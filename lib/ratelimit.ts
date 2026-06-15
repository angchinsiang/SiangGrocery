import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "@/lib/redis";

/**
 * General actions (addToCart, updateCart, updateLike, wishlist toggling, checkout cart ops)
 * 15 requests per 10 seconds per user
 */
export const generalLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(15, "10 s"),
  prefix: "ratelimit:general",
  analytics: true,
});

/**
 * Write-heavy / sensitive actions (uploadGrocery, createPaymentIntent)
 * 5 requests per 30 seconds per user
 */
export const writeLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "30 s"),
  prefix: "ratelimit:write",
  analytics: true,
});

/**
 * API route global limiter (for unauthenticated/webhook endpoints)
 * 30 requests per 60 seconds per IP
 */
export const apiLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, "60 s"),
  prefix: "ratelimit:api",
  analytics: true,
});
