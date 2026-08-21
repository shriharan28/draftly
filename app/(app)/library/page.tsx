/**
 * app/(app)/library/page.tsx
 *
 * Server Component for Saved Content Library Page.
 * Fetches user's AI post generations from Supabase.
 */
import { createClient } from "@/lib/supabase/server";
import { LibraryContent } from "./library-content";

export default async function LibraryPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: generations } = await supabase
    .from("generations")
    .select("id, created_at, format, topic, content")
    .eq("user_id", user?.id || "")
    .order("created_at", { ascending: false });

  return <LibraryContent generations={generations || []} />;
}
