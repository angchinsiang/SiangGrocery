"use client";

import {
  cancelPaymentIntent,
  createPaymentIntent,
} from "@/app/actions/checkout";
import { useState, useTransition } from "react";
import StripeCheckoutForm from "./StripeCheckoutForm";
import { Address } from "@/lib/generated/prisma";
import Link from "next/link";

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
  isCart,
  availableShippingCoupon,
  availableDiscountCoupon,
  userAddresses,
  onToggleCheckout,
}: {
  items: OrderItem[];
  isCart: boolean;
  availableShippingCoupon: Coupon[];
  availableDiscountCoupon: Coupon[];
  userAddresses: Address[];
  onToggleCheckout: () => void;
}) {
  const [useShippingCoupon, setUseShippingCoupon] = useState(
    !!availableShippingCoupon,
  );
  const [useDiscountCoupon, setUseDiscountCoupon] = useState(
    !!availableDiscountCoupon,
  );
  // Default to first address or empty string if none available
  const [selectedAddressId, setSelectedAddressId] = useState(
    userAddresses.length > 0 ? userAddresses[0].id : "",
  );
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const baseShippingFee = 5.0; // Flat rate RM 5.00 or $5.00 for example

  const shippingDiscount =
    useShippingCoupon && availableShippingCoupon.length > 0
      ? availableShippingCoupon[0].amount
      : 0;
  const finalShippingFee = Math.max(0, baseShippingFee - shippingDiscount);

  const productDiscount =
    useDiscountCoupon && availableDiscountCoupon.length > 0
      ? availableDiscountCoupon[0].amount
      : 0;

  // Tax logic (if applicable, assuming 0 for now based on user's schema not having tax field, or standard 8% from their checkout2)
  const taxRate = 0; // Or 0.08 if needed
  const taxAmount = (subtotal - productDiscount) * taxRate;

  const grandTotal =
    Math.max(0, subtotal - productDiscount) + finalShippingFee + taxAmount;

  const handlePay = () => {
    if (!selectedAddressId) {
      setError("Please select a delivery address to proceed.");
      return;
    }
    
    // Find full address string format
    const addressObj = userAddresses.find((a) => a.id === selectedAddressId);
    const fullAddressString = addressObj 
      ? `${addressObj.street}, ${addressObj.city}, ${addressObj.state} ${addressObj.postalCode}, ${addressObj.country}`
      : "No address provided";

    onToggleCheckout();
    startTransition(async () => {
      setError(null);
      try {
        const response = await createPaymentIntent(
          items.map((item) => ({ SKU: item.SKU, quantity: item.quantity })),
          isCart,
          useShippingCoupon
            ? availableShippingCoupon.length > 0
              ? availableShippingCoupon[0].id
              : undefined
            : undefined,
          useDiscountCoupon
            ? availableDiscountCoupon.length > 0
              ? availableDiscountCoupon[0].id
              : undefined
            : undefined,
          fullAddressString // Pass the newly required address string
        );

        if (response.error) {
          setError(response.error);
          onToggleCheckout();
          return;
        }

        if (response.clientSecret && response.paymentId) {
          setClientSecret(response.clientSecret);
          setPaymentId(response.paymentId);
          setExpiresAt(response.expiresAt);
        }
      } catch (err) {
        setError("Failed to initialize payment. Please try again.");
        onToggleCheckout();
      }
    });
  };

  const handleCancel = (paymentId: string) => {
    startTransition(async () => {
      const response = await cancelPaymentIntent(paymentId);

      if (response.error) {
        setError(response.error);
        onToggleCheckout();
        return;
      }
      setClientSecret(null);
      setPaymentId(null);
      setExpiresAt(null);
      onToggleCheckout();
    });
  };

  if (!items || items.length === 0) {
    return null;
  }

  // Phase 2: Show Stripe Payment Element form
  if (clientSecret && paymentId && expiresAt) {
    return (
      <StripeCheckoutForm
        clientSecret={clientSecret}
        amount={grandTotal}
        onBack={() => handleCancel(paymentId)}
        expiresAt={expiresAt}
      />
    );
  }

  // Phase 1: Show Order Summary
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Delivery Details</h2>

      {/* Address Selection Dropdown */}
      <div className="mb-6 pb-6 border-b border-gray-100">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Delivery Address
        </label>
        {userAddresses.length > 0 ? (
          <select
            value={selectedAddressId}
            onChange={(e) => setSelectedAddressId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#f8b878] focus:border-[#f8b878] outline-none"
          >
            {userAddresses.map((address) => (
              <option key={address.id} value={address.id}>
                {address.street}, {address.city}, {address.state} {address.postalCode}
              </option>
            ))}
          </select>
        ) : (
          <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100">
            No saved addresses found. <Link href="/store/profile" className="font-bold underline hover:text-amber-800">Add an address in your profile</Link> before checking out.
          </div>
        )}
      </div>

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
            {availableShippingCoupon.length > 0 && (
              <label className="text-xs text-blue-600 flex items-center gap-1 mt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useShippingCoupon}
                  onChange={(e) => setUseShippingCoupon(e.target.checked)}
                  className="rounded text-blue-600"
                />
                Apply Shipping Coupon (-$
                {availableShippingCoupon.length > 0
                  ? availableShippingCoupon[0].amount
                  : 0}
                )
              </label>
            )}
          </div>
          <span className="font-medium">${finalShippingFee.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center text-gray-600">
          <div className="flex flex-col">
            <span>Discount</span>
            {availableDiscountCoupon.length > 0 && (
              <label className="text-xs text-blue-600 flex items-center gap-1 mt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useDiscountCoupon}
                  onChange={(e) => setUseDiscountCoupon(e.target.checked)}
                  className="rounded text-blue-600"
                />
                Apply Product Coupon (-$
                {availableDiscountCoupon.length > 0
                  ? availableDiscountCoupon[0].amount
                  : 0}
                )
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
