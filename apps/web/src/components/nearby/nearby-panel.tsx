"use client";

import {
  ArrowLeft,
  ArrowUpRight,
  ChevronDown,
  ChevronRight,
  Link2,
  MapPinOff,
  Navigation,
  Share2,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";

import { UniversityLogo } from "@/components/university-logo";
import { Link } from "@/i18n/navigation";
import { formatMoney, yearsFromMonths } from "@/lib/format";
import type { NearbyProgram, NearbyUniversity } from "@/lib/nearby";
import { cn } from "@/lib/utils";

export type ResultRow = {
  university: NearbyUniversity;
  programs: NearbyProgram[];
  /** Straight-line kilometres from the starting point; null without one. */
  distance: number | null;
};

export type SortKey = "distance" | "name" | "programs";

/** A number that eases to its new value instead of jumping. */
export function useTweenedNumber(target: number, duration = 450) {
  const [value, setValue] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    const start = performance.now();
    const origin = from.current;
    if (origin === target || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      from.current = target;
      setValue(target);
      return;
    }
    let frame = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const next = origin + (target - origin) * (1 - Math.pow(1 - p, 3));
      from.current = next;
      setValue(next);
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);
  return Math.round(value);
}

/* ------------------------------------------------------------------ list */

export function ResultsHeader({
  count,
  context,
  sort,
  onSort,
  canSortByDistance,
}: {
  count: number;
  context: string;
  sort: SortKey;
  onSort: (sort: SortKey) => void;
  canSortByDistance: boolean;
}) {
  const t = useTranslations("Nearby");
  const shown = useTweenedNumber(count);
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h1 className="text-[15px] font-semibold text-slate-900" aria-live="polite">
          {t("list.count", { count: shown })}
        </h1>
        <p className="mt-0.5 truncate text-[13px] text-slate-500">{context}</p>
      </div>
      <label className="relative shrink-0">
        <span className="sr-only">{t("list.sortLabel")}</span>
        <select
          value={sort}
          onChange={(event) => onSort(event.target.value as SortKey)}
          className="h-8 cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white ps-2.5 pe-7 text-[13px] font-medium text-slate-700 outline-none transition-colors hover:border-slate-300 focus-visible:border-[#1E6DEB]"
        >
          {canSortByDistance ? <option value="distance">{t("list.sortDistance")}</option> : null}
          <option value="name">{t("list.sortName")}</option>
          <option value="programs">{t("list.sortPrograms")}</option>
        </select>
        <ChevronDown className="pointer-events-none absolute end-2 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" aria-hidden />
      </label>
    </div>
  );
}

export function ResultList({
  rows,
  hovered,
  nearestSlug,
  listKey,
  formatDistance,
  onSelect,
  onHover,
}: {
  rows: ResultRow[];
  hovered: string | null;
  nearestSlug: string | null;
  /** Changes with each new result set, so rows replay their entrance. */
  listKey: string;
  formatDistance: (km: number) => string;
  onSelect: (slug: string) => void;
  onHover: (slug: string | null) => void;
}) {
  const listRef = useRef<HTMLUListElement>(null);

  // A pin hovered on the map scrolls its row into view.
  useEffect(() => {
    if (!hovered) return;
    listRef.current
      ?.querySelector<HTMLElement>(`[data-slug="${CSS.escape(hovered)}"]`)
      ?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [hovered]);

  // Up/down arrows move between rows.
  function onKeyDown(event: React.KeyboardEvent<HTMLUListElement>) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    const buttons = [...(listRef.current?.querySelectorAll<HTMLButtonElement>("button[data-row]") ?? [])];
    const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
    const next = buttons[index + (event.key === "ArrowDown" ? 1 : -1)] ?? buttons[event.key === "ArrowDown" ? 0 : buttons.length - 1];
    if (next) {
      event.preventDefault();
      next.focus();
    }
  }

  return (
    <ul ref={listRef} onKeyDown={onKeyDown} key={listKey} className="divide-y divide-slate-100">
      {rows.map((row, index) => (
        <li key={row.university.slug} data-slug={row.university.slug} className="ul-rise" style={{ "--rise-delay": `${Math.min(index, 10) * 30}ms` } as React.CSSProperties}>
          <ResultItem
            row={row}
            hovered={hovered === row.university.slug}
            nearest={nearestSlug === row.university.slug}
            formatDistance={formatDistance}
            onSelect={() => onSelect(row.university.slug)}
            onHover={onHover}
          />
        </li>
      ))}
    </ul>
  );
}

