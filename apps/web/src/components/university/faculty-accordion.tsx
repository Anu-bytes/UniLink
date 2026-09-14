"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

export type FacultyAccordionItem = {
  id: string;
  header: React.ReactNode;
  body: React.ReactNode;
};

/**
 * One faculty open at a time: opening another closes whichever was open,
 * animated with a CSS grid-rows trick (0fr <-> 1fr) rather than measuring
 * pixel heights in JS, so the collapse/expand is a genuinely smooth height
 * transition with no layout jump. Header/body content is pre-rendered by
 * the server parent (translations, formatting); this component only owns
 * which faculty is open and the transition itself.
 */
export function FacultyAccordion({
  items,
  defaultOpenId,
  expandLabel,
  collapseLabel,
}: {
  items: FacultyAccordionItem[];
  defaultOpenId?: string;
  /** Short verb next to the chevron ("View programs"/"Hide") — a circular
   * arrow alone reads as decoration to a first-time visitor; spelling out
   * what clicking it does makes the tile obviously interactive. */
  expandLabel: string;
  collapseLabel: string;
}) {
  const [openId, setOpenId] = useState(defaultOpenId);

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const isOpen = item.id === openId;
        return (
          <div
            key={item.id}
            className={cn(
              "overflow-hidden rounded-2xl border bg-white transition-colors duration-300",
              isOpen
                ? "border-[#1E6DEB]/40 shadow-[0_20px_45px_-24px_rgba(30,109,235,0.35)]"
                : "border-slate-200 shadow-sm",
            )}
          >
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? undefined : item.id)}
              aria-expanded={isOpen}
              className={cn(
                "group flex w-full items-center gap-3 px-5 py-4 text-start transition-colors duration-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#1E6DEB] md:px-6",
                isOpen ? "bg-[#F5F8FF]" : "hover:bg-[#F7F9FE]",
              )}
            >
              {item.header}
              <span
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-colors duration-300",
                  isOpen
                    ? "bg-[#1E6DEB] text-white"
                    : "bg-[#EEF3FF] text-[#1E6DEB] group-hover:bg-[#DCE7FE]",
                )}
              >
                <span className="hidden sm:inline">
                  {isOpen ? collapseLabel : expandLabel}
                </span>
                <ChevronDown
                  className={cn(
                    "size-4 shrink-0 transition-transform duration-300 ease-out",
                    isOpen ? "rotate-180" : "group-hover:translate-y-0.5",
                  )}
                  aria-hidden
                />
              </span>
            </button>

            <div
              className={cn(
                "grid transition-[grid-template-rows] duration-500 ease-in-out",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <div className="px-5 pb-5 pt-1 md:px-6">{item.body}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
