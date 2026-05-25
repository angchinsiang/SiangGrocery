"use server";

import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export async function getWishlistStatus({
  userId,
  SKU,
}: {
  userId: string | null;
  SKU: string;
}) {
  if (!userId) return false;

  const cachedWishlist = unstable_cache(
    async (userId: string) => {
      const wishlistItem = await prisma.wishlist.findFirst({
        where: { user_id: userId },
        include: {
          wishlistItems: { select: { wishlist_id: true }, where: { SKU: SKU } },
        },
      });
      return !!wishlistItem?.wishlistItems.length;
    },
    [`wishlist-${SKU}-${userId}`],
    {
      tags: [`wishlist-${SKU}-${userId}`],
    },
  );
  return cachedWishlist(userId);
}
