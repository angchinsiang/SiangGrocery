"use server";

import { auth } from "@clerk/nextjs/server";
import { GroceryFormData } from "@/lib/schemas";
import prisma from "@/lib/prisma";
import { Media_Type } from "@/lib/generated/prisma";

export async function uploadGrocery({
  name,
  description,
  mediaURL,
  category,
  form,
  mou: MoU,
  isPromotion,
  expiryDate,
  status,
}: GroceryFormData) {
  const user = await auth();
  if (!user) {
    throw new Error("Unauthorized - Not logged in");
  }

  try {
    const grocery = await prisma.grocery.create({
      data: {
        name,
        description,
        image:
          mediaURL.find((media) => media.type === Media_Type.IMAGE)?.url ||
          mediaURL[0].url,
        category,
        form,
        MoU,
        isPromotion,
        expiryDate,
        status,
      },
    });

    mediaURL.forEach(async ({ id }, index) => {
      await prisma.grocery_Media.create({
        data: {
          SKU: grocery.id,
          media_id: id,
          isPrimary: index === 0,
          sortOrder: index,
        },
      });
    });
  } catch (error) {
    throw error;
  }
}
