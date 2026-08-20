import { Header } from "@/components/layout/header";
import { QuickGenerateCard } from "@/components/features/quick-generate-card";
import { Card } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";

function StatCard({
  label,
  value,
  delta,
  deltaClass = "text-muted",
}: {
  label: string;
  value: string;
  delta: string;
  deltaClass?: string;
}) {
  return (
    <Card>
      <p className="text-xs font-medium uppercase tracking-widest text-muted">
        {label}
      </p>
      <p className="mt-2 font-display text-[32px] font-bold leading-none">
        {value}
      </p>
      <p className={`mt-2.5 text-xs ${deltaClass}`}>{delta}</p>
    </Card>
  );
}

const RECENT = [
  {
    icon: "📸",
    topic: "gym progress — 3 month transformation",
    meta: "IG caption · 2h ago",
    sample:
      "3 months. 0 excuses. The version of me from January wouldn't recognize today's version — and that's the point. 📈 #transformation #consistency",
  },
  {
    icon: "🎬",
    topic: "why everyone should learn to code",
    meta: "Reel hook · yesterday",
    sample:
      "Your job will change in 5 years. Coding won't wait for you to be ready — start ugly, start now. 👇",
  },
  {
    icon: "💼",
    topic: "5 lessons from my first freelance client",
    meta: "LinkedIn · 2d ago",
    sample:
      "My first client paid me less than my monthly phone bill. Best ROI of my life. Here's what it taught me about value vs. price 🧵",
  },
];

export default function DashboardPage() {
  return (
    <>
      <Header title="Welcome back, Shriharan 👋" subtitle="Ready to make the internet talk?" />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Credits left" value="14" delta="resets in 12 days" />
        <StatCard label="This week" value="6 posts" delta="▲ 2 vs last week" deltaClass="text-success" />
        <StatCard label="Top type" value="IG captions" delta="you're on a 4-day streak 🔥" />
      </div>

      <div className="mb-6">
        <QuickGenerateCard />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">Recent</h3>
        <a href="/library" className="text-[13px] text-muted hover:text-foreground">
          View all →
        </a>
      </div>

      <div className="space-y-2.5">
        {RECENT.map((item) => (
          <div
            key={item.topic}
            className="flex items-center gap-4 rounded-2xl border border-border bg-surface px-5 py-4"
          >
            <div className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-xl bg-surface-2">
              {item.icon}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">"{item.topic}"</p>
              <p className="text-xs text-muted">{item.meta}</p>
            </div>
            <CopyButton text={item.sample} />
          </div>
        ))}
      </div>
    </>
  );
}
