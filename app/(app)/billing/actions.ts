/**
 * app/(app)/billing/actions.ts
 *
 * Server Actions for Stripe Checkout & Customer Portal.
 */
"use server";

import { createClient } from "@/lib/supabase/server";
import { stripe, getOrCreateStripeCustomer } from "@/lib/stripe/client";

export async function createCheckoutSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Authentication required." };
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || "http://localhost:3000";
  const priceId = process.env.STRIPE_PRICE_PRO_ID;

  if (!priceId) {
    return {
      error: "Stripe Price ID is not set in .env.local. Add STRIPE_PRICE_PRO_ID=price_xxx from your Stripe Dashboard to enable live checkout.",
    };
  }

  try {
    const customerId = await getOrCreateStripeCustomer(user.id, user.email || "");

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/billing?success=true`,
      cancel_url: `${appUrl}/billing?canceled=true`,
      metadata: {
        user_id: user.id,
      },
    });

    return { url: session.url };
  } catch (err: any) {
    console.error("Stripe checkout error:", err);
    return { error: err.message || "Failed to create Stripe Checkout session." };
  }
}

export async function createPortalSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Authentication required." };
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || "http://localhost:3000";

  try {
    const customerId = await getOrCreateStripeCustomer(user.id, user.email || "");

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${appUrl}/billing`,
    });

    return { url: session.url };
  } catch (err: any) {
    console.error("Stripe portal error:", err);
    return { error: err.message || "Failed to create Stripe Portal session." };
  }
}
