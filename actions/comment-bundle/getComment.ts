"use server";
import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export const getComment = async ({
  SKU,
  userId,
}: {
  SKU: string;
  userId: string | null;
}) => {
  const cachedComment = unstable_cache(
    async () => {
      return await prisma.comment.findMany({
        include: {
          user: {
            select: { name: true, id: true, image_url: true },
          },
          _count: { select: { commentLikes: true } },
        },
        take: 3,
        orderBy: { createdAt: "desc" },
      });
    },
    [`comment-${SKU}`],
    {
      tags: [`comment-${SKU}`],
      revalidate: 7200,
    },
  );

  const comments = await cachedComment();

  // Checking like status
  if (!userId) {
    return comments.map((c) => ({ ...c, hasLiked: [] }));
  }

  const likeStatus = await prisma.commentLike.findMany({
    where: {
      user_id: userId,
      comment_id: {
        in: comments.map((c) => c.id),
      },
    },
    select: {
      comment_id: true,
    },
  });

  return comments.map((c) => ({
    ...c,
    hasLiked: likeStatus.some((l) => l.comment_id === c.id) ? [c.id] : [],
  }));
};
