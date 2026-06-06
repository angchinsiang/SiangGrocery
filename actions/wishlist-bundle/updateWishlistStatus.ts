"use server";

import prisma from "@/lib/prisma";
import { updateTag } from "next/cache";

export const updateWishlistStatus = async ({
  userId,
  SKU,
}: {
  userId: string;
  SKU: string;
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

    updateTag(`wishlist-${userId}`);
    return { success: true };
  } catch (error) {
    console.error(`Fail to update wishlist ${error}`);
    return { success: false };
  }
};
