"use client";

import { Award, Building2, BookOpen, Users, type LucideIcon } from "lucide-react";

import { useCountUp } from "@/hooks/use-count-up";
import { useStartedOnVisible } from "@/hooks/use-started-on-visible";
import { cn } from "@/lib/utils";

// Order matches heroStatOrder in the homepage: university, program,
// student, scholarship.
const icons: LucideIcon[] = [Building2, BookOpen, Users, Award];

function StatCard({
  value,
  label,
  Icon,
  started,
}: {
  value: number;
  label: string;
  Icon: LucideIcon;
  started: boolean;
}) {
  const current = useCountUp(value, started);
  // No backdrop-blur here on purpose: the hero background behind these cards
  // animates, so a backdrop filter would re-blur every frame.
  return (
    <div className="hover-lift group flex flex-col items-center justify-center gap-2 rounded-2xl border border-white/80 bg-white/90 px-2 py-3.5 text-center shadow-[0_10px_30px_-18px_rgba(15,23,42,0.45)] sm:flex-row sm:gap-3 sm:px-3 sm:py-4 sm:text-start">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#1E6DEB]/10 text-[#1E6DEB] transition-transform duration-300 group-hover:scale-110 sm:size-10">
        <Icon className="size-[18px] sm:size-5" strokeWidth={2} />
      </span>
      <div className="min-w-0">
        <div className="text-[19px] font-bold leading-none tabular-nums text-[#16233F] sm:text-[20px]">
          +{Math.round(current).toLocaleString("en-US")}
        </div>
        <div className="mt-1 text-[11px] leading-4 text-[#5a6072] sm:text-xs md:text-[13px]">
          {label}
        </div>
      </div>
    </div>
  );
}

// Icon tiles in the slim strip: one brand blue, light to dark.
const INLINE_TONES = [
  "from-[#4C8DF6] to-[#1E6DEB] shadow-[0_8px_18px_-10px_rgba(30,109,235,0.8)]",
  "from-[#2F7BF5] to-[#1857C9] shadow-[0_8px_18px_-10px_rgba(30,109,235,0.8)]",
  "from-[#2560D6] to-[#1E3A8A] shadow-[0_8px_18px_-10px_rgba(30,58,138,0.8)]",
];

/** One stat in the slim hero strip: icon, number and label, no card. */
function InlineStat({
  value,
  label,
  Icon,
  started,
  tone,
}: {
  value: number;
  label: string;
  Icon: LucideIcon;
  started: boolean;
  tone: string;
}) {
  const current = useCountUp(value, started);
  return (
    <div className="group flex min-w-0 flex-col items-center gap-1.5 text-center sm:flex-row sm:gap-2.5 sm:text-start">
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:rotate-[-6deg]",
          tone,
        )}
      >
        <Icon className="size-5" strokeWidth={1.9} aria-hidden />
      </span>
      <div className="min-w-0">
        <div className="text-lg font-extrabold leading-none tabular-nums text-[#16233F] md:text-xl">
          +{Math.round(current).toLocaleString("en-US")}
        </div>
        <div className="mt-1 truncate text-xs font-medium text-[#5a6072] md:text-[13px]">{label}</div>
      </div>
    </div>
  );
}

export function HeroStats({
  values,
  labels,
  variant = "cards",
}: {
  values: number[];
  labels: string[];
  /** "inline": a slim divided strip for sitting on a photo background. */
  variant?: "cards" | "inline";
}) {
  const { ref, started } = useStartedOnVisible<HTMLDivElement>();

  // A "+0" stat (e.g. no scholarships listed yet) read as broken, so empty
  // counters are left out. The icon stays tied to the stat's original slot.
  const stats = values
    .map((value, i) => ({ value, label: labels[i] ?? "", Icon: icons[i] ?? Award }))
    .filter((stat) => stat.value > 0);

  if (variant === "inline") {
    return (
      <div
        ref={ref}
        className={cn(
          "grid gap-x-2 gap-y-4 sm:flex sm:flex-wrap sm:items-center sm:gap-x-0",
          stats.length === 3 ? "grid-cols-3" : "grid-cols-2",
        )}
      >
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={cn(
              "min-w-0 sm:px-5 sm:first:ps-0",
              index > 0 && "sm:border-s sm:border-[#D6E3FA]",
            )}
          >
            <InlineStat
              value={stat.value}
              label={stat.label}
              Icon={stat.Icon}
              started={started}
              tone={INLINE_TONES[index % INLINE_TONES.length]}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={cn(
        "grid gap-2.5 sm:gap-3",
        stats.length === 3 ? "grid-cols-3" : "grid-cols-2 sm:grid-cols-4",
      )}
    >
      {stats.map((stat) => (
        <StatCard
          key={stat.label}
          value={stat.value}
          label={stat.label}
          Icon={stat.Icon}
          started={started}
        />
      ))}
    </div>
  );
}
