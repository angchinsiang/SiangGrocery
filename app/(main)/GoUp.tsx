import { Button } from "@/components/ui/button";
import React from "react";
import { MdArrowBackIosNew } from "react-icons/md";

const GoUp = () => {
  return (
    <div className="fixed bottom-5 right-5 aspect-square h-10">
      <Button className="w-full h-full rounded-full">
        <MdArrowBackIosNew className="rotate-90 size-5 " />
      </Button>
    </div>
  );
};

export default GoUp;
