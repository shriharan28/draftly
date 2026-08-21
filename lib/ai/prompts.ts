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

  let formatInstructions = "";

  if (contentType === "x_thread") {
    formatInstructions = `
CRITICAL X THREAD REQUIREMENTS:
- You MUST write a COMPLETE, full multi-tweet sequential thread for EACH variant (5 to 7 tweets per thread).
- NEVER output only the opening hook or 1/10. Write out every single numbered tweet from beginning to end (e.g. 1/5, 2/5, 3/5, 4/5, 5/5).
- Number each tweet clearly at the beginning of the line (e.g. "1/5", "2/5", "3/5", "4/5", "5/5").
- Separate each tweet in the thread with double linebreaks so it is clearly readable as a sequence.`;
  } else if (contentType === "reel_hook") {
    formatInstructions = `
CRITICAL REEL/SHORT HOOK REQUIREMENTS:
- Provide high-converting video script hooks including visual directions [On-Screen Visual] and spoken voiceover lines.`;
  } else if (contentType === "x_post") {
    formatInstructions = `
CRITICAL X SINGLE POST REQUIREMENTS:
- Keep under 280 characters. Sharp, punchy, high-impact single tweet.`;
  } else if (contentType === "linkedin_post") {
    formatInstructions = `
CRITICAL LINKEDIN POST REQUIREMENTS:
- High-performing thought leadership format: killer opening hook line, short spaced paragraphs, key bullet point takeaways, and a compelling question CTA at the end.`;
  } else if (contentType === "ig_caption") {
    formatInstructions = `
CRITICAL INSTAGRAM CAPTION REQUIREMENTS:
- Full caption format: bold opening hook, value-packed body paragraph, clear call-to-action, and relevant hashtags.`;
  } else if (contentType === "yt_desc") {
    formatInstructions = `
CRITICAL YOUTUBE DESCRIPTION REQUIREMENTS:
- Complete description format: engaging summary, key topics/timestamps section, resources/links section placeholder, and search tags.`;
  }

  return `Write 3 distinct viral variants for a ${FORMAT_NAMES[contentType]}.

User Topic: "${topic}"

Tone Persona: ${tonePreset || "Bold & Punchy"}
Custom Guidelines: ${customRules || "Keep it punchy, authentic, and naturally engaging."}
${formatInstructions}

Variant Structure:
- Option 1 (Direct Hook): High energy, instant hook, grabs immediate attention.
- Option 2 (Perspective / Story): Emotional or intriguing angle related to the topic.
- Option 3 (Call-to-Action / Recommendation): Clear takeaway or call-to-action for the audience.

Ensure all 3 variants match the exact subject matter of "${topic}".
Output valid JSON array format now.`;
}
