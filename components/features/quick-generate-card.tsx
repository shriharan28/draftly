"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { useToast } from "@/components/ui/toast";

const TYPES = ["IG caption", "Reel hook", "X thread", "LinkedIn", "YouTube"];

export function QuickGenerateCard() {
  const [type, setType] = useState("IG caption");
  const [topic, setTopic] = useState("");
  const { toast } = useToast();

  return (
    <Card className="relative overflow-hidden p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary-glow blur-3xl"
      />

      <h2 className="font-display text-[22px] font-semibold">Quick generate</h2>
      <p className="mt-1.5 text-sm text-muted">
        One card. Zero friction. The whole product.
      </p>

      <input
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        maxLength={500}
        placeholder="What do you want to post about?"
        className="mt-5 h-[52px] w-full rounded-[14px] border border-border bg-surface-2 px-[18px] text-[15px] text-foreground placeholder:text-muted outline-none transition-colors focus:border-primary focus:ring-[3px] focus:ring-primary/25"
      />

      <div className="mt-4 flex flex-wrap gap-2">
        {TYPES.map((t) => (
          <Chip key={t} selected={t === type} onClick={() => setType(t)}>
            {t}
          </Chip>
        ))}
      </div>

      <div className="mt-5">
        <Button
          size="lg"
          onClick={() => toast("The studio goes live in Stage 4 ⚡", "success")}
        >
          ⚡ Generate
          <span className="font-mono text-xs opacity-75">· 1 credit</span>
        </Button>
      </div>
    </Card>
  );
}