function ResultItem({
  row,
  hovered,
  nearest,
  formatDistance,
  onSelect,
  onHover,
}: {
  row: ResultRow;
  hovered: boolean;
  nearest: boolean;
  formatDistance: (km: number) => string;
  onSelect: () => void;
  onHover: (slug: string | null) => void;
}) {
  const t = useTranslations("Nearby");
  const { university, programs, distance } = row;
  return (
    <button
      type="button"
      data-row
      onClick={onSelect}
      onMouseEnter={() => onHover(university.slug)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(university.slug)}
      onBlur={() => onHover(null)}
      className={cn(
        "group flex w-full items-center gap-3.5 px-5 py-3.5 text-start transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#1E6DEB]",
        hovered ? "bg-slate-50" : "hover:bg-slate-50",
      )}
    >
      <UniversityLogo name={university.name} logoUrl={university.logoUrl} className="size-11 border-slate-200" />
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="truncate text-[14px] font-medium text-slate-900">{university.name}</span>
          {nearest ? (
            <span className="shrink-0 rounded-full bg-[#FFF1F0] px-1.5 py-px text-[10.5px] font-semibold text-[#D92D20]">{t("card.nearest")}</span>
          ) : null}
        </span>
        <span className="mt-0.5 block truncate text-[13px] text-slate-500">
          {[university.city, university.governorate].filter(Boolean).join(", ")} · {t(`types.${university.type}`)}
        </span>
        <span className="mt-0.5 block text-[12px] text-slate-400">{t("card.programs", { count: programs.length })}</span>
      </span>
      <span className="flex shrink-0 items-center gap-1.5">
        {distance !== null ? (
          <span className="text-end text-[14px] font-semibold tabular-nums text-slate-900">{formatDistance(distance)}</span>
        ) : null}
        <ChevronRight
          className={cn("size-4 text-slate-300 transition-[transform,color] rtl:rotate-180", hovered ? "translate-x-0.5 text-slate-500 rtl:-translate-x-0.5" : "group-hover:text-slate-400")}
          aria-hidden
        />
      </span>
    </button>
  );
}

export function ListSkeleton() {
  return (
    <ul className="divide-y divide-slate-100" aria-hidden>
      {Array.from({ length: 6 }, (_, index) => (
        <li key={index} className="flex items-center gap-3.5 px-5 py-3.5">
          <span className="ul-skeleton size-11 rounded-full" />
          <span className="flex-1 space-y-2">
            <span className="ul-skeleton block h-3.5 w-3/4 rounded" />
            <span className="ul-skeleton block h-3 w-1/2 rounded" />
          </span>
          <span className="ul-skeleton h-3.5 w-10 rounded" />
        </li>
      ))}
    </ul>
  );
}

