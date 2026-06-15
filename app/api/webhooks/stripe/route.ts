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

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

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

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    const { userId, cartId, isCart, shippingCouponId, discountCouponId } =
      paymentIntent.metadata;

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
      const orderTicketId = randomUUID();

      // Collect coupon IDs to connect
      const couponIds: string[] = [];
      if (shippingCouponId) couponIds.push(shippingCouponId);
      if (discountCouponId) couponIds.push(discountCouponId);

      await prisma.$transaction(async (tx) => {
        // 1. Create the Order_Ticket
        await tx.order_Ticket.create({
          data: {
            id: orderTicketId,
            user_id: userId,
            total_amount: paymentIntent.amount / 100, // Convert from cents
            payment_method: "CARD",
            status: "PENDING",
            deliveryStatus: "PENDING",
            ...(couponIds.length > 0 && {
              coupons: {
                connect: couponIds.map((id) => ({ id })),
              },
            }),
          },
        });

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
              id: randomUUID(),
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
              id: randomUUID(),
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
  }

  return NextResponse.json({ received: true });
}
