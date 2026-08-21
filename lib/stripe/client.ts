/**
 * lib/stripe/client.ts
 *
 * Stripe Server SDK Adapter.
 * Initializes Stripe Node.js SDK and handles customer lookup/creation.
 */
import Stripe from "stripe";
import { adminClient } from "@/lib/supabase/admin";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_mock_key_for_build", {
  apiVersion: "2025-02-24.acacia" as any,
  appInfo: {
    name: "Draftly AI",
    version: "1.0.0",
  },
});

export async function getOrCreateStripeCustomer(userId: string, email: string) {
  // 1. Check existing subscription record for customer ID
  const { data: existingSub } = await adminClient
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", userId)
    .single();

  if (existingSub?.stripe_customer_id) {
    return existingSub.stripe_customer_id;
  }

  // 2. Create customer in Stripe
  const customer = await stripe.customers.create({
    email,
    metadata: {
      supabase_user_id: userId,
    },
  });

  // 3. Store customer record in public.subscriptions
  await adminClient.from("subscriptions").insert({
    user_id: userId,
    stripe_customer_id: customer.id,
    status: "incomplete",
  });

  return customer.id;
}
