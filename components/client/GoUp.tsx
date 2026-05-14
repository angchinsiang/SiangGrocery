"use client";

import { Button } from "@/components/ui/button";
import { MdArrowBackIosNew } from "react-icons/md";

const GoUp = () => {
  const handleGoUp = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="fixed bottom-5 right-5 aspect-square h-10">
      <Button className="w-full h-full rounded-full" onClick={handleGoUp}>
        <MdArrowBackIosNew className="rotate-90 size-5 " />
      </Button>
    </div>
  );
};

export default GoUp;
