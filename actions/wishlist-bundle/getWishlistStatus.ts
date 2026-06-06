"use server"

import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export async function getWishlistStatus({ userId }: { userId: string | null }) {
  if (!userId) return [];

  const cachedWishlist = unstable_cache(
    async (userId: string) => {
      const wishlistItem = await prisma.wishlist_Item.findMany({
        where: { wishlist: { user_id: userId } },
        select: { SKU: true },
      });
      return wishlistItem.map((item) => item.SKU);
    },
    [`wishlist-${userId}`],
    {
      tags: [`wishlist-${userId}`],
    },
  );
  return cachedWishlist(userId);
}
