import { Header } from "@/components/layout/header";
import { Card } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <>
      <Header title="Settings" subtitle="Profile & brand voice." />
      <Card className="mx-auto mt-16 max-w-md text-center">
        <p className="text-4xl">⚙️</p>
        <p className="mt-4 font-display text-xl font-semibold">
          Arrives in Stage 3
        </p>
        <p className="mt-2 text-sm text-muted">
          Once accounts exist (Supabase Auth), this becomes your profile,
          brand voice, and timezone controls.
        </p>
      </Card>
    </>
  );
}
