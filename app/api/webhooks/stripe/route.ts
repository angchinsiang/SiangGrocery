import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { randomUUID } from "crypto";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || "sk_test_placeholder",
  {
    apiVersion: "2026-05-27.dahlia",
  },
);

const webhookSecret: string | undefined =
  process.env.NODE_ENV === "development"
    ? "whsec_bae5d1b5e2bf3cafc17778a3b9d00bca3dd4574dc7c85cdd9799f02f66d4ba6d"
    : process.env.STRIPE_WEBHOOK_SECRET;

type CheckoutData = {
  skus: { SKU: string; quantity: number }[];
  isCart: boolean;
};

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig || !webhookSecret) {
    console.error("Missing stripe-signature header or STRIPE_WEBHOOK_SECRET");
    return NextResponse.json(
      { error: "Missing signature or webhook secret" },
      { status: 400 },
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 },
    );
  }

  const paymentIntent = event.data.object as Stripe.PaymentIntent;
  const { userId, cartId, isCart, shippingCouponId, discountCouponId } =
    paymentIntent.metadata;

  if (event.type === "payment_intent.created") {
    if (!userId) {
      console.error("Missing userId in PaymentIntent metadata");
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    try {
      // Read checkout data from Redis
      const rawCheckoutData = await redis.get<CheckoutData>(
        `checkout:${paymentIntent.id}`,
      );

      if (!rawCheckoutData) {
        console.error(
          `No checkout data found in Redis for PI ${paymentIntent.id}`,
        );
        return NextResponse.json(
          { error: "Checkout data not found" },
          { status: 400 },
        );
      }

      const checkoutData: CheckoutData =
        typeof rawCheckoutData === "string"
          ? JSON.parse(rawCheckoutData)
          : rawCheckoutData;

      const { skus } = checkoutData;
      const skuIds = skus.map((s) => s.SKU);
      const quantityMap = new Map(skus.map((s) => [s.SKU, s.quantity]));

      // Fetch groceries with listed products for order creation
      const groceries = await prisma.grocery.findMany({
        where: { id: { in: skuIds } },
        include: {
          listedProducts: {
            where: { isDisplay: true },
          },
        },
      });

      // Create Order_Ticket and Grocery_Order entries in a transaction

      // Collect coupon IDs to connect
      const couponIds: string[] = [];
      if (shippingCouponId) couponIds.push(shippingCouponId);
      if (discountCouponId) couponIds.push(discountCouponId);

      // Determine the payment method from Stripe's payment_method_types array
      const pmTypes = paymentIntent.payment_method_types || [];
      let mappedPaymentMethod: "CARD" | "FPX" | "EWALLET" | "COD" = "CARD"; // default

      if (pmTypes.includes("fpx")) {
        mappedPaymentMethod = "FPX";
      } else if (
        pmTypes.some((type) =>
          ["grabpay", "alipay", "wechat_pay", "boost", "touch_n_go"].includes(
            type,
          ),
        )
      ) {
        mappedPaymentMethod = "EWALLET";
      } else if (pmTypes.includes("card")) {
        mappedPaymentMethod = "CARD";
      }

      let orderTicketId = "";

      await prisma.$transaction(async (tx) => {
        // 1. Create the Order_Ticket
        const newOrder = await tx.order_Ticket.create({
          data: {
            user_id: userId,
            total_amount: paymentIntent.amount / 100, // Convert from cents
            payment_method: mappedPaymentMethod,
            status: "PENDING",
            deliveryStatus: "WAITING_FOR_PAYMENT",
            ...(couponIds.length > 0 && {
              coupons: {
                connect: couponIds.map((id) => ({ id })),
              },
            }),
          },
        });

        orderTicketId = newOrder.id;

        // 2. Create Grocery_Order entries from the checkout SKU data
        for (const grocery of groceries) {
          const listedProduct = grocery.listedProducts[0];
          if (!listedProduct) continue;

          const unitPrice =
            listedProduct.discount_price > 0
              ? listedProduct.discount_price
              : listedProduct.original_price;
          const quantity = quantityMap.get(grocery.id) || 1;

          await tx.grocery_Order.create({
            data: {
              ot_id: orderTicketId,
              lp_id: listedProduct.id,
              quantity,
              price: unitPrice * quantity,
            },
          });
        }

        // 3. Mark used coupons as REDEEMED and create usage history
        for (const couponId of couponIds) {
          await tx.user_Coupon.updateMany({
            where: {
              user_id: userId,
              coupon_id: couponId,
              status: "UNREDEEMED",
            },
            data: {
              status: "REDEEMED",
            },
          });

          await tx.coupon_Usage_History.create({
            data: {
              user_id: userId,
              coupon_id: couponId,
              ot_id: orderTicketId,
            },
          });
        }

        // 4. Cart cleanup — only for cart checkouts, only the specific SKUs
        if (isCart === "true" && cartId && cartId !== "none") {
          await tx.cart_Item.deleteMany({
            where: {
              cart_id: cartId,
              SKU: { in: skuIds },
            },
          });
        }
        // Single product checkout: no cart items are touched
      });

      // 5. Clean up Redis checkout data
      await redis.del(`checkout:${paymentIntent.id}`);

      // 6. Update PaymentIntent with the generated orderTicketId so we can reference it in payment_intent.succeeded
      await stripe.paymentIntents.update(paymentIntent.id, {
        metadata: {
          ...paymentIntent.metadata,
          orderTicketId,
        },
      });

      console.log(
        `Order ${orderTicketId} created for user ${userId}, isCart: ${isCart}, amount: RM ${(paymentIntent.amount / 100).toFixed(2)}`,
      );
    } catch (err) {
      console.error("Error creating order from webhook:", err);
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 },
      );
    }
  } else if (event.type === "payment_intent.succeeded") {
    const orderTicketId = paymentIntent.metadata.orderTicketId;

    if (!orderTicketId) {
      console.error(`${event.type} missing orderTicketId in metadata`);
      return NextResponse.json({ received: true });
    }

    try {
      await prisma.order_Ticket.update({
        where: {
          id: orderTicketId,
        },
        data: {
          status: "COMPLETED",
          deliveryStatus: "PENDING",
        },
      });
      console.log(`Order ${orderTicketId} marked as successfully paid.`);
    } catch (err) {
      console.error(
        `Failed to update Order ${orderTicketId} on payment success:`,
        err,
      );
    }
  } else if (
    event.type === "payment_intent.payment_failed" ||
    event.type === "payment_intent.canceled"
  ) {
    const orderTicketId = paymentIntent.metadata.orderTicketId;
    if (!orderTicketId) {
      console.error(`${event.type} missing orderTicketId in metadata`);
      return NextResponse.json({ received: true });
    }

    try {
      await prisma.order_Ticket.update({
        where: {
          id: orderTicketId,
        },
        data: {
          status: "CANCELLED",
          deliveryStatus: "CANCELLED",
        },
      });
      console.log(`Order ${orderTicketId} marked as cancelled.`);
    } catch (err) {
      console.error(
        `Failed to update Order ${orderTicketId} on payment ${event.type}:`,
        err,
      );
    }
  }

  return NextResponse.json({ received: true });
}
