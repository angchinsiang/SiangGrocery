import { Button } from "@/components/ui/button";
import React from "react";
import { FaRegHeart, FaRegShareFromSquare } from "react-icons/fa6";
import Description from "./Description";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import WishlistButton from "../../../../Components/WishlistButton";
import ShareButton from "./ShareButton";

const DescriptionSection = async ({
  SKU,
  description,
  name,
}: {
  SKU: string;
  description: string;
  name: string;
}) => {
  const session = await auth();

  const isInWishlist = await prisma.wishlist.findFirst({
    where: { user_id: session?.userId || undefined },
    include: {
      wishlistItems: { select: { wishlist_id: true }, where: { SKU: SKU } },
    },
  });

  return (
    <div className="w-full flex flex-col gap-5 ">
      <div className="flex justify-between">
        <p className="text-2xl font-bold">Description</p>
        <div>
          <WishlistButton
            className=" size-5"
            isInWishlist={!!isInWishlist?.wishlistItems.length}
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
