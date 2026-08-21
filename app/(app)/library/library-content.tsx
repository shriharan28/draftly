/**
 * app/(app)/library/library-content.tsx
 *
 * Interactive Content Library Client Component.
 * Search, platform format filters, instant copy, and draft management.
 */
"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  LibraryIcon,
  SparklesIcon,
  InstagramIcon,
  ReelIcon,
  XIcon,
  LinkedInIcon,
  YouTubeIcon,
} from "@/components/ui/icons";

interface GenerationRow {
  id: string;
  created_at: string;
  format: string;
  topic: string;
  content: string;
}

const FORMAT_FILTERS = [
  { id: "all", label: "All Formats" },
  { id: "ig_caption", label: "IG Caption" },
  { id: "reel_hook", label: "Reel Hook" },
  { id: "x_thread", label: "X Thread" },
  { id: "x_post", label: "X Post" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "yt_desc", label: "YouTube" },
];

export function LibraryContent({ generations }: { generations: GenerationRow[] }) {
  const [selectedFormat, setSelectedFormat] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = generations.filter((gen) => {
    const matchesFormat = selectedFormat === "all" || gen.format === selectedFormat;
    const matchesSearch =
      searchQuery.trim() === "" ||
      gen.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gen.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFormat && matchesSearch;
  });

  function handleCopy(id: string, text: string) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function getPlatformIcon(format: string) {
    if (format.startsWith("ig") || format === "ig_caption")
      return <InstagramIcon className="w-4 h-4" />;
    if (format === "reel_hook") return <ReelIcon className="w-4 h-4" />;
    if (format.startsWith("x_")) return <XIcon className="w-3.5 h-3.5" />;
    if (format === "linkedin") return <LinkedInIcon className="w-4 h-4" />;
    if (format === "yt_desc") return <YouTubeIcon className="w-4 h-4" />;
    return <SparklesIcon className="w-4 h-4 text-[#8B5CF6]" />;
  }

  return (
    <div className="space-y-6 py-2">
      {/* TOP HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white flex items-center gap-3">
            <LibraryIcon className="w-6 h-6 text-[#8B5CF6]" />
            <span>Saved Content Library</span>
          </h1>
          <p className="text-xs text-[#9494A8] mt-1">
            Access and manage all your generated AI posts ({generations.length} total drafts).
          </p>
        </div>

        <Link href="/generate">
          <Button variant="primary" className="bg-gradient-to-r from-[#8B5CF6] to-[#10B981] text-xs h-10">
            <SparklesIcon className="w-4 h-4" />
            <span>Generate New Draft</span>
          </Button>
        </Link>
      </div>

      {/* FILTER BAR & SEARCH */}
      <div className="glass-panel p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* PLATFORM CHIPS */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {FORMAT_FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFormat(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedFormat === f.id
                  ? "bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/30"
                  : "bg-white/5 text-[#9494A8] hover:bg-white/10 hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* SEARCH INPUT */}
        <div className="w-full md:w-64">
          <input
            type="text"
            placeholder="Search saved drafts…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 rounded-xl border border-white/10 bg-white/5 px-3 text-xs text-white placeholder-[#9494A8] focus:border-[#8B5CF6] focus:outline-none"
          />
        </div>
      </div>

      {/* DRAFTS GRID */}
      {filtered.length === 0 ? (
        <div className="glass-panel p-12 text-center max-w-md mx-auto">
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-white/5 text-[#9494A8]">
            <LibraryIcon className="w-6 h-6" />
          </div>
          <h3 className="font-display text-lg font-bold text-white mb-1">
            No Saved Drafts Found
          </h3>
          <p className="text-xs text-[#9494A8] mb-6">
            {generations.length === 0
              ? "You haven't generated any AI posts yet. Start by generating your first post!"
              : "No drafts match your current filter or search criteria."}
          </p>
          <Link href="/generate">
            <Button variant="primary" className="bg-gradient-to-r from-[#8B5CF6] to-[#10B981]">
              <SparklesIcon className="w-4 h-4" />
              <span>Generate Content</span>
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((gen) => (
            <div
              key={gen.id}
              className="glass-panel p-5 flex flex-col justify-between hover:border-[#8B5CF6]/40 transition-all duration-200"
            >
              <div>
                {/* CARD HEADER */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="grid h-7 w-7 place-items-center rounded-lg bg-white/5">
                      {getPlatformIcon(gen.format)}
                    </div>
                    <span className="font-mono text-[11px] font-semibold text-[#8B5CF6] uppercase tracking-wider">
                      {gen.format.replace("_", " ")}
                    </span>
                  </div>

                  <span className="font-mono text-[11px] text-[#9494A8]" suppressHydrationWarning>
                    {new Date(gen.created_at).toISOString().split("T")[0]}
                  </span>
                </div>

                {/* TOPIC HEADER */}
                {gen.topic && (
                  <div className="text-xs font-semibold text-white mb-2 line-clamp-1">
                    "{gen.topic}"
                  </div>
                )}

                {/* CONTENT BODY */}
                <div className="rounded-xl border border-white/5 bg-white/5 p-3 text-xs text-[#F4F4FA] leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto mb-4 font-sans">
                  {gen.content}
                </div>
              </div>

              {/* CARD FOOTER */}
              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <span className="font-mono text-[10px] text-[#9494A8]">
                  {gen.content.split(" ").length} words
                </span>

                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => handleCopy(gen.id, gen.content)}
                  className="h-8 text-xs px-3"
                >
                  {copiedId === gen.id ? "✓ Copied!" : "Copy Text"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
