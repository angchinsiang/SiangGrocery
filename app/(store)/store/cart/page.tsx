import BodySection from "@/app/Components/BodyTemplate";
import dummyImage from "@/public/DummyImg.jpg";
import { IoFilterSharp } from "react-icons/io5";
import CartItem from "./CartItem";

const cartItems = [
  {
    id: 1,
    productName: "Fresh Milk",
    image: dummyImage.src,
    alt: "Fresh Milk",
    oriPrice: 10.99,
    price: 8.99,
    unit: "Kg",
    country: "Malaysia",
    quantity: 1,
  },
  {
    id: 2,
    productName: "Fresh Milk",
    image: dummyImage.src,
    alt: "Fresh Milk",
    oriPrice: 10.99,
    price: 8.99,
    unit: "Kg",
    country: "Malaysia",
    quantity: 1,
  },
];

const page = () => {
  return (
    <BodySection header="Shopping Cart" ButtonIcon={<IoFilterSharp className="size-5"/>}>
      <div className="flex flex-col gap-10">
        {cartItems.map((item) => (
          <CartItem key={item.id} {...item} />
        ))}
      </div>
    </BodySection>
  );
};

export default page;
