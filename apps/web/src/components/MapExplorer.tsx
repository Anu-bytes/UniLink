"use client";

import { useCallback, useRef, useState } from "react";
import { MapPin, Star, Layers, RotateCcw } from "lucide-react";
import { useIntl } from "@/i18n/provider";
import { MapView, type MapBounds } from "./MapView";
import { LocaleLink } from "./LocaleLink";
import { VerifiedBadge } from "./ui/VerifiedBadge";
import { FIELDS } from "@/data/fields";
import { pick, formatFeeRange, formatNumber } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { FieldOfStudyId, UniversitySummary } from "@/lib/types";

const CHIP_FIELDS: FieldOfStudyId[] = ["engineering", "medicine", "cs-ai-it", "business", "pharmacy", "dentistry"];

export function MapExplorer({ points }: { points: UniversitySummary[] }) {
  const { locale, m } = useIntl();
  const [base, setBase] = useState(points);
  const [field, setField] = useState<FieldOfStudyId | null>(null);
  const [dirty, setDirty] = useState(false);
  const boundsRef = useRef<MapBounds | null>(null);

  const displayed = field ? base.filter((p) => p.topFields.includes(field)) : base;

  const onBounds = useCallback((b: MapBounds) => {
    boundsRef.current = b;
    setDirty(true);
  }, []);

  async function searchThisArea() {
    const b = boundsRef.current;
    if (!b) return;
    const res = await fetch(
      `/api/universities/within?min_lat=${b.minLat}&min_lng=${b.minLng}&max_lat=${b.maxLat}&max_lng=${b.maxLng}&lang=${locale}`,
    );
    const json = await res.json();
    setBase(json.data ?? []);
    setDirty(false);
  }

  function reset() {
    setBase(points);
    setField(null);
    setDirty(false);
  }

  return (
    <div className="grid h-[calc(100dvh-4rem)] grid-rows-[1fr] lg:grid-cols-[360px_1fr]">
      {/* List panel */}
      <aside className="hidden flex-col overflow-hidden border-e border-line bg-surface lg:flex">
        <div className="border-b border-line p-4">
          <h1 className="font-head text-lg font-bold text-ink">{m.map.title}</h1>
          <p className="mt-1 text-sm text-muted">
            {formatNumber(displayed.length, locale)} {m.map.universitiesShown}
          </p>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          <div className="flex flex-col gap-2">
            {displayed.map((u) => (
              <LocaleLink
                key={u.id}
                href={`/universities/${u.slug}`}
                className="rounded-xl border border-line p-3 transition-colors hover:border-brand-200 hover:bg-brand-50"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-head text-sm font-semibold text-ink">{pick(u.name, locale)}</h3>
                  {u.isVerified && <VerifiedBadge label={m.common.verified} />}
                </div>
                <p className="mt-1 flex items-center gap-2 text-xs text-muted">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-3.5" /> {pick(u.city, locale)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Star className="size-3.5 fill-warning text-warning" /> {formatNumber(u.rating, locale)}
                  </span>
                </p>
                <p className="mt-1.5 text-xs font-medium text-ink">
                  {formatFeeRange(u.minFees, u.maxFees, locale)}
                </p>
              </LocaleLink>
            ))}
          </div>
        </div>
      </aside>

      {/* Map */}
      <div className="relative">
        <MapView points={displayed} onBoundsChange={onBounds} />

        {/* Field chips overlay */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 p-3">
          <div className="no-scrollbar pointer-events-auto flex gap-2 overflow-x-auto">
            <button
              onClick={() => setField(null)}
              className={cn(
                "inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 text-sm font-medium shadow-sm",
                !field ? "border-brand bg-brand text-white" : "border-line bg-surface text-ink",
              )}
            >
              <Layers className="size-4" /> {m.common.all}
            </button>
            {CHIP_FIELDS.map((id) => {
              const f = FIELDS.find((x) => x.id === id)!;
              return (
                <button
                  key={id}
                  onClick={() => setField((cur) => (cur === id ? null : id))}
                  className={cn(
                    "whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-medium shadow-sm",
                    field === id ? "border-brand bg-brand text-white" : "border-line bg-surface text-ink",
                  )}
                >
                  {pick(f.name, locale)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search this area / reset */}
        <div className="absolute inset-x-0 bottom-4 z-10 flex justify-center gap-2">
          {dirty && (
            <button
              onClick={searchThisArea}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-brand px-5 text-sm font-semibold text-white shadow-lg hover:bg-brand-600"
            >
              {m.map.searchThisArea}
            </button>
          )}
          {base.length !== points.length && (
            <button
              onClick={reset}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-surface px-4 text-sm font-medium text-ink shadow-lg"
            >
              <RotateCcw className="size-4" /> {m.common.clearAll}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
