"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

type Props = {
  cursor?: string;
  SKU: string;
};
export const infiniteComment = async ({ cursor, SKU }: Props) => {
  const session = await auth();
  const limit = 8;
  try {
    const [comments] = await Promise.all([
      prisma.comment.findMany({
        take: limit + 1,
        cursor:
          cursor === "$Undefined" || cursor === "" ? undefined : { id: cursor },
        where: { SKU: SKU },
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
        orderBy: { createdAt: "desc" },
      }),
    ]);

    let nextCursor: string | undefined = undefined;
    if (comments.length > limit) {
      const nextItem = comments.pop();
      nextCursor = nextItem?.id;
    }

    return { nextCursor, comments };
  } catch (e) {
    console.log(`Error fetching comments: ${e}`);
    throw new Error("Failed to fetch comments");
  }
};
