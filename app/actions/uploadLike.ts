"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateLike({
  commentId,
  userId,
  pathname,
}: {
  commentId: string;
  userId: string;
  pathname: string;
}) {
  try {
    const existingLike = await prisma.commentLike.findUnique({
      where: { user_id_comment_id: { user_id: userId, comment_id: commentId } },
    });

    if (existingLike) {
      await prisma.commentLike.delete({
        where: {
          user_id_comment_id: { user_id: userId, comment_id: commentId },
        },
      });
    } else {
      await prisma.commentLike.create({
        data: { user_id: userId, comment_id: commentId },
      });
    }
    revalidatePath(pathname);
  } catch (e) {
    console.log(`Error in updateLike: ${e}`);
    throw e;
  }
}
