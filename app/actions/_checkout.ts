import { redis } from "@/lib/redis";
import stripe from "@/lib/stripe";

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
