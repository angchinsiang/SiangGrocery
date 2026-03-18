import { Button } from "@/components/ui/button";
import React from "react";
import { FaRegHeart, FaRegShareFromSquare } from "react-icons/fa6";
import Description from "./Description";

const DescriptionSection = () => {
  return (
    <div className="w-full flex flex-col gap-5 ">
      <div className="flex justify-between">
        <p className="text-2xl font-bold">Description</p>
        <div>
          <Button variant="ghost" className="hover:bg-red-50">
            <FaRegHeart className="size-4 text-red-600" />
          </Button>
          <Button variant="ghost" className="hover:bg-gray-100">
            <FaRegShareFromSquare className="size-4" />
          </Button>
        </div>
      </div>
      <Description description="This is a description" />
    </div>
  );
};

export default DescriptionSection;
