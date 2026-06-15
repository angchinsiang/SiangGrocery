"use client";

import { useState } from "react";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder",
);

function CheckoutForm({
  amount,
  onBack,
}: {
  amount: number;
  onBack: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/store/checkout/success`,
      },
    });

    // If we reach here, there was an error (successful payments redirect)
    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setErrorMessage(error.message || "Payment failed.");
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement
        options={{
          layout: "tabs",
        }}
      />

      {errorMessage && (
        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
          {errorMessage}
        </div>
      )}

      <div className="flex flex-col gap-3">
        <button
          type="submit"
          disabled={isProcessing || !stripe || !elements}
          className="w-full bg-[#f8b878] hover:bg-[#f0a860] text-gray-900 font-bold py-4 rounded-xl transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Processing Payment...
            </span>
          ) : (
            `Pay RM ${amount.toFixed(2)}`
          )}
        </button>

        <button
          type="button"
          onClick={onBack}
          disabled={isProcessing}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-xl transition-colors disabled:opacity-50"
        >
          ← Back to Summary
        </button>
      </div>
    </form>
  );
}

export default function StripeCheckoutForm({
  clientSecret,
  amount,
  onBack,
}: {
  clientSecret: string;
  amount: number;
  onBack: () => void;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Details</h2>

      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance: {
            theme: "stripe",
            variables: {
              colorPrimary: "#f8b878",
              colorBackground: "#ffffff",
              colorText: "#1f2937",
              colorDanger: "#ef4444",
              fontFamily: "system-ui, -apple-system, sans-serif",
              borderRadius: "12px",
              spacingUnit: "4px",
            },
            rules: {
              ".Input": {
                border: "1px solid #e5e7eb",
                boxShadow: "none",
                padding: "12px",
              },
              ".Input:focus": {
                border: "1px solid #f8b878",
                boxShadow: "0 0 0 1px #f8b878",
              },
              ".Label": {
                fontWeight: "500",
                color: "#4b5563",
              },
              ".Tab": {
                border: "1px solid #e5e7eb",
                boxShadow: "none",
              },
              ".Tab--selected": {
                border: "1px solid #f8b878",
                backgroundColor: "#fffbf5",
              },
            },
          },
        }}
      >
        <CheckoutForm amount={amount} onBack={onBack} />
      </Elements>
    </div>
  );
}
