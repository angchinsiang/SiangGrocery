"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
      } else {
        const addedItem = await prisma.cart_Item.create({
          data: {
            cart_id: existingCart.id,
            SKU: SKU,
          },
        });
        console.log("added to cart: ", addedItem);
      }
    }
    revalidatePath(pathname);
  } catch (error) {
    console.error(`Fail to add to cart: ${error}`);
    return { error: "Fail to add to cart" };
  }
}
