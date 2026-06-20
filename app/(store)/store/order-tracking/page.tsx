"use client";

import BodyTemplate from "@/components/server/BodyTemplate";
import SupportButton from "@/components/client/SupportButton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import OrderItem from "./OrderItem";
import OrderItemGroup from "./OrderItemGroup";
import GoUp from "@/components/client/GoUp";
import { useQuery } from "@tanstack/react-query";
import { fetchUserOrders } from "@/app/actions/orders";
import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

const OrderTrackingContent = () => {
  const searchParams = useSearchParams();
  const fresh = searchParams.get("fresh");

  const {
    data: groupedOrders,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: () => fetchUserOrders(),
  });

  // If redirected with ?fresh=1, refetch to bypass cache
  useEffect(() => {
    if (fresh === "1") {
      refetch();
    }
  }, [fresh, refetch]);

  const renderOrderGroup = (orders: any[], status: any) => {
    if (!orders || orders.length === 0) {
      return (
        <div className="text-center text-gray-500 py-10">
          No orders found in this category.
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-10">
        {orders.map((order) => (
          <OrderItemGroup
            key={order.id}
            status={status}
            totalAmount={order.totalAmount}
            orderTicketId={order.id}
          >
            {order.items.map((item: any) => (
              <OrderItem {...item} key={item.id} />
            ))}
          </OrderItemGroup>
        ))}
      </div>
    );
  };

  return (
    <BodyTemplate header="Order Summary" ButtonIcon={<SupportButton />}>
      <div className="my-5">
        <Tabs defaultValue="pending" className="w-[70%] mx-auto">
          <TabsList className="w-full bg-gray-200 mb-10">
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

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f8b878]"></div>
            </div>
          ) : (
            <>
              <TabsContent value="pending">
                {renderOrderGroup(groupedOrders?.pending || [], "Pending")}
              </TabsContent>
              <TabsContent value="processing">
                {renderOrderGroup(
                  groupedOrders?.processing || [],
                  "Processing",
                )}
              </TabsContent>
              <TabsContent value="delivered">
                {renderOrderGroup(groupedOrders?.delivered || [], "Delivered")}
              </TabsContent>
              <TabsContent value="returncancel">
                {renderOrderGroup(
                  groupedOrders?.returnCancel || [],
                  "ReturnCancel",
                )}
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </BodyTemplate>
  );
};

const page = () => {
  return (
    <>
      <Suspense
        fallback={<div className="flex justify-center py-20">Loading...</div>}
      >
        <OrderTrackingContent />
      </Suspense>
      <GoUp />
    </>
  );
};

export default page;
