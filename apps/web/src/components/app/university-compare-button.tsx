"use client";

import { Check, GitCompareArrows } from "lucide-react";
import { useTranslations } from "next-intl";

import { useCompare } from "@/components/app/compare-context";
import { cn } from "@/lib/utils";

/**
 * Compare toggle for a whole university, mirroring FacultyCompareButton.
 * Split out as its own client component so its server-rendered parents
 * (search cards, the profile hero) stay server components.
 */
export function UniversityCompareButton({
  id,
  name,
  logoUrl,
  className,
}: {
  id: string;
  name: string;
  logoUrl: string | null;
  className?: string;
}) {
  const t = useTranslations("Search");
  const compare = useCompare();

  const selected = compare.isSelected(id);
  // Full only blocks when the tray already holds universities; picking a
  // university while programs/faculties are selected replaces them instead.
  const blocked = !selected && compare.isFull && compare.kind === "university";

  return (
    <button
      type="button"
      onClick={() =>
        compare.toggle({ id, kind: "university", name, universityName: name, logoUrl })
      }
      disabled={blocked}
      aria-pressed={selected}
      className={cn(
        "inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-md border text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB] disabled:cursor-not-allowed disabled:opacity-50",
        selected
          ? "border-[#1E6DEB] bg-[#1E6DEB] text-white"
          : "border-slate-200 text-[#1F2A44] hover:bg-slate-50",
        className,
        // Keeps the selected state readable even when a caller's className
        // sets its own idle text colour.
        selected && "text-white hover:bg-[#1859c4]",
      )}
    >
      {selected ? (
        <Check className="size-4 shrink-0" aria-hidden />
      ) : (
        <GitCompareArrows className="size-4 shrink-0" aria-hidden />
      )}
      <span className="truncate">
        {selected ? t("card.comparing") : t("card.compare")}
      </span>
    </button>
  );
}
