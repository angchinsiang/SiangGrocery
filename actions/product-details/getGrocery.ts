import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export const getGrocery = async ({ SKU }: { SKU: string }) => {
  const cachedGrocery = unstable_cache(
    async (targetSKU: string) => {
      return await prisma.grocery.findUnique({
        where: { id: targetSKU },
        include: {
          listedProducts: { orderBy: { createdAt: "desc" }, take: 1 },
        },
      });
    },
    [SKU],
    {
      tags: [`grocery-${SKU}`],
    },
  );
  return await cachedGrocery(SKU);
};
