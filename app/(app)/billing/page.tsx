/**
 * app/(app)/billing/page.tsx
 *
 * Server Component for Billing & Subscriptions Page.
 * Fetches subscription status and credit_ledger history from Supabase.
 */
import { createClient } from "@/lib/supabase/server";
import { adminClient } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe/client";
import { BillingContent } from "./billing-content";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function syncStripeCheckoutSuccess(userId: string, sessionId?: string) {
  try {
    let existingSub = null;
    
    // First try the fast path: DB lookup
    const { data: dbSub } = await adminClient
      .from("subscriptions")
      .select("status, stripe_customer_id, stripe_subscription_id")
      .eq("user_id", userId)
      .single();

    existingSub = dbSub;

    // If it's not in DB yet, or if it's there but missing the subscription_id (because getOrCreateStripeCustomer created it),
    // and we have a session ID, fetch from Stripe synchronously
    // This completely resolves the race condition between the webhook and the instant redirect
    if ((!existingSub || !existingSub.stripe_subscription_id) && sessionId) {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status === "paid" || session.status === "complete") {
        const stripeSubId = session.subscription as string;
        
        await adminClient.from("subscriptions")
          .update({
            stripe_subscription_id: stripeSubId,
            status: "active",
            price_id: process.env.STRIPE_PRICE_PRO_ID || null,
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_customer_id", session.customer as string);
        
        // Ensure existingSub is populated for the next steps
        existingSub = { 
          status: "active", 
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: stripeSubId 
        };
      }
    }

    if (existingSub) {
      // 1. Mark subscription as active
      if (existingSub.status !== "active") {
        await adminClient
          .from("subscriptions")
          .update({
            status: "active",
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId);
      }

      // 2. Check if a plan_grant has already been granted recently for this user
      // We use the sessionId for idempotency to perfectly match the webhook
      const idempotencyKey = sessionId ? `stripe_grant_${sessionId}` : `sync_grant_${userId}`;
      const { data: existingGrant } = await adminClient
        .from("credit_ledger")
        .select("id")
        .eq("idempotency_key", idempotencyKey)
        .limit(1);

      if (!existingGrant || existingGrant.length === 0) {
        // Fetch latest balance
        const { data: latestLedger } = await adminClient
          .from("credit_ledger")
          .select("balance_after")
          .eq("user_id", userId)
          .order("id", { ascending: false })
          .limit(1)
          .single();

        const currentBalance = latestLedger?.balance_after ?? 0;
        const newBalance = currentBalance + 150;

        // Insert +150 credits into ledger
        await adminClient.from("credit_ledger").insert({
          user_id: userId,
          delta: 150,
          reason: "plan_grant",
          balance_after: newBalance,
          idempotency_key: idempotencyKey,
        });
      }
    }
  } catch (err) {
    console.error("Error syncing checkout success:", err);
  }
}

async function syncCreditTopUpSuccess(userId: string, creditsStr?: string, sessionId?: string) {
  if (!creditsStr) return;
  const creditsToGrant = parseInt(creditsStr, 10);
  if (isNaN(creditsToGrant) || creditsToGrant <= 0) return;

  try {
    // 1. Fetch latest ledger balance
    const { data: latestLedger } = await adminClient
      .from("credit_ledger")
      .select("balance_after")
      .eq("user_id", userId)
      .order("id", { ascending: false })
      .limit(1)
      .single();

    const currentBalance = latestLedger?.balance_after ?? 0;
    const newBalance = currentBalance + creditsToGrant;
    const idempotencyKey = sessionId
      ? `stripe_topup_${sessionId}`
      : `topup_${userId}_${Date.now()}`;

    // 2. Insert atomically into credit_ledger using adminClient
    const { error: insertError } = await adminClient.from("credit_ledger").insert({
      user_id: userId,
      delta: creditsToGrant,
      reason: "plan_grant",
      balance_after: newBalance,
      idempotency_key: idempotencyKey,
    });

    if (insertError) {
      console.error("Top-up sync error:", insertError.message);
    }
  } catch (err) {
    console.error("Error syncing credit top-up success:", err);
  }
}

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; canceled?: string; credits?: string; session_id?: string }>;
}) {
  const supabase = await createClient();
  const params = await searchParams;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If redirected back from Stripe with success=true, sync subscription or top-up credits
  if (params.success === "true" && user) {
    if (params.credits) {
      await syncCreditTopUpSuccess(user.id, params.credits, params.session_id);
    } else {
      await syncStripeCheckoutSuccess(user.id, params.session_id);
    }
  }

  // 1. Fetch Subscription status
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("status, stripe_subscription_id")
    .eq("user_id", user?.id || "")
    .single();

  let cancelAtPeriodEnd = false;
  let daysRemaining = 0;
  let debugError = null;
  
  if (sub && sub.stripe_subscription_id && sub.status === "active") {
    try {
      const stripeSub = await stripe.subscriptions.retrieve(sub.stripe_subscription_id);
      cancelAtPeriodEnd = stripeSub.cancel_at_period_end;
      
      const endTimestamp = stripeSub.cancel_at || (stripeSub as any).current_period_end || (stripeSub.items?.data?.[0]?.current_period_end);

      if (cancelAtPeriodEnd && endTimestamp) {
        const now = Math.floor(Date.now() / 1000);
        daysRemaining = Math.max(0, Math.ceil((endTimestamp - now) / 86400));
        
        console.log("=== DATE MATH DEBUG ===");
        console.log("Stripe endTimestamp:", endTimestamp);
        console.log("Server now:", now);
        console.log("Days Remaining:", daysRemaining);
        console.log("=======================");
      }
      
      console.log("=== BILLING PAGE DEBUG ===");
      console.log("Stripe Subscription ID:", sub.stripe_subscription_id);
      console.log("Stripe cancel_at_period_end:", stripeSub.cancel_at_period_end);
      console.log("==========================");
    } catch (err: any) {
      console.error("Error fetching stripe subscription:", err);
      debugError = err.message;
    }
  } else {
    console.log("=== BILLING PAGE DEBUG ===");
    console.log("Did not fetch from Stripe. sub:", sub);
    console.log("==========================");
  }

  // 2. Fetch credit ledger history
  const { data: ledgerRows } = await supabase
    .from("credit_ledger")
    .select("id, created_at, delta, reason, balance_after")
    .eq("user_id", user?.id || "")
    .order("id", { ascending: false })
    .limit(10);

  const currentBalance = ledgerRows?.[0]?.balance_after ?? 15;

  return (
    <BillingContent
      subscriptionStatus={sub?.status || "inactive"}
      cancelAtPeriodEnd={cancelAtPeriodEnd}
      daysRemaining={daysRemaining}
      currentBalance={currentBalance}
      ledgerRows={ledgerRows || []}
      searchParams={params}
    />
  );
}
