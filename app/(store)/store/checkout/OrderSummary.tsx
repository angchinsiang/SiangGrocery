"use client";

import { useState, useTransition } from "react";
import { createPaymentIntent } from "@/app/actions/checkout";
import { loadStripe } from "@stripe/stripe-js";

// Make sure to set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in .env
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder",
);

type OrderItem = {
  SKU: string;
  name: string;
  quantity: number;
  lineTotal: number;
};

type Coupon = {
  id: string;
  amount: number;
  type: "SHIPPING" | "DISCOUNT";
};

export default function OrderSummary({
  items,
  availableShippingCoupon,
  availableDiscountCoupon,
}: {
  items: OrderItem[];
  availableShippingCoupon?: Coupon[];
  availableDiscountCoupon?: Coupon[];
}) {
  const [useShippingCoupon, setUseShippingCoupon] = useState(
    !!availableShippingCoupon,
  );
  const [useDiscountCoupon, setUseDiscountCoupon] = useState(
    !!availableDiscountCoupon,
  );
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const baseShippingFee = 5.0; // Flat rate RM 5.00 or $5.00 for example

  const shippingDiscount =
    useShippingCoupon && availableShippingCoupon
      ? Math.min(availableShippingCoupon[0].amount, baseShippingFee)
      : 0;
  const finalShippingFee = baseShippingFee - shippingDiscount;

  const productDiscount =
    useDiscountCoupon && availableDiscountCoupon
      ? availableDiscountCoupon[0].amount
      : 0;

  // Tax logic (if applicable, assuming 0 for now based on user's schema not having tax field, or standard 8% from their checkout2)
  const taxRate = 0; // Or 0.08 if needed
  const taxAmount = (subtotal - productDiscount) * taxRate;

  const grandTotal =
    Math.max(0, subtotal - productDiscount) + finalShippingFee + taxAmount;

  const handlePay = () => {
    startTransition(async () => {
      setError(null);
      try {
        const response = await createPaymentIntent(
          useShippingCoupon ? availableShippingCoupon?.[0].id : undefined,
          useDiscountCoupon ? availableDiscountCoupon?.[0].id : undefined,
        );

        if (response.error) {
          setError(response.error);
          return;
        }

        if (response.clientSecret) {
          // In a real app, redirect to a Stripe Elements checkout page
          // or open a modal with the PaymentElement here.
          // For now, redirecting to a placeholder success page or
          // simulating the checkout flow completion.
          console.log("Client Secret Received:", response.clientSecret);
          alert(
            `Payment intent created for ${grandTotal.toFixed(2)}. Proceeding to Stripe...`,
          );
          // Example: stripe.confirmPayment(...)
        }
      } catch (err) {
        setError("Failed to initialize payment. Please try again.");
      }
    });
  };

  if (!items || items.length === 0) {
    return null;
  }
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Order Details</h2>

      <div className="space-y-4 mb-6 text-sm">
        {items.map((item) => (
          <div key={item.SKU} className="flex justify-between text-gray-600">
            <span className="truncate pr-4">{item.name}</span>
            <span className="font-medium whitespace-nowrap">
              ${item.lineTotal.toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-3 py-4 border-t border-gray-100 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center text-gray-600">
          <div className="flex flex-col">
            <span>Shipping Fee</span>
            {availableShippingCoupon && (
              <label className="text-xs text-blue-600 flex items-center gap-1 mt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useShippingCoupon}
                  onChange={(e) => setUseShippingCoupon(e.target.checked)}
                  className="rounded text-blue-600"
                />
                Apply Shipping Coupon (-${availableShippingCoupon?.[0].amount})
              </label>
            )}
          </div>
          <span className="font-medium">${finalShippingFee.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center text-gray-600">
          <div className="flex flex-col">
            <span>Discount</span>
            {availableDiscountCoupon && (
              <label className="text-xs text-blue-600 flex items-center gap-1 mt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useDiscountCoupon}
                  onChange={(e) => setUseDiscountCoupon(e.target.checked)}
                  className="rounded text-blue-600"
                />
                Apply Product Coupon (-${availableDiscountCoupon?.[0].amount})
              </label>
            )}
          </div>
          <span className="font-medium text-red-500">
            -${productDiscount.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center py-4 border-t border-gray-100 mb-6">
        <span className="font-bold text-gray-900 text-base">Total Amount</span>
        <span className="font-black text-2xl text-gray-900">
          ${grandTotal.toFixed(2)}
        </span>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
          {error}
        </div>
      )}

      <button
        onClick={handlePay}
        disabled={isPending || items.length === 0}
        className="w-full bg-[#f8b878] hover:bg-[#f0a860] text-gray-900 font-bold py-4 rounded-xl transition-colors shadow-sm disabled:opacity-50"
      >
        {isPending ? "Processing..." : "Pay"}
      </button>
    </div>
  );
}
