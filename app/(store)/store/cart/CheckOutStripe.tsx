import { Button } from "@/components/ui/button";
import React from "react";
import { MdArrowBackIos } from "react-icons/md";

const CheckOutStripe = ({ totalPrice }: { totalPrice: number }) => {
  return (
    <div className="sticky bottom-0 h-15 w-full ring-2 ring-gray-200 bg-white pl-30 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)]">
      <div className="flex justify-between h-full items-center">
        <p className="text-2xl font-bold">Total Price</p>
        <div className="flex gap-15 h-full items-center">
          <div className="flex flex-col items-end">
            <div className="flex gap-1 items-center">
              <Button variant="ghost" className="aspect-square">
                <MdArrowBackIos className="size-3 rotate-90" />
              </Button>
              <p className="text-red-500 font-bold text-xl">${totalPrice}</p>
            </div>
            <p className="text-xs text-gray-400">*tax included</p>
          </div>
          <Button className="h-full rounded-none text-lg font-bold text-black bg-[#FFC188] hover:bg-orange-400">
            Check Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CheckOutStripe;
