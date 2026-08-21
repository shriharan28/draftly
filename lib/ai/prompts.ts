/**
 * lib/ai/prompts.ts
 *
 * System prompts and template formatters for Gemini 2.0 Flash.
 * Ensures the AI returns strictly valid JSON containing 3 distinct variants.
 */

export type ContentType =
  | "ig_caption"
  | "reel_hook"
  | "x_thread"
  | "x_post"
  | "linkedin_post"
  | "yt_desc";

export type GeneratePromptParams = {
  topic: string;
  contentType: ContentType;
  niche?: string;
  targetAudience?: string;
  tonePreset?: string;
  customRules?: string;
};

export const FORMAT_NAMES: Record<ContentType, string> = {
  ig_caption: "Instagram Caption",
  reel_hook: "Reel / TikTok Short Hook",
  x_thread: "X (Twitter) Thread",
  x_post: "X (Twitter) Single Post",
  linkedin_post: "LinkedIn Thought Leadership Post",
  yt_desc: "YouTube Video Description",
};

export function buildSystemPrompt(): string {
  return `You are Draftly AI, an elite viral content strategist and copywriter.
Your goal is to write high-converting, highly engaging social media content.

CRITICAL INSTRUCTIONS:
1. Always output ONLY a raw, valid JSON array containing exactly 3 distinct content objects.
2. Do not include markdown code fence formatting like \`\`\`json or \`\`\` in your final output if possible, but if included, ensure the JSON inside is valid.
3. Return JSON format:
[
  {
    "angle": "Direct & Punchy",
    "text": "The content text here..."
  },
  {
    "angle": "Contrarian Angle",
    "text": "The content text here..."
  },
  {
    "angle": "Actionable Framework",
    "text": "The content text here..."
  }
]`;
}

export function buildUserPrompt(params: GeneratePromptParams): string {
  const { topic, contentType, niche, targetAudience, tonePreset, customRules } = params;

  return `Task: Write 3 viral variants for a ${FORMAT_NAMES[contentType]}.

User Topic: "${topic}"

Target Context:
- Domain / Niche: ${niche || "General Content Creation & Tech"}
- Target Audience: ${targetAudience || "Ambitious creators, builders, and entrepreneurs"}
- Desired Tone Persona: ${tonePreset || "Bold, punchy, zero fluff"}
- Custom Voice Rules: ${customRules || "Keep emojis tasteful. Focus on actionable insights."}

Format Guidelines for ${FORMAT_NAMES[contentType]}:
- Variant 1 (Direct Hook): Grab attention in the first line. High urgency.
- Variant 2 (Contrarian / Story): Challenge common assumptions. Provoke curiosity.
- Variant 3 (Actionable Playbook): Bullet points, structured advice, clear takeaway.

Generate the 3 variants in valid JSON array format now.`;
}
