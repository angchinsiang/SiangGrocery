import { Checkbox } from "@/components/ui/checkbox";
import CartProductCard from "../cart/CartProductCard";

const OrderItem = ({
  productName,
  image,
  alt,
  oriPrice,
  price,
  unit,
  country,
  quantity,
}: {
  productName: string;
  image: string;
  alt: string;
  oriPrice: number;
  price: number;
  unit: string;
  country: string;
  quantity: number;
}) => {
  return (
      <div className="w-full flex px-5">
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
            <div className="text-base">x{quantity}</div>
          </div>
        </div>
      </div>
  );
};

export default OrderItem;
