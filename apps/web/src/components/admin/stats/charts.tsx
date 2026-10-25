"use client";

import { Table2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

// One series per chart, so one hue (the brand blue) and no legend box: the
// card title says what is plotted. Thin marks, hairline grid, hover tooltip,
// and a table view for anyone who'd rather read numbers.
const SERIES = "#1E6DEB";
const GRID = "#EEF1F5";
const AXIS_TEXT = "#94A3B8";
const HEIGHT = 220;
const PAD = { top: 16, right: 12, bottom: 28, left: 40 };

export type Point = { bucket: string; value: number };
export type Granularity = "day" | "week" | "month" | "year";

function niceMax(value: number) {
  if (value <= 4) return 4;
  const step = 10 ** Math.floor(Math.log10(value));
  for (const factor of [1, 2, 2.5, 5, 10]) {
    if (factor * step >= value) return factor * step;
  }
  return 10 * step;
}

export function bucketLabel(locale: string, bucket: string, unit: Granularity, long = false) {
  const date = new Date(`${bucket}T00:00:00Z`);
  const tag = locale === "ar" ? "ar-EG" : "en-GB";
  if (unit === "year") return new Intl.DateTimeFormat(tag, { year: "numeric", timeZone: "UTC" }).format(date);
  if (unit === "month") return new Intl.DateTimeFormat(tag, { month: long ? "long" : "short", year: long ? "numeric" : undefined, timeZone: "UTC" }).format(date);
  return new Intl.DateTimeFormat(tag, { day: "numeric", month: "short", year: long ? "numeric" : undefined, timeZone: "UTC" }).format(date);
}

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(640);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.max(280, entry.contentRect.width)));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return { ref, width };
}

function Tooltip({ x, y, width, children }: { x: number; y: number; width: number; children: React.ReactNode }) {
  const left = Math.min(Math.max(x, 70), width - 70);
  return (
    <div
      className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-center shadow-lg"
      style={{ left, top: Math.max(y - 8, 4) }}
    >
      {children}
    </div>
  );
}

function YAxis({ max, width, inner }: { max: number; width: number; inner: number }) {
  const locale = useLocale();
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(max * f));
  return (
    <g>
      {ticks.map((tick) => {
        const y = PAD.top + inner - (tick / max) * inner;
        return (
          <g key={tick}>
            <line x1={PAD.left} x2={width - PAD.right} y1={y} y2={y} stroke={GRID} strokeWidth={1} />
            <text x={PAD.left - 8} y={y + 4} textAnchor="end" fontSize={11} fill={AXIS_TEXT} className="tabular-nums">
              {formatNumber(locale, tick)}
            </text>
          </g>
        );
      })}
    </g>
  );
}

