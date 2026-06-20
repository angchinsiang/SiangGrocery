"use client";

import { Address, Coupon } from "@/lib/generated/prisma";
import { useRef, useState } from "react";
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
  userAddresses,
}: {
  initialItems: OrderItem[];
  isCart: boolean;
  shippingCoupon: Coupon[];
  discountCoupon: Coupon[];
  userAddresses: Address[];
}) => {
  const [items, setItems] = useState(initialItems);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const isCheckingOutRef = useRef(false);

  const toggleCheckout = () => {
    isCheckingOutRef.current = !isCheckingOutRef.current;
    setIsCheckingOut(isCheckingOutRef.current);
  };

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
        <CartItemList
          items={items}
          isCart={isCart}
          setItems={setItems}
          isCheckingOut={isCheckingOut}
          isCheckingOutRef={isCheckingOutRef}
        />
      </section>

      <section className="lg:col-span-1">
        <OrderSummary
          items={items}
          isCart={isCart}
          availableShippingCoupon={shippingCoupon}
          availableDiscountCoupon={discountCoupon}
          userAddresses={userAddresses}
          onToggleCheckout={toggleCheckout}
        />
      </section>
    </>
  );
};

export default ItemManager;
