"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  setCartCookie,
  removeCartCookie,
} from "@/actions/cookies-bundle/cookieActions";

export type CartItemData = {
  SKU: string;
  productName: string;
  image: string;
  alt: string;
  oriPrice: number;
  discountPrice: number;
  unit: string;
  country: string;
  quantity: number;
};

type CartContextType = {
  items: CartItemData[];
  setItems: React.Dispatch<React.SetStateAction<CartItemData[]>>;
  checkedSKUs: Set<string>;
  toggleChecked: (SKU: string, quantity: number) => void;
  checkedTotal: number;
  checkedCount: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

export function CartProvider({
  initialItems,
  initialCheckedSKUs,
  children,
}: {
  initialItems: CartItemData[];
  initialCheckedSKUs: string[];
  children: React.ReactNode;
}) {
  const [items, setItems] = useState<CartItemData[]>(initialItems);
  const [checkedSKUs, setCheckedSKUs] = useState<Set<string>>(
    () => new Set(initialCheckedSKUs),
  );

  const toggleChecked = useCallback(
    (SKU: string, quantity: number) => {
      const wasChecked = checkedSKUs.has(SKU);

      setCheckedSKUs((prev) => {
        const next = new Set(prev);
        if (next.has(SKU)) {
          next.delete(SKU);
        } else {
          next.add(SKU);
        }
        return next;
      });

      // Cookie sync runs outside the state updater to avoid
      // triggering router updates during rendering
      if (wasChecked) {
        removeCartCookie(SKU);
      } else {
        setCartCookie(SKU, quantity);
      }
    },
    [checkedSKUs],
  );

  const { checkedTotal, checkedCount } = useMemo(() => {
    let total = 0;
    let count = 0;
    for (const item of items) {
      if (checkedSKUs.has(item.SKU)) {
        total += item.discountPrice * item.quantity;
        count++;
      }
    }
    return {
      checkedTotal: Math.round(total * 100) / 100,
      checkedCount: count,
    };
  }, [items, checkedSKUs]);

  return (
    <CartContext.Provider
      value={{
        items,
        setItems,
        checkedSKUs,
        toggleChecked,
        checkedTotal,
        checkedCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
