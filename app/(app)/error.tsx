"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ZapIcon } from "@/components/ui/icons";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // We can also log this to Sentry here later (Stage 7)
    console.error("App Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col items-center justify-center p-4 text-center animate-in fade-in">
      <div className="mb-6 grid h-16 w-16 place-items-center rounded-full bg-red-500/10 text-red-500 ring-1 ring-red-500/20">
        <ZapIcon className="h-8 w-8" />
      </div>
      <h2 className="mb-2 font-display text-2xl font-bold tracking-tight text-white">
        Something went wrong!
      </h2>
      <p className="mb-8 max-w-[400px] text-sm text-[#9494A8]">
        We've caught an unexpected error. Our team has been notified. 
        You can try reloading the page to see if that fixes it.
      </p>
      <Button onClick={() => reset()} variant="secondary" className="min-w-[160px]">
        Try again
      </Button>
    </div>
  );
}
