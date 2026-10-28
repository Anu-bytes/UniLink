"use client";

import { Lock, MapPin, X } from "lucide-react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";

import { useFormatDistance } from "@/components/nearby/nearby-controls";
import type { MapInsets, MapPoint, MapUniversity } from "@/components/nearby/nearby-map";
import {
  EmptyState,
  ListSkeleton,
  ResultList,
  ResultsHeader,
  UniversityDetail,
  UnmappedList,
  type ResultRow,
  type SortKey,
} from "@/components/nearby/nearby-panel";
import { NearbySheet, type SheetSnap } from "@/components/nearby/nearby-sheet";
import { NearbyToolbar, type OriginSource } from "@/components/nearby/nearby-toolbar";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Link } from "@/i18n/navigation";
import type { NearbyCatalog } from "@/lib/nearby";
import { NEARBY_RADIUS_MAX, nearbyHref, type NearbyFilters } from "@/lib/nearby-filters";
import { cn } from "@/lib/utils";

// Leaflet touches `window` on import, so the map only ever loads in the browser.
const NearbyMap = dynamic(() => import("@/components/nearby/nearby-map").then((m) => m.NearbyMap), {
  ssr: false,
  loading: () => <div className="ul-skeleton h-full w-full" />,
});

type LocateStatus = "idle" | "locating" | "denied" | "unavailable";
type Toast = { id: number; tone: "info" | "warn"; title: string; text?: string; spinner?: boolean; sticky?: boolean };

