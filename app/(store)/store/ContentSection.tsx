import dummyImg from "@/public/DummyImg.jpg";
import ProductCard2 from "./ProductCard2";
import { Button } from "@/components/ui/button";

const ContentSection = ({ title }: { title: string }) => {
  return (
    <div className="space-y-5 ">
      <div className="flex justify-between">
        <p className="text-2xl font-bold">{title}</p>
        <Button variant="link" >
            View All
          </Button>
      </div>
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
    </div>
  );
};

export default ContentSection;
