"use client";

import { updateWishlist } from "@/actions/updateWishlist";
import { Button } from "@/components/ui/button";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { useWishlist } from "../../hooks/use-wishlist";

const WishlistButton = ({
  className,
  isInWishlist,
  SKU,
}: {
  className?: string;
  isInWishlist: boolean;
  SKU: string;
}) => {
  const [optimisticWishlist, handleWishlist, isPending] = useWishlist<
    boolean,
    { SKU: string }
  >(isInWishlist, (prev) => !prev, updateWishlist);

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
