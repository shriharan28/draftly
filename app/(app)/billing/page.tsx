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

async function syncStripeCheckoutSuccess(userId: string) {
  try {
    const { data: existingSub } = await adminClient
      .from("subscriptions")
      .select("status, stripe_customer_id")
      .eq("user_id", userId)
      .single();

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
      const { data: existingGrant } = await adminClient
        .from("credit_ledger")
        .select("id")
        .eq("user_id", userId)
        .eq("reason", "plan_grant")
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
          idempotency_key: `sync_grant_${userId}`,
        });
      }
    }
  } catch (err) {
    console.error("Error syncing checkout success:", err);
  }
}

async function syncCreditTopUpSuccess(userId: string, creditsStr?: string) {
  if (!creditsStr) return;
  const creditsToGrant = parseInt(creditsStr, 10);
  if (isNaN(creditsToGrant) || creditsToGrant <= 0) return;

  try {
    const { data: latestLedger } = await adminClient
      .from("credit_ledger")
      .select("balance_after, created_at, delta, reason")
      .eq("user_id", userId)
      .order("id", { ascending: false })
      .limit(1)
      .single();

    // Prevent double-crediting if already processed by webhook in the last 2 minutes
    const lastCreatedAt = latestLedger?.created_at ? new Date(latestLedger.created_at).getTime() : 0;
    const now = Date.now();
    if (latestLedger?.reason === "top_up" && latestLedger?.delta === creditsToGrant && now - lastCreatedAt < 120000) {
      return;
    }

    const currentBalance = latestLedger?.balance_after ?? 0;
    const newBalance = currentBalance + creditsToGrant;

    await adminClient.from("credit_ledger").insert({
      user_id: userId,
      delta: creditsToGrant,
      reason: "top_up",
      balance_after: newBalance,
      idempotency_key: `sync_topup_${userId}_${creditsToGrant}_${Math.floor(Date.now() / 60000)}`,
    });
  } catch (err) {
    console.error("Error syncing credit top-up success:", err);
  }
}

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; canceled?: string; credits?: string }>;
}) {
  const supabase = await createClient();
  const params = await searchParams;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If redirected back from Stripe with success=true, sync subscription or top-up credits
  if (params.success === "true" && user) {
    if (params.credits) {
      await syncCreditTopUpSuccess(user.id, params.credits);
    } else {
      await syncStripeCheckoutSuccess(user.id);
    }
  }

  // 1. Fetch Subscription status
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("user_id", user?.id || "")
    .single();

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
      currentBalance={currentBalance}
      ledgerRows={ledgerRows || []}
      searchParams={params}
    />
  );
}
