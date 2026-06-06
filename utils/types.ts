import { z } from 'zod';

export const OrderStatusSchema = z.enum(['processing', 'shipped', 'delivered']);
export type OrderStatus = z.infer<typeof OrderStatusSchema>;

export const OrderItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  originalPrice: z.number(),
  salePrice: z.number(),
  quantity: z.number(),
  origin: z.string(),
  imageUrl: z.string()
});
export type OrderItem = z.infer<typeof OrderItemSchema>;

export const OrderSchema = z.object({
  id: z.string(),
  status: OrderStatusSchema,
  statusText: z.string(),
  recipient: z.string(),
  deliveryAddress: z.string(),
  items: z.array(OrderItemSchema),
  shippingFee: z.number(),
  discount: z.number(),
  paymentMethod: z.string(),
  createdAt: z.string(),
  shippedAt: z.string().optional(),
  completedAt: z.string().optional(),
  remark: z.string()
});
export type Order = z.infer<typeof OrderSchema>;

export const ProductReviewSchema = z.object({
  productId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string(),
  date: z.string()
});
export type ProductReview = z.infer<typeof ProductReviewSchema>;

export const SupportMessageSchema = z.object({
  id: z.string(),
  sender: z.enum(['user', 'bot']),
  text: z.string(),
  timestamp: z.string()
});
export type SupportMessage = z.infer<typeof SupportMessageSchema>;

