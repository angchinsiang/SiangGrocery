"use client";
import { getWishlistStatus } from "@/actions/wishlist-bundle/getWishlistStatus";
import WishlistButton from "@/components/client/WishlistButton";
import { useSuspenseQuery } from "@tanstack/react-query";
import Description from "./Description";
import ShareButton from "./ShareButton";

const DescriptionSection = ({
  SKU,
  description,
  name,
  userId,
}: {
  SKU: string;
  description: string;
  name: string;
  userId: string | null;
}) => {
  const { data } = useSuspenseQuery({
    queryKey: ["wishlist", "status", SKU],
    queryFn: async () => await getWishlistStatus({ SKU, userId }),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  return (
    <div className="w-full flex flex-col gap-5 ">
      <div className="flex justify-between">
        <p className="text-2xl font-bold">Description</p>
        <div>
          <WishlistButton
            className=" size-5"
            isInWishlist={data || false}
            SKU={SKU}
          />
          <ShareButton name={name} />
        </div>
      </div>
      <Description description={description} />
    </div>
  );
};

export default DescriptionSection;
