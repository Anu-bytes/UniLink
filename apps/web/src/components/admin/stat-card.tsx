import type { ComponentType } from "react";

import { cn } from "@/lib/utils";

export type StatTone = "default" | "positive" | "warning" | "danger";

// Tone tints the icon chip only. The number itself stays ink-coloured: a grid
// of four differently coloured figures reads as an alert, not as a summary.
const TONES: Record<StatTone, string> = {
  default: "bg-[#EAF2FE] text-[#1E6DEB]",
  positive: "bg-[#E7F6EE] text-[#0F7B45]",
  warning: "bg-[#FFF6E5] text-[#B77714]",
  danger: "bg-[#FFF0EE] text-[#C81F15]",
};

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "default",
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  hint?: React.ReactNode;
  icon?: ComponentType<{ className?: string }>;
  tone?: StatTone;
}) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.05)]">
      <div className="min-w-0">
        <p className="text-[13px] text-[#64748B]">{label}</p>
        <p className="mt-2 text-[28px] font-semibold tabular-nums tracking-[-0.02em] text-[#0F172A]">
          {value}
        </p>
        {hint ? <p className="mt-1 text-[12.5px] text-[#64748B]">{hint}</p> : null}
      </div>

      {Icon ? (
        <span
          aria-hidden
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-lg",
            TONES[tone],
          )}
        >
          <Icon className="size-[18px]" />
        </span>
      ) : null}
    </div>
  );
}

export function StatCardGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{children}</div>
  );
}
