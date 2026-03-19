import BodyTemplate from "@/app/Components/BodyTemplate";
import React from "react";
import OrderStatusStripe from "./OrderStatusStripe";
import RecepientDetailStripe from "./RecepientDetailStripe";
import dummyImage from "@/public/DummyImg.jpg";
import OrderItem from "../OrderItem";
import OrderItemGroup from "../OrderItemGroup";
import GoUp from "@/app/(main)/GoUp";

const page = () => {
  const receipient = "Lydia";
  const address =
    "No 123, Jalan Intan 100, Taman Pangkalan Barat, 33990 Perak Malaysia ";
  const phone = "1234567890";

  const order = {
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
  };
  return (
    <>
      <BodyTemplate>
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-5">
            <OrderStatusStripe status="Delivered" />
            <RecepientDetailStripe
              receipient={receipient}
              address={address}
              phone={phone}
            />
          </div>
          <div>
            <OrderItemGroup
              status="DeliveredDetails"
              totalAmount={order.items.reduce((acc, item) => {
                return acc + item.price * item.quantity;
              }, 0)}
            >
              {order.items.map((item) => (
                <OrderItem {...item} key={item.id} />
              ))}
            </OrderItemGroup>
          </div>
          <div className="flex flex-col gap-10">
            <div>
              <p className="text-md font-bold">Order Details</p>
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <p>{item.productName}</p>
                  <p>${item.price * item.quantity}</p>
                </div>
              ))}
              <div className="flex justify-between">
                <p>Shipping Fee</p>
                <p>$5.00</p>
              </div>
              <div className="flex justify-between">
                <p>Discount</p>
                <p>-$5.00</p>
              </div>
              <div className="flex justify-between">
                <p>
                  <span className="font-bold">Total Amount</span>
                  <span className="text-sm"> (Including Tax)</span>
                </p>
                <p className="font-bold">
                  $
                  {order.items.reduce((acc, item) => {
                    return acc + item.price * item.quantity;
                  }, 0)}
                </p>
              </div>
            </div>
            <div className="flex gap-15">
              <div className="flex flex-col">
                <p>Order ID: </p>
                <p>Created At: </p>
                <p>Payment Method: </p>
                <p>Delivered At: </p>
                <p>Completed At: </p>
                <p>Remarks: </p>
              </div>
              <div className="flex flex-col">
                <p>Or123456789der</p>
                <p>03-03-2026 11:00:00</p>
                <p>FPX</p>
                <p>03-03-2026 11:00:00</p>
                <p>03-03-2026 11:00:00</p>
                <p>Give the product extra protection. Thanks.</p>
              </div>
            </div>
          </div>
        </div>
      </BodyTemplate>
      <GoUp />
    </>
  );
};

export default page;
