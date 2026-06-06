import { Button } from "@/components/ui/button";
import React from "react";

const QuantityUpdateButton = ({
  handleCart,
  children,
}: {
  handleCart: () => Promise<void>;
  children: React.ReactNode;
}) => {
  return (
    <Button
      onClick={async () => {
        await handleCart();
      }}
      className="flex justify-center items-center bg-[#BFD8BA] rounded-sm shadow-sm border-none text-black text-sm aspect-square"
    >
      {children}
    </Button>
  );
};

export default QuantityUpdateButton;
