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
  if (user) {
    const { data } = await supabase
      .from("generations")
      .select("topic, content_type, variants")
      .eq("user_id", user.id)
      .is("chosen_index", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    latestGen = data;
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
      />
    </div>
  );
}
