"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { useCart } from "./CartContext";

const CheckBox = ({ SKU, quantity }: { SKU: string; quantity: number }) => {
  const { checkedSKUs, toggleChecked } = useCart();

  return (
    <Checkbox
      checked={checkedSKUs.has(SKU)}
      onCheckedChange={() => {
        toggleChecked(SKU, quantity);
      }}
      id={`cart-checkbox-${SKU}`}
      name={`cart-checkbox-${SKU}`}
      className="border-2 border-gray-300 size-5"
    />
  );
};

export default CheckBox;
