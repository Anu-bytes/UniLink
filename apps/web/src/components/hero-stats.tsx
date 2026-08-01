"use client";

import { useEffect, useRef, useState } from "react";
import { Award, Building2, BookOpen, Users, type LucideIcon } from "lucide-react";

// Order matches heroStatOrder in the homepage: university, program,
// student, scholarship.
const icons: LucideIcon[] = [Building2, BookOpen, Users, Award];

function useCountUp(target: number, started: boolean, duration = 1400) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!started) return;
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setValue(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setValue(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, target, duration]);

  return value;
}

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
    <div className="hover-lift group flex items-center justify-center gap-3 rounded-2xl border border-white/80 bg-white/90 px-3 py-4 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.45)]">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#1E6DEB]/10 text-[#1E6DEB] transition-transform duration-300 group-hover:scale-110">
        <Icon className="size-5" strokeWidth={2} />
      </span>
      <div>
        <div className="text-[20px] font-bold leading-none tabular-nums text-[#16233F]">
          +{Math.round(current).toLocaleString("en-US")}
        </div>
        <div className="mt-1 text-xs leading-4 text-[#5a6072] md:text-[13px]">
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
    <div ref={ref} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {values.map((value, i) => (
        <StatCard
          key={labels[i] ?? i}
          value={value}
          label={labels[i] ?? ""}
          Icon={icons[i] ?? Award}
          started={started}
        />
      ))}
    </div>
  );
}
