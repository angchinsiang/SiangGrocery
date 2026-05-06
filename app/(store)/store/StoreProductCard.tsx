import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import PriceTag from "../../Components/PriceTag";
import CartButton from "./CartButton";
import WishlistButton from "../../Components/WishlistButton";

const StoreProductCard = async ({
  SKU,
  image,
  alt,
  price,
  unit,
  oriPrice,
  country,
}: {
  SKU: string;
  image: string | StaticImageData;
  alt: string;
  price: number;
  oriPrice: number;
  unit: string;
  country: string;
}) => {
  const session = await auth();

  const isInWishlist = await prisma.wishlist.findFirst({
    where: { user_id: session?.userId || undefined },
    include: {
      wishlistItems: { select: { wishlist_id: true }, where: { SKU: SKU } },
    },
  });

  return (
    // 1. ADDED 'relative' to trap the Heart button inside!
    // 2. Swapped w-fit to w-full so it fills your Grid cells perfectly.
    // 3. Added rounded-xl and p-4 so it looks like a real card.
    <Link
      href={`/store/product/${SKU}`}
      className="ring-2 ring-gray-200 w-fit relative rounded-xl p-4 bg-white hover:shadow-xl transition-shadow duration-300 cursor-pointer"
    >
      <div className="mb-4">
        <Image
          src={image}
          alt={alt}
          width={200}
          height={200}
          className="w-fit"
        />
      </div>
      <PriceTag oriPrice={oriPrice} price={price} unit={unit} />
      {/* Fixed: Added justify-between and w-full to push the cart to the right! */}
      <div className="flex items-end justify-between w-full mt-4">
        <div className="text-muted-foreground font-medium text-sm">
          From {country}
        </div>
        <CartButton SKU={SKU} />
      </div>
      {/* The Heart is now safely trapped 5px from the top-right edge of the card! */}
      <div className="absolute top-5 right-5">
        <WishlistButton
          isInWishlist={!!isInWishlist?.wishlistItems.length}
          SKU={SKU}
        />
      </div>
    </Link>
  );
};

export default StoreProductCard;
