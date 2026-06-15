# Stripe Sandbox Payment Gateway — Checkout Integration

## Background

The current checkout flow creates a PaymentIntent on the server ([checkout.ts](file:///d:/SiangGrocery_AI/app/actions/checkout.ts)) and receives a `clientSecret`, but then just shows an `alert()` instead of rendering an actual payment form. This plan replaces that placeholder with a real Stripe **Payment Element** inline payment form.

### Approach: Payment Element (embedded, inline)

Per Stripe's best practices, the recommended approach for a custom checkout page is:

> **Payment Element** — Embedded UI component backed by a PaymentIntent.

This is the right fit here because:
- You already have a `createPaymentIntent` server action that computes the dynamic total
- You want the payment form inline on the same checkout page (not a redirect to Stripe-hosted Checkout)
- Payment Element automatically shows the most relevant payment methods (cards, FPX, e-wallets) based on the MYR currency, with zero hardcoding

---

## Proposed Changes

### 1. Install `@stripe/react-stripe-js`

```bash
npm install @stripe/react-stripe-js
```

You already have `@stripe/stripe-js` and `stripe` (server SDK). We just need the React bindings.

---

### 2. Stripe Payment Form Component

#### [NEW] [StripeCheckoutForm.tsx](file:///d:/SiangGrocery_AI/app/(store)/store/checkout/StripeCheckoutForm.tsx)

A new component that renders inside OrderSummary **after** the PaymentIntent is created:

- Wraps `<Elements>` provider with the `clientSecret`
- Renders Stripe's `<PaymentElement>` (auto-shows cards, FPX, e-wallets for MYR)
- Has a "Pay" submit button that calls `stripe.confirmPayment()`
- On success, redirects to a new `/store/checkout/success` page
- On error, displays inline error message
- Has a "Back" button to return to the order summary

---

### 3. Modify OrderSummary — Two-Phase UI

#### [MODIFY] [OrderSummary.tsx](file:///d:/SiangGrocery_AI/app/(store)/store/checkout/OrderSummary.tsx)

Currently, `handlePay` creates a PaymentIntent then alerts. The change:

1. When user clicks "Pay", create PaymentIntent (existing logic)
2. On success, **switch to payment form view** — render `<StripeCheckoutForm>` with the `clientSecret`
3. Add a "Back to Summary" option to return to the order details view
4. Remove the `loadStripe` import from this file (move to StripeCheckoutForm)

The flow:

```
[Order Summary + Pay button] → click Pay → [Stripe Payment Element form] → confirm → [Success page]
```

---

### 4. Success Page

#### [NEW] [page.tsx](file:///d:/SiangGrocery_AI/app/(store)/store/checkout/success/page.tsx)

A simple success/confirmation page that:
- Shows payment confirmation message
- Extracts `payment_intent` from URL search params to verify status
- Links back to the store or order tracking

---

### 5. Stripe Webhook for Payment Confirmation

#### [NEW] [route.ts](file:///d:/SiangGrocery_AI/app/api/webhooks/stripe/route.ts)

A webhook endpoint to handle `payment_intent.succeeded` events from Stripe:

- Verifies the webhook signature using a `STRIPE_WEBHOOK_SECRET` env var
- On `payment_intent.succeeded`: creates an `Order_Ticket` record and associated `Grocery_Order` entries
- Marks used coupons as `REDEEMED`

> [!IMPORTANT]
> **Webhook secret**: You'll need to set up a Stripe webhook in the Dashboard (or use `stripe listen` CLI locally) and add the `STRIPE_WEBHOOK_SECRET` to your `.env`.

---

### 6. Update Stripe API Version

#### [MODIFY] [checkout.ts](file:///d:/SiangGrocery_AI/app/actions/checkout.ts)

- Update the Stripe API version from `"2024-04-10"` to the latest (`"2025-05-28.basil"` or latest available) and remove the `as any` cast
- Add `automatic_payment_methods: { enabled: true }` to the PaymentIntent creation (ensures dynamic payment methods work with the Payment Element)
- Store coupon IDs in PaymentIntent metadata so the webhook can redeem them

---

## Summary of All Changes

| File | Change | Purpose |
|---|---|---|
| `@stripe/react-stripe-js` | **[INSTALL]** New npm package | React bindings for Payment Element |
| `checkout/StripeCheckoutForm.tsx` | **[NEW]** Payment Element form | Renders Stripe's embedded payment UI |
| `checkout/OrderSummary.tsx` | **[MODIFY]** Two-phase checkout UI | Switches between summary → payment form |
| `checkout/success/page.tsx` | **[NEW]** Payment success page | Post-payment confirmation |
| `api/webhooks/stripe/route.ts` | **[NEW]** Stripe webhook handler | Creates orders on payment success |
| `app/actions/checkout.ts` | **[MODIFY]** API version + metadata | Latest API version, coupon metadata |

---

## Open Questions

> [!IMPORTANT]
> **Webhook for order creation**: Should the `payment_intent.succeeded` webhook automatically create an `Order_Ticket` + `Grocery_Order` records and clear the cart? Or do you want order creation handled differently (e.g., manual admin step)?

> [!IMPORTANT]
> **Stripe CLI for local testing**: For local development, you'll need `stripe listen --forward-to localhost:3000/api/webhooks/stripe` to receive webhook events. Do you have the [Stripe CLI](https://docs.stripe.com/stripe-cli) installed, or would you like guidance setting it up?

> [!NOTE]
> **Payment methods**: With MYR currency and dynamic payment methods, Stripe will automatically offer cards and any other methods you enable in the [Stripe Dashboard payment methods settings](https://dashboard.stripe.com/settings/payment_methods) (e.g., FPX, GrabPay). No code changes needed to add/remove methods.

---

## Verification Plan

### Automated Tests
```bash
npx tsc --noEmit
```
Ensure the project builds cleanly.

### Manual Verification
1. Go to checkout with items in cart → click "Pay" → verify Stripe Payment Element renders inline
2. Use Stripe test card `4242 4242 4242 4242` (any future expiry, any CVC) → confirm payment succeeds
3. Verify redirect to success page with payment confirmation
4. Check Stripe Dashboard (test mode) for the PaymentIntent → confirm amount matches `grandTotal`
5. Toggle coupon checkboxes on/off → click Pay → verify the PaymentIntent amount changes dynamically
