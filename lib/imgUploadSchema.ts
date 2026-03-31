import { z } from "zod";
import { Media_Category, Media_Type } from "./generated/prisma";

export const mediaSchema = z.object({
  url: z.string().min(1, "Please upload an image."),
  name: z.string().min(1, "Name is required").max(50, "Name is too long"),
  category: z.enum(Media_Category),
  type: z.enum(Media_Type),
  altText: z.string().optional(),
});

export type MediaFormData = z.infer<typeof mediaSchema>;
