"use server";

import { grocerySchema, type GroceryFormData } from "@/lib/schemas";
import prisma from "@/lib/prisma";
import { Media_Type } from "@/lib/generated/prisma";
import { enforceRateLimit } from "@/lib/ratelimit-helpers";
import { writeLimiter } from "@/lib/ratelimit";

export async function uploadGrocery(rawData: GroceryFormData) {
  const userId = await enforceRateLimit(writeLimiter, "uploadGrocery");

  // Admin authorization check
  const isAdmin = await prisma.admin.findUnique({
    where: { id: userId },
  });
  if (!isAdmin) {
    throw new Error("Unauthorized - Not an admin");
  }

  // Validate input with Zod
  const { name, description, mediaURL, category, form, mou: MoU, isPromotion, expiryDate, status, country } =
    grocerySchema.parse(rawData);

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
        country,
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
