import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { MdDelete } from "react-icons/md";
import CartProductCard from "./CartProductCard";

type Props = {
  productName: string;
  image: string;
  alt: string;
  oriPrice: number;
  price: number;
  unit: string;
  country: string;
  quantity: number;
};

const CartItem = ({
  productName,
  image,
  alt,
  oriPrice,
  price,
  unit,
  country,
  quantity,
}: Props) => {
  return (
    <div className="flex gap-5 items-center">
      <div className="w-[5%] flex justify-center">
        <Checkbox id="terms-checkbox-basic" name="terms-checkbox-basic" className="border-2 border-gray-300 size-5"  />
      </div>
      <div className="w-[95%] flex">
        <CartProductCard
          image={image}
          alt={alt}
          oriPrice={oriPrice}
          price={price}
          unit={unit}
          country={country}
        />
        <div className="flex flex-col px-7 w-full">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xl font-bold">{productName}</p>
              <p className="text-red-600 font-bold text-lg">
                ${price}{" "}
                <span className="text-sm font-normal text-gray-600">
                  / {unit}
                </span>
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <Button className="flex justify-center items-center bg-[#BFD8BA] rounded-sm shadow-sm border-none text-black text-sm aspect-square">
                -
              </Button>
              {quantity}
              <Button className="flex justify-center items-center bg-[#BFD8BA] rounded-sm shadow-sm border-none text-black text-sm aspect-square">
                +
              </Button>
              <Button variant="ghost" className="aspect-square">
                <MdDelete className="size-5 text-red-600 " />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
