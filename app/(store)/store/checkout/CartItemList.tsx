"use client";

import { removeCartItem, updateCartItemQuantity } from "@/app/actions/checkout";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useTransition } from "react";
import type { RefObject } from "react";
import { OrderItem } from "./ItemManager";

export default function CartItemList({
  items,
  isCart,
  setItems,
  isCheckingOut,
  isCheckingOutRef,
}: {
  items: OrderItem[];
  isCart: boolean;
  setItems: React.Dispatch<React.SetStateAction<OrderItem[]>>;
  isCheckingOut: boolean;
  isCheckingOutRef: RefObject<boolean>;
}) {
  const [isPending, startTransition] = useTransition();

  const handleUpdateQuantity = (SKU: string, newQuantity: number) => {
    if (isCheckingOutRef.current) return; // Synchronous guard
    if (newQuantity < 1) return;

    // Optimistic update
    setItems((prev) =>
      prev.map((item) =>
        item.SKU === SKU
          ? {
              ...item,
              quantity: newQuantity,
              lineTotal: item.unitPrice * newQuantity,
            }
          : item,
      ),
    );

    if (isCart) {
      startTransition(async () => {
        await updateCartItemQuantity(SKU, newQuantity);
      });
    }
  };

  const handleRemove = (SKU: string) => {
    if (isCheckingOutRef.current) return; // Synchronous guard
    setItems((prev) => prev.filter((item) => item.SKU !== SKU));
    // startTransition(async () => {
    //   if (isCart) {
    //     await removeCartItem(SKU);
    //   }
    // });
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.SKU}
          className="flex flex-col sm:flex-row items-start sm:items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 gap-4"
        >
          <div className="relative w-24 h-24 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden border">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-contain p-2"
            />
          </div>

          <div className="flex-grow min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {item.name}
            </h3>
            <p className="text-sm text-gray-500 mb-2">From {item.country}</p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-red-600">
                ${item.unitPrice.toFixed(2)} / Unit
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:ml-auto ">
            <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden">
              <button
                onClick={() =>
                  handleUpdateQuantity(item.SKU, item.quantity - 1)
                }
                disabled={item.quantity <= 1 || isPending || isCheckingOut}
                className="p-2 hover:bg-gray-200 disabled:opacity-50 transition-colors text-green-600 font-bold"
              >
                <Minus size={16} />
              </button>
              <span className="w-8 text-center font-semibold text-gray-900">
                {item.quantity}
              </span>
              <button
                onClick={() =>
                  handleUpdateQuantity(item.SKU, item.quantity + 1)
                }
                disabled={isPending || isCheckingOut}
                className="p-2 hover:bg-gray-200 disabled:opacity-50 transition-colors text-green-600 font-bold"
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              onClick={() => handleRemove(item.SKU)}
              disabled={isPending || isCheckingOut}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
