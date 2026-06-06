import SupportButton from "@/components/client/SupportButton";
import React from "react";
import { TbTruckDelivery } from "react-icons/tb";

const statusList = {
  Delivered: {
    icon: <TbTruckDelivery className="text-[#2E2EC3] size-5" />,
    message: "Items are succesfully delivered, Thank you for the shopping.",
    bgColor: "bg-linear-to-r from-[#D2D7FF] via-[#929CF3] to-[#6876F2]",
  },
  Processing: {
    icon: <TbTruckDelivery className="text-[#2E2EC3] size-5" />,
    message: "Items are succesfully delivered, Thank you for the shopping.",
    bgColor: "bg-linear-to-r from-[#D2D7FF] via-[#929CF3] to-[#6876F2]",
  },
  Pending: {
    icon: <TbTruckDelivery className="text-[#2E2EC3] size-5" />,
    message: "Items are succesfully delivered, Thank you for the shopping.",
    bgColor: "bg-linear-to-r from-[#D2D7FF] via-[#929CF3] to-[#6876F2]",
  },
  ReturnCancel: {
    icon: <TbTruckDelivery className="text-[#2E2EC3] size-5" />,
    message: "Items are succesfully delivered, Thank you for the shopping.",
    bgColor: "bg-linear-to-r from-[#D2D7FF] via-[#929CF3] to-[#6876F2]",
  },
};

const OrderStatusStripe = ({ status }: { status: keyof typeof statusList }) => {
  return (
    <div
      className={`flex flex-col gap-0 ${statusList[status].bgColor} w-full px-4 py-2 rounded-lg`}
    >
      <div className="flex justify-between w-full">
        <div className="flex gap-2 items-center w-[80%]">
          <p className="font-bold text-md text-[#2E2EC3]">{status}</p>
          {statusList[status].icon}
        </div>
        <div>
          <SupportButton />
        </div>
      </div>
      <div>
        <p className="text-sm">{statusList[status].message}</p>
      </div>
    </div>
  );
};

export default OrderStatusStripe;
