import { Building2, GraduationCap } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export type SearchMode = "faculties" | "universities";

/**
 * Faculties (blue) vs Universities (red): two entirely different queries
 * behind the same page (searchFaculties vs getPublishedUniversities), so
 * this is a real navigation between two URL states, not client-side view
 * state. Still animates the active pill via a plain CSS transform
 * transition, no client JS needed for it, App Router's client navigation
 * keeps this element in place across the swap so the transition still
 * plays.
 *
 * Grid, not flex: the two labels are different lengths ("Universities" is
 * longer than "Faculties", same in Arabic), and `flex-1` in a shrink-to-fit
 * container sizes each tab to its own content rather than forcing them
 * equal, which desynced the actual tab boundary from the indicator's
 * hardcoded 50% and made it visibly overlap the neighboring tab. Grid's
 * `1fr` tracks are forced equal regardless of content, so the indicator's
 * 50% math is now always correct.
 */
export function SearchModeSwitch({
  mode,
  facultiesLabel,
  universitiesLabel,
}: {
  mode: SearchMode;
  facultiesLabel: string;
  universitiesLabel: string;
}) {
  const isUniversities = mode === "universities";

  return (
    <nav
      aria-label={`${facultiesLabel} / ${universitiesLabel}`}
      className="relative grid w-full max-w-sm grid-cols-2 overflow-hidden rounded-full bg-white p-1.5 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.25)] ring-1 ring-slate-200/80 sm:w-auto"
    >
      {/* The active pill: gradient fill plus a glow in its own color, sliding
          with a touch of overshoot rather than a flat linear ease, so it
          reads as a physical toggle settling into place. */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-y-1.5 start-1.5 w-[calc(50%-6px)] rounded-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          isUniversities
            ? "translate-x-full bg-gradient-to-br from-[#F82C1F] to-[#ff6b5b] shadow-[0_6px_16px_-4px_rgba(248,44,31,0.55)] rtl:-translate-x-full"
            : "translate-x-0 bg-gradient-to-br from-[#1E6DEB] to-[#3B86F7] shadow-[0_6px_16px_-4px_rgba(30,109,235,0.55)]",
        )}
      />

      <Link
        href="/app/search"
        aria-current={!isUniversities ? "page" : undefined}
        className={cn(
          "relative z-10 flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-bold transition-colors duration-300 sm:px-6",
          isUniversities
            ? "text-[#5a6072] hover:text-[#1E6DEB]"
            : "text-white",
        )}
      >
        <GraduationCap className="size-4 shrink-0" aria-hidden />
        {facultiesLabel}
      </Link>
      <Link
        href="/app/search?mode=universities"
        aria-current={isUniversities ? "page" : undefined}
        className={cn(
          "relative z-10 flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-bold transition-colors duration-300 sm:px-6",
          isUniversities
            ? "text-white"
            : "text-[#5a6072] hover:text-[#F82C1F]",
        )}
      >
        <Building2 className="size-4 shrink-0" aria-hidden />
        {universitiesLabel}
      </Link>
    </nav>
  );
}
