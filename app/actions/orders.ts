"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import {
  Order_Ticket,
  Grocery_Order,
  Listed_Product,
  Grocery,
  Grocery_Media,
  MediaAsset,
} from "@/lib/generated/prisma";

export type OrderItemData = {
  id: string;
  productName: string;
  image: string;
  alt: string;
  oriPrice: number;
  price: number;
  unit: string;
  country: string;
  quantity: number;
};

export type OrderTicketData = {
  id: string;
  status: string;
  deliveryStatus: string;
  createdAt: Date;
  completedAt: Date | null;
  totalAmount: number;
  paymentMethod: string;
  deliveryAddress: string | null;
  items: OrderItemData[];
};

export type OrderGroupData = {
  pending: OrderTicketData[];
  processing: OrderTicketData[];
  delivered: OrderTicketData[];
  returnCancel: OrderTicketData[];
};

export async function fetchUserOrders(): Promise<OrderGroupData> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Fetch all orders for the user with nested products
  const orders = await prisma.order_Ticket.findMany({
    where: { user_id: userId },
    include: {
      groceryOrders: {
        include: {
          listed_product: {
            include: {
              grocery: {
                include: {
                  groceryMedias: {
                    orderBy: { sortOrder: "asc" },
                    // skip: 1,
                    take: 1,
                    include: { media: true },
                  },
                },
              },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const grouped: OrderGroupData = {
    pending: [],
    processing: [],
    delivered: [],
    returnCancel: [],
  };

  for (const order of orders) {
    const formattedOrder: OrderTicketData = {
      id: order.id,
      status: order.status,
      deliveryStatus: order.deliveryStatus,
      createdAt: order.createdAt,
      completedAt: order.completed_At,
      totalAmount: order.total_amount,
      paymentMethod: order.payment_method,
      deliveryAddress: order.delivery_address,
      items: order.groceryOrders.map((go) => {
        const product = go.listed_product;
        const grocery = product.grocery;
        const primaryMedia = grocery.groceryMedias[0]?.media;

        return {
          id: go.id,
          productName: grocery.name,
          image: primaryMedia?.url || "/DummyImg.jpg",
          alt: primaryMedia?.altText || grocery.name,
          oriPrice: product.original_price,
          price:
            product.discount_price > 0
              ? product.discount_price
              : product.original_price,
          unit: grocery.size || grocery.MoU.toString(),
          country: grocery.country,
          quantity: go.quantity,
        };
      }),
    };

    // Categorize based on mapping from implementation plan
    // Pending: PENDING OR WAITING_FOR_PAYMENT
    if (
      order.status === "PENDING" &&
      ["WAITING_FOR_PAYMENT", "PENDING"].includes(order.deliveryStatus)
    ) {
      grouped.pending.push(formattedOrder);
    }
    // Processing: COMPLETED AND OUT_FOR_DELIVERY (Wait, in Stripe webhook, successful payment sets status to COMPLETED, deliveryStatus to PENDING)
    else if (
      order.status === "COMPLETED" &&
      ["PENDING", "OUT_FOR_DELIVERY"].includes(order.deliveryStatus)
    ) {
      grouped.processing.push(formattedOrder);
    }
    // Delivered: DELIVERED
    else if (order.deliveryStatus === "DELIVERED") {
      grouped.delivered.push(formattedOrder);
    }
    // ReturnCancel: CANCELLED or RETURNED
    else if (
      order.status === "CANCELLED" ||
      ["RETURNED", "CANCELLED"].includes(order.deliveryStatus)
    ) {
      grouped.returnCancel.push(formattedOrder);
    } else {
      // Fallback
      grouped.pending.push(formattedOrder);
    }
  }

  return grouped;
}
