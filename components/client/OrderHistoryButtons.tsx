import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export const OrderDetailsButton = ({
  orderTicketId,
}: {
  orderTicketId?: string;
}) => {
  return (
    <Button
      asChild
      className="flex justify-center items-center bg-white ring-gray-300 ring-1 hover:ring-[#D522A0] hover:text-[#D522A0] hover:bg-white rounded-sm shadow-sm border-none text-black text-sm aspect-square p-0"
    >
      <Link
        href={orderTicketId ? `/store/order-tracking/${orderTicketId}` : "#"}
        className="w-full flex items-center justify-center px-4"
      >
        Order Details
      </Link>
    </Button>
  );
};

export const BuyAgainButton = ({
  orderTicketId,
}: {
  orderTicketId?: string;
}) => {
  return (
    <Button className="flex justify-center items-center bg-[#BFD8BA] hover:bg-[#99B98C] hover:text-black rounded-sm shadow-sm border-none text-black text-sm aspect-square">
      Buy Again
    </Button>
  );
};

export const ReviewButton = ({ orderTicketId }: { orderTicketId?: string }) => {
  return (
    <Button className="px-2 flex justify-center items-center bg-[#EEBB23] hover:bg-[#DFAF20] hover:text-black rounded-sm shadow-sm border-none text-black text-sm aspect-square">
      Review
    </Button>
  );
};
