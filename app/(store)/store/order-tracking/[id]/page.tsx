import BodyTemplate from "@/components/server/BodyTemplate";
import React from "react";
import OrderStatusStripe from "./OrderStatusStripe";
import RecepientDetailStripe from "./RecepientDetailStripe";
import OrderItem from "../OrderItem";
import OrderItemGroup from "../OrderItemGroup";
import GoUp from "@/components/client/GoUp";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/store");
  }

  const { id: orderTicketId } = await params;

  const order = await prisma.order_Ticket.findUnique({
    where: { id: orderTicketId, user_id: userId },
    include: {
      user: true,
      groceryOrders: {
        include: {
          listed_product: {
            include: {
              grocery: {
                include: {
                  groceryMedias: {
                    where: { isPrimary: true },
                    include: { media: true },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!order) {
    return (
      <BodyTemplate>
        <div className="py-20 text-center text-gray-500 text-lg">Order not found.</div>
      </BodyTemplate>
    );
  }

  // Calculate actual mapped status for UI
  let uiStatus: "Pending" | "Processing" | "Delivered" | "ReturnCancel" = "Pending";
  if (order.status === "PENDING" && ["WAITING_FOR_PAYMENT", "PENDING"].includes(order.deliveryStatus)) {
    uiStatus = "Pending";
  } else if (order.status === "COMPLETED" && ["PENDING", "OUT_FOR_DELIVERY"].includes(order.deliveryStatus)) {
    uiStatus = "Processing";
  } else if (order.deliveryStatus === "DELIVERED") {
    uiStatus = "Delivered";
  } else if (order.status === "CANCELLED" || ["RETURNED", "CANCELLED"].includes(order.deliveryStatus)) {
    uiStatus = "ReturnCancel";
  }

  // Derive recipient details
  // Use delivery_address if available, fallback to user info
  const address = order.delivery_address || "No address provided";
  const receipient = order.user.name;
  const phone = order.user.phone || "No phone provided";

  const orderItems = order.groceryOrders.map((go) => {
    const product = go.listed_product;
    const grocery = product.grocery;
    const primaryMedia = grocery.groceryMedias[0]?.media;
    return {
      id: go.id,
      productName: grocery.name,
      image: primaryMedia?.url || "/DummyImg.jpg",
      alt: primaryMedia?.altText || grocery.name,
      oriPrice: product.original_price,
      price: product.discount_price > 0 ? product.discount_price : product.original_price,
      unit: grocery.size || grocery.MoU.toString(),
      country: grocery.country,
      quantity: go.quantity,
    };
  });

  const subtotal = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <>
      <BodyTemplate>
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-5">
            <OrderStatusStripe status={uiStatus} />
            <RecepientDetailStripe
              receipient={receipient}
              address={address}
              phone={phone}
            />
          </div>
          <div>
            <OrderItemGroup
              status={uiStatus === "Delivered" ? "DeliveredDetails" : uiStatus}
              totalAmount={subtotal}
            >
              {orderItems.map((item) => (
                <OrderItem {...item} key={item.id} />
              ))}
            </OrderItemGroup>
          </div>
          <div className="flex flex-col gap-10">
            <div>
              <p className="text-md font-bold mb-4">Order Details</p>
              {orderItems.map((item) => (
                <div key={item.id} className="flex justify-between mb-2">
                  <p className="text-gray-600">{item.productName} <span className="text-sm">x{item.quantity}</span></p>
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <div className="flex justify-between mt-4">
                <p>Subtotal</p>
                <p>${subtotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p>Shipping & Discounts</p>
                <p className={order.total_amount - subtotal < 0 ? "text-green-600" : ""}>
                  ${(order.total_amount - subtotal).toFixed(2)}
                </p>
              </div>
              <div className="flex justify-between mt-4">
                <p>
                  <span className="font-bold text-lg">Total Amount</span>
                </p>
                <p className="font-bold text-xl text-[#D522A0]">
                  ${order.total_amount.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="flex gap-15 text-sm">
              <div className="flex flex-col gap-2 text-gray-500">
                <p>Order ID: </p>
                <p>Created At: </p>
                <p>Payment Method: </p>
                <p>Status: </p>
                <p>Delivery Status: </p>
                {order.completed_At && <p>Completed At: </p>}
              </div>
              <div className="flex flex-col gap-2 font-medium">
                <p>{order.id}</p>
                <p>{new Date(order.createdAt).toLocaleString()}</p>
                <p>{order.payment_method}</p>
                <p>{order.status}</p>
                <p>{order.deliveryStatus}</p>
                {order.completed_At && <p>{new Date(order.completed_At).toLocaleString()}</p>}
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
