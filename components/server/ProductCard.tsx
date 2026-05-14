import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image, { StaticImageData } from "next/image";
import { GoHeart } from "react-icons/go";
import { MdOutlineShoppingCart } from "react-icons/md";

const ProductCard = ({
  imgURL,
  price,
  oriPrice,
  unit,
  country,
}: {
  imgURL: StaticImageData;
  price: number;
  oriPrice: number;
  unit: string;
  country: string;
}) => {
  return (
    <Card className="w-56 relative">
      <CardContent className="">
        <Image src={imgURL} alt="A product card" className="w-full h-auto" />
        <div>
          <p className="line-through text-black font-semibold">${oriPrice}</p>
          <p className="text-red-600 font-bold text-xl">
            ${price} <span>/ {unit}</span>
          </p>
        </div>
        <div className="flex justify-between items-end ">
          <div className="text-muted-foreground font-medium">
            From {country}
          </div>
          <div className="">
            <Button className="aspect-square h-10 rounded-full p-0 bg-[#C9F2BD]">
              <MdOutlineShoppingCart className="text-black size-6" />
            </Button>
          </div>
        </div>
      </CardContent>
      <div className="absolute top-5 right-5">
        <Button variant="link" className="rounded-full p-0 h-8 aspect-square">
          <GoHeart className="size-6 " />
        </Button>
      </div>
    </Card>
  );
};

export default ProductCard;
