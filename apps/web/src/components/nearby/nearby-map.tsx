"use client";

import "leaflet/dist/leaflet.css";
import "maplibre-gl/dist/maplibre-gl.css";

import { maplibreGL } from "@maplibre/maplibre-gl-leaflet";
import L from "leaflet";
import { LocateFixed, Minus, Plus, Scan } from "lucide-react";
import { setWorkerUrl } from "maplibre-gl";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { UniversityLogo } from "@/components/university-logo";
import { EGYPT_OUTLINE } from "@/lib/egypt-outline";
import { MAP_ATTRIBUTION, loadMapStyle } from "@/lib/map-style";
import { cn } from "@/lib/utils";

export type MapPoint = { lat: number; lng: number; /** metres, GPS only */ accuracy?: number };

export type MapUniversity = {
  slug: string;
  name: string;
  logoUrl: string | null;
  lat: number;
  lng: number;
  nearest: boolean;
  distanceLabel: string | null;
};

/** Space the panel / bottom sheet covers, so framing keeps results visible. */
export type MapInsets = { top: number; bottom: number; start: number };

// Egypt, for the first frame before there is a starting point.
const EGYPT_CENTER: L.LatLngTuple = [27.2, 30.8];
const EGYPT_ZOOM = 6;

// The basemap is drawn from vector tiles (lib/map-style.ts), so place names
// can be relabelled. MapLibre runs its tile work in a web worker, served from
// public/vendor at the exact version installed (package.json pins it).
setWorkerUrl("/vendor/maplibre-gl-worker-6.16.0.mjs");

// Fallback if the vector style cannot be loaded: OpenStreetMap's own tiles.
const FALLBACK_TILES = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const FALLBACK_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>';

const PIN: L.PointTuple = [44, 52];

// Where the "Palestine" label sits: over the West Bank, clear of the pins
// on Egypt's Sinai coast.
const PALESTINE: L.LatLngTuple = [31.95, 35.25];

/** The flag of Palestine: black, white and green bands, red triangle at the hoist. */
const PALESTINE_FLAG_SVG =
  '<svg class="ul-place-flag" viewBox="0 0 6 3" aria-hidden="true"><rect width="6" height="1" fill="#000"/><rect y="1" width="6" height="1" fill="#fff"/><rect y="2" width="6" height="1" fill="#007A3D"/><path d="M0 0L2 1.5L0 3Z" fill="#CE1126"/></svg>';

/** A small red heart beside the Palestine tag. */
const HEART_SVG =
  '<svg class="ul-place-heart" viewBox="0 0 24 24" aria-hidden="true"><path fill="#E11D48" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';

/**
 * A frosted, blurred sheet over everything outside Egypt. It is a Leaflet
 * layer in its own pane between the tiles and the pins, so pins, the route
 * and the search circle stay sharp even where they cross the border. The
 * sheet covers three viewports (one spare on each side, for panning and
 * zooming out) with Egypt cut out by an even-odd clip path, and it scales
 * with the tiles during a zoom animation the way Leaflet's image overlays do.
 */
