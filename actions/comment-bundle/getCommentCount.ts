import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export const getCommentCount = async ({ SKU }: { SKU: string }) => {
  const cachedCommentCount = unstable_cache(
    async (targetSKU: string) => {
      return await prisma.comment.count({ where: { SKU: targetSKU } });
    },
    [`comment-count-${SKU}`],
    {
      tags: [`comment-count-${SKU}`],
    },
  );
  return await cachedCommentCount(SKU);
};
