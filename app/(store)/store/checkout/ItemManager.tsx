"use client";

import { Coupon } from "@/lib/generated/prisma";
import { useState } from "react";
import CartItemList from "./CartItemList";
import OrderSummary from "./OrderSummary";

export type OrderItem = {
  SKU: string;
  name: string;
  image: string;
  country: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

const ItemManager = ({
  initialItems,
  isCart,
  shippingCoupon,
  discountCoupon,
}: {
  initialItems: OrderItem[];
  isCart: boolean;
  shippingCoupon?: Coupon[];
  discountCoupon?: Coupon[];
}) => {
  const [items, setItems] = useState(initialItems);

  if (items.length === 0) {
    return (
      <section className="lg:col-span-3 text-center py-12 text-gray-500">
        Your cart is empty.
      </section>
    );
  }
  return (
    <>
      <section className="lg:col-span-2 space-y-6">
        <CartItemList items={items} isCart={isCart} setItems={setItems} />
      </section>

      <section className="lg:col-span-1">
        <OrderSummary
          items={items}
          availableShippingCoupon={shippingCoupon}
          availableDiscountCoupon={discountCoupon}
        />
      </section>
    </>
  );
};

export default ItemManager;
