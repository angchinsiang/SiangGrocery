import { Separator } from "@/components/ui/separator";
import React from "react";
import ContentSection from "../../ContentSection";
import ProductCard2 from "../../ProductCard2";
import dummyImg from "@/public/DummyImg.jpg";
import { Button } from "@/components/ui/button";

const MoreSection = () => {
  return (
    <div className="w-full px-[5%] pt-5 flex flex-col gap-0 items-center">
      <p className="text-lg font-semibold ">You May Also Like</p>
      <Separator className="my-5" />
      <div className="space-y-5 pb-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          <ProductCard2
            alt="image"
            image={dummyImg}
            price={10.99}
            oriPrice={8.99}
            unit="Kg"
            country="Austrialia"
          />
          <ProductCard2
            alt="image"
            image={dummyImg}
            price={10.99}
            oriPrice={8.99}
            unit="Kg"
            country="Austrialia"
          />
          <ProductCard2
            alt="image"
            image={dummyImg}
            price={10.99}
            oriPrice={8.99}
            unit="Kg"
            country="Austrialia"
          />
          <ProductCard2
            alt="image"
            image={dummyImg}
            price={10.99}
            oriPrice={8.99}
            unit="Kg"
            country="Austrialia"
          />
          <ProductCard2
            alt="image"
            image={dummyImg}
            price={10.99}
            oriPrice={8.99}
            unit="Kg"
            country="Austrialia"
          />
          <ProductCard2
            alt="image"
            image={dummyImg}
            price={10.99}
            oriPrice={8.99}
            unit="Kg"
            country="Austrialia"
          />
          <ProductCard2
            alt="image"
            image={dummyImg}
            price={10.99}
            oriPrice={8.99}
            unit="Kg"
            country="Austrialia"
          />
          <ProductCard2
            alt="image"
            image={dummyImg}
            price={10.99}
            oriPrice={8.99}
            unit="Kg"
            country="Austrialia"
          />
        </div>
        <div className="flex justify-center">
          <Button variant="link">Load More</Button>
        </div>
      </div>
    </div>
  );
};

export default MoreSection;
