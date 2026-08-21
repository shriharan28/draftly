/**
 * app/(app)/layout.tsx
 *
 * App Layout with Sidebar, Header, Mobile Bottom Nav, and background glows.
 * Zero emojis — Uses technical vector SVG icons.
 */
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ZapIcon } from "@/components/ui/icons";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch current user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url, onboarded")
    .eq("id", user.id)
    .single();

  // If user hasn't completed onboarding, redirect to /onboarding
  if (profile && profile.onboarded === false) {
    redirect("/onboarding");
  }

  // Fetch current credit balance
  const { data: ledger } = await supabase
    .from("credit_ledger")
    .select("balance_after")
    .eq("user_id", user.id)
    .order("id", { ascending: false })
    .limit(1)
    .single();

  const userCredits = ledger?.balance_after ?? 15;
  const userInitial = (profile?.full_name || user.email || "U")
    .charAt(0)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#030305] text-[#F4F4FA] antialiased">
      {/* Background Ambient Orbs */}
      <div className="fixed top-0 left-1/4 h-96 w-96 rounded-full bg-[#8B5CF6]/10 blur-[128px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 h-96 w-96 rounded-full bg-[#10B981]/10 blur-[128px] pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 bg-grid-pattern opacity-60 pointer-events-none" />

      {/* DESKTOP SIDEBAR */}
      <Sidebar userCredits={userCredits} />

      {/* MAIN CONTENT AREA */}
      <div className="relative flex flex-1 flex-col lg:pl-64">
        <Header credits={userCredits} userInitial={userInitial} />

        <main className="flex-1 p-6 pb-24 lg:pb-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION */}
      <BottomNav />
    </div>
  );
}
