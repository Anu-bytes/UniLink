"use client";

import { Check, GitCompareArrows } from "lucide-react";
import { useTranslations } from "next-intl";

import { useCompare } from "@/components/app/compare-context";
import { cn } from "@/lib/utils";

/**
 * Compact icon-only compare toggle for a university tile, for grids too
 * dense for a full-width button (the public directory). Sits as a sibling
 * of a stretched card link rather than nested inside it — an interactive
 * element can't nest inside an <a>.
 */
export function UniversityCompareToggle({
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
  const blocked = !selected && compare.isFull && compare.kind === "university";
  const label = selected ? t("card.comparing") : t("card.compare");

  return (
    <button
      type="button"
      onClick={(event) => {
        // The card underneath is a stretched link; without this the click
        // would also navigate.
        event.preventDefault();
        event.stopPropagation();
        compare.toggle({ id, kind: "university", name, universityName: name, logoUrl });
      }}
      disabled={blocked}
      aria-pressed={selected}
      aria-label={label}
      title={label}
      className={cn(
        "relative z-10 flex size-7 items-center justify-center rounded-full shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB] disabled:cursor-not-allowed disabled:opacity-50",
        selected
          ? "bg-[#1E6DEB] text-white"
          : "bg-white/95 text-[#5a6072] hover:bg-white hover:text-[#1E6DEB]",
        className,
      )}
    >
      {selected ? (
        <Check className="size-3.5" aria-hidden />
      ) : (
        <GitCompareArrows className="size-3.5" aria-hidden />
      )}
    </button>
  );
}
