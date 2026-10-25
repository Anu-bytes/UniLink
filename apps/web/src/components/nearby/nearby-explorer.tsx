"use client";

import {
  ArrowUpRight,
  Gift,
  Lock,
  Building2,
  ChevronDown,
  GraduationCap,
  List,
  LocateFixed,
  Map as MapIcon,
  MapPin,
  MapPinOff,
  MousePointerClick,
  Navigation,
  Radar,
  SlidersHorizontal,
  X,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { NearbyLauncher } from "@/components/nearby/nearby-launcher";
import type { MapPoint, MapUniversity } from "@/components/nearby/nearby-map";
import { UniversityLogo } from "@/components/university-logo";
import { useCountUp } from "@/hooks/use-count-up";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Link } from "@/i18n/navigation";
import type { NearbyCatalog, NearbyProgram, NearbyUniversity } from "@/lib/nearby";
import { nearbyHref, type NearbyFilters } from "@/lib/nearby-filters";
import { cn } from "@/lib/utils";

// Leaflet touches `window` on import, so the map only ever loads in the browser.
const NearbyMap = dynamic(() => import("@/components/nearby/nearby-map").then((m) => m.NearbyMap), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-[#EEF1F5]" />,
});

const RADII = [10, 25, 50, 100] as const;

type LocateStatus = "idle" | "locating" | "denied" | "unavailable";

type Row = {
  university: NearbyUniversity;
  programs: NearbyProgram[];
  /** Straight-line kilometres from the starting point; null without one. */
  distance: number | null;
};

