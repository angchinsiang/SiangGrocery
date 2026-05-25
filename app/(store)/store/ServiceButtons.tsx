import { Button } from "@/components/ui/button";
import React from "react";
import { FaLocationDot } from "react-icons/fa6";
import { GoClockFill } from "react-icons/go";
import { MdArrowBackIosNew } from "react-icons/md";

const ServiceButtons = () => {
  return (
    <div className="flex justify-between px-[5%] [&_Button]:rounded-full">
      <div className="flex gap-5">
        <Button variant="default" className="flex items-center gap-2 py-4">
          <FaLocationDot className="size-3" />
          Location
          <MdArrowBackIosNew className="rotate-270 size-3 " />
        </Button>
        <Button variant="default" className="flex items-center gap-2 py-4">
          <GoClockFill />
          Date & Time
          <MdArrowBackIosNew className="rotate-270 size-3 " />
        </Button>
      </div>
      <div className="flex gap-5">
        <Button variant="default" className="py-4 px-6">
          All Products
        </Button>
        <Button variant="default" className="py-4 px-6">
          Order Tracking
        </Button>
      </div>
    </div>
  );
};

export default ServiceButtons;
