"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import Stripe from "stripe";
import { enforceRateLimit } from "@/lib/ratelimit-helpers";
import { generalLimiter, writeLimiter } from "@/lib/ratelimit";
import { redis } from "@/lib/redis";
import { cancelCheckout } from "@/lib/stripe";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || "sk_test_placeholder",
  {
    apiVersion: "2026-05-27.dahlia",
  },
);

export async function updateCartItemQuantity(SKU: string, newQuantity: number) {
  try {
    if (newQuantity < 1 || newQuantity > 99)
      throw new Error("Invalid quantity");
    const userId = await enforceRateLimit(
      generalLimiter,
      "updateCartItemQuantity",
    );

    // Verify ownership
    const cart = await prisma.cart.findFirst({
      where: { user_id: userId },
      include: {
        cartItems: {
          where: { SKU: SKU },
        },
      },
    });

    const cartItem = cart?.cartItems[0];

    if (!cartItem) {
      throw new Error("Item not found in cart");
    }

    await prisma.cart_Item.update({
      where: { id: cartItem.id },
      data: { quantity: newQuantity },
    });

    revalidatePath("/store/checkout");
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

export async function removeCartItem(SKU: string) {
  try {
    const userId = await enforceRateLimit(generalLimiter, "removeCartItem");

    // Verify ownership
    const cart = await prisma.cart.findFirst({
      where: { user_id: userId },
      include: {
        cartItems: {
          where: { SKU: SKU },
        },
      },
    });

    const cartItem = cart?.cartItems[0];

    if (!cartItem) {
      throw new Error("Item not found in cart");
    }

    await prisma.cart_Item.delete({
      where: { id: cartItem.id },
    });

    revalidatePath("/store/checkout");
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

export async function createPaymentIntent(
  skus: { SKU: string; quantity: number }[],
  isCart: boolean,
  shippingCouponId?: string,
  discountCouponId?: string,
  deliveryAddress?: string,
) {
  let userId: string;
  try {
    userId = await enforceRateLimit(writeLimiter, "createPaymentIntent");
  } catch {
    return { error: "Too many requests. Please try again later." };
  }

  try {
    // Input validation
    if (!skus || skus.length === 0) {
      return { error: "No items to checkout." };
    }

    // SKU Validation — verify all SKUs exist with displayable listed products
    const skuIds = skus.map((s) => s.SKU);
    const groceries = await prisma.grocery.findMany({
      where: { id: { in: skuIds } },
      include: {
        listedProducts: {
          where: { isDisplay: true },
        },
      },
    });

    // Check that every requested SKU was found with a valid listed product
    const foundSkuIds = new Set(groceries.map((g) => g.id));
    const missingSKUs = skuIds.filter((id) => !foundSkuIds.has(id));
    if (missingSKUs.length > 0) {
      return { error: "One or more items are no longer available." };
    }

    const invalidSKUs = groceries.filter((g) => g.listedProducts.length === 0);
    if (invalidSKUs.length > 0) {
      return { error: "One or more items are no longer available." };
    }

    // Build a quantity lookup from the client-provided SKUs
    const quantityMap = new Map(skus.map((s) => [s.SKU, s.quantity]));

    // Server-side recalculation of the total amount from validated groceries
    let subtotal = 0;
    for (const grocery of groceries) {
      const listedProduct = grocery.listedProducts[0];
      const unitPrice =
        listedProduct.discount_price > 0
          ? listedProduct.discount_price
          : listedProduct.original_price;
      const quantity = quantityMap.get(grocery.id) || 1;
      subtotal += unitPrice * quantity;
    }

    const baseShippingFee = 5.0; // Constant RM 5.00
    let finalShippingFee = baseShippingFee;
    let productDiscount = 0;

    // Validate Coupons on Server — verify ownership through user_coupon table
    if (shippingCouponId) {
      const userCoupon = await prisma.user_Coupon.findFirst({
        where: {
          user_id: userId,
          coupon_id: shippingCouponId,
          status: "UNREDEEMED",
        },
        include: { coupon: true },
      });
      if (
        userCoupon &&
        userCoupon.coupon.status === "ACTIVE" &&
        userCoupon.coupon.type === "SHIPPING"
      ) {
        finalShippingFee = Math.max(
          0,
          baseShippingFee - userCoupon.coupon.amount,
        );
      } else {
        console.error("Invalid shipping coupon");
        return { error: "Invalid shipping coupon" };
      }
    }

    if (discountCouponId) {
      const userCoupon = await prisma.user_Coupon.findFirst({
        where: {
          user_id: userId,
          coupon_id: discountCouponId,
          status: "UNREDEEMED",
        },
        include: { coupon: true },
      });
      if (
        userCoupon &&
        userCoupon.coupon.status === "ACTIVE" &&
        userCoupon.coupon.type === "DISCOUNT"
      ) {
        productDiscount = userCoupon.coupon.amount;
      } else {
        console.error("Invalid discount coupon");
        return { error: "Invalid discount coupon" };
      }
    }

    const grandTotal =
      Math.max(0, subtotal - productDiscount) + finalShippingFee;

    // Fetch cartId only for cart checkout (needed for webhook cart cleanup)
    let cartId = "none";
    if (isCart) {
      const cart = await prisma.cart.findUnique({
        where: { user_id: userId },
        select: { id: true },
      });
      if (!cart) {
        return { error: "Cart not found." };
      }
      cartId = cart.id;
    }

    // Create a PaymentIntent with the exact calculated amount
    // Auto-cancel after 5 minutes (300 seconds)
    const PAYMENT_TTL_SECONDS = 60 * 60 * 24 * 7;
    const expiresAt = Math.floor(Date.now() / 1000) + PAYMENT_TTL_SECONDS;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(grandTotal * 100), // Convert to cents
      currency: "myr",
      automatic_payment_methods: { enabled: true },
      metadata: {
        userId,
        isCart: String(isCart),
        cartId,
        ...(shippingCouponId && { shippingCouponId }),
        ...(discountCouponId && { discountCouponId }),
      },
    });

    // Store checkout data in Redis for the webhook (5 min TTL matching payment window)
    await redis.set(
      `checkout:${paymentIntent.id}`,
      JSON.stringify({ skus, isCart, deliveryAddress }),
      { ex: PAYMENT_TTL_SECONDS },
    );

    // Schedule server-side auto-cancellation as a safety net
    // This fires after 5 minutes — if the PI is already paid, the endpoint will skip cancellation

    setTimeout(async () => {
      try {
        await cancelPaymentIntent(paymentIntent.id);
      } catch (err) {
        console.error(`Failed to auto-cancel PI ${paymentIntent.id}:`, err);
      }
    }, PAYMENT_TTL_SECONDS * 1000);

    return {
      paymentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      expiresAt, // Unix timestamp (seconds) for client countdown
    };
  } catch (error: any) {
    console.error("Payment intent error:", error);
    return { error: "Failed to process payment setup." };
  }
}

export async function cancelPaymentIntent(paymentId: string) {
  try {
    const userId = await enforceRateLimit(writeLimiter, "cancelPaymentIntent");
  } catch (error: any) {
    return { error: "Too many requests. Please try again later." };
  }

  return cancelCheckout(paymentId);
}
