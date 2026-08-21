/**
 * app/(app)/generate/page.tsx
 *
 * Stage 4: Content Studio Generator Page.
 * Renders the StudioGenerator component with optional initial query params.
 */
import { createClient } from "@/lib/supabase/server";
import { StudioGenerator } from "./studio-generator";

export default async function GeneratePage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string; type?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let latestGen = null;
  let activeTone = "Bold & Punchy";
  let activeNicheLabel = "General";
  let isPro = false;

  if (user) {
    const [genRes, profileRes, voiceRes, subRes] = await Promise.all([
      supabase
        .from("generations")
        .select("topic, content_type, variants")
        .eq("user_id", user.id)
        .is("chosen_index", null)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("profiles")
        .select("tone, niche")
        .eq("id", user.id)
        .single(),
      supabase
        .from("brand_voices")
        .select("tones")
        .eq("user_id", user.id)
        .eq("is_default", true)
        .single(),
      supabase
        .from("subscriptions")
        .select("status")
        .eq("user_id", user.id)
        .single(),
    ]);

    latestGen = genRes.data;
    const profile = profileRes.data;
    const voice = voiceRes.data;
    const sub = subRes.data;

    isPro = sub?.status === "active";
    activeTone = (voice?.tones && voice.tones[0]) || profile?.tone || "Bold & Punchy";

    const NICHE_LABELS: Record<string, string> = {
      tech: "Tech & Software",
      saas: "B2B SaaS & Startup",
      business: "Business & E-Commerce",
      marketing: "Digital Marketing",
      fitness: "Health & Fitness",
      design: "Design & Creative",
      creator: "Content Creator",
      lifestyle: "Lifestyle & Brand",
    };

    const rawNiche = (profile?.niche || "").toLowerCase();
    activeNicheLabel = NICHE_LABELS[rawNiche] || profile?.niche || "General";
  }

  const initialVariants = Array.isArray(latestGen?.variants)
    ? latestGen.variants.map((v: any, i: number) =>
        typeof v === "string"
          ? { angle: `Option ${i + 1}`, text: v }
          : { angle: v?.angle || `Option ${i + 1}`, text: v?.text || String(v) }
      )
    : null;

  return (
    <div className="py-2">
      <StudioGenerator
        initialTopic={params.topic || latestGen?.topic || ""}
        initialType={params.type || latestGen?.content_type || "ig_caption"}
        initialVariants={initialVariants}
        activeTone={activeTone}
        activeNicheLabel={activeNicheLabel}
        isPro={isPro}
      />
    </div>
  );
}
