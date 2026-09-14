"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Shows the first `limit` items and a "Show N more" toggle for the rest —
 * the whole point is cutting how far a visitor has to scroll through a
 * faculty with a long program list, without adding real navigation (no
 * tabs, no separate view) to get there.
 *
 * Takes pre-rendered items rather than raw program data: the cards
 * themselves (translations, formatting) render server-side in the parent;
 * this component only needs to know how many there are and toggle which
 * slice is visible, so it stays a small, cheap client island instead of
 * pulling the whole grid into the client bundle.
 */
export function ProgramGridReveal({
  items,
  limit,
  moreLabel,
  lessLabel,
}: {
  items: React.ReactNode[];
  limit: number;
  moreLabel: string;
  lessLabel: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? items : items.slice(0, limit);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{visible}</div>

      {items.length > limit ? (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="group mx-auto mt-5 flex min-h-11 items-center gap-1.5 rounded-full border border-[#1E6DEB]/25 bg-white px-5 text-sm font-bold text-[#1E6DEB] shadow-sm transition-colors hover:bg-[#EEF3FF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
        >
          {expanded ? lessLabel : moreLabel}
          <ChevronDown
            className={cn(
              "size-4 transition-transform duration-300",
              expanded && "rotate-180",
            )}
            aria-hidden
          />
        </button>
      ) : null}
    </>
  );
}
