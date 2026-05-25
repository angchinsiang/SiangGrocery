"use server";
import prisma from "@/lib/prisma";
import { getGrocery } from "../product-details/getGrocery";

export const infiniteGrocery = async ({ cursor }: { cursor?: string }) => {
  const limit = 8;

  const groceries = await prisma.grocery.findMany({
    take: limit + 1,
    cursor: cursor ? { id: cursor } : undefined,
    select: { id: true },
  });

  let nextCursor: string | undefined = undefined;
  if (groceries.length > limit) {
    nextCursor = groceries[limit].id;
    groceries.pop();
  }

  const data = await Promise.all(
    groceries.map((g) => getGrocery({ SKU: g.id })),
  );
  return { groceries: data, nextCursor };
};
