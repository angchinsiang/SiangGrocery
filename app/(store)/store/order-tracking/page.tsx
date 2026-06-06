import BodyTemplate from "@/components/server/BodyTemplate";
import SupportButton from "@/components/client/SupportButton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dummyImage from "@/public/DummyImg.jpg";
import OrderItem from "./OrderItem";
import OrderItemGroup from "./OrderItemGroup";
import GoUp from "@/components/client/GoUp";

const orders = [
  {
    order_id: 1,
    items: [
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
    ],
  },
  {
    order_id: 2,
    items: [
      {
        id: 3,
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
        id: 4,
        productName: "Fresh Milk",
        image: dummyImage.src,
        alt: "Fresh Milk",
        oriPrice: 10.99,
        price: 8.99,
        unit: "Kg",
        country: "Malaysia",
        quantity: 1,
      },
    ],
  },
];

const page = () => {
  return (
    <>
      <BodyTemplate header="Order Summary" ButtonIcon={<SupportButton />}>
        <div className="my-5">
          <Tabs defaultValue="pending" className="w-[70%] mx-auto">
            <TabsList className="w-full bg-gray-200 ">
              <TabsTrigger
                className="group data-[state=active]:bg-gray-50"
                value="pending"
              >
                <span className="group-data-[state=active]:text-gray-800">
                  Pending
                </span>
              </TabsTrigger>
              <TabsTrigger
                className="group data-[state=active]:bg-green-50"
                value="processing"
              >
                <span className="group-data-[state=active]:text-green-600">
                  Processing
                </span>
              </TabsTrigger>
              <TabsTrigger
                className="group data-[state=active]:bg-yellow-50"
                value="delivered"
              >
                <span className="group-data-[state=active]:text-yellow-600">
                  Delivered
                </span>
              </TabsTrigger>
              <TabsTrigger
                className="group data-[state=active]:bg-red-50"
                value="returncancel"
              >
                <span className="group-data-[state=active]:text-red-600">
                  Return/Cancel
                </span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="flex flex-col gap-10">
          {orders.map((order) => (
            <OrderItemGroup
              status="Delivered"
              key={order.order_id}
              totalAmount={order.items.reduce((acc, item) => {
                return acc + item.price * item.quantity;
              }, 0)}
            >
              {order.items.map((item) => (
                <OrderItem {...item} key={item.id} />
              ))}
            </OrderItemGroup>
          ))}
        </div>
      </BodyTemplate>
      <GoUp />
    </>
  );
};

export default page;
