"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { setCartCookie } from "@/actions/cookies-bundle/cookieActions";

export async function addToCart({
  userId,
  SKU,
  pathname,
}: {
  userId: string;
  SKU: string;
  pathname: string;
}) {
  try {
    const existingCart = await prisma.cart.findFirst({
      where: { user_id: userId },
    });

    if (!existingCart) {
      await prisma.cart.create({
        data: {
          user_id: userId,
          cartItems: {
            create: {
              SKU: SKU,
            },
          },
        },
      });
      console.log("added new cart!");
      // Auto-check newly added item in cookie
      await setCartCookie(SKU, 1);
    } else {
      const hasItem = await prisma.cart_Item.findFirst({
        where: { cart_id: existingCart.id, SKU: SKU },
      });
      if (hasItem) {
        await prisma.cart_Item.update({
          where: { id: hasItem.id },
          data: { quantity: hasItem.quantity + 1 },
        });
        console.log("added to cart quantity increase");
        // Update cookie with new quantity
        await setCartCookie(SKU, hasItem.quantity + 1);
      } else {
        const addedItem = await prisma.cart_Item.create({
          data: {
            cart_id: existingCart.id,
            SKU: SKU,
          },
        });
        console.log("added to cart: ", addedItem);
        // Auto-check newly added item in cookie
        await setCartCookie(SKU, 1);
      }
    }
    revalidatePath(pathname);
  } catch (error) {
    console.error(`Fail to add to cart: ${error}`);
    return { error: "Fail to add to cart" };
  }
}

export async function updateCart(quantity: number, SKU: string) {
  if (quantity - 1 === 0) return quantity;

  const { userId } = await auth();
  if (!userId) throw new Error("Invalid User!");

  const existingCart = await prisma.cart.findFirst({
    where: { user_id: userId },
  });
  if (!existingCart) throw new Error("Invalid Cart!");

  const hasItem = await prisma.cart_Item.findFirst({
    where: { cart_id: existingCart.id, SKU: SKU },
  });
  if (!hasItem) throw new Error("Invalid Item!");

  await prisma.cart_Item.update({
    where: { id: hasItem.id },
    data: { quantity: quantity },
  });
  console.log("updated cart quantity");

  return quantity;
}
