"use server";

import { Media_Category, Media_Type } from "@/lib/generated/prisma";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

type queryParams = {
  cursor?: string;
  name?: string;
  category?: Media_Category[];
  type?: Media_Type[];
};

export const fetchMediaAssets = async ({
  cursor,
  name,
  category,
  type,
}: queryParams) => {
  // const { userId } = await auth();
  // if (!userId) throw new Error("Unauthorized - Not logged in");

  const limit = 10;
  const whereClauses: any = {};

  if (name?.trim() !== "") {
    whereClauses.name = { contains: name?.trim(), mode: "insensitive" };
  }
  if (category && category.length > 0) {
    whereClauses.category = { in: category };
  }
  if (type && type.length > 0) {
    whereClauses.type = { in: type };
  }

  try {
    const clearCursor =
      cursor === "$Undefined" || cursor === "" ? undefined : { id: cursor };
    const mediaAssets = await prisma.mediaAsset.findMany({
      where: whereClauses,
      take: limit + 1,
      cursor: clearCursor,
      orderBy: { createdAt: "desc" },
    });

    let nextCursor: string | undefined = undefined;
    if (mediaAssets.length > limit) {
      const nextItem = mediaAssets.pop();
      nextCursor = nextItem?.id;
    }
    return { data: mediaAssets, nextCursor };
  } catch (error) {
    console.log(`Error fetching media assets: ${error}`);
    throw new Error("Failed to fetch media assets");
  }
};