/** Great-circle distance in km. */
function haversine(a: MapPoint, b: MapPoint) {
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLng = (b.lng - a.lng) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

export function NearbyExplorer({
  catalog,
  initialFilters,
  guest = false,
}: {
  catalog: NearbyCatalog;
  initialFilters: NearbyFilters;
  /** Not signed in: this is their one free search, so the choices are fixed. */
  guest?: boolean;
}) {
  const t = useTranslations("Nearby");
  const locale = useLocale();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const [filters, setFilters] = useState(initialFilters);
  const [origin, setOrigin] = useState<MapPoint | null>(null);
  const [status, setStatus] = useState<LocateStatus>("idle");
  const [picking, setPicking] = useState(initialFilters.start === "pick");
  const [picked, setSelected] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [intro, setIntro] = useState<string | null>(null);
  const [focusKey, setFocusKey] = useState("initial");
  // Fresh keys for "re-frame the map" and "show the summary again".
  const keySeq = useRef(0);
  const nextKey = (prefix: string) => `${prefix}-${++keySeq.current}`;
  const [sheet, setSheet] = useState<"none" | "list" | "detail">("none");
  const [locked, setLocked] = useState(false);

  const fieldLabel = catalog.fields.find((field) => field.value === filters.field)?.label ?? null;

  const formatDistance = useCallback(
    (km: number) => {
      const number = (value: number, digits: number) =>
        new Intl.NumberFormat(locale, { maximumFractionDigits: digits, numberingSystem: "latn" }).format(value);
      if (km < 1) return t("m", { value: number(Math.round((km * 1000) / 10) * 10, 0) });
      return t("km", { value: number(km, km < 10 ? 1 : 0) });
    },
    [locale, t],
  );

  // Universities matching the filters, each with the programs that matched.
  const matches = useMemo(() => {
    const rows: Row[] = [];
    for (const university of catalog.universities) {
      if (filters.type && university.type !== filters.type) continue;
      const programs = university.programs.filter(
        (program) =>
          (!filters.field || program.field === filters.field) && (!filters.level || program.level === filters.level),
      );
      if ((filters.field || filters.level) && programs.length === 0) continue;
      const distance =
        origin && university.lat !== null && university.lng !== null
          ? haversine(origin, { lat: university.lat, lng: university.lng })
          : null;
      rows.push({ university, programs, distance });
    }
    return rows;
  }, [catalog.universities, filters.type, filters.field, filters.level, origin]);

  const mapped = useMemo(() => {
    const rows = matches.filter((row) => row.university.lat !== null);
    return origin
      ? rows.sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0))
      : rows.sort((a, b) => a.university.name.localeCompare(b.university.name, locale));
  }, [matches, origin, locale]);

  const shown = useMemo(
    () => (origin && filters.radius ? mapped.filter((row) => (row.distance ?? Infinity) <= filters.radius!) : mapped),
    [mapped, origin, filters.radius],
  );
  const nearestOutside = origin && filters.radius ? mapped.find((row) => (row.distance ?? 0) > filters.radius!) : undefined;
  const unmapped = useMemo(() => matches.filter((row) => row.university.lat === null), [matches]);

  const mapUniversities = useMemo<MapUniversity[]>(
    () =>
      shown.map((row, index) => ({
        slug: row.university.slug,
        name: row.university.name,
        logoUrl: row.university.logoUrl,
        lat: row.university.lat!,
        lng: row.university.lng!,
        rank: origin ? index + 1 : null,
        distanceLabel: row.distance !== null ? formatDistance(row.distance) : null,
      })),
    [shown, origin, formatDistance],
  );

  // A selection the filters removed counts as no selection.
  const selectedRow = shown.find((row) => row.university.slug === picked) ?? null;
  const selected = selectedRow ? picked : null;

  const locate = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setStatus("unavailable");
      setPicking(true);
      return;
    }
    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setStatus("idle");
        setPicking(false);
        setOrigin({ lat: position.coords.latitude, lng: position.coords.longitude });
        const key = `gps-${position.timestamp}`;
        setFocusKey(key);
        setIntro(key);
      },
      (error) => {
        setStatus(error.code === error.PERMISSION_DENIED ? "denied" : "unavailable");
        setPicking(true);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 },
    );
  }, []);

  // Ask for the location once, when the visitor chose "Use my location".
  const asked = useRef(false);
  useEffect(() => {
    if (asked.current || initialFilters.start !== "locate") return;
    asked.current = true;
    locate();
  }, [initialFilters.start, locate]);

  const onOriginChange = useCallback(
    (point: MapPoint) => {
      // A pick (not a drag of the dot) frames the results and shows the summary.
      if (!origin || picking) {
        const key = `pick-${point.lat}-${point.lng}`;
        setFocusKey(key);
        setIntro(key);
      }
      setOrigin(point);
      setPicking(false);
      setStatus("idle");
    },
    [origin, picking],
  );

  function openEdit() {
    if (guest) setLocked(true);
    else setDialogOpen(true);
  }

  function applyFilters(next: NearbyFilters) {
    setFilters(next);
    setSelected(null);
    const key = nextKey("filters");
    setFocusKey(key);
    if (origin) setIntro(key);
    // Keep the URL shareable; the visitor's location is never part of it.
    const href = nearbyHref({ ...next, start: "locate" });
    window.history.replaceState(null, "", `${window.location.pathname}${href.slice("/nearby".length)}`);
  }

  function select(slug: string | null) {
    setSelected(slug);
    if (slug && !isDesktop) setSheet((current) => (current === "list" ? "detail" : current));
  }

  // The summary card hides itself after a few seconds.
  useEffect(() => {
    if (!intro) return;
    const timer = window.setTimeout(() => setIntro(null), 7000);
    return () => window.clearTimeout(timer);
  }, [intro]);

  const summary = t("summary", {
    count: shown.length,
    hasField: fieldLabel ? "yes" : "no",
    field: fieldLabel ?? "",
    hasRadius: filters.radius ? "yes" : "no",
    radius: filters.radius ?? 0,
  });
  const nearest = origin ? shown[0] : undefined;

  const filterChips = [
    fieldLabel,
    filters.level ? t(`levels.${filters.level}`) : null,
    filters.type ? t(`types.${filters.type}`) : null,
  ].filter((chip): chip is string => Boolean(chip));

  const header = (
    <div className="border-b border-slate-100 px-5 pb-4 pt-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#1E6DEB]">{t("eyebrow")}</p>
          <h1 className="mt-1 text-[19px] font-extrabold leading-snug tracking-tight text-[#16233F]">
            {origin ? summary : t("noOrigin.title")}
          </h1>
        </div>
        <button
          type="button"
          onClick={openEdit}
          className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-slate-200 px-3 text-[13px] font-bold text-[#1F2A44] transition-colors hover:border-[#1E6DEB] hover:text-[#1E6DEB] focus-visible:outline-2 focus-visible:outline-[#1E6DEB]"
        >
          <SlidersHorizontal className="size-4" aria-hidden />
          {t("panel.edit")}
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {filterChips.length ? (
          filterChips.map((chip) => (
            <span key={chip} className="rounded-full bg-[#EEF4FF] px-2.5 py-1 text-xs font-semibold text-[#1E4FB8]">
              {chip}
            </span>
          ))
        ) : (
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-[#5a6072]">{t("panel.allUniversities")}</span>
        )}
      </div>

      {guest ? (
        <p className="mt-3 flex items-center gap-1.5 rounded-xl bg-[#EEF4FF] px-3 py-2 text-xs font-semibold text-[#1E4FB8]">
          <Gift className="size-3.5 shrink-0" aria-hidden />
          <span className="min-w-0 flex-1">{t("access.guestActive")}</span>
          <Link href="/signup" className="shrink-0 font-bold underline underline-offset-2 hover:no-underline">
            {t("access.signup")}
          </Link>
        </p>
      ) : null}

      <div className="mt-4 grid grid-cols-5 gap-1 rounded-xl bg-[#F1F5FB] p-1" role="group" aria-label={t("launcher.radiusLabel")}>
        {[null, ...RADII].map((radius) => (
          <button
            key={radius ?? "any"}
            type="button"
            aria-pressed={filters.radius === radius}
            onClick={() => (guest ? setLocked(true) : applyFilters({ ...filters, radius }))}
            className={cn(
              "h-8 rounded-lg text-xs font-bold transition-all focus-visible:outline-2 focus-visible:outline-[#1E6DEB]",
              filters.radius === radius ? "bg-white text-[#1E6DEB] shadow-[0_4px_10px_-6px_rgba(30,109,235,0.7)]" : "text-[#5a6072] hover:text-[#16233F]",
            )}
          >
            {radius === null ? t("launcher.anyDistance") : t("km", { value: radius })}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <button
          type="button"
          onClick={locate}
          disabled={status === "locating"}
          className="inline-flex items-center gap-1.5 font-bold text-[#1E6DEB] transition-colors hover:text-[#1859c4] disabled:opacity-60"
        >
          <LocateFixed className={cn("size-3.5", status === "locating" && "animate-spin")} aria-hidden />
          {status === "locating" ? t("status.locating") : t("panel.useLocation")}
        </button>
        <span className="text-slate-300" aria-hidden>|</span>
        <button
          type="button"
          onClick={() => {
            setPicking(true);
            setSelected(null);
            if (!isDesktop) setSheet("none");
          }}
          className={cn("inline-flex items-center gap-1.5 font-bold transition-colors", picking ? "text-[#F82C1F]" : "text-[#5a6072] hover:text-[#16233F]")}
        >
          <MousePointerClick className="size-3.5" aria-hidden />
          {origin ? t("panel.movePoint") : t("panel.pickPoint")}
        </button>
      </div>
    </div>
  );

  const list = (
    <div className="space-y-2.5 p-3">
      {!origin && !picking && status !== "locating" ? (
        <p className="rounded-xl bg-[#FFF7E8] px-3 py-2.5 text-xs font-medium text-[#8A5A00]">{t("noOrigin.hint")}</p>
      ) : null}

      {shown.map((row, index) => (
        <ResultCard
          key={row.university.slug}
          row={row}
          rank={origin ? index + 1 : null}
          selected={row.university.slug === selected}
          onSelect={() => select(row.university.slug === selected ? null : row.university.slug)}
          formatDistance={formatDistance}
          expandable
        />
      ))}

      {origin && shown.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-center">
          <MapPinOff className="mx-auto size-7 text-[#98A0B4]" aria-hidden />
          <p className="mt-2 text-sm font-bold text-[#16233F]">{t("empty.title")}</p>
          {nearestOutside ? (
            <p className="mt-1 text-xs text-[#5a6072]">
              {t("empty.nearestOutside", { name: nearestOutside.university.name, distance: formatDistance(nearestOutside.distance ?? 0) })}
            </p>
          ) : null}
          {filters.radius ? (
            <button
              type="button"
              onClick={() => (guest ? setLocked(true) : applyFilters({ ...filters, radius: null }))}
              className="mt-3 inline-flex h-9 items-center rounded-full bg-[#1E6DEB] px-4 text-xs font-bold text-white transition-colors hover:bg-[#1859c4]"
            >
              {t("empty.widen")}
            </button>
          ) : null}
        </div>
      ) : null}

      {unmapped.length ? (
        <details className="group rounded-2xl border border-slate-100 bg-[#FAFBFE] px-4 py-3">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-xs font-bold text-[#5a6072]">
            <span className="inline-flex items-center gap-1.5">
              <MapPinOff className="size-3.5" aria-hidden />
              {t("unmapped.title", { count: unmapped.length })}
            </span>
            <ChevronDown className="size-4 transition-transform group-open:rotate-180" aria-hidden />
          </summary>
          <p className="mt-2 text-xs text-[#98A0B4]">{t("unmapped.hint")}</p>
          <ul className="mt-2 space-y-1">
            {unmapped.map((row) => (
              <li key={row.university.slug}>
                <Link
                  href={`/universities/${row.university.slug}`}
                  className="flex items-center gap-2 rounded-lg px-1 py-1 text-[13px] font-semibold text-[#1F2A44] hover:bg-white hover:text-[#1E6DEB]"
                >
                  <UniversityLogo name={row.university.name} logoUrl={row.university.logoUrl} className="size-6" />
                  <span className="min-w-0 flex-1 truncate">{row.university.name}</span>
                  <span className="shrink-0 text-[11px] font-medium text-[#98A0B4]">{row.university.city}</span>
                </Link>
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  );

  return (
    <div className="relative h-[calc(100dvh-4rem-4.25rem-env(safe-area-inset-bottom))] overflow-hidden bg-white md:h-[calc(100dvh-5rem-4.25rem-env(safe-area-inset-bottom))] lg:h-[calc(100dvh-5rem)] lg:min-h-[600px]">
      <div className="flex h-full">
        {isDesktop ? (
          <aside className="flex w-[410px] shrink-0 flex-col border-e border-slate-200 bg-white">
            {header}
            <div className="min-h-0 flex-1 overflow-y-auto">{list}</div>
          </aside>
        ) : null}

        <div className="relative min-w-0 flex-1">
          <NearbyMap
            universities={mapUniversities}
            origin={origin}
            radiusKm={filters.radius}
            selected={selected}
            picking={picking}
            focusKey={focusKey}
            onSelect={select}
            onOriginChange={onOriginChange}
          />

          {/* Picking / locating banners over the map. */}
          {picking || status === "locating" ? (
            <div className="pointer-events-none absolute inset-x-3 top-3 z-[600] flex justify-center lg:end-16">
              <div className="ul-tray-in pointer-events-auto flex max-w-md items-center gap-3 rounded-2xl bg-[#16233F] px-4 py-3 text-white shadow-[0_18px_40px_-18px_rgba(15,23,42,0.8)]">
                {status === "locating" ? (
                  <Radar className="size-5 shrink-0 animate-spin text-[#7FB0FF] [animation-duration:2s]" aria-hidden />
                ) : (
                  <MousePointerClick className="size-5 shrink-0 text-[#FF8A80]" aria-hidden />
                )}
                <p className="text-[13px] font-semibold leading-snug" role="status">
                  {status === "locating"
                    ? t("status.locating")
                    : status === "denied"
                      ? t("status.denied")
                      : status === "unavailable"
                        ? t("status.unavailable")
                        : t("status.pick")}
                </p>
                {picking && origin ? (
                  <button
                    type="button"
                    onClick={() => setPicking(false)}
                    className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                  >
                    <X className="size-4" aria-hidden />
                    <span className="sr-only">{t("launcher.close")}</span>
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}

          {status === "locating" ? <LocatingOverlay label={t("status.locating")} /> : null}

          {locked ? <LockedCard onClose={() => setLocked(false)} /> : null}

          {intro && origin ? (
            <IntroCard
              key={intro}
              count={shown.length}
              summary={summary}
              nearest={nearest ? t("nearest", { name: nearest.university.name, distance: formatDistance(nearest.distance ?? 0) }) : null}
              onClose={() => setIntro(null)}
              onNearest={nearest ? () => { setIntro(null); select(nearest.university.slug); } : undefined}
              closeLabel={t("intro.explore")}
              nearestLabel={t("intro.showNearest")}
            />
          ) : null}

          {/* Mobile: a summary bar at the top and the results along the bottom. */}
          {!isDesktop ? (
            <>
              {!picking && status !== "locating" ? (
                <div className="absolute inset-x-3 top-3 z-[550] flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSheet("list")}
                    className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl bg-white/95 px-3.5 py-2.5 text-start shadow-[0_10px_30px_-14px_rgba(15,23,42,0.5)] ring-1 ring-black/5"
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#1E6DEB] text-white">
                      <List className="size-4" aria-hidden />
                    </span>
                    <span className="min-w-0 truncate text-[13px] font-bold text-[#16233F]">{origin ? summary : t("noOrigin.title")}</span>
                  </button>
                  <button
                    type="button"
                    onClick={openEdit}
                    className="flex size-[52px] shrink-0 items-center justify-center rounded-2xl bg-white/95 text-[#1F2A44] shadow-[0_10px_30px_-14px_rgba(15,23,42,0.5)] ring-1 ring-black/5"
                  >
                    <SlidersHorizontal className="size-5" aria-hidden />
                    <span className="sr-only">{t("panel.edit")}</span>
                  </button>
                </div>
              ) : null}

              {shown.length ? (
                <MobileCarousel
                  rows={shown}
                  ranked={Boolean(origin)}
                  selected={selected}
                  onSelect={(slug) => setSelected(slug)}
                  onDetails={(slug) => {
                    setSelected(slug);
                    setSheet("detail");
                  }}
                  formatDistance={formatDistance}
                  detailsLabel={t("card.details")}
                />
              ) : null}

              {sheet !== "none" ? (
                <MobileSheet onClose={() => setSheet("none")} closeLabel={t("launcher.close")} mapLabel={t("panel.backToMap")}>
                  {sheet === "detail" && selectedRow ? (
                    <div className="p-3">
                      <ResultCard
                        row={selectedRow}
                        rank={origin ? shown.indexOf(selectedRow) + 1 : null}
                        selected
                        onSelect={() => setSheet("none")}
                        formatDistance={formatDistance}
                        expandable={false}
                      />
                    </div>
                  ) : (
                    <>
                      {header}
                      {list}
                    </>
                  )}
                </MobileSheet>
              ) : null}
            </>
          ) : null}
        </div>
      </div>

      <NearbyLauncher
        fields={catalog.fields}
        levels={catalog.levels}
        initial={filters}
        variant="none"
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onApply={(next) => {
          applyFilters(next);
          if (next.start === "pick") {
            setPicking(true);
            if (!isDesktop) setSheet("none");
          } else if (!origin) {
            locate();
          }
        }}
      />
    </div>
  );
}

function ResultCard({
  row,
  rank,
  selected,
  onSelect,
  formatDistance,
  expandable,
}: {
  row: Row;
  rank: number | null;
  selected: boolean;
  onSelect: () => void;
  formatDistance: (km: number) => string;
  expandable: boolean;
}) {
  const t = useTranslations("Nearby");
  const ref = useRef<HTMLDivElement>(null);
  const { university, programs, distance } = row;

  // Bring the card into view when its pin is clicked on the map.
  useEffect(() => {
    if (selected && expandable) ref.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [selected, expandable]);

  const byFaculty = useMemo(() => {
    const groups = new Map<string, NearbyProgram[]>();
    for (const program of programs) {
      const key = program.faculty ?? t("card.otherPrograms");
      groups.set(key, [...(groups.get(key) ?? []), program]);
    }
    return [...groups.entries()];
  }, [programs, t]);

  const open = selected;
  const directions = university.lat !== null ? `https://www.google.com/maps/dir/?api=1&destination=${university.lat},${university.lng}` : null;

  return (
    <div
      ref={ref}
      className={cn(
        "overflow-hidden rounded-2xl border bg-white transition-all",
        selected ? "border-[#1E6DEB] shadow-[0_14px_32px_-18px_rgba(30,109,235,0.8)] ring-2 ring-[#1E6DEB]/15" : "border-slate-200 hover:border-[#1E6DEB]/40 hover:shadow-[0_10px_24px_-18px_rgba(15,23,42,0.5)]",
      )}
    >
      <button type="button" onClick={onSelect} aria-expanded={expandable ? open : undefined} className="flex w-full items-center gap-3 p-3 text-start">
        <span className="relative shrink-0">
          <UniversityLogo name={university.name} logoUrl={university.logoUrl} className="size-12 ring-1 ring-slate-200" />
          {rank !== null ? (
            <span
              className={cn(
                "absolute -end-1 -top-1 flex size-5 items-center justify-center rounded-full text-[10px] font-extrabold text-white ring-2 ring-white",
                rank === 1 ? "bg-[#F82C1F]" : "bg-[#1E6DEB]",
              )}
            >
              {rank}
            </span>
          ) : null}
        </span>
        <span className="min-w-0 flex-1">
          {rank === 1 ? (
            <span className="mb-0.5 inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-[#F82C1F]">
              <Navigation className="size-3" aria-hidden />
              {t("card.nearest")}
            </span>
          ) : null}
          <span className="block truncate text-[14px] font-bold text-[#16233F]">
            {university.name}
            {university.acronym ? (
              <span dir="ltr" className="ms-1.5 rounded bg-[#1E6DEB]/10 px-1.5 py-0.5 align-middle text-[10px] font-extrabold tracking-wider text-[#1E6DEB]">
                {university.acronym}
              </span>
            ) : null}
          </span>
          <span className="mt-0.5 flex items-center gap-1 truncate text-xs text-[#5a6072]">
            <MapPin className="size-3 shrink-0 text-[#1E6DEB]" aria-hidden />
            {university.city}
            {university.governorate ? `, ${university.governorate}` : ""}
          </span>
          <span className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[11px] font-semibold">
            <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[#475569]">{t(`types.${university.type}`)}</span>
            <span className="inline-flex items-center gap-1 rounded-md bg-[#EEF4FF] px-1.5 py-0.5 text-[#1E4FB8]">
              <GraduationCap className="size-3" aria-hidden />
              {t("card.programs", { count: programs.length })}
            </span>
          </span>
        </span>
        {distance !== null ? (
          <span className="shrink-0 text-end">
            <span className="block text-[15px] font-extrabold tabular-nums text-[#16233F]">{formatDistance(distance)}</span>
            <span className="block text-[10px] font-medium text-[#98A0B4]">{t("card.away")}</span>
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="ul-tray-in border-t border-slate-100 bg-[#FAFBFE] px-3 pb-3 pt-3">
          {byFaculty.length ? (
            <div className="max-h-64 space-y-3 overflow-y-auto pe-1">
              {byFaculty.map(([faculty, list]) => (
                <div key={faculty}>
                  <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-[#5a6072]">
                    <Building2 className="size-3.5 text-[#1E6DEB]" aria-hidden />
                    {faculty}
                  </p>
                  <ul className="mt-1.5 space-y-1">
                    {list.map((program) => (
                      <li key={program.slug}>
                        <Link
                          href={`/universities/${university.slug}/programs/${program.slug}`}
                          className="group flex items-center justify-between gap-2 rounded-lg bg-white px-2.5 py-1.5 text-[13px] font-medium text-[#1F2A44] ring-1 ring-slate-100 transition-colors hover:text-[#1E6DEB] hover:ring-[#1E6DEB]/30"
                        >
                          <span className="min-w-0 truncate">{program.name}</span>
                          <span className="shrink-0 text-[10px] font-semibold text-[#98A0B4]">{t(`levels.${program.level}`)}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#98A0B4]">{t("card.noPrograms")}</p>
          )}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link
              href={`/universities/${university.slug}`}
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-[#1E6DEB] text-[13px] font-bold text-white transition-colors hover:bg-[#1859c4]"
            >
              {t("card.view")}
              <ArrowUpRight className="size-4 rtl:-scale-x-100" aria-hidden />
            </Link>
            {directions ? (
              <a
                href={directions}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white text-[13px] font-bold text-[#1F2A44] transition-colors hover:border-[#F82C1F] hover:text-[#F82C1F]"
              >
                <Navigation className="size-4" aria-hidden />
                {t("card.directions")}
              </a>
            ) : null}
          </div>
          {distance !== null ? <p className="mt-2 text-center text-[10.5px] text-[#98A0B4]">{t("card.straightLine")}</p> : null}
        </div>
      ) : null}
    </div>
  );
}

function IntroCard({
  count,
  summary,
  nearest,
  onClose,
  onNearest,
  closeLabel,
  nearestLabel,
}: {
  count: number;
  summary: string;
  nearest: string | null;
  onClose: () => void;
  onNearest?: () => void;
  closeLabel: string;
  nearestLabel: string;
}) {
  const value = useCountUp(count, true, 900);
  return (
    <div className="pointer-events-none absolute inset-0 z-[700] flex items-center justify-center p-4">
      <div className="ul-intro pointer-events-auto relative w-full max-w-sm overflow-hidden rounded-3xl bg-white p-6 text-center shadow-[0_40px_80px_-30px_rgba(15,23,42,0.65)] ring-1 ring-black/5">
        <div className="pointer-events-none absolute -top-24 start-1/2 size-48 -translate-x-1/2 rounded-full bg-[#1E6DEB]/10 rtl:translate-x-1/2" aria-hidden />
        <div className="relative mx-auto flex size-20 items-center justify-center">
          <span className="ul-radar absolute inset-0 rounded-full border-2 border-[#1E6DEB]/40" aria-hidden />
          <span className="ul-radar absolute inset-0 rounded-full border-2 border-[#1E6DEB]/40 [animation-delay:0.8s]" aria-hidden />
          <span className="relative flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-[#1E6DEB] to-[#3B86F7] text-[26px] font-extrabold tabular-nums text-white shadow-[0_14px_30px_-12px_rgba(30,109,235,0.9)]">
            {Math.round(value)}
          </span>
        </div>
        <p className="relative mt-4 text-lg font-extrabold leading-snug text-[#16233F]" role="status">
          {summary}
        </p>
        {nearest ? <p className="relative mt-1.5 text-sm text-[#5a6072]">{nearest}</p> : null}
        <div className="relative mt-5 flex flex-col gap-2 sm:flex-row">
          {onNearest ? (
            <button
              type="button"
              onClick={onNearest}
              className="inline-flex h-11 flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#F82C1F] text-sm font-bold text-white transition-colors hover:bg-[#C81F15]"
            >
              <Navigation className="size-4" aria-hidden />
              {nearestLabel}
            </button>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 text-sm font-bold text-[#1F2A44] transition-colors hover:border-[#1E6DEB] hover:text-[#1E6DEB]"
          >
            <MapIcon className="size-4" aria-hidden />
            {closeLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function LockedCard({ onClose }: { onClose: () => void }) {
  const t = useTranslations("Nearby");
  return (
    <div className="absolute inset-0 z-[750] flex items-center justify-center bg-[#0B1220]/25 p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="nearby-locked-title"
        onClick={(event) => event.stopPropagation()}
        className="ul-intro relative w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-[0_40px_80px_-30px_rgba(15,23,42,0.65)] ring-1 ring-black/5"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute end-3 top-3 flex size-8 items-center justify-center rounded-full text-[#5a6072] hover:bg-slate-100"
        >
          <X className="size-4" aria-hidden />
          <span className="sr-only">{t("launcher.close")}</span>
        </button>
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#EEF4FF] text-[#1E6DEB]">
          <Lock className="size-6" aria-hidden />
        </span>
        <p id="nearby-locked-title" className="mt-4 text-lg font-extrabold text-[#16233F]">
          {t("locked.title")}
        </p>
        <p className="mt-1.5 text-sm text-[#5a6072]">{t("locked.text")}</p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Link
            href="/signup"
            className="inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-[#1E6DEB] text-sm font-bold text-white transition-colors hover:bg-[#1859c4]"
          >
            {t("gate.signup")}
          </Link>
          <Link
            href={`/login?callbackUrl=${encodeURIComponent(window.location.pathname + window.location.search)}`}
            className="inline-flex h-11 flex-1 items-center justify-center rounded-xl border border-slate-200 text-sm font-bold text-[#1F2A44] transition-colors hover:border-[#1E6DEB] hover:text-[#1E6DEB]"
          >
            {t("gate.login")}
          </Link>
        </div>
      </div>
    </div>
  );
}

function LocatingOverlay({ label }: { label: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-[650] flex items-center justify-center bg-white/40">
      <div className="relative flex size-40 items-center justify-center">
        <span className="ul-radar absolute inset-0 rounded-full border-2 border-[#1E6DEB]/50" aria-hidden />
        <span className="ul-radar absolute inset-0 rounded-full border-2 border-[#1E6DEB]/50 [animation-delay:0.7s]" aria-hidden />
        <span className="ul-radar absolute inset-0 rounded-full border-2 border-[#1E6DEB]/50 [animation-delay:1.4s]" aria-hidden />
        <span className="flex size-14 items-center justify-center rounded-full bg-[#1E6DEB] text-white shadow-[0_14px_30px_-10px_rgba(30,109,235,0.9)]">
          <LocateFixed className="size-6" aria-hidden />
        </span>
        <span className="sr-only">{label}</span>
      </div>
    </div>
  );
}

function MobileCarousel({
  rows,
  ranked,
  selected,
  onSelect,
  onDetails,
  formatDistance,
  detailsLabel,
}: {
  rows: Row[];
  ranked: boolean;
  selected: string | null;
  onSelect: (slug: string) => void;
  onDetails: (slug: string) => void;
  formatDistance: (km: number) => string;
  detailsLabel: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const fromCode = useRef(false);

  // A new order (new starting point or filters) starts again at the nearest.
  const order = rows.map((row) => row.university.slug).join(",");
  useEffect(() => {
    fromCode.current = true;
    scrollerRef.current?.scrollTo({ left: 0 });
    const timer = window.setTimeout(() => (fromCode.current = false), 600);
    return () => window.clearTimeout(timer);
  }, [order]);

  // A pin tapped on the map scrolls its card into the middle.
  useEffect(() => {
    if (!selected) return;
    const card = scrollerRef.current?.querySelector<HTMLElement>(`[data-slug="${CSS.escape(selected)}"]`);
    if (!card) return;
    fromCode.current = true;
    card.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    const timer = window.setTimeout(() => (fromCode.current = false), 600);
    return () => window.clearTimeout(timer);
  }, [selected]);

  // Swiping the cards selects the one that settles in the middle.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    let timer = 0;
    const onScroll = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (fromCode.current) return;
        const middle = scroller.getBoundingClientRect().left + scroller.clientWidth / 2;
        let best: HTMLElement | null = null;
        let bestGap = Infinity;
        for (const card of scroller.querySelectorAll<HTMLElement>("[data-slug]")) {
          const box = card.getBoundingClientRect();
          const gap = Math.abs(box.left + box.width / 2 - middle);
          if (gap < bestGap) {
            bestGap = gap;
            best = card;
          }
        }
        const slug = best?.dataset.slug;
        if (slug && slug !== selected) onSelect(slug);
      }, 140);
    };
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      window.clearTimeout(timer);
    };
  }, [selected, onSelect]);

  return (
    <div
      ref={scrollerRef}
      className="absolute inset-x-0 bottom-3 z-[550] flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-[7.5vw] pb-1 [overflow-anchor:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {rows.map((row, index) => {
        const active = row.university.slug === selected;
        return (
          <div
            key={row.university.slug}
            data-slug={row.university.slug}
            className={cn(
              "w-[85vw] max-w-sm shrink-0 snap-center rounded-2xl bg-white p-3 shadow-[0_14px_34px_-16px_rgba(15,23,42,0.55)] ring-1 transition-all",
              active ? "ring-2 ring-[#1E6DEB]" : "ring-black/5",
            )}
          >
            <button type="button" onClick={() => onSelect(row.university.slug)} className="flex w-full items-center gap-3 text-start">
              <span className="relative shrink-0">
                <UniversityLogo name={row.university.name} logoUrl={row.university.logoUrl} className="size-11 ring-1 ring-slate-200" />
                {ranked ? (
                  <span className={cn("absolute -end-1 -top-1 flex size-5 items-center justify-center rounded-full text-[10px] font-extrabold text-white ring-2 ring-white", index === 0 ? "bg-[#F82C1F]" : "bg-[#1E6DEB]")}>
                    {index + 1}
                  </span>
                ) : null}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-bold text-[#16233F]">{row.university.name}</span>
                <span className="mt-0.5 block truncate text-xs text-[#5a6072]">{row.university.city}</span>
              </span>
              {row.distance !== null ? (
                <span className="shrink-0 text-[15px] font-extrabold tabular-nums text-[#16233F]">{formatDistance(row.distance)}</span>
              ) : null}
            </button>
            <button
              type="button"
              onClick={() => onDetails(row.university.slug)}
              className="mt-2.5 inline-flex h-9 w-full items-center justify-center rounded-xl bg-[#EEF4FF] text-[13px] font-bold text-[#1E6DEB] transition-colors hover:bg-[#1E6DEB] hover:text-white"
            >
              {detailsLabel}
            </button>
          </div>
        );
      })}
    </div>
  );
}

function MobileSheet({
  children,
  onClose,
  closeLabel,
  mapLabel,
}: {
  children: React.ReactNode;
  onClose: () => void;
  closeLabel: string;
  mapLabel: string;
}) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="absolute inset-0 z-[800] flex flex-col justify-end bg-[#0B1220]/35" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
        className="ul-sheet-in flex max-h-[88%] flex-col overflow-hidden rounded-t-3xl bg-white shadow-[0_-20px_50px_-20px_rgba(15,23,42,0.5)]"
      >
        <div className="flex items-center justify-between px-4 pt-2">
          <span className="mx-auto h-1.5 w-10 rounded-full bg-slate-200" aria-hidden />
        </div>
        <div className="flex items-center justify-end gap-2 px-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 items-center gap-1.5 rounded-full bg-slate-100 px-3 text-xs font-bold text-[#1F2A44]"
          >
            <MapIcon className="size-3.5" aria-hidden />
            {mapLabel}
            <span className="sr-only">{closeLabel}</span>
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto pb-[env(safe-area-inset-bottom)]">{children}</div>
      </div>
    </div>
  );
}
