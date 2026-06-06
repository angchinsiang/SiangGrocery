"use client";

import { Button } from "@/components/ui/button";
import { MdArrowBackIos } from "react-icons/md";
import CheckOutButton from "./CheckOutButton";
import { useCart } from "./CartContext";

const CheckOutStripe = () => {
  const { checkedTotal, checkedCount, items } = useCart();

  if (items.length === 0) return null;
  return (
    <div className="sticky bottom-0 h-15 w-full ring-2 ring-gray-200 bg-white pl-30 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)]">
      <div className="flex justify-between h-full items-center">
        <p className="text-2xl font-bold">
          Total Price
          {checkedCount > 0 && (
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({checkedCount} {checkedCount === 1 ? "item" : "items"})
            </span>
          )}
        </p>
        <div className="flex gap-15 h-full items-center">
          <div className="flex flex-col items-end">
            <div className="flex gap-1 items-center">
              <Button variant="ghost" className="aspect-square">
                <MdArrowBackIos className="size-3 rotate-90" />
              </Button>
              <p className="text-red-500 font-bold text-xl">
                ${checkedTotal.toFixed(2)}
              </p>
            </div>
            <p className="text-xs text-gray-400">*tax included</p>
          </div>
          <CheckOutButton />
        </div>
      </div>
    </div>
  );
};

export default CheckOutStripe;
