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

export function HeroStats({
  values,
  labels,
}: {
  values: number[];
  labels: string[];
}) {
  const { ref, started } = useStartedOnVisible<HTMLDivElement>();

  // A "+0" stat (e.g. no scholarships listed yet) read as broken, so empty
  // counters are left out. The icon stays tied to the stat's original slot.
  const stats = values
    .map((value, i) => ({ value, label: labels[i] ?? "", Icon: icons[i] ?? Award }))
    .filter((stat) => stat.value > 0);

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
