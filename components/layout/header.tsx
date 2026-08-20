export function Header({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="font-display text-2xl font-semibold">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* placeholder until Stage 3 auth wires real credits + profile */}
        <div className="tnum flex h-10 items-center gap-2 rounded-full border border-border bg-surface px-4 font-mono text-sm font-medium">
          <span>⚡</span>
          <span>14</span>
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-semibold">
          S
        </div>
      </div>
    </header>
  );
}
