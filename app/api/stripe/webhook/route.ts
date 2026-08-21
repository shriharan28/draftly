/**
 * app/api/stripe/webhook/route.ts
 *
 * Stripe Webhook Handler Route.
 * Listens for checkout.session.completed, customer.subscription.updated, customer.subscription.deleted.
 * Grants +300 credits into public.credit_ledger using adminClient.
 */
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/client";
import { adminClient } from "@/lib/supabase/admin";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (webhookSecret && signature) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      // In development / testing without webhook secret
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        const customerId = session.customer as string;

        if (userId) {
          // 1. Update subscription status
          await adminClient.from("subscriptions").upsert({
            user_id: userId,
            stripe_customer_id: customerId,
            stripe_subscription_id: session.subscription as string,
            status: "active",
            price_id: process.env.STRIPE_PRICE_PRO_ID || null,
            updated_at: new Date().toISOString(),
          });

          // 2. Fetch current user balance
          const { data: latestLedger } = await adminClient
            .from("credit_ledger")
            .select("balance_after")
            .eq("user_id", userId)
            .order("id", { ascending: false })
            .limit(1)
            .single();

          const currentBalance = latestLedger?.balance_after ?? 0;
          const newBalance = currentBalance + 300;

          // 3. Grant +300 credits atomically in ledger
          await adminClient.from("credit_ledger").insert({
            user_id: userId,
            delta: 300,
            reason: "plan_grant",
            balance_after: newBalance,
            idempotency_key: `stripe_grant_${session.id}`,
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;

        const periodEnd = (sub as any).current_period_end;
        await adminClient
          .from("subscriptions")
          .update({
            status: sub.status as any,
            current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_customer_id", customerId);
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;

        await adminClient
          .from("subscriptions")
          .update({
            status: "canceled",
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_customer_id", customerId);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Error processing Stripe webhook:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
