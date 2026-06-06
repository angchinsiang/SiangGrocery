import BodyTemplate from "@/components/server/BodyTemplate";
import React from "react";
import StoreProductCard from "@/components/server/StoreProductCard";
import dummyImage from "@/public/DummyImg.jpg";
import MoreSection from "@/components/server/MoreSection";

const page = () => {
  return (
    <BodyTemplate header="Wishlist">
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          <StoreProductCard
            SKU="200"
            image={dummyImage}
            alt="Fresh Milk"
            price={8.99}
            oriPrice={10.99}
            unit="Kg"
            country="Malaysia"
          />
          <StoreProductCard
            SKU="200"
            image={dummyImage}
            alt="Fresh Milk"
            price={8.99}
            oriPrice={10.99}
            unit="Kg"
            country="Malaysia"
          />
          <StoreProductCard
            SKU="200"
            image={dummyImage}
            alt="Fresh Milk"
            price={8.99}
            oriPrice={10.99}
            unit="Kg"
            country="Malaysia"
          />
          <StoreProductCard
            SKU="200"
            image={dummyImage}
            alt="Fresh Milk"
            price={8.99}
            oriPrice={10.99}
            unit="Kg"
            country="Malaysia"
          />
          <StoreProductCard
            SKU="200"
            image={dummyImage}
            alt="Fresh Milk"
            price={8.99}
            oriPrice={10.99}
            unit="Kg"
            country="Malaysia"
          />
        </div>
      </div>
      <MoreSection />
    </BodyTemplate>
  );
};

export default page;
