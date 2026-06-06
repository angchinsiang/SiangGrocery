"use server";
import prisma from "@/lib/prisma";
import { serializeObject } from "@/utils/serializeObject";
import { unstable_cache } from "next/cache";

export const getGrocery = async ({ SKU }: { SKU: string }) => {
  const cachedGrocery = unstable_cache(
    async (targetSKU: string) => {
      const grocery = await prisma.grocery.findUnique({
        where: { id: targetSKU },
        include: {
          listedProducts: { orderBy: { createdAt: "asc" }, take: 1 },
          groceryMedias: {
            where: {
              media: { type: "IMAGE", status: "ACTIVE" },
            },
            include: { media: { select: { url: true, altText: true } } },
            orderBy: { sortOrder: "asc" },
            take: 1,
          },
        },
      });
      return serializeObject(grocery);
    },
    [SKU],
    {
      tags: [`grocery-${SKU}`],
    },
  );
  return cachedGrocery(SKU);
};
