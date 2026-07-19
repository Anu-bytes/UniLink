"use client";

import { useRef, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Selectable country filter row for the "trusted partners" section. Replaces
 * the previous static buttons (whose active state was hard-coded and whose
 * clicks did nothing). Keeps a real selected state, an animated underline, and
 * keyboard navigation (arrow keys with roving focus).
 */
export function PartnerCountryTabs({ countries }: { countries: string[] }) {
  const [active, setActive] = useState(0);
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

  function focusTab(index: number) {
    const next = (index + countries.length) % countries.length;
    setActive(next);
    buttonsRef.current[next]?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent, index: number) {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      focusTab(index + 1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      focusTab(index - 1);
    }
  }

  return (
    <div
      role="group"
      aria-label="Filter partners by country"
      className="flex flex-wrap justify-center gap-x-8 gap-y-3"
    >
      {countries.map((c, i) => {
        const selected = i === active;
        return (
          <button
            key={c}
            ref={(el) => {
              buttonsRef.current[i] = el;
            }}
            type="button"
            aria-pressed={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cn(
              "relative pb-1 text-[18px] font-semibold outline-none transition-colors",
              "after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:origin-center after:rounded-full after:bg-[#1E6DEB] after:transition-transform after:duration-300 after:content-['']",
              "focus-visible:text-[#1E6DEB]",
              selected
                ? "text-[#1E6DEB] after:scale-x-100"
                : "text-[#292E3E] after:scale-x-0 hover:text-[#1E6DEB]",
            )}
          >
            {c}
          </button>
        );
      })}
    </div>
  );
}
