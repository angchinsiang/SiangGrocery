import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription
} from "@/components/ui/card";
import FruitBundle from "@/public/Fruit Bundle.png";
import Image from "next/image";

const QualityAssurance = () => {
  return (
    <Card className="bg-linear-[270deg,#85DEA7,#63AD7F,#52916A] max-w-[57%] relative overflow-visible">
      <CardContent className="py-4 px-6 gap-4 flex flex-col">
        <div>
          <p className="max-w-3/5 text-3xl font-semibold text-white">
            We only Provide
          </p>
          <p className="max-w-3/5 text-3xl font-semibold text-white">
            High Quality Products
          </p>
        </div>
        <CardDescription className="text-white max-w-3/5">
          We believe that great meals start with better ingredients. That&apos;s why we work directly with local growers and trusted suppliers
          to ensure every item—from crisp seasonal greens to premium cuts of
          meat—reaches your kitchen at the peak of freshness. No compromises, no
          shortcuts.
        </CardDescription>
        <Image
          src={FruitBundle}
          alt="A bundle of fruits"
          placeholder="empty"
          quality={75}
          className="object-fit max-w-2/5 absolute -right-10 -bottom-10 "
        />
        <Button className="max-w-2/5 shadow-sm hover:bg-green-100 active:bg-[#364C35] absolute left-9 -bottom-5 bg-white text-[#68AA81] font-bold rounded-4xl px-4 py-5 text-sm">
          Shop Now
        </Button>
      </CardContent>
    </Card>
  );
};

export default QualityAssurance;
