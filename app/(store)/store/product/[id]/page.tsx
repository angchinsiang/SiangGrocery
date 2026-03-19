import Comments from "./Comments";
import DescriptionSection from "./DescriptionSection";
import MoreSection from "../../../../Components/MoreSection";
import ProductImageAndPrice from "./ProductImage&Price";
import BodyTemplate from "@/app/Components/BodyTemplate";

const page = () => {
  return (
    <BodyTemplate className="pt-1">
      <ProductImageAndPrice />
      <div className="w-[50%] flex flex-col gap-10">
        <DescriptionSection />
        <Comments />
      </div>
      <MoreSection />
    </BodyTemplate>
  );
};

export default page;
