"use server";
import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export const totalUnitSold = async ({
  SKU,
  startDate,
}: {
  SKU: string;
  startDate: string;
}) => {
  try {
    const parsedDate = new Date(startDate);
    const cachedUnitSold = unstable_cache(
      async () => {
        const unitSold = await prisma.grocery_Order.aggregate({
          _sum: { quantity: true },
          where: {
            listed_product: {
              SKU: SKU,
            },
            order_ticket: { createdAt: { gte: parsedDate }, status: "COMPLETED" },
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

    return cachedUnitSold();
  } catch (error) {
    console.error("Error in totalUnitSold:", error);
    throw error;
  }
};
