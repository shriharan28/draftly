/**
 * app/(app)/settings/actions.ts
 *
 * Server Actions to update Brand Voice and Profile settings in Supabase.
 */
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateBrandVoiceAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Authentication required." };
  }

  const fullName = formData.get("fullName") as string;
  const niche = formData.get("niche") as string;
  const targetAudience = formData.get("targetAudience") as string;
  const tone = formData.get("tone") as string;
  const voiceInstructions = formData.get("voiceInstructions") as string;

  try {
    // 1. Update Profile full_name, niche & tone (only valid columns in profiles table)
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        full_name: fullName || null,
        niche: niche || null,
        tone: tone || "Bold & Punchy",
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (profileError) {
      console.error("Error updating profiles table:", profileError);
      return { error: profileError.message };
    }

    // 2. Format combined instructions (target audience + custom guidelines) for brand_voices.sample_text
    const combinedInstructions = [
      targetAudience ? `Target Audience: ${targetAudience}` : "",
      voiceInstructions ? `Custom Guidelines: ${voiceInstructions}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    // 3. Safely update or insert default brand voice
    const { data: existingVoice } = await supabase
      .from("brand_voices")
      .select("id")
      .eq("user_id", user.id)
      .eq("is_default", true)
      .maybeSingle();

    if (existingVoice) {
      const { error: voiceError } = await supabase
        .from("brand_voices")
        .update({
          tones: tone ? [tone] : ["Bold & Punchy"],
          sample_text: combinedInstructions || null,
        })
        .eq("id", existingVoice.id);

      if (voiceError) {
        console.error("Error updating brand_voices table:", voiceError);
      }
    } else {
      const { error: voiceError } = await supabase.from("brand_voices").insert({
        user_id: user.id,
        name: "Default Voice",
        tones: tone ? [tone] : ["Bold & Punchy"],
        sample_text: combinedInstructions || null,
        is_default: true,
      });

      if (voiceError) {
        console.error("Error inserting brand_voices table:", voiceError);
      }
    }

    revalidatePath("/settings");
    revalidatePath("/dashboard");
    revalidatePath("/generate");
    return { success: true };
  } catch (err: any) {
    console.error("Error updating brand voice settings:", err);
    return { error: err.message || "Failed to update settings." };
  }
}