const FrostLayer = L.Layer.extend({
  onAdd(this: L.Layer & { _el: HTMLDivElement; _reset: () => void }, map: L.Map) {
    this._el = L.DomUtil.create("div", "ul-frost leaflet-zoom-animated", map.getPane("frost"));
    this._reset();
    return this;
  },
  onRemove(this: { _el: HTMLDivElement }) {
    this._el.remove();
    return this;
  },
  getEvents(this: { _reset: () => void; _animateZoom: (event: L.ZoomAnimEvent) => void }) {
    return { zoom: this._reset, viewreset: this._reset, moveend: this._reset, resize: this._reset, zoomanim: this._animateZoom };
  },
  _reset(this: L.Layer & { _el: HTMLDivElement; _map: L.Map; _bounds: L.LatLngBounds }) {
    const map = this._map;
    const size = map.getSize();
    const topLeft = map.containerPointToLayerPoint([-size.x, -size.y]).round();
    const span = size.multiplyBy(3);
    this._bounds = L.latLngBounds(map.layerPointToLatLng(topLeft), map.layerPointToLatLng(topLeft.add(span)));
    const holes = EGYPT_OUTLINE.map(
      (ring) =>
        "M" +
        ring
          .map(([lat, lng]) => {
            const point = map.latLngToLayerPoint([lat, lng]).subtract(topLeft);
            return `${point.x.toFixed(1)} ${point.y.toFixed(1)}`;
          })
          .join("L") +
        "Z",
    ).join("");
    L.DomUtil.setPosition(this._el, topLeft);
    this._el.style.width = `${span.x}px`;
    this._el.style.height = `${span.y}px`;
    this._el.style.clipPath = `path(evenodd, "M0 0H${span.x}V${span.y}H0Z${holes}")`;
  },
  _animateZoom(this: { _el: HTMLDivElement; _map: L.Map; _bounds: L.LatLngBounds }, event: L.ZoomAnimEvent) {
    const map = this._map as L.Map & {
      _latLngBoundsToNewLayerBounds: (bounds: L.LatLngBounds, zoom: number, center: L.LatLng) => L.Bounds;
    };
    const scale = map.getZoomScale(event.zoom);
    const offset = map._latLngBoundsToNewLayerBounds(this._bounds, event.zoom, event.center).min!;
    L.DomUtil.setTransform(this._el, offset, scale);
  },
});
const BRAND = "#1E6DEB";

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** rAF tween from 0 to 1 with ease-out; returns a cancel function. */
function tween(duration: number, step: (t: number) => void) {
  if (reducedMotion()) {
    step(1);
    return () => {};
  }
  let frame = 0;
  const start = performance.now();
  const tick = (now: number) => {
    const p = Math.min(1, (now - start) / duration);
    step(1 - Math.pow(1 - p, 3));
    if (p < 1) frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(frame);
}

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
  hovered,
  picking,
  locating,
  focusKey,
  insets,
  onSelect,
  onHover,
  onOriginChange,
  onLocate,
}: {
  universities: MapUniversity[];
  origin: MapPoint | null;
  radiusKm: number | null;
  selected: string | null;
  hovered: string | null;
  picking: boolean;
  locating: boolean;
  /** Changes whenever the map should re-frame the results (new search, new origin). */
  focusKey: string;
  insets: MapInsets;
  onSelect: (slug: string | null) => void;
  onHover: (slug: string | null) => void;
  onOriginChange: (point: MapPoint) => void;
  onLocate: () => void;
}) {
  const t = useTranslations("Nearby");
  const locale = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef(new Map<string, L.Marker>());
  const [pinElements, setPinElements] = useState<Map<string, HTMLDivElement>>(new Map());
  const originMarkerRef = useRef<L.Marker | null>(null);
  const accuracyRef = useRef<L.Circle | null>(null);
  const circleRef = useRef<L.Circle | null>(null);
  const lineRef = useRef<L.Polyline | null>(null);
  const lineLabelRef = useRef<L.Tooltip | null>(null);

  // Latest values for handlers Leaflet binds once.
  const live = useRef({ onSelect, onHover, onOriginChange, picking, insets });
  useEffect(() => {
    live.current = { onSelect, onHover, onOriginChange, picking, insets };
  });

  const padding = () => {
    const { top, bottom, start } = live.current.insets;
    const rtl = document.documentElement.dir === "rtl";
    return {
      // Room for a pin's name label, which sits above it and can be wide.
      paddingTopLeft: L.point(rtl ? 110 : start + 110, top + 70),
      paddingBottomRight: L.point(rtl ? start + 110 : 110, bottom + 40),
    };
  };

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
      zoomSnap: 0.25,
      wheelPxPerZoomLevel: 90,
      maxBounds: L.latLngBounds([15, 18], [38, 44]),
      maxBoundsViscosity: 0.8,
    });
    const attribution = L.control.attribution({ position: "bottomleft", prefix: false }).addTo(map);
    loadMapStyle(locale)
      .then((style) => {
        if (mapRef.current !== map) return;
        maplibreGL({ style, attributionControl: false }).addTo(map);
        attribution.addAttribution(MAP_ATTRIBUTION);
      })
      .catch(() => {
        if (mapRef.current !== map) return;
        L.tileLayer(FALLBACK_TILES, { maxZoom: 19, className: "ul-fallback-tiles" }).addTo(map);
        attribution.addAttribution(FALLBACK_ATTRIBUTION);
      });

    map.on("click", (event: L.LeafletMouseEvent) => {
      if (live.current.picking) {
        live.current.onOriginChange({ lat: event.latlng.lat, lng: event.latlng.lng });
      } else {
        live.current.onSelect(null);
      }
    });
    mapRef.current = map;

    // Everything outside Egypt sits under a frosted, blurred layer that
    // lives between the base map and the pins (see FrostLayer), with a thin
    // outline along the border and a Palestine label on top.
    map.createPane("frost").style.zIndex = "250";
    new FrostLayer().addTo(map);
    L.polygon(EGYPT_OUTLINE.map((ring) => ring.map(([lat, lng]) => L.latLng(lat, lng))), {
      color: BRAND,
      weight: 1.5,
      opacity: 0.35,
      fill: false,
      interactive: false,
    }).addTo(map);
    const palestine = document.createElement("div");
    palestine.className = "ul-place";
    palestine.innerHTML = PALESTINE_FLAG_SVG;
    const name = document.createElement("span");
    name.textContent = t("map.palestine");
    palestine.append(name);
    palestine.insertAdjacentHTML("beforeend", HEART_SVG);
    L.marker(PALESTINE, {
      icon: L.divIcon({ html: palestine, className: "ul-place-icon", iconSize: [0, 0] }),
      interactive: false,
      keyboard: false,
      // Under any university pin it might meet.
      zIndexOffset: -1000,
    }).addTo(map);

    // The panel beside the map can resize it (mobile sheet, window resize).
    const observer = new ResizeObserver(() => map.invalidateSize({ pan: false }));
    observer.observe(container);
    const markers = markersRef.current;

    return () => {
      observer.disconnect();
      map.remove();
      mapRef.current = null;
      markers.clear();
      originMarkerRef.current = null;
      accuracyRef.current = null;
      circleRef.current = null;
      lineRef.current = null;
      lineLabelRef.current = null;
    };
    // Created once; a language switch loads a new page, so `t` never changes here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // One marker per university in the results; new ones pop in.
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
    universities.forEach((university, index) => {
      const existing = markers.get(university.slug);
      if (existing) {
        existing.setLatLng([university.lat, university.lng]);
        return;
      }
      const element = document.createElement("div");
      element.className = "ul-pin-root";
      element.style.setProperty("--pin-delay", `${Math.min(index, 12) * 35}ms`);
      const marker = L.marker([university.lat, university.lng], {
        icon: L.divIcon({ html: element, className: "ul-pin-icon", iconSize: PIN, iconAnchor: [PIN[0] / 2, PIN[1]] }),
        keyboard: true,
        title: university.name,
        alt: university.name,
      });
      marker.on("click", (event) => {
        L.DomEvent.stopPropagation(event);
        live.current.onSelect(university.slug);
      });
      marker.on("mouseover", () => live.current.onHover(university.slug));
      marker.on("mouseout", () => live.current.onHover(null));
      marker.addTo(map);
      markers.set(university.slug, marker);
      elements.set(university.slug, element);
      changed = true;
    });
    if (changed) setPinElements(elements);
    // pinElements is the output of this effect, not an input.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [universities]);

  // The active pin sits on top of its neighbours.
  useEffect(() => {
    for (const [slug, marker] of markersRef.current) {
      marker.setZIndexOffset(slug === selected ? 2000 : slug === hovered ? 1000 : 0);
    }
  }, [selected, hovered, pinElements]);

  // The visitor's own point: a blue dot (draggable) and, from GPS, its accuracy.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (!origin) {
      originMarkerRef.current?.remove();
      originMarkerRef.current = null;
      accuracyRef.current?.remove();
      accuracyRef.current = null;
      return;
    }
    if (!originMarkerRef.current) {
      const element = document.createElement("div");
      element.className = "ul-me";
      element.innerHTML = '<span class="ul-me-halo"></span><span class="ul-me-dot"></span>';
      const marker = L.marker([origin.lat, origin.lng], {
        icon: L.divIcon({ html: element, className: "ul-me-icon", iconSize: [22, 22], iconAnchor: [11, 11] }),
        draggable: true,
        autoPan: true,
        zIndexOffset: 3000,
        title: t("map.dragHint"),
        alt: t("map.you"),
      });
      marker.bindTooltip(t("map.you"), { direction: "top", offset: [0, -12], className: "ul-tip" });
      marker.on("dragstart", () => element.classList.add("is-dragging"));
      marker.on("dragend", () => element.classList.remove("is-dragging"));
      marker.on("drag", () => {
        const point = marker.getLatLng();
        live.current.onOriginChange({ lat: point.lat, lng: point.lng });
      });
      marker.addTo(map);
      originMarkerRef.current = marker;
    } else {
      originMarkerRef.current.setLatLng([origin.lat, origin.lng]);
    }

    if (origin.accuracy && origin.accuracy > 30) {
      const radius = Math.min(origin.accuracy, 5000);
      if (!accuracyRef.current) {
        accuracyRef.current = L.circle([origin.lat, origin.lng], {
          radius,
          color: BRAND,
          weight: 0,
          fillColor: BRAND,
          fillOpacity: 0.1,
          interactive: false,
        }).addTo(map);
      } else {
        accuracyRef.current.setLatLng([origin.lat, origin.lng]).setRadius(radius);
      }
    } else {
      accuracyRef.current?.remove();
      accuracyRef.current = null;
    }
  }, [origin, t]);

  // The search radius, which grows or shrinks smoothly when the slider moves.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (!origin || !radiusKm) {
      circleRef.current?.remove();
      circleRef.current = null;
      return;
    }
    const target = radiusKm * 1000;
    if (!circleRef.current) {
      const circle = L.circle([origin.lat, origin.lng], {
        radius: 1,
        color: BRAND,
        weight: 1.5,
        opacity: 0.55,
        fillColor: BRAND,
        fillOpacity: 0.05,
        interactive: false,
        className: "ul-radius",
      }).addTo(map);
      circleRef.current = circle;
      return tween(650, (p) => circle.setRadius(Math.max(1, target * p)));
    }
    const circle = circleRef.current;
    circle.setLatLng([origin.lat, origin.lng]);
    const from = circle.getRadius();
    return tween(260, (p) => circle.setRadius(from + (target - from) * p));
  }, [origin, radiusKm]);

  // A line from the visitor to the chosen university that draws itself in.
  const selectedUniversity = universities.find((u) => u.slug === selected) ?? null;
  const routeKey = selectedUniversity && origin ? selectedUniversity.slug : null;
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    lineRef.current?.remove();
    lineRef.current = null;
    lineLabelRef.current?.remove();
    lineLabelRef.current = null;
    if (!routeKey || !origin || !selectedUniversity) return;
    const from = L.latLng(origin.lat, origin.lng);
    const to = L.latLng(selectedUniversity.lat, selectedUniversity.lng);
    const line = L.polyline([from, from], {
      color: "#0F172A",
      weight: 2.5,
      opacity: 0.75,
      dashArray: "1 7",
      lineCap: "round",
      interactive: false,
    }).addTo(map);
    lineRef.current = line;
    const cancel = tween(550, (p) => {
      line.setLatLngs([from, L.latLng(from.lat + (to.lat - from.lat) * p, from.lng + (to.lng - from.lng) * p)]);
      if (p === 1 && selectedUniversity.distanceLabel) {
        lineLabelRef.current = L.tooltip({ permanent: true, direction: "center", className: "ul-route-label", interactive: false })
          .setLatLng(L.latLng((from.lat + to.lat) / 2, (from.lng + to.lng) / 2))
          .setContent(selectedUniversity.distanceLabel)
          .addTo(map);
      }
    });
    return cancel;
    // Redraw on a new selection only; dragging the origin moves it below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeKey]);

  // While the origin is dragged, the line and its label follow without redrawing.
  useEffect(() => {
    if (!lineRef.current || !origin || !selectedUniversity) return;
    const from = L.latLng(origin.lat, origin.lng);
    const to = L.latLng(selectedUniversity.lat, selectedUniversity.lng);
    lineRef.current.setLatLngs([from, to]);
    if (lineLabelRef.current && selectedUniversity.distanceLabel) {
      lineLabelRef.current
        .setLatLng(L.latLng((from.lat + to.lat) / 2, (from.lng + to.lng) / 2))
        .setContent(selectedUniversity.distanceLabel);
    }
  }, [origin, selectedUniversity]);

  // Frame the results whenever the search or the starting point changes.
  const latest = useRef({ universities, origin, radiusKm });
  useEffect(() => {
    latest.current = { universities, origin, radiusKm };
  });
  useEffect(() => {
    const map = mapRef.current;
    if (!map || focusKey === "initial-empty") return;
    const { universities: list, origin: from, radiusKm: radius } = latest.current;
    const options = { ...padding(), maxZoom: 14, duration: reducedMotion() ? 0 : 1 };
    if (from && radius) {
      // The whole search circle, so every result inside it is on screen.
      map.flyToBounds(L.latLng(from.lat, from.lng).toBounds(radius * 2000), options);
      return;
    }
    const points: L.LatLngExpression[] = from ? [[from.lat, from.lng]] : [];
    // With a start point, the nearest few keep the view local.
    const nearest = from ? list.slice(0, 6) : list;
    for (const u of nearest) points.push([u.lat, u.lng]);
    if (points.length === 0) map.flyTo(EGYPT_CENTER, EGYPT_ZOOM, { duration: options.duration });
    else if (points.length === 1) map.flyTo(points[0]!, 12, { duration: options.duration });
    else map.flyToBounds(L.latLngBounds(points), options);
    // Only a new focusKey re-frames; dragging the origin must not.
  }, [focusKey]);

  // Bring a chosen university (and the visitor) into view.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedUniversity) return;
    const target = L.latLng(selectedUniversity.lat, selectedUniversity.lng);
    const bounds = origin ? L.latLngBounds([target, L.latLng(origin.lat, origin.lng)]) : L.latLngBounds([target, target]);
    map.flyToBounds(bounds, { ...padding(), maxZoom: origin ? 14 : 15, duration: reducedMotion() ? 0 : 0.8 });
    // Moving the origin while a university is open should not keep flying.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUniversity?.slug]);

  function fitAll() {
    const map = mapRef.current;
    if (!map) return;
    const points: L.LatLngExpression[] = universities.map((u) => [u.lat, u.lng]);
    if (origin) points.push([origin.lat, origin.lng]);
    if (points.length > 1) map.flyToBounds(L.latLngBounds(points), { ...padding(), duration: 0.8 });
  }

  return (
    // The picking class sits on the wrapper: Leaflet manages the container's
    // own classes, and React re-rendering them would wipe Leaflet's.
    <div
      className={cn("relative h-full w-full", picking && "ul-map-picking")}
      // Lifts Leaflet's bottom controls (the attribution) above the bottom sheet.
      style={{ "--map-inset-bottom": `${insets.bottom}px` } as React.CSSProperties}
    >
      <div ref={containerRef} className="ul-map h-full w-full bg-[#ECEFF3]" role="application" aria-label={t("map.label")} />


      {/* Phones (a sheet below): only locate and fit, just above the sheet;
          pinch zooms. Desktop: the full stack, top corner. */}
      <div
        className="pointer-events-none absolute end-3 z-[500] flex flex-col gap-2 transition-[bottom] duration-[420ms] ease-[cubic-bezier(0.32,0.72,0,1)]"
        style={insets.bottom ? { bottom: insets.bottom + 12 } : { top: insets.top + 12 }}
      >
        <div
          className={cn(
            "pointer-events-auto flex-col overflow-hidden rounded-xl bg-white shadow-[0_2px_8px_rgba(15,23,42,0.12),0_0_0_1px_rgba(15,23,42,0.06)]",
            insets.bottom ? "hidden" : "flex",
          )}
        >
          <MapButton label={t("map.zoomIn")} onClick={() => mapRef.current?.zoomIn()}>
            <Plus className="size-[18px]" aria-hidden />
          </MapButton>
          <span className="mx-2 h-px bg-slate-100" />
          <MapButton label={t("map.zoomOut")} onClick={() => mapRef.current?.zoomOut()}>
            <Minus className="size-[18px]" aria-hidden />
          </MapButton>
        </div>
        <div className="pointer-events-auto flex flex-col overflow-hidden rounded-xl bg-white shadow-[0_2px_8px_rgba(15,23,42,0.12),0_0_0_1px_rgba(15,23,42,0.06)]">
          <MapButton label={t("map.locate")} onClick={onLocate} active={locating}>
            <LocateFixed className={cn("size-[18px]", locating && "animate-pulse text-[#1E6DEB]")} aria-hidden />
          </MapButton>
          <span className="mx-2 h-px bg-slate-100" />
          <MapButton label={t("map.fitAll")} onClick={fitAll}>
            <Scan className="size-[18px]" aria-hidden />
          </MapButton>
        </div>
      </div>

      {universities.map((university) => {
        const element = pinElements.get(university.slug);
        if (!element) return null;
        return createPortal(
          <Pin university={university} selected={university.slug === selected} hovered={university.slug === hovered} />,
          element,
          university.slug,
        );
      })}
    </div>
  );
}

function MapButton({
  label,
  onClick,
  active = false,
  children,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={active || undefined}
      className="flex size-10 items-center justify-center text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#1E6DEB] active:bg-slate-100"
    >
      {children}
    </button>
  );
}

function Pin({ university, selected, hovered }: { university: MapUniversity; selected: boolean; hovered: boolean }) {
  return (
    <div className={cn("ul-pin", selected && "is-selected", hovered && "is-hovered", university.nearest && "is-nearest")}>
      <span className="ul-pin-head">
        <UniversityLogo name={university.name} logoUrl={university.logoUrl} className="size-full border-0 p-[5px]" />
      </span>
      <span className="ul-pin-tail" aria-hidden />
      {university.nearest ? <span className="ul-pin-dot" aria-hidden /> : null}
      <span className="ul-pin-label" aria-hidden>
        <span className="ul-pin-name">{university.name}</span>
        {university.distanceLabel ? <span className="ul-pin-distance">{university.distanceLabel}</span> : null}
      </span>
    </div>
  );
}
