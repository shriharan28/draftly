/**
 * lib/ai/provider.ts
 *
 * Google Gemini 2.0 Flash AI provider adapter.
 * Uses GOOGLE_AI_API_KEY or GEMINI_API_KEY from environment variables.
 */
import { GoogleGenAI } from "@google/genai";
import { buildSystemPrompt, buildUserPrompt, GeneratePromptParams } from "./prompts";

export type VariantOutput = {
  angle: string;
  text: string;
};

export async function generateContentWithGemini(
  params: GeneratePromptParams
): Promise<VariantOutput[]> {
  const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GOOGLE_AI_API_KEY is not configured in environment variables."
    );
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = buildSystemPrompt();
  const prompt = buildUserPrompt(params);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.8,
      },
    });

    const responseText = response.text || "";

    // Clean any markdown backticks if present
    const cleanedText = responseText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const parsed = JSON.parse(cleanedText) as VariantOutput[];

    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error("Gemini returned invalid response format.");
    }

    return parsed;
  } catch (err: any) {
    console.error("Gemini generation error:", err);
    throw new Error(err.message || "Failed to generate content with Gemini AI.");
  }
}