const subscribeNothing = () => () => {};

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
  const formatDistance = useFormatDistance();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  // False while server-rendering and hydrating, true after: the list waits
  // for the browser so its layout (desktop panel vs phone sheet) is right.
  const mounted = useSyncExternalStore(subscribeNothing, () => true, () => false);

  const [filters, setFilters] = useState(initialFilters);
  const [origin, setOrigin] = useState<MapPoint | null>(null);
  const [originSource, setOriginSource] = useState<OriginSource>(null);
  // "Use my location" starts out locating; the request goes out after mount.
  const [status, setStatus] = useState<LocateStatus>(initialFilters.start === "locate" ? "locating" : "idle");
  const [picking, setPicking] = useState(initialFilters.start === "pick");
  const [picked, setPicked] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [sortChoice, setSort] = useState<SortKey>("distance");
  const [focusKey, setFocusKey] = useState("initial");
  const [toast, setToast] = useState<Toast | null>(() =>
    initialFilters.start === "pick"
      ? { id: 0, tone: "info", title: t("status.pick"), sticky: true }
      : { id: 0, tone: "info", title: t("status.locating"), spinner: true, sticky: true },
  );
  const [locked, setLocked] = useState(false);
  const [snap, setSnap] = useState<SheetSnap>("peek");
  const [sheetCover, setSheetCover] = useState(112);
  const seq = useRef(0);
  const nextId = () => ++seq.current;

  const filtersRef = useRef(filters);
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  const fieldLabel = catalog.fields.find((field) => field.value === filters.field)?.label ?? null;
  const sort: SortKey = sortChoice === "distance" && !origin ? "name" : sortChoice;

  // Universities matching the filters, each with the programs that matched.
  const matches = useMemo(() => {
    const rows: ResultRow[] = [];
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

  const byDistance = useMemo(
    () => matches.filter((row) => row.university.lat !== null).sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0)),
    [matches],
  );
  const inRange = useMemo(
    () => (origin && filters.radius ? byDistance.filter((row) => (row.distance ?? Infinity) <= filters.radius!) : byDistance),
    [byDistance, origin, filters.radius],
  );
  const shown = useMemo(() => {
    if (sort === "distance") return inRange;
    const copy = [...inRange];
    if (sort === "name") copy.sort((a, b) => a.university.name.localeCompare(b.university.name));
    else copy.sort((a, b) => b.programs.length - a.programs.length);
    return copy;
  }, [inRange, sort]);
  const nearestSlug = origin ? (inRange[0]?.university.slug ?? null) : null;
  const nearestOutside = origin && filters.radius ? byDistance.find((row) => (row.distance ?? 0) > filters.radius!) : undefined;
  const unmapped = useMemo(() => matches.filter((row) => row.university.lat === null), [matches]);

  const mapUniversities = useMemo<MapUniversity[]>(
    () =>
      inRange.map((row) => ({
        slug: row.university.slug,
        name: row.university.name,
        logoUrl: row.university.logoUrl,
        lat: row.university.lat!,
        lng: row.university.lng!,
        nearest: row.university.slug === nearestSlug,
        distanceLabel: row.distance !== null ? formatDistance(row.distance) : null,
      })),
    [inRange, nearestSlug, formatDistance],
  );

  // A selection the filters removed counts as no selection.
  const selectedRow = inRange.find((row) => row.university.slug === picked) ?? null;
  const selected = selectedRow ? picked : null;

  const showToast = useCallback((next: Omit<Toast, "id">) => setToast({ ...next, id: nextId() }), []);
  useEffect(() => {
    if (!toast || toast.sticky) return;
    const timer = window.setTimeout(() => setToast((current) => (current?.id === toast.id ? null : current)), 3800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  // "We found N": worked out for the new state at the moment it is set.
  const announce = useCallback(
    (nextFilters: NearbyFilters, nextOrigin: MapPoint) => {
      const found = catalog.universities
        .filter((university) => {
          if (university.lat === null || university.lng === null) return false;
          if (nextFilters.type && university.type !== nextFilters.type) return false;
          if (
            (nextFilters.field || nextFilters.level) &&
            !university.programs.some(
              (program) =>
                (!nextFilters.field || program.field === nextFilters.field) &&
                (!nextFilters.level || program.level === nextFilters.level),
            )
          )
            return false;
          return true;
        })
        .map((university) => ({ university, distance: haversine(nextOrigin, { lat: university.lat!, lng: university.lng! }) }))
        .filter((row) => !nextFilters.radius || row.distance <= nextFilters.radius)
        .sort((a, b) => a.distance - b.distance);
      const label = catalog.fields.find((field) => field.value === nextFilters.field)?.label ?? null;
      showToast({
        tone: "info",
        title: t("summary", {
          count: found.length,
          hasField: label ? "yes" : "no",
          field: label ?? "",
          hasRadius: nextFilters.radius ? "yes" : "no",
          radius: nextFilters.radius ?? 0,
        }),
        text: found[0] ? t("nearest", { name: found[0].university.name, distance: formatDistance(found[0].distance) }) : undefined,
      });
    },
    [catalog.universities, catalog.fields, formatDistance, showToast, t],
  );

  // Asks the browser; every state change happens in its callbacks.
  const requestPosition = useCallback(() => {
    const fail = (denied: boolean) => {
      setStatus(denied ? "denied" : "unavailable");
      setPicking(true);
      showToast({ tone: "warn", title: denied ? t("status.denied") : t("status.unavailable"), sticky: true });
    };
    if (!("geolocation" in navigator)) {
      queueMicrotask(() => fail(false));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const point = { lat: position.coords.latitude, lng: position.coords.longitude, accuracy: position.coords.accuracy };
        setStatus("idle");
        setPicking(false);
        setOrigin(point);
        setOriginSource("gps");
        setFocusKey(`gps-${position.timestamp}`);
        announce(filtersRef.current, point);
      },
      (error) => fail(error.code === error.PERMISSION_DENIED),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 },
    );
  }, [announce, showToast, t]);

  const locate = useCallback(() => {
    setStatus("locating");
    showToast({ tone: "info", title: t("status.locating"), spinner: true, sticky: true });
    requestPosition();
  }, [requestPosition, showToast, t]);

  // Ask for the location once, when the visitor chose "Use my location".
  const asked = useRef(false);
  useEffect(() => {
    if (asked.current) return;
    asked.current = true;
    if (initialFilters.start === "locate") requestPosition();
  }, [initialFilters.start, requestPosition]);

  const startPicking = useCallback(() => {
    setPicking(true);
    setPicked(null);
    setSnap("peek");
    showToast({ tone: "info", title: t("status.pick"), sticky: true });
  }, [showToast, t]);

  const onOriginChange = useCallback(
    (point: MapPoint) => {
      // A pick (not a drag of the dot) frames the results and announces them.
      if (picking || !origin) {
        setFocusKey(`pick-${point.lat}-${point.lng}`);
        announce(filters, point);
      }
      setOrigin({ lat: point.lat, lng: point.lng });
      setOriginSource("pin");
      setPicking(false);
      setStatus("idle");
    },
    [origin, picking, filters, announce],
  );

  function applyFilters(next: NearbyFilters) {
    if (guest) {
      setLocked(true);
      return;
    }
    const radiusOnly =
      next.field === filters.field && next.level === filters.level && next.type === filters.type && next.radius !== filters.radius;
    setFilters(next);
    // Dragging the distance slider re-frames quietly; other changes announce.
    setFocusKey(`filters-${nextId()}`);
    if (!radiusOnly && origin) announce(next, origin);
    const href = nearbyHref({ ...next, start: "locate" });
    window.history.replaceState(null, "", `${window.location.pathname}${href.slice("/nearby".length)}`);
  }

  const select = useCallback(
    (slug: string | null) => {
      setPicked(slug);
      if (slug && !isDesktop) setSnap("half");
    },
    [isDesktop],
  );

  const context = [
    fieldLabel,
    filters.level ? t(`levels.${filters.level}`) : null,
    filters.type ? t(`types.${filters.type}`) : null,
    origin ? (filters.radius ? t("list.within", { km: filters.radius }) : t("list.anyDistance")) : t("list.noOrigin"),
  ]
    .filter(Boolean)
    .join(" · ");

  const listKey = `${filters.field}-${filters.level}-${filters.type}-${filters.radius}-${originSource}-${sort}`;

  const emptyAction =
    nearestOutside && filters.radius ? (
      <button
        type="button"
        onClick={() =>
          applyFilters({ ...filters, radius: Math.min(NEARBY_RADIUS_MAX, Math.ceil((nearestOutside.distance ?? 0) / 5) * 5) })
        }
        className="inline-flex h-9 items-center rounded-lg bg-[#1E6DEB] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[#1857C4]"
      >
        {t("empty.expand", { km: Math.min(NEARBY_RADIUS_MAX, Math.ceil((nearestOutside.distance ?? 0) / 5) * 5) })}
      </button>
    ) : null;

  const listBody = !mounted ? (
    <ListSkeleton />
  ) : shown.length ? (
    <ResultList
      rows={shown}
      hovered={hovered}
      nearestSlug={nearestSlug}
      listKey={listKey}
      formatDistance={formatDistance}
      onSelect={(slug) => select(slug)}
      onHover={setHovered}
    />
  ) : (
    <EmptyState
      title={origin && filters.radius ? t("empty.title", { km: filters.radius }) : t("empty.noMatches")}
      text={
        nearestOutside
          ? t("empty.nearestOutside", { name: nearestOutside.university.name, distance: formatDistance(nearestOutside.distance ?? 0) })
          : t("empty.tryOther")
      }
      action={emptyAction}
    />
  );

  const guestNote = guest ? (
    <div className="flex items-center gap-3 border-t border-slate-100 bg-slate-50 px-5 py-3 text-[12.5px] text-slate-600">
      <Lock className="size-3.5 shrink-0 text-slate-400" aria-hidden />
      <span className="min-w-0 flex-1">{t("access.guestActive")}</span>
      <Link href="/signup" className="shrink-0 font-semibold text-[#1E6DEB] hover:underline">
        {t("access.signup")}
      </Link>
    </div>
  ) : null;

  const detail = selectedRow ? (
    <UniversityDetail
      key={selectedRow.university.slug}
      row={selectedRow}
      nearest={selectedRow.university.slug === nearestSlug}
      formatDistance={formatDistance}
      onBack={() => {
        setPicked(null);
        if (!isDesktop) setSnap("half");
      }}
      onToast={(title) => showToast({ tone: "info", title })}
    />
  ) : null;

  const toolbar = (floating: boolean) => (
    <NearbyToolbar
      fields={catalog.fields}
      levels={catalog.levels}
      filters={filters}
      onChange={applyFilters}
      originSource={originSource}
      locating={status === "locating"}
      picking={picking}
      onLocate={locate}
      onPick={startPicking}
      locked={guest}
      onLocked={() => setLocked(true)}
      floating={floating}
    />
  );

  const insets: MapInsets = isDesktop ? { top: 0, bottom: 0, start: 0 } : { top: 60, bottom: sheetCover, start: 0 };

  return (
    <div className="relative flex h-[calc(100dvh-4rem-4.25rem-env(safe-area-inset-bottom))] flex-col overflow-hidden bg-white md:h-[calc(100dvh-5rem-4.25rem-env(safe-area-inset-bottom))] lg:h-[calc(100dvh-5rem)] lg:min-h-[600px]">
      {isDesktop ? <div className="relative z-[1000] shrink-0 border-b border-slate-200 bg-white px-4 py-2.5">{toolbar(false)}</div> : null}

      <div className="relative flex min-h-0 flex-1">
        {isDesktop ? (
          <aside className="flex w-[400px] shrink-0 flex-col border-e border-slate-200 bg-white">
            {detail ? (
              <div className="ul-thin-scroll min-h-0 flex-1 overflow-y-auto">{detail}</div>
            ) : (
              <>
                <div className="border-b border-slate-100 px-5 py-4">
                  <ResultsHeader count={shown.length} context={context} sort={sort} onSort={setSort} canSortByDistance={Boolean(origin)} />
                </div>
                <div className="ul-thin-scroll min-h-0 flex-1 overflow-y-auto">
                  {listBody}
                  <UnmappedList rows={unmapped} />
                </div>
              </>
            )}
            {guestNote}
          </aside>
        ) : null}

        <div className="relative min-w-0 flex-1">
          <NearbyMap
            universities={mapUniversities}
            origin={origin}
            radiusKm={origin ? filters.radius : null}
            selected={selected}
            hovered={hovered}
            picking={picking}
            locating={status === "locating"}
            focusKey={focusKey}
            insets={insets}
            onSelect={select}
            onHover={setHovered}
            onOriginChange={onOriginChange}
            onLocate={locate}
          />

          {!isDesktop ? <div className="absolute inset-x-0 top-0 z-[1000]">{toolbar(true)}</div> : null}

          {toast ? (
            <div
              className={cn("pointer-events-none absolute inset-x-0 z-[950] flex justify-center px-4", isDesktop ? "top-4" : "top-[60px]")}
            >
              <div
                key={toast.id}
                role="status"
                className={cn(
                  "ul-toast pointer-events-auto flex max-w-md items-start gap-3 rounded-xl px-4 py-3 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.45),0_0_0_1px_rgba(15,23,42,0.06)]",
                  toast.tone === "warn" ? "bg-[#FFFBEB] text-[#92400E]" : "bg-white text-slate-900",
                )}
              >
                {toast.spinner ? (
                  <span className="mt-0.5 size-4 shrink-0 animate-spin rounded-full border-2 border-[#1E6DEB]/25 border-t-[#1E6DEB]" aria-hidden />
                ) : toast.tone === "warn" || picking ? (
                  <MapPin className={cn("mt-0.5 size-4 shrink-0", toast.tone === "warn" ? "text-[#D97706]" : "text-[#1E6DEB]")} aria-hidden />
                ) : (
                  <span className="mt-1.5 size-2 shrink-0 rounded-full bg-[#1E6DEB]" aria-hidden />
                )}
                <div className="min-w-0">
                  <p className="text-[13.5px] font-semibold leading-snug">{toast.title}</p>
                  {toast.text ? <p className="mt-0.5 text-[12.5px] text-slate-500">{toast.text}</p> : null}
                </div>
                {toast.sticky && !toast.spinner && (origin || toast.tone === "warn") ? (
                  <button
                    type="button"
                    onClick={() => {
                      setToast(null);
                      if (origin) setPicking(false);
                    }}
                    className="-me-1 flex size-6 shrink-0 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-black/5 hover:text-slate-700"
                  >
                    <X className="size-3.5" aria-hidden />
                    <span className="sr-only">{t("launcher.close")}</span>
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}

          {!isDesktop && mounted ? (
            <NearbySheet
              snap={snap}
              onSnap={setSnap}
              onCover={setSheetCover}
              scrollKey={selectedRow ? selectedRow.university.slug : "list"}
              header={
                detail ? (
                  <p className="truncate text-center text-[13px] font-medium text-slate-500">{selectedRow?.university.name}</p>
                ) : (
                  <ResultsHeader count={shown.length} context={context} sort={sort} onSort={setSort} canSortByDistance={Boolean(origin)} />
                )
              }
            >
              {detail ?? (
                <>
                  {listBody}
                  <UnmappedList rows={unmapped} />
                </>
              )}
              {guestNote}
            </NearbySheet>
          ) : null}
        </div>
      </div>

      {locked ? <LockedDialog onClose={() => setLocked(false)} /> : null}
    </div>
  );
}

function LockedDialog({ onClose }: { onClose: () => void }) {
  const t = useTranslations("Nearby");
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    ref.current?.showModal();
  }, []);
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      aria-labelledby="nearby-locked-title"
      className="ul-nearby-dialog m-auto w-[min(400px,calc(100vw-2rem))] rounded-2xl bg-white p-0 text-slate-900 shadow-[0_24px_64px_-16px_rgba(15,23,42,0.35),0_0_0_1px_rgba(15,23,42,0.05)] backdrop:bg-slate-900/40"
    >
      <div className="p-6">
        <span className="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
          <Lock className="size-[18px]" aria-hidden />
        </span>
        <h2 id="nearby-locked-title" className="mt-4 text-lg font-semibold tracking-tight">
          {t("locked.title")}
        </h2>
        <p className="mt-1.5 text-sm leading-6 text-slate-500">{t("locked.text")}</p>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Link
            href={`/login?callbackUrl=${encodeURIComponent(window.location.pathname + window.location.search)}`}
            className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50"
          >
            {t("gate.login")}
          </Link>
          <Link
            href="/signup"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-[#1E6DEB] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#1857C4]"
          >
            {t("gate.signup")}
          </Link>
        </div>
      </div>
    </dialog>
  );
}
