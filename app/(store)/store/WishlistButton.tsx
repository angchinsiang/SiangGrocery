"use client";

import { updateWishlist } from "@/app/actions/updateWishlist";
import { Button } from "@/components/ui/button";
import { useAuth, useClerk } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useOptimistic, useTransition } from "react";
import { GoHeart, GoHeartFill } from "react-icons/go";

const WishlistButton = ({
  isInWishlist,
  SKU,
}: {
  isInWishlist: boolean;
  SKU: string;
}) => {
  const { userId } = useAuth();
  const { openSignIn } = useClerk();
  const pathname = usePathname();
  const loginPath = `top-manatee-47.accounts.dev/sign-in`;
  const [isPending, startTransition] = useTransition();
  const [optimisticWishlist, setOptimisticWishlist] = useOptimistic(
    isInWishlist,
    (_prev, _payload) => !_prev,
  );

  const handleWishlist = () => {
    if (!userId) {
      return openSignIn({ fallbackRedirectUrl: `${pathname}` });
    }
    startTransition(async () => {
      setOptimisticWishlist(undefined);
      await updateWishlist({ userId, SKU, pathname });
    });
  };

  return (
    <Button
      onClick={handleWishlist}
      disabled={isPending}
      variant="ghost"
      className="rounded-full p-0 h-8 aspect-square hover:bg-red-50"
    >
      {optimisticWishlist ? (
        <GoHeartFill className="size-6 text-red-500" />
      ) : (
        <GoHeart className="size-6 text-red-500" />
      )}
    </Button>
  );
};

export default WishlistButton;
