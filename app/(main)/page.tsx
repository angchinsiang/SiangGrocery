import Hero from "./Hero";
import QualityAssurance from "./QualityAssurance";
import DeliveryAssurance from "./DeliveryAssurance";
import PaperBag from "./PaperBag";
import DiscountSection from "./DiscountSection";
import Comments from "./Comments";
import GoUp from "@/components/client/GoUp";

const Page = () => {
  return (
    <div className="bg-theme flex flex-col w-full h-full items-center pt-20 pb-5 relative gap-15">
      <Hero />
      <PaperBag />
      <QualityAssurance />
      <DeliveryAssurance />
      <DiscountSection />
      <Comments />
      <GoUp />
    </div>
  );
};

export default Page;
