"use client";

import { Check } from "lucide-react";
import { useTranslations } from "next-intl";

import { useCompare } from "@/components/app/compare-context";
import { useCloseProgramDialog } from "@/components/university/program-dialog";
import { cn } from "@/lib/utils";

/**
 * "Add to compare" inside a program's details pop-up. Feeds the same compare
 * selection as the search page, so the bottom compare tray appears. Adding
 * closes the pop-up, because the tray sits underneath a modal dialog and
 * would otherwise stay hidden until the visitor dismissed it.
 */
export function ProgramCompareButton({
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
  const t = useTranslations("ProgramDetail");
  const compare = useCompare();
  const close = useCloseProgramDialog();

  const selected = compare.isSelected(id);
  // Picking a program while faculties are selected replaces them, so "full"
  // only blocks when the tray already holds programs.
  const blocked = !selected && compare.isFull && compare.kind === "program";

  return (
    <button
      type="button"
      disabled={blocked}
      aria-pressed={selected}
      onClick={() => {
        compare.toggle({ id, kind: "program", name, universityName, logoUrl });
        if (!selected) close();
      }}
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border px-6 text-base font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB] disabled:cursor-not-allowed disabled:opacity-50",
        selected
          ? "border-[#1E6DEB] bg-[#1E6DEB] text-white"
          : "border-[#1E6DEB] text-[#1E6DEB] hover:bg-[#EEF3FF]",
      )}
    >
      {selected ? <Check className="size-4" aria-hidden /> : null}
      {selected ? t("addedToCompare") : t("compare")}
    </button>
  );
}
