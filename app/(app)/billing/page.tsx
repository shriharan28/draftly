/**
 * app/(app)/billing/page.tsx
 *
 * Server Component for Billing & Subscriptions Page.
 * Fetches subscription status and credit_ledger history from Supabase.
 */
import { createClient } from "@/lib/supabase/server";
import { BillingContent } from "./billing-content";

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; canceled?: string }>;
}) {
  const supabase = await createClient();
  const params = await searchParams;

  const {
    data: { user },
  } = await supabase.auth.getUser();

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
