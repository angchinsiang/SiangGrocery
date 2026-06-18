// import { NextRequest, NextResponse } from "next/server";
// import stripe from "@/lib/stripe";

// /**
//  * Scheduled endpoint to cancel a PaymentIntent after its TTL expires.
//  * Called via a delayed fetch from the checkout action.
//  *
//  * This acts as a server-side safety net — if the user closes their browser
//  * or the client-side timer fails, this ensures the PaymentIntent still gets
//  * cancelled, which triggers the webhook to mark the order as CANCELLED.
//  */
// export async function POST(req: NextRequest) {
//   // Verify the request is from our own server
//   const authHeader = req.headers.get("authorization");
//   if (authHeader !== `Bearer ${process.env.CRON_SECRET || "dev-cron-secret"}`) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     const { paymentIntentId } = await req.json();

//     if (!paymentIntentId) {
//       return NextResponse.json(
//         { error: "Missing paymentIntentId" },
//         { status: 400 },
//       );
//     }

//     // Retrieve the current state of the PaymentIntent
//     const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

//     // Only cancel if it's still in a cancellable state
//     // (not already succeeded, cancelled, or requires_capture)
//     if (
//       paymentIntent.status === "requires_payment_method" ||
//       paymentIntent.status === "requires_confirmation" ||
//       paymentIntent.status === "requires_action"
//     ) {
//       await stripe.paymentIntents.cancel(paymentIntentId, {
//         cancellation_reason: "abandoned",
//       });
//       console.log(
//         `PaymentIntent ${paymentIntentId} auto-cancelled after TTL expiry.`,
//       );
//       return NextResponse.json({ cancelled: true });
//     }

//     console.log(
//       `PaymentIntent ${paymentIntentId} already in status "${paymentIntent.status}", skipping cancellation.`,
//     );
//     return NextResponse.json({
//       cancelled: false,
//       reason: `Already in status: ${paymentIntent.status}`,
//     });
//   } catch (error: any) {
//     console.error("Error cancelling expired PaymentIntent:", error);
//     return NextResponse.json(
//       { error: "Failed to cancel payment" },
//       { status: 500 },
//     );
//   }
// }
