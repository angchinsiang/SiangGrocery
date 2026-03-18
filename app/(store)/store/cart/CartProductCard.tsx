
import Image from "next/image";


const CartProductCard = ({image, alt, oriPrice, price, unit, country}: {image: string, alt: string, oriPrice: number, price: number, unit: string, country: string}) => {
  return (
    <div className="ring-2 ring-gray-200 h-64 aspect-3/4 relative rounded-xl p-4 bg-white">
          <div className="mb-4 h-[65%]">
            <Image
              src={image}
              alt={alt}
              width={150}
              height={150}
              className="w-full"
            />
          </div>
            <div className="h-[25%] flex flex-col justify-center ">
              <p className="line-through text-xs text-gray-400">${oriPrice}</p>
              <p className="text-red-600 font-bold text-xl">
                ${price}
                <span className="text-sm font-normal text-gray-600">
                  / {unit}
                </span>
              </p>
            </div>
          {/* Fixed: Added justify-between and w-full to push the cart to the right! */}
          <div className="flex items-center w-full h-[10%]">
            <div className="text-muted-foreground font-medium text-xs">
              From {country}
            </div>
          </div>
          {/* The Heart is now safely trapped 5px from the top-right edge of the card! */}
        </div>
  )
}

export default CartProductCard