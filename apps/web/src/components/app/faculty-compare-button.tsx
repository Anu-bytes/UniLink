"use client";

import { useTranslations } from "next-intl";

import { useCompare } from "@/components/app/compare-context";
import { cn } from "@/lib/utils";

/**
 * Compare toggle for a faculty card.
 *
 * Split out as its own client component so FacultyCard can stay a server
 * component and keep rendering translated content without shipping the whole
 * card to the browser.
 */
export function FacultyCompareButton({
  id,
  name,
  universityName,
  logoUrl,
}: {
  id: string;
  name: string;
  universityName: string;
  logoUrl: string | null;
}) {
  const t = useTranslations("Search");
  const compare = useCompare();

  const selected = compare.isSelected(id);
  // Full only blocks when the tray already holds faculties; picking a faculty
  // while programs are selected replaces them instead.
  const blocked = !selected && compare.isFull && compare.kind === "faculty";

  return (
    <button
      type="button"
      onClick={() =>
        compare.toggle({ id, kind: "faculty", name, universityName, logoUrl })
      }
      disabled={blocked}
      aria-pressed={selected}
      className={cn(
        "h-10 flex-1 rounded-md border text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB] disabled:cursor-not-allowed disabled:opacity-50",
        selected
          ? "border-[#1E6DEB] bg-[#1E6DEB] text-white"
          : "border-slate-200 text-[#1F2A44] hover:bg-slate-50",
      )}
    >
      {selected ? t("card.comparing") : t("card.compare")}
    </button>
  );
}
