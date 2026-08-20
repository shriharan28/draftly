/**
 * app/(app)/layout.tsx
 *
 * This is a SERVER component — no "use client" directive.
 * It runs on the server for every page inside (app)/.
 *
 * WHY fetch here (layout) instead of in each page?
 * Because every page in (app)/ needs the user's name and credit balance.
 * Fetching once in the layout means each page gets it for free — no
 * duplicated data fetching, no prop drilling through multiple levels.
 *
 * The proxy.ts already guarantees only authenticated users reach here,
 * so we can safely assume getUser() returns a real user.
 */
import { BottomNav } from "@/components/layout/bottom-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Get the current authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Extra safety: if somehow no user (proxy should catch this first)
  if (!user) redirect("/login");

  // Fetch real credit balance: the newest row in credit_ledger for this user
  // balance_after on the latest row = current balance (append-only ledger)
  const { data: ledger } = await supabase
    .from("credit_ledger")
    .select("balance_after")
    .order("id", { ascending: false })
    .limit(1)
    .single();

  const credits = ledger?.balance_after ?? 0;

  // Extract display name: use email prefix as fallback
  // e.g. "shriharan.mit11@gmail.com" → "Shriharan"
  const emailPrefix = user.email?.split("@")[0] ?? "there";
  const displayName =
    emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1).split(".")[0];

  // Avatar initial
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="mx-auto w-full max-w-[1200px] px-6 py-8 pb-24 md:pb-8">
        {/* Credits pill + avatar — shown on every app page in the top-right */}
        <div className="mb-0 flex justify-end">
          <div className="flex items-center gap-3">
            <div className="tnum flex h-10 items-center gap-2 rounded-full border border-border bg-surface px-4 font-mono text-sm font-medium">
              <span>⚡</span>
              <span>{credits}</span>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-semibold">
              {initial}
            </div>
          </div>
        </div>

        {/* Pass real user data to children via props on the special _userContext pattern —
            instead, we pass them as a data attribute context that pages can use.
            Pages that need the name use it directly from their own server fetch,
            or we pass it via a shared context. For now the layout handles the header. */}
        {children}
      </div>
      <BottomNav />
    </div>
  );
}
