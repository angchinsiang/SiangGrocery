import { Button } from "@/components/ui/button";
import React from "react";

export const OrderDetailsButton = () => {
  return (
    <Button className="flex justify-center items-center bg-white ring-gray-300 ring-1 hover:ring-[#D522A0] hover:text-[#D522A0] hover:bg-white rounded-sm shadow-sm border-none text-black text-sm aspect-square">
      Order Details
    </Button>
  );
};

export const BuyAgainButton = () => {
  return (
    <Button className="flex justify-center items-center bg-[#BFD8BA] hover:bg-[#99B98C] hover:text-black rounded-sm shadow-sm border-none text-black text-sm aspect-square">
      Buy Again
    </Button>
  );
};

export const ReviewButton = () => {
  return (
    <Button className="px-2 flex justify-center items-center bg-[#EEBB23] hover:bg-[#DFAF20] hover:text-black rounded-sm shadow-sm border-none text-black text-sm aspect-square">
      Review
    </Button>
  );
};
