import { Card, CardContent } from "@/components/ui/card";
import dummyImg from "@/public/DummyImg.jpg";
import ProductCard from "@/components/server/ProductCard";

const DiscountSection = () => {
  const products = [
    {
      imgURL: dummyImg,
      price: 8.99,
      oriPrice: 10.99,
      unit: "KG",
      country: "Australia",
    },
    {
      imgURL: dummyImg,
      price: 3.99,
      oriPrice: 2.49,
      unit: "Pcs",
      country: "New Zealand",
    },
    {
      imgURL: dummyImg,
      price: 4.99,
      oriPrice: 6.99,
      unit: "Pcs",
      country: "New Zealand",
    },
    {
      imgURL: dummyImg,
      price: 2.99,
      oriPrice: 3.99,
      unit: "Pcs",
      country: "New Zealand",
    },
    {
      imgURL: dummyImg,
      price: 8.99,
      oriPrice: 10.99,
      unit: "KG",
      country: "New Zealand",
    },
    {
      imgURL: dummyImg,
      price: 1.99,
      oriPrice: 2.99,
      unit: "Pcs",
      country: "New Zealand",
    },
  ];

  return (
    <div className="space-y-5 w-5/7">
      <p className="text-4xl font-normal text-center ">
        Ample<span className="font-hennypenny text-[#E25E95]"> discounts </span>
        from time to time
      </p>
      <div className="w-full">
        <Card>
          <CardContent className="grid gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product, index) => (
              <ProductCard key={index} {...product} />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DiscountSection;
