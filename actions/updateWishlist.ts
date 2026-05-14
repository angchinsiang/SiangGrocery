"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const updateWishlist = async ({
  userId,
  SKU,
  pathname,
}: {
  userId: string;
  SKU: string;
  pathname: string;
}) => {
  try {
    const hasWishlist = await prisma.wishlist.findFirst({
      where: { user_id: userId },
    });

    if (!hasWishlist) {
      await prisma.wishlist.create({
        data: {
          user_id: userId,
          wishlistItems: {
            create: {
              SKU: SKU,
            },
          },
        },
      });
    } else {
      const wishItem = await prisma.wishlist_Item.findFirst({
        where: {
          SKU: SKU,
          wishlist_id: hasWishlist.id,
        },
      });
      if (wishItem) {
        await prisma.wishlist_Item.deleteMany({
          where: { SKU: SKU, wishlist_id: hasWishlist.id },
        });
      } else {
        await prisma.wishlist_Item.create({
          data: {
            SKU: SKU,
            wishlist_id: hasWishlist.id,
          },
        });
      }
    }
    revalidatePath(pathname);
  } catch (error) {
    console.error(`Fail to update wishlist ${error}`);
    return { error: "Fail to update wishlist" };
  }
};
