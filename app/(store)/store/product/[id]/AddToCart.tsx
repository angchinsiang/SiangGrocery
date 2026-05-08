"use client";

import { addToCart } from "@/app/actions/addToCart";
import { Button } from "@/components/ui/button";
import { useClerk, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

const AddToCart = ({ SKU }: { SKU: string }) => {
  const session = useUser();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const { openSignIn } = useClerk();

  const handleCart = async () => {
    if (!session.user) {
      return openSignIn({ fallbackRedirectUrl: `${pathname}` });
    }

    startTransition(async () => {
      toast.promise(
        async () =>
          await addToCart({
            userId: session.user.id,
            SKU,
            pathname,
          }),
        {
          loading: "Adding to cart...",
          success: "Item has been added to cart",
          error: "Fail to add to cart",
          position: "top-center",
        },
      );
    });
  };

  return (
    <Button
      disabled={isPending}
      onClick={handleCart}
      className=" bg-blue-600 text-white hover:bg-blue-700 py-4.5 text-base shadow-lg border-none "
    >
      Add to Cart
    </Button>
  );
};

export default AddToCart;
