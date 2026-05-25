import { Separator } from "@/components/ui/separator";
import ProductCardManager from "./ProductCardManager";

const MoreSection = async () => {
  return (
    <div className="w-full pt-20 flex flex-col gap-0 items-center">
      <p className="text-lg font-semibold ">You May Also Like</p>
      <Separator className="my-5" />
      <ProductCardManager />
    </div>
  );
};

export default MoreSection;
