import Link from "next/link";
import Stripe from "stripe";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || "sk_test_placeholder",
  {
    apiVersion: "2026-05-27.dahlia",
  },
);

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ payment_intent?: string; redirect_status?: string }>;
}) {
  const { payment_intent, redirect_status } = await searchParams;

  let paymentStatus: "succeeded" | "processing" | "failed" | "unknown" =
    "unknown";
  let amount: number | null = null;

  if (payment_intent) {
    try {
      const pi = await stripe.paymentIntents.retrieve(payment_intent);
      paymentStatus =
        pi.status === "succeeded"
          ? "succeeded"
          : pi.status === "processing"
            ? "processing"
            : "failed";
      amount = pi.amount / 100; // Convert from cents
    } catch {
      paymentStatus = "unknown";
    }
  } else if (redirect_status === "succeeded") {
    paymentStatus = "succeeded";
  }

  return (
    <main className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 min-h-[60vh] flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center w-full">
        {paymentStatus === "succeeded" && (
          <>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h1>
            <p className="text-gray-600 mb-2">
              Thank you for your order. Your payment has been processed
              successfully.
            </p>
            {amount !== null && (
              <p className="text-lg font-semibold text-gray-900 mb-6">
                Amount Paid: RM {amount.toFixed(2)}
              </p>
            )}
          </>
        )}

        {paymentStatus === "processing" && (
          <>
            <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-yellow-600 animate-spin"
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
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Processing
            </h1>
            <p className="text-gray-600 mb-6">
              Your payment is being processed. You&apos;ll receive a
              confirmation once it&apos;s complete.
            </p>
          </>
        )}

        {paymentStatus === "failed" && (
          <>
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Failed
            </h1>
            <p className="text-gray-600 mb-6">
              Unfortunately, your payment could not be processed. Please try
              again.
            </p>
          </>
        )}

        {paymentStatus === "unknown" && (
          <>
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Status Unknown
            </h1>
            <p className="text-gray-600 mb-6">
              We couldn&apos;t determine the status of your payment. Please
              check your email or contact support.
            </p>
          </>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/store"
            className="inline-flex items-center justify-center px-6 py-3 bg-[#f8b878] hover:bg-[#f0a860] text-gray-900 font-semibold rounded-xl transition-colors shadow-sm"
          >
            Continue Shopping
          </Link>
          {paymentStatus === "failed" && (
            <Link
              href="/store/checkout"
              className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
            >
              Try Again
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
