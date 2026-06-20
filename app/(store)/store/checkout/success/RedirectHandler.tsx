"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export default function RedirectHandler({
  status,
}: {
  status: "succeeded" | "failed";
}) {
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (status === "succeeded") {
      // Invalidate the orders cache so the new order shows up immediately
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      // Short delay so user can see "Payment Successful" briefly before redirect
      const timer = setTimeout(() => {
        router.push("/store/order-tracking");
      }, 5000);
      return () => clearTimeout(timer);
    } else if (status === "failed") {
      // Redirect back to cart so they can try again
      const timer = setTimeout(() => {
        router.push("/store/cart");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status, router, queryClient]);

  return null;
}
