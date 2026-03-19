import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import dummyImg from "@/public/DummyImg.jpg";
import StoreProductCard from "../(store)/store/StoreProductCard";

const MoreSection = () => {
  return (
    <div className="w-full pt-20 flex flex-col gap-0 items-center">
      <p className="text-lg font-semibold ">You May Also Like</p>
      <Separator className="my-5" />
      <div className="space-y-5 pb-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          <StoreProductCard
            alt="image"
            image={dummyImg}
            price={10.99}
            oriPrice={8.99}
            unit="Kg"
            country="Austrialia"
          />
          <StoreProductCard
            alt="image"
            image={dummyImg}
            price={10.99}
            oriPrice={8.99}
            unit="Kg"
            country="Austrialia"
          />
          <StoreProductCard
            alt="image"
            image={dummyImg}
            price={10.99}
            oriPrice={8.99}
            unit="Kg"
            country="Austrialia"
          />
          <StoreProductCard
            alt="image"
            image={dummyImg}
            price={10.99}
            oriPrice={8.99}
            unit="Kg"
            country="Austrialia"
          />
          <StoreProductCard
            alt="image"
            image={dummyImg}
            price={10.99}
            oriPrice={8.99}
            unit="Kg"
            country="Austrialia"
          />
          <StoreProductCard
            alt="image"
            image={dummyImg}
            price={10.99}
            oriPrice={8.99}
            unit="Kg"
            country="Austrialia"
          />
          <StoreProductCard
            alt="image"
            image={dummyImg}
            price={10.99}
            oriPrice={8.99}
            unit="Kg"
            country="Austrialia"
          />
          <StoreProductCard
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
