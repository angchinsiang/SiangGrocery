import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { apiLimiter } from "@/lib/ratelimit";

const protectedRoutes = createRouteMatcher([
  "/store/order-tracking(.*)",
  "/store/profile(.*)",
  "/store/wishlist(.*)",
  "/store/cart(.*)",
  "/store/checkout(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // Rate limit API routes by IP
  if (req.nextUrl.pathname.startsWith("/api/")) {
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const { success } = await apiLimiter.limit(ip);
    if (!success) {
      return new NextResponse("Too Many Requests", { status: 429 });
    }
  }

  if (protectedRoutes(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    //     // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    //     // Always run for API routes
    //     // "/(api|trpc)(.*)",
  ],
};
