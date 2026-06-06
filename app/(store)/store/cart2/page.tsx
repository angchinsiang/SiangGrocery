"use client";

import { useState } from "react";
import {
  ShoppingCart,
  User,
  SlidersHorizontal,
  Plus,
  Minus,
  Trash2,
  ChevronUp,
} from "lucide-react";

type CartItem = {
  id: string;
  name: string;
  originalPrice: number | null;
  price: number;
  unit: string;
  origin: string;
  image: string;
  quantity: number;
};

const initialItems: CartItem[] = [
  {
    id: "item-1",
    name: "Gourmet Thick-Cut Striploin (500g)",
    originalPrice: 10.99,
    price: 8.99,
    unit: "Unit",
    origin: "From Australia",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCTYUOihvoJEuY1ig0zVn-j74W_yh5XRLf0Dod8QDXQhEGXM0_K2DD_a5TFN_4h5nd9ghra3tH02FYmMVhFDN0KyJ9jRR1dDj6D7c7OGYBOpQC5Kf6XN8nu0VJBNJxzYI606IQCKB-U0SuzI2x1gTWn-MQ1mCqHBZ9whRg1jI7aofy05aQk0DpKA2G_tmnaVa5at4rEH1V8Pbqif6TFy5N7NBXsuuqKq4-gTA-17d8G9Ee-taFVBqWp0jVtLjTI1Ag3AkSNO3isP17m",
    quantity: 1,
  },
  {
    id: "item-2",
    name: "(Promo) Original NesCafe 3 In 1",
    originalPrice: 5.99,
    price: 3.99,
    unit: "Unit",
    origin: "From Australia",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCShSqya6sgUU3oEjimE1xaIXWGKHEVOPBalTw8jtZRH6bdjfmQGqiTPkml2HHZeZKp_gDvh2KOb06RGmSty489WJoiQtYsHZaeH9x3KzoTsRPDbbFp6juz4ZgsW4IcE9K8NDA9Ns7QjayHPYmSKA4Wn-e9662QCPoKDhV7tnFe65VCcOCaXHC5dqHz8akqb541CHherVoPFd7sFbWtASw5LbcSOTkjvf4wzos3y2KDUdYKH9RD0-Y8Htm2E1i-OMWwOHbs57UxBcri",
    quantity: 1,
  },
  {
    id: "item-3",
    name: "Farm-Fresh Whole Milk",
    originalPrice: 3.99,
    price: 2.49,
    unit: "Unit",
    origin: "From Australia",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAxicUi1wzL_fH6YN1zS3RfdubYRhu48J3trtfSIcruyT-4RmQSnMESQx0zZ51TtLQb6AXcaXPZy98itJ_uYYqfQPHRtQjmlDckRCOSvCtCtXQ8-nvTGwcB7shzisKr3m8No6WZCt0k8oBgsgO24t9d3E3-Z5rp5huucCb_-t01furuWdcz7XLc2rQhXp6DMg7r0G7sJC22YWbKATeOcP-QBfca9KD7v62ECNymmDSjr8zGSKGILkHuV3hOzrGpI371F_R5NFzWpv0J",
    quantity: 1,
  },
  {
    id: "item-4",
    name: "Fresh Avocado",
    originalPrice: 2.99,
    price: 1.99,
    unit: "Unit",
    origin: "From Australia",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDK6zCSxiitq-Y4ZN7cfem8KZe9K8lG4jVJOjIzNV8SZlh-chSkgk0I_e6fSEiBzzpet_AM1hMdY8jrZ6QlOV8Mkz3aXbKlGlUZpqoEsS4pGGpr_EPF4BO28DXIeBNA_B8kOooT07Ck1OOSCBZduzWrpHLiTF3RAdlMAmDV4NEfcmIy-TStla8jZ1qytk4i0TuncPtnhorpdU5_zZx7FDCsT-ZprYnLzFCUD9bcGJuSvcNC5IPU0Jhta67wBstIOChzbpNr_1IV8I9S",
    quantity: 1,
  },
];

