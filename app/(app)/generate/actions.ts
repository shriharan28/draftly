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
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Authentication required to generate content." };
  }

  // 1. Get current credit balance from credit_ledger
  const { data: latestLedger } = await supabase
    .from("credit_ledger")
    .select("balance_after")
    .eq("user_id", user.id)
    .order("id", { ascending: false })
    .limit(1)
    .single();

  const currentBalance = latestLedger?.balance_after ?? 0;

  if (currentBalance < 1) {
    return {
      error: "Insufficient credits! Upgrade your plan or wait for your monthly reset.",
    };
  }

  const newBalance = currentBalance - 1;

  // Deduct 1 credit in credit_ledger using adminClient (bypasses RLS for system accounting)
  const { error: ledgerInsertError } = await adminClient
    .from("credit_ledger")
    .insert({
      user_id: user.id,
      delta: -1,
      reason: "generation",
      balance_after: newBalance,
      idempotency_key: `gen_${crypto.randomUUID()}`,
    });

  if (ledgerInsertError) {
    console.error("Error updating credit_ledger:", ledgerInsertError);
    return { error: `Credit transaction failed: ${ledgerInsertError.message}` };
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
    // 3. Call Gemini 3.6 Flash Model AI
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
        model: "gemini-3.6-flash",
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
      status: "saved",
      model: "gemini-3.6-flash",
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
