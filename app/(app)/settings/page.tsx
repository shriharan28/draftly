/**
 * app/(app)/settings/page.tsx
 *
 * Server Component for Settings Page.
 * Fetches user profile, brand voice, subscription status, and credit balance from Supabase.
 */
import { createClient } from "@/lib/supabase/server";
import { SettingsContent } from "./settings-content";

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1. Fetch Profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, niche, target_audience")
    .eq("id", user?.id || "")
    .single();

  // 2. Fetch Default Brand Voice
  const { data: brandVoice } = await supabase
    .from("brand_voices")
    .select("tone, voice_instructions")
    .eq("user_id", user?.id || "")
    .eq("is_default", true)
    .single();

  // 3. Fetch Subscription Status
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("user_id", user?.id || "")
    .single();

  // 4. Fetch Latest Credit Balance
  const { data: latestLedger } = await supabase
    .from("credit_ledger")
    .select("balance_after")
    .eq("user_id", user?.id || "")
    .order("id", { ascending: false })
    .limit(1)
    .single();

  const userCredits = latestLedger?.balance_after ?? 15;

  return (
    <SettingsContent
      profile={profile || {}}
      brandVoice={brandVoice || {}}
      subscriptionStatus={sub?.status || "inactive"}
      userCredits={userCredits}
      userEmail={user?.email || ""}
    />
  );
}