export default function ShoppingCartPage() {
  const [items, setItems] = useState<CartItem[]>(initialItems);

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      }),
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const currentTotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <>
      {/* Header Container */}
      <header className="bg-[#f0f0f0] border-b border-gray-200 sticky top-0 z-50 rounded-b-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex-shrink-0 flex items-center">
            <ShoppingCart className="w-8 h-8 text-black" strokeWidth={2} />
          </div>

          <nav className="hidden md:flex space-x-8 text-gray-800 text-lg font-medium">
            <a href="#" className="hover:text-black transition-colors">
              All Products
            </a>
            <a href="#" className="hover:text-black transition-colors">
              New Arrival
            </a>
            <a href="#" className="hover:text-black transition-colors">
              Recent Popular
            </a>
            <a href="#" className="hover:text-black transition-colors">
              Order Tracking
            </a>
          </nav>

          <div className="flex items-center space-x-6">
            <button className="text-black hover:text-gray-600 transition-colors">
              <ShoppingCart className="w-7 h-7" strokeWidth={2} />
            </button>
            <button className="text-black hover:text-gray-600 transition-colors">
              <User className="w-7 h-7" strokeWidth={2} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content View */}
      <main className="flex-grow max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-10 pb-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-black tracking-tight">
            Shopping Cart
          </h1>
          <button className="text-black hover:text-gray-600 transition-colors">
            <SlidersHorizontal className="w-8 h-8" strokeWidth={2} />
          </button>
        </div>

        {/* Cart Item Listing */}
        <div className="space-y-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-center gap-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-50"
            >
              {/* Image Banner */}
              <div className="w-48 h-48 flex-shrink-0 bg-white rounded-xl border border-gray-200 flex flex-col justify-between p-3 relative shadow-sm">
                {/* Hotlinking using native img as requested per architecture limitations config */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-32 object-contain mix-blend-multiply"
                />
                <div className="mt-2 flex flex-col">
                  {item.originalPrice && (
                    <span className="text-xs text-gray-400 line-through font-medium">
                      ${item.originalPrice.toFixed(2)}
                    </span>
                  )}
                  <span className="text-red-600 font-bold text-lg">
                    ${item.price.toFixed(2)} / {item.unit}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium mt-1 font-inter">
                    {item.origin}
                  </span>
                </div>
              </div>

              {/* Data & Actions Panel */}
              <div className="flex-grow flex flex-col sm:flex-row justify-between items-center w-full gap-4">
                <div className="flex flex-col space-y-2 text-center sm:text-left">
                  <h2 className="text-xl font-semibold text-black">
                    {item.name}
                  </h2>
                  <p className="text-red-600 font-bold text-lg">
                    ${item.price.toFixed(2)} / {item.unit}
                  </p>
                </div>

                <div className="flex items-center space-x-6">
                  {/* Quantity adjustment component */}
                  <div className="flex items-center space-x-4 bg-gray-50 p-1 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-8 h-8 rounded bg-[#c5e1a5] flex items-center justify-center text-gray-700 hover:bg-[#aed581] transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <span className="font-bold text-xl w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      disabled={item.quantity <= 1}
                      className="w-8 h-8 rounded bg-[#c5e1a5] flex items-center justify-center text-gray-700 hover:bg-[#aed581] transition-colors disabled:opacity-50 disabled:hover:bg-[#c5e1a5] cursor-pointer disabled:cursor-not-allowed"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Removal Functionality */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700 transition-colors p-2"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="text-center py-12 text-gray-500 font-medium text-lg">
              Your shopping cart is empty
            </div>
          )}
        </div>
      </main>

      {/* Persistent Bottom Summary Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] border-t border-gray-100 h-28 flex items-center z-50">
        <div className="max-w-[1920px] mx-auto w-full flex justify-between items-stretch h-full">
          <div className="flex items-center pl-8 md:pl-20">
            <span className="text-[28px] font-extrabold text-black tracking-tight">
              Current Price:
            </span>
          </div>

          <div className="flex items-stretch">
            <div className="flex flex-col justify-center items-end pr-8">
              <div className="flex items-center">
                <ChevronUp className="w-6 h-6 text-gray-600 mr-2" />
                <span className="text-4xl font-extrabold text-[#ef4444]">
                  ${currentTotal.toFixed(2)}
                </span>
              </div>
              <span className="text-sm text-gray-500 mt-1 font-medium font-inter">
                *Include Tax
              </span>
            </div>

            <button className="bg-[#fdba74] hover:bg-[#fb923c] transition-colors text-black text-[28px] font-extrabold px-16 h-full flex items-center justify-center cursor-pointer">
              Check Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
}