/** Columns from one baseline, 4px rounded tops, value on hover. */
export function ColumnChart({ points, unit, label, color = SERIES }: { points: Point[]; unit: Granularity; label: string; color?: string }) {
  const locale = useLocale();
  const { ref, width } = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const inner = HEIGHT - PAD.top - PAD.bottom;
  const max = niceMax(Math.max(...points.map((point) => point.value), 0));
  const band = (width - PAD.left - PAD.right) / Math.max(points.length, 1);
  const barWidth = Math.min(24, Math.max(4, band - 4));
  const every = Math.ceil(points.length / Math.max(1, Math.floor((width - PAD.left) / 64)));

  return (
    <div ref={ref} className="relative" dir="ltr">
      <svg width={width} height={HEIGHT} role="img" aria-label={label} onMouseLeave={() => setHover(null)}>
        <YAxis max={max} width={width} inner={inner} />
        {points.map((point, index) => {
          const h = (point.value / max) * inner;
          const cx = PAD.left + band * index + band / 2;
          const x = cx - barWidth / 2;
          const y = PAD.top + inner - h;
          const r = Math.min(4, h);
          return (
            <g key={point.bucket} onMouseEnter={() => setHover(index)}>
              <rect x={PAD.left + band * index} y={PAD.top} width={band} height={inner} fill="transparent" />
              {h > 0 ? (
                <path
                  d={`M${x},${y + h} V${y + r} Q${x},${y} ${x + r},${y} H${x + barWidth - r} Q${x + barWidth},${y} ${x + barWidth},${y + r} V${y + h} Z`}
                  fill={color}
                  opacity={hover === null || hover === index ? 1 : 0.45}
                />
              ) : null}
              {index % every === 0 || index === points.length - 1 ? (
                <text x={cx} y={HEIGHT - 8} textAnchor="middle" fontSize={11} fill={AXIS_TEXT}>
                  {bucketLabel(locale, point.bucket, unit)}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
      {hover !== null ? (
        <Tooltip x={PAD.left + band * hover + band / 2} y={PAD.top + inner - (points[hover].value / max) * inner} width={width}>
          <p className="text-[11.5px] text-[#64748B]">{bucketLabel(locale, points[hover].bucket, unit, true)}</p>
          <p className="text-[14px] font-semibold text-[#0F172A]">{formatNumber(locale, points[hover].value)}</p>
        </Tooltip>
      ) : null}
    </div>
  );
}

/** 2px line over a 10% wash, crosshair and tooltip following the pointer. */
export function LineChart({ points, label }: { points: Point[]; label: string }) {
  const locale = useLocale();
  const { ref, width } = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const inner = HEIGHT - PAD.top - PAD.bottom;
  const max = niceMax(Math.max(...points.map((point) => point.value), 0));
  const step = (width - PAD.left - PAD.right) / Math.max(points.length - 1, 1);
  const xy = points.map((point, index) => [PAD.left + step * index, PAD.top + inner - (point.value / max) * inner] as const);
  const line = xy.map(([x, y], index) => `${index ? "L" : "M"}${x},${y}`).join(" ");
  const area = `${line} L${xy[xy.length - 1]?.[0] ?? 0},${PAD.top + inner} L${PAD.left},${PAD.top + inner} Z`;
  const every = Math.ceil(points.length / Math.max(1, Math.floor((width - PAD.left) / 64)));

  function onMove(event: React.MouseEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const index = Math.round((event.clientX - rect.left - PAD.left) / step);
    setHover(Math.max(0, Math.min(points.length - 1, index)));
  }

  return (
    <div ref={ref} className="relative" dir="ltr">
      <svg width={width} height={HEIGHT} role="img" aria-label={label} onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
        <YAxis max={max} width={width} inner={inner} />
        <path d={area} fill={SERIES} opacity={0.1} />
        <path d={line} fill="none" stroke={SERIES} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        {points.map((point, index) =>
          index % every === 0 || index === points.length - 1 ? (
            <text key={point.bucket} x={xy[index][0]} y={HEIGHT - 8} textAnchor="middle" fontSize={11} fill={AXIS_TEXT}>
              {bucketLabel(locale, point.bucket, "day")}
            </text>
          ) : null,
        )}
        {hover !== null ? (
          <g>
            <line x1={xy[hover][0]} x2={xy[hover][0]} y1={PAD.top} y2={PAD.top + inner} stroke="#CBD5E1" strokeWidth={1} />
            <circle cx={xy[hover][0]} cy={xy[hover][1]} r={5} fill={SERIES} stroke="#fff" strokeWidth={2} />
          </g>
        ) : xy.length ? (
          <circle cx={xy[xy.length - 1][0]} cy={xy[xy.length - 1][1]} r={4} fill={SERIES} stroke="#fff" strokeWidth={2} />
        ) : null}
      </svg>
      {hover !== null ? (
        <Tooltip x={xy[hover][0]} y={xy[hover][1]} width={width}>
          <p className="text-[11.5px] text-[#64748B]">{bucketLabel(locale, points[hover].bucket, "day", true)}</p>
          <p className="text-[14px] font-semibold text-[#0F172A]">{formatNumber(locale, points[hover].value)}</p>
        </Tooltip>
      ) : null}
    </div>
  );
}

/** "Show as table" toggle under a chart. */
export function TableToggle({ points, unit, valueLabel }: { points: Point[]; unit: Granularity; valueLabel: string }) {
  const t = useTranslations("Admin.stats");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#64748B] hover:text-[#0F172A]"
      >
        <Table2 className="size-3.5" aria-hidden />
        {open ? t("hideTable") : t("showTable")}
      </button>
      {open ? (
        <div className="mt-2 max-h-64 overflow-y-auto rounded-lg border border-slate-100">
          <table className="w-full text-[12.5px]">
            <thead className="sticky top-0 bg-[#F8FAFC] text-[#64748B]">
              <tr>
                <th className="px-3 py-1.5 text-start font-semibold">{t("period")}</th>
                <th className="px-3 py-1.5 text-end font-semibold">{valueLabel}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[...points].reverse().map((point) => (
                <tr key={point.bucket}>
                  <td className="px-3 py-1.5">{bucketLabel(locale, point.bucket, unit, true)}</td>
                  <td className="px-3 py-1.5 text-end tabular-nums">{formatNumber(locale, point.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}

export type ActivityMetric = "views" | "searches" | "signups" | "saves";
const METRIC_COLORS: Record<ActivityMetric, string> = { views: "#1E6DEB", searches: "#F5A524", signups: "#16A34A", saves: "#E11D48" };

/** Site activity over the chosen window, one metric at a time. */
export function ActivityChart({
  points,
  unit,
}: {
  points: ({ bucket: string } & Record<ActivityMetric, number>)[];
  unit: "day" | "week" | "month";
}) {
  const t = useTranslations("Admin.stats.analytics");
  const locale = useLocale();
  const [metric, setMetric] = useState<ActivityMetric>("views");
  const series = points.map((point) => ({ bucket: point.bucket, value: point[metric] }));
  const total = series.reduce((sum, point) => sum + point.value, 0);
  const best = series.reduce((top, point) => (point.value > top.value ? point : top), { bucket: "", value: 0 });
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div role="radiogroup" aria-label={t("activity.metric")} className="inline-flex flex-wrap rounded-lg border border-slate-200 bg-white p-0.5">
          {(["views", "searches", "signups", "saves"] as const).map((option) => (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={metric === option}
              onClick={() => setMetric(option)}
              className={cn(
                "inline-flex min-h-8 items-center gap-1.5 rounded-md px-3 text-[12.5px] font-semibold transition-colors",
                metric === option ? "bg-[#0B1220] text-white" : "text-[#64748B] hover:text-[#0F172A]",
              )}
            >
              <span aria-hidden className="size-2 rounded-full" style={{ background: METRIC_COLORS[option] }} />
              {t(`metrics.${option}`)}
            </button>
          ))}
        </div>
        <p className="text-[13px] text-[#64748B]">
          {t("activity.total")}: <span className="font-semibold text-[#0F172A]">{formatNumber(locale, total)}</span>
          {best.value > 0 ? (
            <>
              {" Â· "}
              {t("activity.best")}: <span className="font-semibold text-[#0F172A]">{bucketLabel(locale, best.bucket, unit, true)}</span>
            </>
          ) : null}
        </p>
      </div>
      <ColumnChart points={series} unit={unit} label={t(`metrics.${metric}`)} color={METRIC_COLORS[metric]} />
      <TableToggle points={series} unit={unit} valueLabel={t(`metrics.${metric}`)} />
    </div>
  );
}

/** Registrations with a Daily / Weekly / Monthly / Yearly switch. */
export function RegistrationsChart({ series }: { series: Record<Granularity, Point[]> }) {
  const t = useTranslations("Admin.stats");
  const locale = useLocale();
  const [unit, setUnit] = useState<Granularity>("day");
  const points = series[unit];
  const total = points.reduce((sum, point) => sum + point.value, 0);
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[13px] text-[#64748B]">
          {t(`registrations.range.${unit}`)}:{" "}
          <span className="font-semibold text-[#0F172A]">{formatNumber(locale, total)}</span>
        </p>
        <div role="radiogroup" aria-label={t("registrations.granularity")} className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5">
          {(["day", "week", "month", "year"] as const).map((option) => (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={unit === option}
              onClick={() => setUnit(option)}
              className={cn(
                "min-h-8 rounded-md px-3 text-[12.5px] font-semibold transition-colors",
                unit === option ? "bg-[#1E6DEB] text-white" : "text-[#64748B] hover:text-[#0F172A]",
              )}
            >
              {t(`registrations.${option}`)}
            </button>
          ))}
        </div>
      </div>
      <ColumnChart points={points} unit={unit} label={t("registrations.title")} />
      <TableToggle points={points} unit={unit} valueLabel={t("registrations.signups")} />
    </div>
  );
}
