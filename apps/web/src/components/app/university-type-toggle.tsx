"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { UNIVERSITY_TYPES } from "@/lib/program-filters";
import { cn } from "@/lib/utils";

type UniversityTypeValue = (typeof UNIVERSITY_TYPES)[number];

const TONES = {
  blue: {
    ring: "focus-visible:outline-[#1E6DEB]",
    active: "bg-[#1E6DEB] text-white",
    border: "border-[#1E6DEB]/35",
  },
  red: {
    ring: "focus-visible:outline-[#F82C1F]",
    active: "bg-[#F82C1F] text-white",
    border: "border-[#F82C1F]/35",
  },
} as const;

/**
 * National vs private, as its own always-visible control: it's the first
 * thing most students decide (it sets the fee bracket and the minimum
 * scores), so it shouldn't sit behind the filters drawer. "All" clears it.
 */
export function UniversityTypeToggle({
  value,
  onChange,
  tone,
}: {
  value: UniversityTypeValue | "";
  onChange: (value: UniversityTypeValue | "") => void;
  tone: keyof typeof TONES;
}) {
  const t = useTranslations("Search.filters");
  const colors = TONES[tone];

  // `value` comes from the URL, so it only changes after the results have
  // reloaded on the server. Show the click straight away, and drop the local
  // pick once the URL catches up (or back/forward moves it elsewhere).
  const [picked, setPicked] = useState<UniversityTypeValue | "" | null>(null);
  const [seenValue, setSeenValue] = useState(value);
  if (seenValue !== value) {
    setSeenValue(value);
    setPicked(null);
  }
  const shown = picked ?? value;
  const options: { value: UniversityTypeValue | ""; label: string }[] = [
    { value: "", label: t("allTypes") },
    ...UNIVERSITY_TYPES.map((type) => ({ value: type, label: t(`types.${type}`) })),
  ];

  return (
    <div
      role="radiogroup"
      aria-label={t("universityType")}
      className={cn(
        "inline-flex h-10 items-stretch overflow-hidden rounded-lg border-2 bg-white shadow-sm",
        colors.border,
      )}
    >
      {options.map((option, index) => {
        const active = option.value === shown;
        return (
          <button
            key={option.value || "all"}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => {
              if (active) return;
              setPicked(option.value);
              onChange(option.value);
            }}
            className={cn(
              "px-3.5 text-sm font-semibold whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2",
              colors.ring,
              index > 0 && "border-s border-slate-200",
              active ? colors.active : "text-[#1F2A44] hover:bg-slate-50",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
