"use client";

import { useState, useEffect, useCallback } from "react";
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
  expiresAt,
}: {
  amount: number;
  onBack: () => void;
  expiresAt: number;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(() => {
    const remaining = expiresAt - Math.floor(Date.now() / 1000);
    return Math.max(0, remaining);
  });

  const handleExpiry = useCallback(() => {
    setErrorMessage("Payment session expired. Please try again.");
    // Small delay so user can see the message before redirecting back
    setTimeout(() => onBack(), 2000);
  }, [onBack]);

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = expiresAt - Math.floor(Date.now() / 1000);
      if (remaining <= 0) {
        setTimeLeft(0);
        clearInterval(interval);
        handleExpiry();
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, handleExpiry]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

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
      {/* Countdown Timer */}
      <div
        className={`flex items-center justify-center gap-2 p-3 rounded-lg text-sm font-medium ${
          timeLeft <= 60
            ? "bg-red-50 text-red-700 border border-red-200"
            : "bg-amber-50 text-amber-700 border border-amber-200"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>
          Time remaining: {minutes}:{seconds.toString().padStart(2, "0")}
        </span>
      </div>

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
          disabled={isProcessing || !stripe || !elements || timeLeft <= 0}
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
  expiresAt,
}: {
  clientSecret: string;
  amount: number;
  onBack: () => void;
  expiresAt: number;
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
        <CheckoutForm amount={amount} onBack={onBack} expiresAt={expiresAt} />
      </Elements>
    </div>
  );
}
