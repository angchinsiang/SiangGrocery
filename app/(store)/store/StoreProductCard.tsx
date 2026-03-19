import { Button } from "@/components/ui/button";
import Image, { StaticImageData } from "next/image";
import { GoHeart } from "react-icons/go";
import { MdOutlineShoppingCart } from "react-icons/md";
import PriceTag from "../../Components/PriceTag";

const StoreProductCard = ({
  image,
  alt,
  price,
  unit,
  oriPrice,
  country,
}: {
  image: StaticImageData;
  alt: string;
  price: number;
  oriPrice: number;
  unit: string;
  country: string;
}) => {
  return (
    // 1. ADDED 'relative' to trap the Heart button inside!
    // 2. Swapped w-fit to w-full so it fills your Grid cells perfectly.
    // 3. Added rounded-xl and p-4 so it looks like a real card.
    <div className="ring-2 ring-gray-200 w-fit relative rounded-xl p-4 bg-white hover:shadow-xl transition-shadow duration-300 cursor-pointer">
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
        <Button className="aspect-square h-10 rounded-full p-0 bg-[#C9F2BD] hover:bg-[#b0dfa3]">
          <MdOutlineShoppingCart className="text-black size-6" />
        </Button>
      </div>
      {/* The Heart is now safely trapped 5px from the top-right edge of the card! */}
      <div className="absolute top-5 right-5">
        <Button
          variant="ghost"
          className="rounded-full p-0 h-8 aspect-square hover:bg-red-50"
        >
          <GoHeart className="size-6 text-red-500" />
        </Button>
      </div>
    </div>
  );
};

export default StoreProductCard;
