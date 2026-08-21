/**
 * app/(app)/generate/actions.ts
 *
 * Server Action for AI Content Generation.
 * Deducts 1 credit from Supabase ledger, calls Gemini 2.0 Flash,
 * and saves generation variants to public.generations.
 */
"use server";

import { createClient } from "@/lib/supabase/server";
import { generateContentWithGemini } from "@/lib/ai/provider";
import { ContentType } from "@/lib/ai/prompts";
import { revalidatePath } from "next/cache";

export async function generateContentAction(params: {
  topic: string;
  contentType: ContentType;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Authentication required to generate content." };
  }

  // 1. Spend 1 credit via RPC
  const { data: creditSpent, error: creditError } = await supabase.rpc(
    "spend_credits",
    {
      p_user_id: user.id,
      p_amount: 1,
      p_reason: `generation:${params.contentType}`,
    }
  );

  if (creditError || !creditSpent) {
    return {
      error: "Insufficient credits! Upgrade your plan or wait for your monthly reset.",
    };
  }

  // 2. Fetch user's profile and default brand voice for context
  const { data: profile } = await supabase
    .from("profiles")
    .select("niche, target_audience, tone")
    .eq("id", user.id)
    .single();

  const { data: brandVoice } = await supabase
    .from("brand_voices")
    .select("id, sample_text, tones")
    .eq("user_id", user.id)
    .eq("is_default", true)
    .single();

  try {
    // 3. Call Gemini 2.0 Flash AI
    const variants = await generateContentWithGemini({
      topic: params.topic,
      contentType: params.contentType,
      niche: profile?.niche || undefined,
      targetAudience: profile?.target_audience || undefined,
      tonePreset: profile?.tone || brandVoice?.tones?.[0] || undefined,
      customRules: brandVoice?.sample_text || undefined,
    });

    // 4. Save generation to Supabase
    const { data: generation, error: saveError } = await supabase
      .from("generations")
      .insert({
        user_id: user.id,
        brand_voice_id: brandVoice?.id || null,
        content_type: params.contentType,
        topic: params.topic,
        tone: profile?.tone || "bold",
        variants: variants,
        status: "complete",
        model: "gemini-2.0-flash",
      })
      .select()
      .single();

    if (saveError) {
      console.error("Error saving generation:", saveError);
    }

    revalidatePath("/dashboard");
    revalidatePath("/generate");

    return {
      success: true,
      variants,
      generationId: generation?.id,
    };
  } catch (err: any) {
    // Refund 1 credit if AI call failed
    await supabase.rpc("spend_credits", {
      p_user_id: user.id,
      p_amount: -1,
      p_reason: "refund:generation_failed",
    });

    return {
      error: err.message || "AI generation failed. Your credit has been refunded.",
    };
  }
}
