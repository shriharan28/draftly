import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 px-6">
      <div className="text-center">
        <h1 className="font-display text-5xl font-bold tracking-tight md:text-6xl">
          Draft<span className="text-gradient">ly</span>
        </h1>
        <p className="mt-4 max-w-md text-muted">
          Skeleton alive · design system wired · deploy pipeline next.
        </p>
      </div>

      <Card className="w-full max-w-md text-center">
        <p className="font-mono text-xs tracking-widest text-muted">
          STAGE 2 CHECKPOINT
        </p>
        <p className="mt-2 font-display text-2xl font-semibold">
          Design system online
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button size="sm">Primary</Button>
          <Button size="sm" variant="secondary">
            Secondary
          </Button>
          <Button size="sm" variant="ghost">
            Ghost
          </Button>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <Chip selected>bold</Chip>
          <Chip>chill</Chip>
          <Chip>funny</Chip>
        </div>

        <div className="mt-6">
          <Input name="demo" placeholder="Input fields look like this" />
        </div>
      </Card>

      <p className="font-mono text-xs text-muted">
        next: mockup gate 1 → app shell → git push → live url
      </p>
    </main>
  );
}
