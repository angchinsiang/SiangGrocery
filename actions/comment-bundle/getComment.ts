import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export const getComment = async ({ SKU }: { SKU: string }) => {
  const cachedComment = unstable_cache(
    async () => {
      return await prisma.comment.findMany({
        include: {
          user: {
            select: { name: true, id: true, image_url: true },
          },
          _count: { select: { commentLikes: true } },
          commentLikes: {
            where: {
              user_id: session?.userId || "UNAUTHENTICATED_USER",
            },
          },
        },
        take: 3,
        orderBy: { createdAt: "desc" },
      });
    },
    [`comment-${SKU}`],
    {
      tags: [`comment-${SKU}`],
    },
  );

  return await cachedComment();
};
