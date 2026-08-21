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
    // 1. Update Profile full_name, niche, tone & target audience
    await supabase
      .from("profiles")
      .update({
        full_name: fullName || null,
        niche: niche || null,
        tone: tone || "Bold & Punchy",
        target_audience: targetAudience || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    // 2. Upsert Brand Voice with proper schema (tones text[], sample_text text)
    await supabase.from("brand_voices").upsert(
      {
        user_id: user.id,
        name: "Default Voice",
        tones: tone ? [tone] : ["Bold & Punchy"],
        sample_text: voiceInstructions || null,
        is_default: true,
      },
      { onConflict: "user_id, name" }
    );

    revalidatePath("/settings");
    revalidatePath("/dashboard");
    revalidatePath("/generate");
    return { success: true };
  } catch (err: any) {
    console.error("Error updating brand voice settings:", err);
    return { error: err.message || "Failed to update settings." };
  }
}
