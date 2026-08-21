/**
 * app/(app)/generate/page.tsx
 *
 * Stage 4: Content Studio Generator Page.
 * Renders the StudioGenerator component with optional initial query params.
 */
import { StudioGenerator } from "./studio-generator";

export default async function GeneratePage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string; type?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="py-2">
      <StudioGenerator
        initialTopic={params.topic || ""}
        initialType={params.type || "ig_caption"}
      />
    </div>
  );
}
