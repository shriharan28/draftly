/**
 * app/(app)/library/page.tsx
 *
 * Server Component for Saved Content Library Page.
 * Fetches user's AI post generations and variants from Supabase.
 */
import { createClient } from "@/lib/supabase/server";
import { LibraryContent } from "./library-content";

export default async function LibraryPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: rawGenerations } = await supabase
    .from("generations")
    .select("id, created_at, content_type, topic, variants")
    .eq("user_id", user?.id || "")
    .order("created_at", { ascending: false });

  // Process rows: flatten variants array into individual saved draft cards
  const drafts: {
    id: string;
    created_at: string;
    format: string;
    topic: string;
    content: string;
  }[] = [];

  (rawGenerations || []).forEach((gen) => {
    let variantsList: string[] = [];
    if (Array.isArray(gen.variants)) {
      variantsList = gen.variants.map((v: any) =>
        typeof v === "string" ? v : v?.text || JSON.stringify(v)
      );
    } else if (typeof gen.variants === "string") {
      variantsList = [gen.variants];
    }

    variantsList.forEach((text, idx) => {
      if (text && text.trim().length > 0) {
        drafts.push({
          id: `${gen.id}-${idx}`,
          created_at: gen.created_at,
          format: gen.content_type || "ig_caption",
          topic: gen.topic || "AI Draft",
          content: text,
        });
      }
    });
  });

  return <LibraryContent generations={drafts} />;
}
