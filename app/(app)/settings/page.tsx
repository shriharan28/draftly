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

  const userId = user?.id || "";

  // Fetch all 4 settings parameters in parallel for sub-second page transitions
  const [profileRes, brandVoiceRes, subRes, ledgerRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, niche, tone")
      .eq("id", userId)
      .single(),
    supabase
      .from("brand_voices")
      .select("tones, sample_text")
      .eq("user_id", userId)
      .eq("is_default", true)
      .single(),
    supabase
      .from("subscriptions")
      .select("status")
      .eq("user_id", userId)
      .single(),
    supabase
      .from("credit_ledger")
      .select("balance_after")
      .eq("user_id", userId)
      .order("id", { ascending: false })
      .limit(1)
      .single(),
  ]);

  const profile = profileRes.data;
  const brandVoice = brandVoiceRes.data;
  const sub = subRes.data;
  const latestLedger = ledgerRes.data;

  const savedTone = (brandVoice?.tones && brandVoice.tones[0]) || profile?.tone || "Bold & Punchy";
  const savedInstructions = brandVoice?.sample_text || "";
  const userCredits = latestLedger?.balance_after ?? 15;

  return (
    <SettingsContent
      profile={profile || {}}
      brandVoice={{ tone: savedTone, voice_instructions: savedInstructions }}
      subscriptionStatus={sub?.status || "inactive"}
      userCredits={userCredits}
      userEmail={user?.email || ""}
    />
  );
}
