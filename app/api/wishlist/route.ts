import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { unstable_cache } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const cachedWishlist = unstable_cache(
  async (userId: string) => {
    const wishlistItem = await prisma.wishlist_Item.findMany({
      where: { wishlist: { user_id: userId } },
      select: { SKU: true },
    });
    return wishlistItem.map((item) => item.SKU);
  },
  [`wishlist-global-cache`],
  {
    tags: [`wishlist-global-cache`],
  },
);

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json([], { status: 401 });

    return NextResponse.json(cachedWishlist(userId), { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json([], { status: 500 });
  }
}
