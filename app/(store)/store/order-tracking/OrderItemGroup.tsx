import {
  BuyAgainButton,
  OrderDetailsButton,
  ReviewButton,
} from "@/app/Components/OrderHistoryButtons";
import React from "react";

const OrderItemGroup = ({
  children,
  totalAmount,
}: {
  children: React.ReactNode;
  totalAmount: number;
}) => {
  return (
    <div className="flex flex-col gap-5 py-5 ring-2 ring-gray-200 rounded-[24px]">
      {children}
      <div className="flex flex-col items-end px-10 gap-5">
        <p className="text-xl font-bold">Total: ${totalAmount.toFixed(2)}</p>
        <div className="flex gap-3 ">
          <OrderDetailsButton />
          <BuyAgainButton />
          <ReviewButton />
        </div>
      </div>
    </div>
  );
};

export default OrderItemGroup;
