import { Header } from "@/components/layout/header";
import { Card } from "@/components/ui/card";

export default function GeneratePage() {
  return (
    <>
      <Header title="Generate" subtitle="Topic in, three posts out." />
      <Card className="mx-auto mt-16 max-w-md text-center">
        <p className="text-4xl">✨</p>
        <p className="mt-4 font-display text-xl font-semibold">
          The Studio arrives in Stage 4
        </p>
        <p className="mt-2 text-sm text-muted">
          This is where a raw idea becomes 3 platform-ready variants — in your
          voice, in under 15 seconds. The shell you're standing in is what we
          build it into.
        </p>
      </Card>
    </>
  );
}
