"use server";

import { Media_Category, Media_Type } from "@/lib/generated/prisma";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const uploadMediaAsset = async (formData: {
  url: string;
  name: string;
  category: Media_Category;
  type: Media_Type;
  altText?: string;
}) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized - Not logged in");

  // const isAdmin = await prisma.admin.findUnique({
  //   where: { id: userId },
  // });
  // if (!isAdmin) throw new Error("Unauthorized - Not an admin");

  try {
    const fileKey = formData.url.split("/f/")[1];
    const media = await prisma.mediaAsset.update({
      where: { id: fileKey },
      data: {
        url: formData.url,
        name: formData.name,
        category: formData.category,
        type: formData.type,
        altText: formData.altText || "",
        status: "ACTIVE",
      },
    });

    return media;
  } catch (error) {
    console.log(`Error uploading media asset: ${error}`);
    throw new Error("Failed to upload media asset");
  }
};
