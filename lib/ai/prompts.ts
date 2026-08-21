/**
 * lib/ai/prompts.ts
 *
 * Intelligent System Prompts and Template Formatters for Gemini AI.
 * Adapts naturally to the topic (movies, tech, sports, business, fitness)
 * while preserving the user's brand voice persona.
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
  return `You are Draftly AI, an elite viral content creator and copywriter.

TOPIC INTELLIGENCE RULES:
1. FIRST, analyze the TOPIC's natural genre (e.g., Movie/Cinema release, Tech/SaaS product, Fitness/Health, Business, Entertainment/Trending).
2. Adapt your tone and terminology naturally to match the topic's subject matter:
   - If the topic is a MOVIE, SHOW, or ENTERTAINMENT (e.g., "Jana Nayagan on Zee5"): Write exciting, engaging entertainment posts for fans/viewers. Focus on hype, drama, performance, and streaming CTA. DO NOT force business/tech jargon like "attention economics", "SaaS", or "growth framework" unless explicitly asked!
   - If the topic is TECH or BUSINESS: Use strategic, sharp, entrepreneurial insights.
   - If the topic is FITNESS or LIFESTYLE: Use high-energy, motivational language.
3. Apply the user's style persona (e.g., Bold & Punchy, Casual, Educational) to the natural topic.

CRITICAL FORMAT REQUIREMENT:
Output ONLY a raw, valid JSON array containing exactly 3 distinct variant objects.
[
  {
    "angle": "Direct Hype Hook",
    "text": "The content text here..."
  },
  {
    "angle": "Story & Highlights",
    "text": "The content text here..."
  },
  {
    "angle": "Call-To-Action / Watch Guide",
    "text": "The content text here..."
  }
]`;
}

export function buildUserPrompt(params: GeneratePromptParams): string {
  const { topic, contentType, tonePreset, customRules } = params;

  return `Write 3 distinct viral variants for a ${FORMAT_NAMES[contentType]}.

User Topic: "${topic}"

Tone Persona: ${tonePreset || "Bold & Punchy"}
Custom Guidelines: ${customRules || "Keep it punchy, authentic, and naturally engaging."}

Variant Structure:
- Option 1 (Direct Hook): High energy, instant hook, grabs immediate attention.
- Option 2 (Perspective / Story): Emotional or intriguing angle related to the topic.
- Option 3 (Call-to-Action / Recommendation): Clear takeaway or call-to-action for the audience.

Ensure all 3 variants match the exact subject matter of "${topic}".
Output valid JSON array format now.`;
}
