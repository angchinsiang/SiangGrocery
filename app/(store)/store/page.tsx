import { Button } from "@/components/ui/button";
import { CustomCarousel } from "./Carousel";
import ContentSection from "./ContentSection";
import ServiceButtons from "./ServiceButtons";
import GoUp from "@/components/client/GoUp";

const Page = () => {
  return (
    <div className="bg-theme w-full flex flex-col gap-10">
      <div className="p-4 flex justify-center h-[25vh]">
        <CustomCarousel />
      </div>
      <div>
        <ServiceButtons />
      </div>
      <div className="flex flex-col gap-6">
        <div className="w-full px-[5%] py-5 ">
          <ContentSection title="Promotions" />
        </div>
        <div className="w-full px-[5%] py-5">
          <ContentSection title="New Arrivals" />
        </div>
        <div className="w-full px-[5%] py-5">
          <ContentSection title="Currently Popular" />
        </div>
      </div>
      <div className="flex justify-center ">
        <Button variant="default" className=" rounded-full px-4 py-3">
          All Products
        </Button>
      </div>
      <GoUp />
    </div>
  );
};

export default Page;
