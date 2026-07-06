"use client";

import { useState } from "react";
import { List, Map as MapIcon } from "lucide-react";
import { useIntl } from "@/i18n/provider";
import { UniversityCard } from "./UniversityCard";
import { MapView } from "./MapView";
import { cn } from "@/lib/cn";
import type { UniversitySummary } from "@/lib/types";

export function SearchResults({
  items,
  userLocation,
  radiusKm,
  controls,
}: {
  items: UniversitySummary[];
  userLocation?: { lat: number; lng: number } | null;
  radiusKm?: number;
  controls?: React.ReactNode;
}) {
  const { m } = useIntl();
  const [view, setView] = useState<"list" | "map">("list");

  return (
    <div className="flex flex-col gap-4">
      {controls}

      {/* Mobile view toggle */}
      <div className="flex rounded-[10px] border border-line p-1 lg:hidden">
        {(["list", "map"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-sm font-medium",
              view === v ? "bg-brand text-white" : "text-muted",
            )}
          >
            {v === "list" ? <List className="size-4" /> : <MapIcon className="size-4" />}
            {v === "list" ? m.search.showList : m.search.showMap}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_minmax(340px,40%)]">
        {/* List */}
        <div className={cn(view === "map" && "hidden lg:block")}>
          {items.length === 0 ? (
            <div className="rounded-card border border-dashed border-line bg-surface py-16 text-center text-muted">
              {m.common.noResults}
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {items.map((u) => (
                <UniversityCard key={u.id} u={u} compact />
              ))}
            </div>
          )}
        </div>

        {/* Map */}
        <div className={cn(view === "list" && "hidden lg:block")}>
          <div className="sticky top-20 h-[70vh] overflow-hidden rounded-card border border-line lg:h-[calc(100vh-7rem)]">
            <MapView points={items} userLocation={userLocation} radiusKm={radiusKm} fitToPoints />
          </div>
        </div>
      </div>
    </div>
  );
}
