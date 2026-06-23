import { z } from "zod";
import {
  Category,
  Country,
  Form,
  Media_Category,
  Media_Type,
  MoU,
} from "./generated/prisma";

export const mediaSchema = z.object({
  url: z.string().min(1, "Please upload an image."),
  name: z.string().min(1, "Name is required").max(50, "Name is too long"),
  category: z.enum(Media_Category),
  type: z.enum(Media_Type),
  altText: z.string().optional(),
});

export type MediaFormData = z.infer<typeof mediaSchema>;

export const grocerySchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name is too long"),
  description: z.string().min(1, "Description is required"),
  mediaURL: z
    .array(
      z.object({ id: z.string(), url: z.string(), type: z.enum(Media_Type) }),
    )
    .min(1, "Media URL is required"),
  category: z.enum(Category),
  form: z.enum(Form),
  mou: z.enum(MoU),
  expiryDate: z.date(),
  isPromotion: z.boolean(),
  status: z.boolean(),
  country: z.enum(Country),
});

export type GroceryFormData = z.infer<typeof grocerySchema>;

export const addressSchema = z.object({
  street: z
    .string()
    .min(1, "Street is required")
    .max(100, "Street is too long"),
  city: z.string().min(1, "City is required").max(100, "City is too long"),
  state: z.string().min(1, "State is required").max(100, "State is too long"),
  postalCode: z
    .string()
    .length(5, "Postal Code must be 5 digits")
    .regex(/^[0-9]+$/, "Postal Code must be numbers only"),
  country: z.enum(Country),
});

export type AddressFormData = z.infer<typeof addressSchema>;
