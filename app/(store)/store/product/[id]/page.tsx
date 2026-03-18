import Comments from "./Comments";
import DescriptionSection from "./DescriptionSection";
import MoreSection from "./MoreSection";
import ProductImageAndPrice from "./ProductImage&Price";

const page = () => {
  return (
    <div className="flex flex-col gap-5">
      <ProductImageAndPrice />
      <div className="w-[50%] flex flex-col gap-10 px-3">
        <DescriptionSection />
        <Comments />
      </div>
      <MoreSection />
    </div>
  );
};

export default page;
