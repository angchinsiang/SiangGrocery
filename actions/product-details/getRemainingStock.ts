import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export const remainingStock = async ({ SKU }: { SKU: string }) => {
  const cachedStock = unstable_cache(
    async (targetSKU: string) => {
      const sum = await prisma.listed_Product.aggregate({
        _sum: { total_qty: true },
        where: { SKU: targetSKU, isDisplay: true },
      });
      return sum._sum.total_qty;
    },
    [`stock-${SKU}`],
    {
      tags: [`stock-${SKU}`],
      revalidate: 60,
    },
  );

  return await cachedStock(SKU);
};
