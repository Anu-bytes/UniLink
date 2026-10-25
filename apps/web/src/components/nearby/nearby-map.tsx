"use client";

import "leaflet/dist/leaflet.css";

import L from "leaflet";
import { Minus, Plus, Scan } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { UniversityLogo } from "@/components/university-logo";
import { cn } from "@/lib/utils";

export type MapPoint = { lat: number; lng: number };

export type MapUniversity = {
  slug: string;
  name: string;
  logoUrl: string | null;
  lat: number;
  lng: number;
  /** 1 for the nearest; null while there is no starting point. */
  rank: number | null;
  distanceLabel: string | null;
};

// Egypt, for the first frame before there is a starting point.
const EGYPT_CENTER: L.LatLngTuple = [27.2, 30.8];
const EGYPT_ZOOM = 6;

// OpenStreetMap's own tiles: no key needed. globals.css (.ul-map) greys them
// out so the blue and red pins carry the page.
const TILES = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors';

const PIN_SIZE: L.PointTuple = [52, 64];

/**
 * The Leaflet map behind /nearby. Leaflet owns the map; each university pin
 * is a plain element Leaflet positions, with React drawn into it through a
 * portal, so names and logos are rendered by React (escaped), never as HTML
 * strings.
 */
export function NearbyMap({
  universities,
  origin,
  radiusKm,
  selected,
  picking,
  focusKey,
  onSelect,
  onOriginChange,
}: {
  universities: MapUniversity[];
  origin: MapPoint | null;
  radiusKm: number | null;
  selected: string | null;
  picking: boolean;
  /** Changes whenever the map should re-frame the results (new search, new origin). */
  focusKey: string;
  onSelect: (slug: string | null) => void;
  onOriginChange: (point: MapPoint) => void;
}) {
  const t = useTranslations("Nearby");
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef(new Map<string, L.Marker>());
  const [pinElements, setPinElements] = useState<Map<string, HTMLDivElement>>(new Map());
  const originMarkerRef = useRef<L.Marker | null>(null);
  const circleRef = useRef<L.Circle | null>(null);
  const lineRef = useRef<L.Polyline | null>(null);
  const lineLabelRef = useRef<L.Tooltip | null>(null);

  // Latest callbacks, so Leaflet handlers bound once never call stale ones.
  const onSelectRef = useRef(onSelect);
  const onOriginChangeRef = useRef(onOriginChange);
  const pickingRef = useRef(picking);
  useEffect(() => {
    onSelectRef.current = onSelect;
    onOriginChangeRef.current = onOriginChange;
    pickingRef.current = picking;
  });

  // Create the map once.
  useEffect(() => {
    const container = containerRef.current;
    if (!container || mapRef.current) return;
    const map = L.map(container, {
      center: EGYPT_CENTER,
      zoom: EGYPT_ZOOM,
      minZoom: 5,
      maxZoom: 19,
      zoomControl: false,
      attributionControl: false,
      worldCopyJump: false,
      maxBounds: L.latLngBounds([15, 18], [38, 44]),
      maxBoundsViscosity: 0.8,
    });
    L.tileLayer(TILES, { maxZoom: 19 }).addTo(map);
    L.control.attribution({ position: "bottomleft", prefix: false }).addAttribution(ATTRIBUTION).addTo(map);

    map.on("click", (event: L.LeafletMouseEvent) => {
      if (pickingRef.current) {
        onOriginChangeRef.current({ lat: event.latlng.lat, lng: event.latlng.lng });
      } else {
        onSelectRef.current(null);
      }
    });
    mapRef.current = map;

    // The panel beside the map can resize it (mobile sheet, window resize).
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(container);
    const markers = markersRef.current;

    return () => {
      observer.disconnect();
      map.remove();
      mapRef.current = null;
      markers.clear();
      originMarkerRef.current = null;
      circleRef.current = null;
      lineRef.current = null;
      lineLabelRef.current = null;
    };
  }, []);

  // Keep one marker per university in the results.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const markers = markersRef.current;
    const wanted = new Set(universities.map((u) => u.slug));
    let changed = false;
    const elements = new Map(pinElements);

    for (const [slug, marker] of markers) {
      if (!wanted.has(slug)) {
        marker.remove();
        markers.delete(slug);
        elements.delete(slug);
        changed = true;
      }
    }
    for (const university of universities) {
      const existing = markers.get(university.slug);
      if (existing) {
        existing.setLatLng([university.lat, university.lng]);
        continue;
      }
      const element = document.createElement("div");
      element.className = "ul-pin-root";
      const marker = L.marker([university.lat, university.lng], {
        icon: L.divIcon({
          html: element,
          className: "ul-pin-icon",
          iconSize: PIN_SIZE,
          iconAnchor: [PIN_SIZE[0] / 2, PIN_SIZE[1]],
        }),
        keyboard: true,
        title: university.name,
        riseOnHover: true,
      });
      marker.on("click", (event) => {
        L.DomEvent.stopPropagation(event);
        onSelectRef.current(university.slug);
      });
      marker.addTo(map);
      markers.set(university.slug, marker);
      elements.set(university.slug, element);
      changed = true;
    }
    if (changed) setPinElements(elements);
    // pinElements is the output of this effect, not an input.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [universities]);

  // Selected pin sits on top of its neighbours.
  useEffect(() => {
    for (const [slug, marker] of markersRef.current) {
      marker.setZIndexOffset(slug === selected ? 1000 : 0);
    }
  }, [selected, pinElements]);

  // The visitor's own point: a pulsing dot that can be dragged to move it.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (!origin) {
      originMarkerRef.current?.remove();
      originMarkerRef.current = null;
      return;
    }
    if (!originMarkerRef.current) {
      const element = document.createElement("div");
      element.className = "ul-me";
      const dot = document.createElement("span");
      dot.className = "ul-me-dot";
      const halo = document.createElement("span");
      halo.className = "ul-me-halo";
      const label = document.createElement("span");
      label.className = "ul-me-label";
      label.textContent = t("map.you");
      element.append(halo, dot, label);
      const marker = L.marker([origin.lat, origin.lng], {
        icon: L.divIcon({ html: element, className: "ul-me-icon", iconSize: [24, 24], iconAnchor: [12, 12] }),
        draggable: true,
        autoPan: true,
        zIndexOffset: 2000,
        title: t("map.dragHint"),
      });
      marker.on("drag", () => {
        const point = marker.getLatLng();
        onOriginChangeRef.current({ lat: point.lat, lng: point.lng });
      });
      marker.addTo(map);
      originMarkerRef.current = marker;
    } else {
      originMarkerRef.current.setLatLng([origin.lat, origin.lng]);
    }
  }, [origin, t]);

  // The search radius around the visitor.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (!origin || !radiusKm) {
      circleRef.current?.remove();
      circleRef.current = null;
      return;
    }
    if (!circleRef.current) {
      circleRef.current = L.circle([origin.lat, origin.lng], {
        radius: radiusKm * 1000,
        color: "#1E6DEB",
        weight: 1.5,
        dashArray: "6 6",
        fillColor: "#1E6DEB",
        fillOpacity: 0.05,
        interactive: false,
      }).addTo(map);
    } else {
      circleRef.current.setLatLng([origin.lat, origin.lng]);
      circleRef.current.setRadius(radiusKm * 1000);
    }
  }, [origin, radiusKm]);

  // A dashed line from the visitor to the chosen university, with the distance on it.
  const selectedUniversity = universities.find((u) => u.slug === selected) ?? null;
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    lineRef.current?.remove();
    lineRef.current = null;
    lineLabelRef.current?.remove();
    lineLabelRef.current = null;
    if (!origin || !selectedUniversity) return;
    const from = L.latLng(origin.lat, origin.lng);
    const to = L.latLng(selectedUniversity.lat, selectedUniversity.lng);
    lineRef.current = L.polyline([from, to], {
      color: "#F82C1F",
      weight: 3,
      opacity: 0.9,
      dashArray: "2 9",
      lineCap: "round",
      interactive: false,
      className: "ul-route",
    }).addTo(map);
    if (selectedUniversity.distanceLabel) {
      lineLabelRef.current = L.tooltip({
        permanent: true,
        direction: "center",
        className: "ul-route-label",
        interactive: false,
      })
        .setLatLng(L.latLng((from.lat + to.lat) / 2, (from.lng + to.lng) / 2))
        .setContent(selectedUniversity.distanceLabel)
        .addTo(map);
    }
  }, [origin, selectedUniversity]);

  // Frame the results whenever the search or the starting point changes.
  const universitiesRef = useRef(universities);
  useEffect(() => {
    universitiesRef.current = universities;
  }, [universities]);
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const list = universitiesRef.current;
    const points: L.LatLngExpression[] = [];
    if (origin) {
      points.push([origin.lat, origin.lng]);
      // The nearest few, so the view stays local rather than the whole country.
      const nearest = [...list].sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99)).slice(0, 5);
      for (const u of nearest) points.push([u.lat, u.lng]);
    } else {
      for (const u of list) points.push([u.lat, u.lng]);
    }
    if (origin && radiusKm && list.length === 0) {
      // Nothing inside the radius: show the whole circle that was searched.
      map.flyToBounds(L.latLng(origin.lat, origin.lng).toBounds(radiusKm * 2000), { padding: [30, 30], duration: 1 });
    } else if (points.length === 0) {
      map.flyTo(EGYPT_CENTER, EGYPT_ZOOM, { duration: 0.8 });
    } else if (points.length === 1) {
      map.flyTo(points[0]!, 12, { duration: 1 });
    } else {
      map.flyToBounds(L.latLngBounds(points), { padding: [60, 60], maxZoom: 13, duration: 1.1 });
    }
    // Only a new focusKey re-frames; dragging the origin must not.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusKey]);

  // Fly to a university when it is chosen from the list.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedUniversity) return;
    const target = L.latLng(selectedUniversity.lat, selectedUniversity.lng);
    if (origin) {
      const bounds = L.latLngBounds([target, L.latLng(origin.lat, origin.lng)]);
      map.flyToBounds(bounds, { padding: [90, 90], maxZoom: 14, duration: 0.9 });
    } else {
      map.flyTo(target, Math.max(map.getZoom(), 12), { duration: 0.9 });
    }
    // Moving the origin while a university is open should not keep flying.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUniversity?.slug]);

  function fitAll() {
    const map = mapRef.current;
    if (!map) return;
    const points: L.LatLngExpression[] = universities.map((u) => [u.lat, u.lng]);
    if (origin) points.push([origin.lat, origin.lng]);
    if (points.length > 1) map.flyToBounds(L.latLngBounds(points), { padding: [50, 50], duration: 0.9 });
  }

  return (
    // The picking class sits on the wrapper: Leaflet manages the container's
    // own classes, and React re-rendering them would wipe Leaflet's.
    <div className={cn("relative h-full w-full", picking && "ul-map-picking")}>
      <div
        ref={containerRef}
        className="ul-map h-full w-full bg-[#EEF1F5]"
        role="application"
        aria-label={t("map.label")}
      />

      <div className="absolute end-3 top-[76px] z-[500] flex flex-col lg:top-3 overflow-hidden rounded-xl bg-white shadow-[0_8px_24px_-12px_rgba(15,23,42,0.45)] ring-1 ring-black/5">
        <MapButton label={t("map.zoomIn")} onClick={() => mapRef.current?.zoomIn()}>
          <Plus className="size-4" aria-hidden />
        </MapButton>
        <span className="h-px bg-slate-100" />
        <MapButton label={t("map.zoomOut")} onClick={() => mapRef.current?.zoomOut()}>
          <Minus className="size-4" aria-hidden />
        </MapButton>
        <span className="h-px bg-slate-100" />
        <MapButton label={t("map.fitAll")} onClick={fitAll}>
          <Scan className="size-4" aria-hidden />
        </MapButton>
      </div>

      {universities.map((university) => {
        const element = pinElements.get(university.slug);
        if (!element) return null;
        return createPortal(
          <Pin university={university} selected={university.slug === selected} />,
          element,
          university.slug,
        );
      })}
    </div>
  );
}

function MapButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className="flex size-10 items-center justify-center text-[#1F2A44] transition-colors hover:bg-[#EEF4FF] hover:text-[#1E6DEB] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#1E6DEB]"
    >
      {children}
    </button>
  );
}

function Pin({ university, selected }: { university: MapUniversity; selected: boolean }) {
  const nearest = university.rank === 1;
  return (
    <div className={cn("ul-pin", selected && "ul-pin-selected", nearest && "ul-pin-nearest")}>
      {nearest ? <span className="ul-pin-pulse" aria-hidden /> : null}
      <span className="ul-pin-head">
        <UniversityLogo name={university.name} logoUrl={university.logoUrl} className="size-full border-0 p-1" />
      </span>
      <span className="ul-pin-tail" aria-hidden />
      {university.rank !== null && university.rank <= 9 ? (
        <span className="ul-pin-rank">{university.rank}</span>
      ) : null}
      {selected ? <span className="ul-pin-name">{university.name}</span> : null}
    </div>
  );
}
