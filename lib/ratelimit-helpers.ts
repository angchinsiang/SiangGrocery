import { auth } from "@clerk/nextjs/server";
import type { Ratelimit } from "@upstash/ratelimit";

/**
 * Authenticates the user via Clerk and enforces rate limiting in one call.
 * Replaces the repeated `const { userId } = await auth(); if (!userId) throw ...` pattern.
 *
 * @param limiter - The Upstash Ratelimit instance to use (generalLimiter, writeLimiter, etc.)
 * @param actionName - A unique name for this action (used as the rate limit key prefix)
 * @returns The authenticated userId
 * @throws Error if unauthorized or rate limited
 */
export async function enforceRateLimit(
  limiter: Ratelimit,
  actionName: string,
): Promise<string> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const { success, reset } = await limiter.limit(`${actionName}:${userId}`);
  if (!success) {
    const retryAfter = Math.ceil((reset - Date.now()) / 1000);
    throw new Error(
      `Rate limited on ${actionName}. Try again in ${retryAfter}s.`,
    );
  }

  return userId;
}
