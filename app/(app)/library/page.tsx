import { Header } from "@/components/layout/header";
import { Card } from "@/components/ui/card";

export default function LibraryPage() {
  return (
    <>
      <Header title="Library" subtitle="Every post you've ever made." />
      <Card className="mx-auto mt-16 max-w-md text-center">
        <p className="text-4xl">📚</p>
        <p className="mt-4 font-display text-xl font-semibold">
          Empty — for now
        </p>
        <p className="mt-2 text-sm text-muted">
          Your generations will live here, searchable and re-copyable. It fills
          up the moment the Studio opens (Stage 4).
        </p>
      </Card>
    </>
  );
}
