"use client";

import { Check, GitCompareArrows } from "lucide-react";
import { useTranslations } from "next-intl";

import { useCompare } from "@/components/app/compare-context";
import { cn } from "@/lib/utils";

/**
 * Compact compare toggle for a university tile. It carries a visible label
 * ("Compare" / "Comparing") rather than a bare icon, which nobody could tell
 * was a compare control on a phone. Sits as a sibling of a stretched card
 * link rather than nested inside it, since an interactive element can't nest
 * inside an <a>.
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
      className={cn(
        "relative z-10 inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-bold shadow-md ring-1 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50",
        selected
          ? "bg-[#1E6DEB] text-white ring-[#1E6DEB]"
          : "bg-white/95 text-[#1E3A8A] ring-black/5 backdrop-blur hover:bg-white hover:text-[#1E6DEB]",
        className,
      )}
    >
      {selected ? (
        <Check className="size-3.5" aria-hidden />
      ) : (
        <GitCompareArrows className="size-3.5" aria-hidden />
      )}
      {label}
    </button>
  );
}
