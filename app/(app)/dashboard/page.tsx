/**
 * app/(app)/dashboard/page.tsx
 *
 * Main Dashboard. Watermelon UI theme.
 * Zero emojis — Uses technical vector SVG icons.
 */
import { createClient } from "@/lib/supabase/server";
import { QuickGenerateCard } from "@/components/features/quick-generate-card";
import { CopyButton } from "@/components/ui/copy-button";
import {
  InstagramIcon,
  ReelIcon,
  LinkedInIcon,
  ZapIcon,
  SparklesIcon,
  LibraryIcon,
} from "@/components/ui/icons";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user?.id || "")
    .single();

  const { data: ledger } = await supabase
    .from("credit_ledger")
    .select("balance_after")
    .eq("user_id", user?.id || "")
    .order("id", { ascending: false })
    .limit(1)
    .single();

  const { count: totalGenerations } = await supabase
    .from("generations")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user?.id || "");

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "Creator";
  const userCredits = ledger?.balance_after ?? 15;

  const mockGenerations = [
    {
      id: "1",
      platform: "Instagram",
      icon: <InstagramIcon className="w-5 h-5" />,
      type: "IG Caption",
      topic: "30-Day Fitness Transformation Journey",
      created: "2 hours ago",
      preview:
        "3 months. 0 excuses. The version of me from January wouldn't recognize today's version — and that's the point. #transformation #consistency",
    },
    {
      id: "2",
      platform: "Reels",
      icon: <ReelIcon className="w-5 h-5" />,
      type: "Reel Hook",
      topic: "Why Most Developers Fail at Freelancing",
      created: "5 hours ago",
      preview:
        "Your job will change in 5 years. Coding won't wait for you to be ready — start ugly, start now.",
    },
    {
      id: "3",
      platform: "LinkedIn",
      icon: <LinkedInIcon className="w-5 h-5" />,
      type: "LinkedIn Post",
      topic: "How I Closed My First $5k Client",
      created: "1 day ago",
      preview:
        "My first client paid me less than my monthly phone bill. Best ROI of my life. Here's what it taught me about value vs. price.",
    },
  ];

  return (
    <div className="space-y-8 py-2">
      {/* WELCOME BANNER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-white">
            Welcome back, {displayName}
          </h1>
          <p className="text-sm text-[#9494A8] mt-1">
            Your brand voice engine is active and ready to generate viral content.
          </p>
        </div>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="glass-panel p-5">
          <div className="flex items-center justify-between text-xs text-[#9494A8] mb-3">
            <span>Remaining Credits</span>
            <ZapIcon className="w-4 h-4 text-[#8B5CF6]" />
          </div>
          <p className="font-display text-3xl font-bold text-white">{userCredits}</p>
          <p className="text-xs text-[#9494A8] mt-1">Refreshes monthly</p>
        </div>

        <div className="glass-panel p-5">
          <div className="flex items-center justify-between text-xs text-[#9494A8] mb-3">
            <span>Total Generations</span>
            <SparklesIcon className="w-4 h-4 text-[#10B981]" />
          </div>
          <p className="font-display text-3xl font-bold text-white">
            {totalGenerations || 3}
          </p>
          <p className="text-xs text-[#9494A8] mt-1">Saved in library</p>
        </div>

        <div className="glass-panel p-5">
          <div className="flex items-center justify-between text-xs text-[#9494A8] mb-3">
            <span>Active Brand Voice</span>
            <LibraryIcon className="w-4 h-4 text-[#8B5CF6]" />
          </div>
          <p className="font-display text-xl font-bold text-white truncate">
            Default Voice
          </p>
          <p className="text-xs text-[#10B981] mt-1 font-medium">100% Calibrated</p>
        </div>
      </div>

      {/* HERO QUICK GENERATOR */}
      <QuickGenerateCard />

      {/* RECENT GENERATIONS SECTION */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-white">
            Recent Generations
          </h2>
        </div>

        <div className="grid gap-4">
          {mockGenerations.map((gen) => (
            <div key={gen.id} className="glass-panel p-5 transition hover:border-[#8B5CF6]/40">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-white/5">
                    {gen.icon}
                  </span>
                  <div>
                    <h3 className="font-display text-sm font-semibold text-white">
                      {gen.topic}
                    </h3>
                    <p className="text-[11px] text-[#9494A8]">
                      {gen.type} · {gen.created}
                    </p>
                  </div>
                </div>
                <CopyButton text={gen.preview} />
              </div>
              <p className="text-xs leading-relaxed text-[#9494A8] line-clamp-2 bg-white/5 p-3 rounded-xl">
                "{gen.preview}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
