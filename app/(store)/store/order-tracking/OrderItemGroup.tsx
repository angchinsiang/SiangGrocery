import {
  BuyAgainButton,
  OrderDetailsButton,
  ReviewButton,
} from "@/app/Components/OrderHistoryButtons";
import React from "react";

type statusTypes =
  | "Pending"
  | "Processing"
  | "Delivered"
  | "DeliveredDetails"
  | "ReturnCancel";
const statusList: Record<statusTypes, React.FC[]> = {
  Pending: [],
  Processing: [],
  Delivered: [OrderDetailsButton, BuyAgainButton, ReviewButton],
  DeliveredDetails: [BuyAgainButton, ReviewButton],
  ReturnCancel: [OrderDetailsButton],
};

const OrderItemGroup = ({
  children,
  totalAmount,
  status,
}: {
  children: React.ReactNode;
  totalAmount: number;
  status: statusTypes;
}) => {
  return (
    <div className="flex flex-col gap-5 py-5 ring-2 ring-gray-200 rounded-[24px]">
      {children}
      <div className="flex flex-col items-end px-10 gap-5">
        <p className="text-xl font-bold">Total: ${totalAmount.toFixed(2)}</p>
        <div className="flex gap-3 ">
          {statusList[status]?.map((ButtonComponent) => (
            <ButtonComponent key={ButtonComponent.name} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderItemGroup;
