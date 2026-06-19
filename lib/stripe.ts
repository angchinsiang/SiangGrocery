import Stripe from "stripe";
import { redis } from "@/lib/redis";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || "sk_test_placeholder",
  {
    apiVersion: "2026-05-27.dahlia",
  },
);

export default stripe;

export async function cancelCheckout(paymentId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);

    if (
      paymentIntent.status === "requires_payment_method" ||
      paymentIntent.status === "requires_confirmation" ||
      paymentIntent.status === "requires_action"
    ) {
      await Promise.all([
        stripe.paymentIntents.cancel(paymentId, {
          cancellation_reason: "abandoned",
        }),
        redis.del(`checkout:${paymentId}`),
      ]);
      console.log(`PaymentIntent ${paymentId} cancelled.`);
    }
    return { success: true };
  } catch (error: any) {
    console.error("Payment intent error:", error);
    return { error: "Failed to cancel payment setup." };
  }
}
