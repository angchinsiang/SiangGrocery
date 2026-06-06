"use client";

import { updateCart } from "@/actions/addToCart";
import { setCartCookie } from "@/actions/cookies-bundle/cookieActions";
import { removeCartItem } from "@/app/actions/checkout";
import { Trash2 } from "lucide-react";
import { useCart, type CartItemData } from "./CartContext";
import CartProductCard from "./CartProductCard";
import CheckBox from "./CheckBox";
import QuantityUpdateButton from "./QuantityUpdateButton";

const CartItem = () => {
  const { items, setItems, checkedSKUs } = useCart();

  const handleRemove = async (SKU: string) => {
    setItems((prev) => prev.filter((item) => item.SKU !== SKU));
    await removeCartItem(SKU);
  };
  const handleUpdateQuantity = async (
    SKU: string,
    quantity: number,
    currentItems: CartItemData[],
  ) => {
    // Also update the cookie if this item is checked
    if (checkedSKUs.has(SKU)) {
      setCartCookie(SKU, quantity);
    }
    const newQuantity = await updateCart(quantity, SKU);
    return currentItems.map((i) =>
      i.SKU === SKU
        ? {
            ...i,
            quantity: newQuantity,
          }
        : i,
    );
  };

  if (items.length === 0)
    return (
      <p className="pt-20 text-gray-600 text-center text-lg font-bold">
        Start shopping and fill your cart!
      </p>
    );
  return items.map((item) => (
    <div key={item.SKU} className="flex gap-5 items-center">
      <div className="w-[5%] flex justify-center">
        <CheckBox SKU={item.SKU} quantity={item.quantity} />
      </div>
      <div className="w-[95%] flex">
        <CartProductCard
          image={item.image}
          alt={item.alt}
          oriPrice={item.oriPrice}
          price={item.discountPrice}
          unit={item.unit}
          country={item.country}
        />
        <div className="flex flex-col px-7 w-full">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xl font-bold">{item.productName}</p>
              <p className="text-red-600 font-bold text-lg">
                ${item.discountPrice}
                <span className="text-sm font-normal text-gray-600">
                  / {item.unit}
                </span>
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <QuantityUpdateButton
                handleCart={async () => {
                  if (item.quantity - 1 === 0) return;
                  setItems(
                    await handleUpdateQuantity(
                      item.SKU,
                      item.quantity - 1,
                      items,
                    ),
                  );
                }}
              >
                -
              </QuantityUpdateButton>
              {item.quantity}
              <QuantityUpdateButton
                handleCart={async () => {
                  setItems(
                    await handleUpdateQuantity(
                      item.SKU,
                      item.quantity + 1,
                      items,
                    ),
                  );
                }}
              >
                +
              </QuantityUpdateButton>
              <button
                onClick={() => handleRemove(item.SKU)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ));
};

export default CartItem;
