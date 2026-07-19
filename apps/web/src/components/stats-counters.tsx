"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Flag,
  Globe,
  GraduationCap,
  Landmark,
  Users,
  type LucideIcon,
} from "lucide-react";

type Stat = {
  icon: LucideIcon;
  color: string;
  target: number;
  decimals: number;
  comma?: boolean;
  suffix?: string;
  label: string;
};

// Numeric config only; labels come from translations (Home.counters.items).
const statConfig: Omit<Stat, "label">[] = [
  { icon: GraduationCap, color: "#1E6DEB", target: 1.5, decimals: 1, suffix: "M+" },
  { icon: Globe, color: "#F5245F", target: 150000, decimals: 0, comma: true, suffix: "+" },
  { icon: Landmark, color: "#17A398", target: 1500, decimals: 0, comma: true, suffix: "+" },
  { icon: Flag, color: "#F0852E", target: 180, decimals: 0, suffix: "+" },
  { icon: Users, color: "#A945D6", target: 10, decimals: 0, suffix: "+" },
];

function useCountUp(target: number, started: boolean, duration = 1600) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!started) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      const frame = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(frame);
    }

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setValue(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setValue(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, target, duration]);

  return value;
}

function format(value: number, stat: Stat) {
  const n = stat.comma
    ? Math.round(value).toLocaleString("en-US")
    : value.toFixed(stat.decimals);
  return `${n}${stat.suffix ?? ""}`;
}

function StatCard({ stat, started }: { stat: Stat; started: boolean }) {
  const value = useCountUp(stat.target, started);
  const Icon = stat.icon;

  return (
    <div className="min-w-0 rounded-2xl bg-white p-4 shadow-[0_12px_40px_-12px_rgba(15,23,42,0.18)] md:p-6">
      <div
        className="flex size-14 items-center justify-center rounded-2xl md:size-16"
        style={{ backgroundColor: stat.color }}
      >
        <Icon className="size-6 text-white md:size-7" strokeWidth={2} />
      </div>
      <div
        className="mt-4 text-[clamp(1.5rem,6vw,1.875rem)] font-bold leading-none tabular-nums md:mt-5"
        style={{ color: stat.color }}
      >
        {format(value, stat)}
      </div>
      <div className="mt-2 text-sm leading-5 text-[#5a6072] md:text-[15px]">
        {stat.label}
      </div>
    </div>
  );
}

export function StatsCounters() {
  const t = useTranslations("Home.counters");
  const labels = t.raw("items") as string[];
  const stats: Stat[] = statConfig.map((s, i) => ({
    ...s,
    label: labels[i] ?? "",
  }));

  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-5"
    >
      {stats.map((stat) => (
        <StatCard key={stat.label} stat={stat} started={started} />
      ))}
    </div>
  );
}