export function EmptyState({
  title,
  text,
  action,
}: {
  title: string;
  text?: string | null;
  action?: React.ReactNode;
}) {
  return (
    <div className="ul-rise px-6 py-12 text-center">
      <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <MapPinOff className="size-5" aria-hidden />
      </span>
      <p className="mt-4 text-[15px] font-semibold text-slate-900">{title}</p>
      {text ? <p className="mx-auto mt-1 max-w-[280px] text-[13px] leading-5 text-slate-500">{text}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function UnmappedList({ rows }: { rows: ResultRow[] }) {
  const t = useTranslations("Nearby");
  const [open, setOpen] = useState(false);
  if (!rows.length) return null;
  return (
    <div className="border-t border-slate-100 px-5 py-4">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 text-start text-[13px] text-slate-500 transition-colors hover:text-slate-800"
      >
        <span>{t("unmapped.title", { count: rows.length })}</span>
        <ChevronDown className={cn("size-4 shrink-0 transition-transform", open && "rotate-180")} aria-hidden />
      </button>
      {open ? (
        <div className="ul-rise">
          <p className="mt-2 text-xs text-slate-400">{t("unmapped.hint")}</p>
          <ul className="mt-2 space-y-0.5">
            {rows.map((row) => (
              <li key={row.university.slug}>
                <Link
                  href={`/universities/${row.university.slug}`}
                  className="-mx-2 flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-[13px] text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
                >
                  <UniversityLogo name={row.university.name} logoUrl={row.university.logoUrl} className="size-6 border-slate-200 p-0.5" />
                  <span className="min-w-0 flex-1 truncate">{row.university.name}</span>
                  <span className="shrink-0 text-xs text-slate-400">{row.university.city}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

/* ---------------------------------------------------------------- detail */

export function UniversityDetail({
  row,
  nearest,
  formatDistance,
  onBack,
  onToast,
}: {
  row: ResultRow;
  nearest: boolean;
  formatDistance: (km: number) => string;
  onBack: () => void;
  onToast: (message: string) => void;
}) {
  const t = useTranslations("Nearby");
  const locale = useLocale();
  const { university, programs, distance } = row;
  const backRef = useRef<HTMLButtonElement>(null);

  // Keyboard users land on "Back"; Escape goes back too.
  useEffect(() => {
    backRef.current?.focus({ preventScroll: true });
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !document.querySelector("dialog[open]")) onBack();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onBack]);

  const byFaculty = useMemo(() => {
    const groups = new Map<string, NearbyProgram[]>();
    for (const program of programs) {
      const key = program.faculty ?? t("card.otherPrograms");
      groups.set(key, [...(groups.get(key) ?? []), program]);
    }
    return [...groups.entries()];
  }, [programs, t]);
  const facultyCount = new Set(university.programs.map((program) => program.faculty).filter(Boolean)).size;

  const directions = university.lat !== null ? `https://www.google.com/maps/dir/?api=1&destination=${university.lat},${university.lng}` : null;

  async function share() {
    const url = `${window.location.origin}/${locale}/universities/${university.slug}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: university.name, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      onToast(t("detail.copied"));
    } catch {
      // Cancelled share sheet: nothing to do.
    }
  }

  return (
    <div className="ul-slide">
      <div className="relative h-36 overflow-hidden bg-slate-100">
        {university.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- covers come from admin-entered hosts.
          <img src={university.coverUrl} alt="" className="size-full object-cover" />
        ) : (
          <div className="size-full bg-[linear-gradient(135deg,#E8EFFB,#F4F7FC)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/10" />
        <button
          ref={backRef}
          type="button"
          onClick={onBack}
          className="absolute start-3 top-3 inline-flex h-8 items-center gap-1.5 rounded-full bg-white/95 ps-2 pe-3 text-[13px] font-medium text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.18)] backdrop-blur transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-[#1E6DEB]"
        >
          <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden />
          {t("detail.back")}
        </button>
      </div>

      <div className="relative px-5">
        <div className="-mt-8 flex items-end justify-between gap-3">
          <UniversityLogo
            name={university.name}
            logoUrl={university.logoUrl}
            className="size-16 rounded-2xl border-0 bg-white p-1.5 shadow-[0_4px_14px_-4px_rgba(15,23,42,0.3)] ring-4 ring-white [&_img]:rounded-xl"
          />
          {nearest ? (
            <span className="mb-1 inline-flex items-center gap-1 rounded-full bg-[#FFF1F0] px-2 py-0.5 text-xs font-semibold text-[#D92D20]">
              <Navigation className="size-3" aria-hidden />
              {t("card.nearest")}
            </span>
          ) : null}
        </div>
        <h2 className="mt-3 text-lg font-semibold leading-snug tracking-tight text-slate-900">
          {university.name}
          {university.acronym ? <span className="ms-2 align-middle text-xs font-medium text-slate-400" dir="ltr">{university.acronym}</span> : null}
        </h2>
        <p className="mt-0.5 text-[13px] text-slate-500">
          {[university.city, university.governorate].filter(Boolean).join(", ")} · {t(`types.${university.type}`)}
        </p>

        <dl className="mt-4 grid grid-cols-3 divide-x divide-slate-100 rounded-xl border border-slate-200 rtl:divide-x-reverse">
          <Stat label={t("detail.distance")} value={distance !== null ? formatDistance(distance) : "-"} />
          <Stat label={t("detail.programs")} value={String(programs.length)} />
          <Stat label={t("detail.faculties")} value={String(facultyCount)} />
        </dl>

        <div className="mt-4 flex gap-2">
          {directions ? (
            <a
              href={directions}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-[#1E6DEB] text-sm font-semibold text-white shadow-[0_1px_2px_rgba(15,23,42,0.1)] transition-colors hover:bg-[#1857C4]"
            >
              <Navigation className="size-4" aria-hidden />
              {t("card.directions")}
            </a>
          ) : null}
          <Link
            href={`/universities/${university.slug}`}
            className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-800 transition-colors hover:border-slate-300 hover:bg-slate-50"
          >
            {t("card.view")}
            <ArrowUpRight className="size-4 text-slate-400 rtl:-scale-x-100" aria-hidden />
          </Link>
          <button
            type="button"
            onClick={share}
            title={t("detail.share")}
            aria-label={t("detail.share")}
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
          >
            {typeof navigator !== "undefined" && "share" in navigator ? <Share2 className="size-4" aria-hidden /> : <Link2 className="size-4" aria-hidden />}
          </button>
        </div>
        {distance !== null ? <p className="mt-2 text-[11.5px] text-slate-400">{t("card.straightLine")}</p> : null}
      </div>

      <section className="mt-5 border-t border-slate-100 pb-6">
        <h3 className="flex items-baseline justify-between px-5 pb-2 pt-4 text-[13px] font-semibold text-slate-900">
          {t("detail.matching")}
          <span className="text-xs font-normal text-slate-400">{t("card.programs", { count: programs.length })}</span>
        </h3>
        {byFaculty.length ? (
          byFaculty.map(([faculty, list], index) => (
            <FacultyGroup key={faculty} faculty={faculty} programs={list} universitySlug={university.slug} defaultOpen={index === 0} locale={locale} />
          ))
        ) : (
          <p className="px-5 text-[13px] text-slate-400">{t("card.noPrograms")}</p>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-3 py-2.5 text-center">
      <dt className="text-[11px] text-slate-500">{label}</dt>
      <dd className="mt-0.5 text-[15px] font-semibold tabular-nums text-slate-900">{value}</dd>
    </div>
  );
}

function FacultyGroup({
  faculty,
  programs,
  universitySlug,
  defaultOpen,
  locale,
}: {
  faculty: string;
  programs: NearbyProgram[];
  universitySlug: string;
  defaultOpen: boolean;
  locale: string;
}) {
  const t = useTranslations("Nearby");
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-slate-100 first:border-t-0">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-5 py-2.5 text-start transition-colors hover:bg-slate-50"
      >
        <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-slate-800">{faculty}</span>
        <span className="shrink-0 rounded-full bg-slate-100 px-1.5 text-[11px] font-medium tabular-nums text-slate-500">{programs.length}</span>
        <ChevronDown className={cn("size-4 shrink-0 text-slate-400 transition-transform duration-200", open && "rotate-180")} aria-hidden />
      </button>
      <div className={cn("grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
        <ul className="min-h-0 overflow-hidden">
          {programs.map((program) => {
            const years = yearsFromMonths(program.durationMonths);
            const meta = [
              t(`levels.${program.level}`),
              program.durationLabel ?? (years ? t("detail.years", { count: years }) : null),
              program.fee !== null
                ? `${formatMoney(locale, program.fee, program.currency)}${t(`detail.per.${program.feePeriod}`)}`
                : null,
            ].filter(Boolean);
            return (
              <li key={program.slug}>
                <Link
                  href={`/universities/${universitySlug}/programs/${program.slug}`}
                  className="group flex items-center gap-3 py-2 pe-5 ps-8 transition-colors hover:bg-slate-50"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] text-slate-800 group-hover:text-[#1E6DEB]">{program.name}</span>
                    <span className="block truncate text-[11.5px] text-slate-400">{meta.join(" · ")}</span>
                  </span>
                  <ChevronRight className="size-3.5 shrink-0 text-slate-300 transition-colors group-hover:text-[#1E6DEB] rtl:rotate-180" aria-hidden />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
