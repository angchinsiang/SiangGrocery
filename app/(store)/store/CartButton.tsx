"use client";

import { Button } from "@/components/ui/button";
import { useClerk, useUser } from "@clerk/nextjs";
import { MdOutlineShoppingCart } from "react-icons/md";
import { usePathname } from "next/navigation";
import { addToCart } from "@/app/actions/addToCart";
import { useTransition } from "react";

const CartButton = ({ SKU }: { SKU: string }) => {
  const [isPending, startTransition] = useTransition();
  const { openSignIn } = useClerk();
  const pathname = usePathname();
  const session = useUser();

  const handleCart = async () => {
    if (!session.user) {
      return openSignIn({ fallbackRedirectUrl: `${pathname}` });
    }

    startTransition(async () => {
      await addToCart({
        userId: session.user.id,
        SKU: SKU,
        pathname: pathname,
      });
      alert("Item added to cart");
    });
  };

  return (
    <Button
      disabled={isPending}
      onClick={handleCart}
      className="aspect-square h-10 rounded-full p-0 bg-[#C9F2BD] hover:bg-[#b0dfa3]"
      type="button"
    >
      <MdOutlineShoppingCart className="text-black size-6" />
    </Button>
  );
};

export default CartButton;
