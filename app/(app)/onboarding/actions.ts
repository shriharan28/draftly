/**
 * app/(app)/onboarding/actions.ts
 *
 * Server action for saving the Onboarding Wizard choices to Supabase.
 *
 * What it updates:
 * 1. public.profiles:
 *    - niche
 *    - platforms (array of strings)
 *    - tone (primary tone preset)
 *    - onboarding_completed = true
 *
 * 2. public.brand_voices:
 *    - inserts default brand voice with tones, custom_rules (sample_text), is_default = true
 *
 * 3. Redirects to /dashboard upon completion.
 */
"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { resend, EMAIL_FROM } from "@/lib/resend/client";
import { getWelcomeEmailHtml } from "@/lib/resend/templates";
import { posthog } from "@/lib/posthog/server";

export type OnboardingData = {
  niche: string;
  targetAudience: string;
  platforms: string[];
  tonePreset: string;
  customRules: string;
};

export async function saveOnboarding(data: OnboardingData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // 1. Update user profile
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      niche: data.niche,
      platforms: data.platforms,
      tone: data.tonePreset,
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (profileError) {
    console.error("Profile onboarding update error:", profileError);
    return { error: profileError.message };
  }

  // 2. Create initial Brand Voice record
  const { error: voiceError } = await supabase.from("brand_voices").insert({
    user_id: user.id,
    name: "Default Voice",
    tones: [data.tonePreset],
    sample_text: data.customRules || null,
    is_default: true,
  });

  if (voiceError) {
    console.error("Brand voice insert error:", voiceError);
    // Non-fatal if voice insert fails, but log it
  }

  // 3. Send welcome email (non-blocking)
  if (user.email) {
    try {
      await resend.emails.send({
        from: `Draftly <${EMAIL_FROM}>`,
        to: user.email,
        subject: "Welcome to Draftly! 🎉",
        html: getWelcomeEmailHtml(),
      });
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
    }
  }

  // 4. Analytics: Track activation
  posthog.capture({
    distinctId: user.id,
    event: 'activation',
    properties: {
      niche: data.niche,
      platforms: data.platforms,
    }
  });

  // Flush posthog to ensure event is sent before redirect
  await posthog.shutdown();

  // 5. Complete & redirect to Dashboard
  redirect("/dashboard");
}
