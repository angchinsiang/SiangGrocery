"use client";

import { Button } from "@/components/ui/button";
import { useAuth, useClerk } from "@clerk/nextjs";
import { MdOutlineShoppingCart } from "react-icons/md";
import { usePathname } from "next/navigation";
import { addToCart } from "@/actions/addToCart";
import { useTransition } from "react";

const CartButton = ({ SKU }: { SKU: string }) => {
  const [isPending, startTransition] = useTransition();
  const { openSignIn } = useClerk();
  const pathname = usePathname();
  const { userId } = useAuth();

  const handleCart = async () => {
    if (!userId) {
      return openSignIn({ fallbackRedirectUrl: `${pathname}` });
    }

    startTransition(async () => {
      await addToCart({
        SKU: SKU,
        pathname: pathname,
      });
      alert("Item added to cart");
    });
  };

  return (
    <Button
      disabled={isPending}
      onClick={(e) => {
        e.preventDefault();
        handleCart();
      }}
      className="aspect-square h-10 rounded-full p-0 bg-[#C9F2BD] hover:bg-[#b0dfa3]"
      type="button"
    >
      <MdOutlineShoppingCart className="text-black size-6" />
    </Button>
  );
};

export default CartButton;
