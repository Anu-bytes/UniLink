import { cn } from "@/lib/utils";

export type BadgeTone = "neutral" | "blue" | "green" | "amber" | "red" | "slate";

// `slate` is deliberately the only solid pill: it is for the one state per
// screen that has to out-shout the tinted tones (archived, draft, closed).
const TONES: Record<BadgeTone, { pill: string; dot: string }> = {
  neutral: { pill: "bg-slate-100 text-[#475569]", dot: "bg-slate-400" },
  blue: { pill: "bg-[#EAF2FE] text-[#1E6DEB]", dot: "bg-[#1E6DEB]" },
  green: { pill: "bg-[#E7F6EE] text-[#0F7B45]", dot: "bg-[#0F7B45]" },
  amber: { pill: "bg-[#FFF6E5] text-[#B77714]", dot: "bg-[#B77714]" },
  red: { pill: "bg-[#FFF0EE] text-[#C81F15]", dot: "bg-[#C81F15]" },
  slate: { pill: "bg-[#0F172A] text-white", dot: "bg-white/70" },
};

export function Badge({
  tone = "neutral",
  children,
  dot,
  className,
}: {
  tone?: BadgeTone;
  children: React.ReactNode;
  dot?: boolean;
  className?: string;
}) {
  const styles = TONES[tone];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-semibold leading-none",
        styles.pill,
        className,
      )}
    >
      {dot ? (
        <span aria-hidden className={cn("size-1.5 shrink-0 rounded-full", styles.dot)} />
      ) : null}
      {children}
    </span>
  );
}
