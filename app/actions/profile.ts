"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function updateUserName(name: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const trimmed = name.trim();
  if (!trimmed || trimmed.length > 40) {
    return { error: "Name must be 1-40 characters." };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { name: trimmed },
  });

  return { success: true };
}
