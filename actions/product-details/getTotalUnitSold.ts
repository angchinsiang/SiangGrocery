import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export const totalUnitSold = async ({
  SKU,
  startDate,
}: {
  SKU: string;
  startDate: Date;
}) => {
  const cachedUnitSold = unstable_cache(
    async () => {
      const unitSold = await prisma.grocery_Order.aggregate({
        _sum: { quantity: true },
        where: {
          listed_product: {
            SKU: SKU,
          },
          order_ticket: { createdAt: { gte: startDate }, status: "COMPLETED" },
        },
      });
      return unitSold._sum.quantity;
    },
    [`sold-${SKU}`],
    {
      tags: [`sold-${SKU}`],
      revalidate: 1800,
    },
  );

  return await cachedUnitSold();
};
