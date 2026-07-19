"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MapPin, LocateFixed, TriangleAlert } from "lucide-react";
import { useIntl } from "@/i18n/provider";
import { SearchResults } from "./SearchResults";
import { Button } from "./ui/legacy-button";
import { cn } from "@/lib/cn";
import type { UniversitySummary } from "@/lib/types";

const RADII = [5, 10, 25, 50];
const FILTER_KEYS = ["q", "field", "degree_type", "fee_bucket", "city", "national_intl", "min_fees", "max_fees"];

type Status = "prompt" | "locating" | "ready" | "denied" | "unsupported";

export function NearMeResults() {
  const { locale, m } = useIntl();
  const router = useRouter();
  const params = useSearchParams();
  const [status, setStatus] = useState<Status>("prompt");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [radius, setRadius] = useState(25);
  const [items, setItems] = useState<UniversitySummary[]>([]);
  const [city, setCity] = useState("");
  const paramsKey = params.toString();

  const filterQuery = useCallback(() => {
    const p = new URLSearchParams();
    for (const key of FILTER_KEYS) params.getAll(key).forEach((v) => p.append(key, v));
    return p.toString();
  }, [params]);

  const fetchNearby = useCallback(
    async (c: { lat: number; lng: number }, r: number) => {
      const qs = filterQuery();
      const res = await fetch(
        `/api/universities/nearby?lat=${c.lat}&lng=${c.lng}&radius_km=${r}&lang=${locale}${qs ? `&${qs}` : ""}`,
      );
      const json = await res.json();
      setItems(json.data ?? []);
    },
    [filterQuery, locale],
  );

  const locate = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("unsupported");
      return;
    }
    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const c = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCoords(c);
        setStatus("ready");
        fetchNearby(c, radius);
      },
      () => setStatus("denied"),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }, [fetchNearby, radius]);

  // Refetch when filters change while ready.
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    if (status === "ready" && coords) {
      const timer = window.setTimeout(() => {
        void fetchNearby(coords, radius);
      }, 0);
      return () => window.clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsKey]);

  function changeRadius(r: number) {
    setRadius(r);
    if (coords) fetchNearby(coords, r);
  }

  function submitCity(e: React.FormEvent) {
    e.preventDefault();
    if (!city.trim()) return;
    const next = new URLSearchParams(params.toString());
    next.delete("near");
    next.set("q", city.trim());
    router.push(`/${locale}/search?${next.toString()}`);
  }

  if (status === "prompt" || status === "locating") {
    return (
      <Card>
        <span className="flex size-14 items-center justify-center rounded-2xl bg-brand-50 text-brand">
          <MapPin className="size-7" />
        </span>
        <h2 className="mt-4 font-head text-xl font-bold text-ink">{m.nearme.prompt}</h2>
        <p className="mt-2 max-w-md text-sm text-muted">{m.nearme.promptBody}</p>
        <Button onClick={locate} className="mt-5" disabled={status === "locating"}>
          <LocateFixed className="size-4" />
          {status === "locating" ? m.nearme.locating : m.nearme.allow}
        </Button>
      </Card>
    );
  }

  if (status === "denied" || status === "unsupported") {
    return (
      <Card>
        <span className="flex size-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
          <TriangleAlert className="size-7" />
        </span>
        <h2 className="mt-4 font-head text-xl font-bold text-ink">
          {status === "denied" ? m.nearme.denied : m.nearme.unsupported}
        </h2>
        <p className="mt-2 max-w-md text-sm text-muted">{m.nearme.deniedBody}</p>
        <form onSubmit={submitCity} className="mt-5 flex w-full max-w-sm gap-2">
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder={m.nearme.cityPlaceholder}
            className="h-11 flex-1 rounded-[10px] border border-line bg-surface px-3 text-sm outline-none focus:border-brand"
          />
          <Button type="submit">{m.common.search}</Button>
        </form>
      </Card>
    );
  }

  return (
    <SearchResults
      items={items}
      userLocation={coords}
      radiusKm={radius}
      controls={
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-muted">{m.nearme.radius}:</span>
          {RADII.map((r) => (
            <button
              key={r}
              onClick={() => changeRadius(r)}
              className={cn(
                "h-9 rounded-full border px-3.5 text-sm font-medium",
                radius === r ? "border-brand bg-brand text-white" : "border-line bg-surface text-ink hover:bg-brand-50",
              )}
            >
              {r} {m.common.km}
            </button>
          ))}
        </div>
      }
    />
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-card border border-line bg-surface p-8 text-center">
      {children}
    </div>
  );
}
