import { getLocale } from "next-intl/server";

import { UniversityLogo } from "@/components/university-logo";
import { Link } from "@/i18n/navigation";
import { formatNumber } from "@/lib/format";

export type RankedRow = {
  key: string;
  label: string;
  sublabel?: string;
  href?: string;
  logo?: { name: string; url: string | null };
  value: number;
  /** Shown instead of the plain number (e.g. "4.6 ★"). */
  display?: string;
  /** A short note under the bar (e.g. "+45% vs the week before"). */
  note?: React.ReactNode;
  noteTone?: "up" | "down" | "muted";
};

/**
 * A ranked list as horizontal bars: the length is the measure, so ranking
 * reads at a glance, and every row carries its exact number as text.
 */
export async function RankedList({
  rows,
  empty,
  unit,
}: {
  rows: RankedRow[];
  empty: string;
  /** Appended to the number, e.g. "views". */
  unit?: string;
}) {
  const locale = await getLocale();
  if (rows.length === 0) {
    return <p className="py-8 text-center text-[13px] text-[#94A3B8]">{empty}</p>;
  }
  const max = Math.max(...rows.map((row) => row.value), 1);

  return (
    <ol className="space-y-3">
      {rows.map((row, index) => (
        <li key={row.key} className="flex items-center gap-3">
          <span className="w-5 shrink-0 text-end text-[12px] font-semibold text-[#94A3B8] tabular-nums">
            {formatNumber(locale, index + 1)}
          </span>
          {row.logo ? (
            <UniversityLogo name={row.logo.name} logoUrl={row.logo.url} className="size-8 shrink-0" textClassName="text-[10px]" />
          ) : null}
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-3">
              {row.href ? (
                <Link href={row.href} className="truncate text-[13.5px] font-semibold text-[#0F172A] hover:text-[#1E6DEB] hover:underline">
                  {row.label}
                </Link>
              ) : (
                <span className="truncate text-[13.5px] font-semibold text-[#0F172A]">{row.label}</span>
              )}
              <span className="shrink-0 text-[13px] font-semibold text-[#0F172A] tabular-nums">
                {row.display ?? formatNumber(locale, row.value)}
                {unit && !row.display ? <span className="ms-1 text-[11.5px] font-normal text-[#94A3B8]">{unit}</span> : null}
              </span>
            </div>
            {row.sublabel ? <p className="truncate text-[12px] text-[#64748B]">{row.sublabel}</p> : null}
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#EEF3FF]">
              <div className="h-full rounded-full bg-[#1E6DEB]" style={{ width: `${Math.max(3, (row.value / max) * 100)}%` }} />
            </div>
            {row.note ? (
              <p
                className={
                  row.noteTone === "up"
                    ? "mt-1 text-[11.5px] font-semibold text-[#0F7B45]"
                    : row.noteTone === "down"
                      ? "mt-1 text-[11.5px] font-semibold text-[#C81F15]"
                      : "mt-1 text-[11.5px] text-[#64748B]"
                }
              >
                {row.note}
              </p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

/** A titled white card, the unit every statistics panel sits in. */
export function StatPanel({
  title,
  subtitle,
  action,
  children,
  className,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)] sm:p-5 ${className ?? ""}`}>
      <header className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-[15px] font-semibold text-[#0F172A]">{title}</h2>
          {subtitle ? <p className="mt-0.5 text-[12.5px] text-[#64748B]">{subtitle}</p> : null}
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}
