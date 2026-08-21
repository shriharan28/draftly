/**
 * lib/ai/provider.ts
 *
 * Google Gemini AI provider adapter.
 * Supports primary model with automatic fallback (gemini-2.5-flash -> gemini-1.5-flash).
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

  // Models to try in order of preference
  const modelsToTry = [
    process.env.AI_MODEL || "gemini-3.7-flash", "gemini-2.5-flash",
    "gemini-1.5-flash",
    "gemini-2.0-flash",
  ];

  let lastError: any = null;

  for (const modelName of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
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

      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (err: any) {
      console.warn(`Model ${modelName} failed, trying fallback:`, err.message);
      lastError = err;
      // If error is 404 model not found, loop continues to next fallback model
    }
  }

  console.error("All Gemini model attempts failed:", lastError);
  throw new Error(
    lastError?.message || "Failed to generate content with Gemini AI."
  );
}
