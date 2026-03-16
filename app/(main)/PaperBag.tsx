import React from "react";
import Image from "next/image";
import paperBagImg from "@/public/Paper Bag.png";
import { Button } from "@/components/ui/button";

const PaperBag = () => {
  return (
    <div className="flex flex-col items-center gap-3 ">
      <Image
        src={paperBagImg}
        alt="A paper bag of groceries."
        className="object-contain max-w-xs"
        placeholder="empty"
        quality={75}
      />
      <Button
        size="lg"
        className="shadow-md bg-green-500 hover:bg-green-600 active:bg-[#364C35] font-bold px-6 py-5"
      >
        Shop Now
      </Button>
    </div>
  );
};

export default PaperBag;
