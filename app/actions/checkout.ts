"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import Stripe from "stripe";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || "sk_test_placeholder",
  {
    apiVersion: "2024-04-10" as any,
  },
);

export async function updateCartItemQuantity(SKU: string, newQuantity: number) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
    if (newQuantity < 1) throw new Error("Invalid quantity");

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
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

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
  shippingCouponId?: string,
  discountCouponId?: string,
) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  try {
    const cart = await prisma.cart.findUnique({
      where: { user_id: userId },
      include: {
        cartItems: {
          include: {
            grocery: {
              include: {
                listedProducts: {
                  where: { isDisplay: true },
                },
              },
            },
          },
        },
      },
    });

    if (!cart || cart.cartItems.length === 0) {
      return { error: "Cart is empty" };
    }

    // Server-side recalculation of the total amount
    let subtotal = 0;
    for (const item of cart.cartItems) {
      const product = item.grocery;
      const listedProduct = product.listedProducts[0];
      const unitPrice =
        listedProduct?.discount_price > 0
          ? listedProduct.discount_price
          : listedProduct?.original_price || 0;

      subtotal += unitPrice * item.quantity;
    }

    const baseShippingFee = 5.0; // Constant RM 5.00
    let finalShippingFee = baseShippingFee;
    let productDiscount = 0;

    // Validate Coupons on Server
    if (shippingCouponId) {
      const shippingCoupon = await prisma.coupon.findUnique({
        where: { id: shippingCouponId },
      });
      if (
        shippingCoupon &&
        shippingCoupon.status === "ACTIVE" &&
        shippingCoupon.type === "SHIPPING"
      ) {
        finalShippingFee = Math.max(0, baseShippingFee - shippingCoupon.amount);
      }
    }

    if (discountCouponId) {
      const discountCoupon = await prisma.coupon.findUnique({
        where: { id: discountCouponId },
      });
      if (
        discountCoupon &&
        discountCoupon.status === "ACTIVE" &&
        discountCoupon.type === "DISCOUNT"
      ) {
        productDiscount = discountCoupon.amount;
      }
    }

    const grandTotal =
      Math.max(0, subtotal - productDiscount) + finalShippingFee;

    // Create a PaymentIntent with the exact calculated amount
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(grandTotal * 100), // Convert to cents
      currency: "myr", // Assuming Malaysian Ringgit
      metadata: {
        userId,
        cartId: cart.id,
      },
    });

    return { clientSecret: paymentIntent.client_secret };
  } catch (error: any) {
    console.error("Payment intent error:", error);
    return { error: "Failed to process payment setup." };
  }
}
