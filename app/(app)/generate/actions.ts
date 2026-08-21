/**
 * app/(app)/generate/actions.ts
 *
 * Server Action for AI Content Generation & Library Saving.
 * Deducts 1 credit from Supabase ledger, calls Gemini 3.6 Flash Model,
 * saves generation variants to public.generations, and provides a save action.
 */
"use server";

import { createClient } from "@/lib/supabase/server";
import { adminClient } from "@/lib/supabase/admin";
import { generateContentWithGemini } from "@/lib/ai/provider";
import { ContentType } from "@/lib/ai/prompts";
import { revalidatePath } from "next/cache";

export async function generateContentAction(params: {
  topic: string;
  contentType: ContentType;
  model?: string;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Authentication required to generate content." };
  }

  // 1. Fetch user profile, default brand voice, and subscription status in parallel
  const [profileRes, voiceRes, subRes, ledgerRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("niche, tone")
      .eq("id", user.id)
      .single(),
    supabase
      .from("brand_voices")
      .select("id, sample_text, tones")
      .eq("user_id", user.id)
      .eq("is_default", true)
      .single(),
    supabase
      .from("subscriptions")
      .select("status")
      .eq("user_id", user.id)
      .single(),
    supabase
      .from("credit_ledger")
      .select("balance_after")
      .eq("user_id", user.id)
      .order("id", { ascending: false })
      .limit(1)
      .single(),
  ]);

  const profile = profileRes.data;
  const brandVoice = voiceRes.data;
  const sub = subRes.data;
  const latestLedger = ledgerRes.data;

  const isPro = sub?.status === "active";
  const requestedModel = params.model || (isPro ? "gemini-3.6-flash" : "gemini-2.5-flash");
  const selectedModel = requestedModel === "gemini-3.6-flash" && isPro ? "gemini-3.6-flash" : "gemini-2.5-flash";

  // Dynamic credit cost: 3 credits for Gemini 3.6 Flash, 1 credit for Gemini 2.5 Flash
  const creditCost = selectedModel === "gemini-3.6-flash" ? 3 : 1;
  const currentBalance = latestLedger?.balance_after ?? 0;

  if (currentBalance < creditCost) {
    return {
      error: `Insufficient credits! ${selectedModel === "gemini-3.6-flash" ? "Gemini 3.6 Flash" : "Gemini 2.5 Flash"} requires ${creditCost} credits (you have ${currentBalance}). Upgrade or buy credits.`,
    };
  }

  const newBalance = currentBalance - creditCost;

  // Deduct credits in credit_ledger using adminClient (bypasses RLS for system accounting)
  const { error: ledgerInsertError } = await adminClient
    .from("credit_ledger")
    .insert({
      user_id: user.id,
      delta: -creditCost,
      reason: "generation",
      balance_after: newBalance,
      idempotency_key: `gen_${crypto.randomUUID()}`,
    });

  if (ledgerInsertError) {
    console.error("Error updating credit_ledger:", ledgerInsertError);
    return { error: `Credit transaction failed: ${ledgerInsertError.message}` };
  }

  try {
    // 2. Call Gemini AI Model matching user subscription tier & selection
    const variants = await generateContentWithGemini({
      topic: params.topic,
      contentType: params.contentType,
      niche: profile?.niche || undefined,
      tonePreset: profile?.tone || brandVoice?.tones?.[0] || undefined,
      customRules: brandVoice?.sample_text || undefined,
      model: selectedModel,
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
        model: selectedModel,
      })
      .select()
      .single();

    if (saveError) {
      console.error("Error saving generation:", saveError);
    }

    revalidatePath("/dashboard");
    revalidatePath("/generate");
    revalidatePath("/library");

    return {
      success: true,
      variants,
      generationId: generation?.id,
    };
  } catch (err: any) {
    // Refund 1 credit using adminClient if AI call failed
    await adminClient.from("credit_ledger").insert({
      user_id: user.id,
      delta: 1,
      reason: "refund",
      balance_after: currentBalance,
      idempotency_key: `refund_${crypto.randomUUID()}`,
    });

    return {
      error: err.message || "AI generation failed. Your credit has been refunded.",
    };
  }
}

export async function saveDraftToLibraryAction(params: {
  topic: string;
  contentType: string;
  content: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Authentication required." };

  const { data, error } = await supabase
    .from("generations")
    .insert({
      user_id: user.id,
      content_type: params.contentType,
      topic: params.topic,
      variants: [params.content],
      status: "complete",
      chosen_index: 0,
      model: "gemini-3.6-flash",
      tone: "bold",
    })
    .select()
    .single();

  if (error) {
    console.error("Error saving draft to library:", error);
    return { error: error.message };
  }

  revalidatePath("/library");
  return { success: true, id: data.id };
}
