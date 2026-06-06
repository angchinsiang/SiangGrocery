"use client";

import { updateWishlistStatus } from "@/actions/wishlist-bundle/updateWishlistStatus";
import { Button } from "@/components/ui/button";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { useWishlist } from "../../hooks/use-wishlist";
import { QueryClient } from "@tanstack/react-query";

const WishlistButton = ({
  className,
  isInWishlist,
  SKU,
}: {
  className?: string;
  isInWishlist: boolean;
  SKU: string;
}) => {
  const queryClient = new QueryClient();
  const [optimisticWishlist, handleWishlist, isPending] = useWishlist<
    boolean,
    { SKU: string }
  >(isInWishlist, (prev) => !prev, {
    mainAction: updateWishlistStatus,
    options: {
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: ["wishlist"] }),
    },
  });

  return (
    <Button
      onClick={() => handleWishlist({ SKU })}
      disabled={isPending}
      variant="ghost"
      className="rounded-full p-0 h-8 aspect-square hover:bg-red-50"
    >
      {optimisticWishlist ? (
        <GoHeartFill
          className={(className ? className : " size-6") + " text-red-500"}
        />
      ) : (
        <GoHeart
          className={(className ? className : " size-6") + " text-red-500"}
        />
      )}
    </Button>
  );
};

export default WishlistButton;
