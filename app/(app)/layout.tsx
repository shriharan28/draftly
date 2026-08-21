/**
 * app/(app)/layout.tsx
 *
 * App Layout with Technical AI Gallery Aesthetic.
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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: ledger } = await supabase
    .from("credit_ledger")
    .select("balance_after")
    .order("id", { ascending: false })
    .limit(1)
    .single();

  const credits = ledger?.balance_after ?? 0;

  const emailPrefix = user.email?.split("@")[0] ?? "there";
  const displayName =
    emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1).split(".")[0];

  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="flex min-h-screen bg-[#07070A] text-[#F4F4FA]">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="relative mx-auto w-full max-w-[1200px] flex-1 px-6 py-8 pb-24 md:pb-8">
        {/* Top Header Bar with Credits Pill & Profile Avatar */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#A3F65A] shadow-[0_0_10px_#A3F65A]" />
            <span className="font-mono text-xs text-[#8E8EA3]">AI System Ready</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="tnum flex h-10 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4.5 font-mono text-sm font-medium backdrop-blur-md shadow-lg shadow-black/30">
              <span className="text-[#7C5CFF]">⚡</span>
              <span>{credits} Credits</span>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-tr from-[#7C5CFF] to-[#FF4ECD] text-sm font-bold text-white shadow-[0_0_20px_rgba(124,92,255,0.4)]">
              {initial}
            </div>
          </div>
        </div>

        {children}
      </div>

      {/* Mobile Bottom Nav */}
      <BottomNav />
    </div>
  );
}
