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

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || "https://draftly-pink.vercel.app";
  const priceId = process.env.STRIPE_PRICE_PRO_ID;

  if (!priceId) {
    return {
      error: "Stripe Price ID is not set. Please add STRIPE_PRICE_PRO_ID in your Vercel Environment Variables.",
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

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || "https://draftly-pink.vercel.app";

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

export async function createCreditCheckoutSession(credits: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Authentication required." };
  }

  // Validate range (min 10, max 100)
  const validCredits = Math.min(Math.max(Math.round(credits), 10), 100);
  const unitPriceInCents = Math.round(validCredits * 0.045 * 100); // e.g. 100 credits = $4.50 = 450 cents

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || "https://draftly-pink.vercel.app";

  try {
    const customerId = await getOrCreateStripeCustomer(user.id, user.email || "");

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Draftly AI Credits Top-Up (${validCredits} Credits)`,
              description: `One-time credit pack top-up of ${validCredits} AI generation credits for Draftly Pro members.`,
            },
            unit_amount: unitPriceInCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/billing?success=true&credits=${validCredits}`,
      cancel_url: `${appUrl}/billing?canceled=true`,
      metadata: {
        user_id: user.id,
        credits: String(validCredits),
        type: "credit_topup",
      },
    });

    return { url: session.url };
  } catch (err: any) {
    console.error("Stripe credit checkout error:", err);
    return { error: err.message || "Failed to create credit checkout session." };
  }
}
