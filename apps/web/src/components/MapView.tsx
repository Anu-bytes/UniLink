"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef } from "react";
import { useIntl } from "@/i18n/provider";
import { pick, formatFeeRange } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { Locale } from "@/i18n/config";
import type { UniversitySummary } from "@/lib/types";

export interface MapBounds {
  minLat: number;
  minLng: number;
  maxLat: number;
  maxLng: number;
}

interface Props {
  points: UniversitySummary[];
  userLocation?: { lat: number; lng: number } | null;
  radiusKm?: number;
  fitToPoints?: boolean;
  onBoundsChange?: (b: MapBounds) => void;
  className?: string;
}

// Keyless OpenStreetMap raster style (swap for MapTiler vector tiles + key in prod).
const STYLE = {
  version: 8,
  glyphs: "https://fonts.openmaptiles.org/{fontstack}/{range}.pbf",
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "© OpenStreetMap contributors",
    },
  },
  layers: [{ id: "osm", type: "raster", source: "osm" }],
} as const;

function toFeatureCollection(points: UniversitySummary[], locale: Locale) {
  return {
    type: "FeatureCollection",
    features: points.map((p) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [p.lng, p.lat] },
      properties: {
        id: p.id,
        slug: p.slug,
        name: pick(p.name, locale),
        city: pick(p.city, locale),
        fees: formatFeeRange(p.minFees, p.maxFees, locale),
      },
    })),
  };
}

function circlePolygon(lat: number, lng: number, radiusKm: number) {
  const points = 64;
  const coords: [number, number][] = [];
  const dLat = radiusKm / 110.574;
  const dLng = radiusKm / (111.32 * Math.cos((lat * Math.PI) / 180));
  for (let i = 0; i <= points; i++) {
    const theta = (i / points) * 2 * Math.PI;
    coords.push([lng + dLng * Math.cos(theta), lat + dLat * Math.sin(theta)]);
  }
  return {
    type: "FeatureCollection",
    features: [{ type: "Feature", geometry: { type: "Polygon", coordinates: [coords] }, properties: {} }],
  };
}

export function MapView({
  points,
  userLocation,
  radiusKm,
  fitToPoints,
  onBoundsChange,
  className,
}: Props) {
  const { locale, m } = useIntl();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("maplibre-gl").Map | null>(null);
  const glRef = useRef<typeof import("maplibre-gl") | null>(null);
  const readyRef = useRef(false);
  const boundsCb = useRef(onBoundsChange);
  boundsCb.current = onBoundsChange;

  // Init once.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const maplibregl = (await import("maplibre-gl")).default;
      if (cancelled || !containerRef.current || mapRef.current) return;
      glRef.current = maplibregl;
      const map = new maplibregl.Map({
        container: containerRef.current,
        style: STYLE as never,
        center: [31.1, 29.7],
        zoom: 5.6,
        attributionControl: { compact: true },
      });
      mapRef.current = map;
      // Handle map errors ourselves so MapLibre doesn't spam console.error.
      // Tile/glyph fetches aborted during fast pan/zoom are benign; ignore them.
      map.on("error", (e) => {
        const msg = (e as { error?: { message?: string } })?.error?.message ?? "";
        if (/abort|signal is aborted/i.test(msg)) return;
        if (msg) console.warn("[maplibre]", msg);
      });
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

      map.on("load", () => {
        readyRef.current = true;
        map.addSource("unis", {
          type: "geojson",
          data: toFeatureCollection(points, locale) as never,
          cluster: true,
          clusterMaxZoom: 11,
          clusterRadius: 46,
        });
        map.addSource("radius", { type: "geojson", data: { type: "FeatureCollection", features: [] } as never });

        map.addLayer({
          id: "radius-fill",
          type: "fill",
          source: "radius",
          paint: { "fill-color": "#0047FF", "fill-opacity": 0.08 },
        });
        map.addLayer({
          id: "radius-line",
          type: "line",
          source: "radius",
          paint: { "line-color": "#0047FF", "line-width": 1.5, "line-dasharray": [2, 2] },
        });
        map.addLayer({
          id: "clusters",
          type: "circle",
          source: "unis",
          filter: ["has", "point_count"],
          paint: {
            "circle-color": "#0047FF",
            "circle-radius": ["step", ["get", "point_count"], 16, 4, 22, 8, 28],
            "circle-stroke-width": 4,
            "circle-stroke-color": "#E1E8FF",
          },
        });
        map.addLayer({
          id: "cluster-count",
          type: "symbol",
          source: "unis",
          filter: ["has", "point_count"],
          layout: {
            "text-field": ["get", "point_count_abbreviated"],
            "text-font": ["Noto Sans Regular"],
            "text-size": 13,
          },
          paint: { "text-color": "#ffffff" },
        });
        map.addLayer({
          id: "point",
          type: "circle",
          source: "unis",
          filter: ["!", ["has", "point_count"]],
          paint: {
            "circle-color": "#0047FF",
            "circle-radius": 8,
            "circle-stroke-width": 3,
            "circle-stroke-color": "#ffffff",
          },
        });

        map.on("click", "clusters", (e) => {
          const feats = map.queryRenderedFeatures(e.point, { layers: ["clusters"] });
          const clusterId = feats[0]?.properties?.cluster_id;
          const src = map.getSource("unis") as import("maplibre-gl").GeoJSONSource;
          src.getClusterExpansionZoom(clusterId).then((zoom) => {
            map.easeTo({ center: (feats[0].geometry as unknown as { coordinates: [number, number] }).coordinates, zoom });
          });
        });

        map.on("click", "point", (e) => {
          const f = e.features?.[0];
          if (!f) return;
          const p = f.properties as { name: string; city: string; fees: string; slug: string };
          const coords = (f.geometry as unknown as { coordinates: [number, number] }).coordinates.slice() as [number, number];
          const html = `
            <a href="/${locale}/universities/${p.slug}" style="display:block;width:240px;text-decoration:none;color:inherit">
              <div style="padding:12px 14px;font-family:system-ui,sans-serif">
                <div style="font-weight:700;color:#0b1220;font-size:14px">${p.name}</div>
                <div style="color:#5b6478;font-size:12px;margin-top:2px">${p.city}</div>
                <div style="margin-top:8px;color:#0b1220;font-size:13px">${p.fees}</div>
                <div style="margin-top:10px;color:#0047ff;font-weight:600;font-size:13px">${m.common.viewProfile} →</div>
              </div>
            </a>`;
          new maplibregl.Popup({ closeButton: true, offset: 14, maxWidth: "260px" })
            .setLngLat(coords)
            .setHTML(html)
            .addTo(map);
        });

        for (const layer of ["clusters", "point"]) {
          map.on("mouseenter", layer, () => (map.getCanvas().style.cursor = "pointer"));
          map.on("mouseleave", layer, () => (map.getCanvas().style.cursor = ""));
        }

        if (boundsCb.current) {
          map.on("moveend", () => {
            const b = map.getBounds();
            boundsCb.current?.({
              minLat: b.getSouth(),
              minLng: b.getWest(),
              maxLat: b.getNorth(),
              maxLng: b.getEast(),
            });
          });
        }
      });
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      readyRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update points when they change.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !readyRef.current) return;
    const src = map.getSource("unis") as import("maplibre-gl").GeoJSONSource | undefined;
    src?.setData(toFeatureCollection(points, locale) as never);

    if (fitToPoints && points.length && glRef.current) {
      const b = new glRef.current.LngLatBounds();
      points.forEach((p) => b.extend([p.lng, p.lat]));
      map.fitBounds(b, { padding: 64, maxZoom: 12, duration: 500 });
    }
  }, [points, locale, fitToPoints]);

  // User location marker + radius circle.
  const markerRef = useRef<import("maplibre-gl").Marker | null>(null);
  useEffect(() => {
    const map = mapRef.current;
    const gl = glRef.current;
    if (!map || !readyRef.current || !gl) return;

    markerRef.current?.remove();
    markerRef.current = null;
    const radiusSrc = map.getSource("radius") as import("maplibre-gl").GeoJSONSource | undefined;

    if (userLocation) {
      const el = document.createElement("div");
      el.style.cssText =
        "width:18px;height:18px;border-radius:9999px;background:#F82C1F;border:3px solid #fff;box-shadow:0 0 0 4px rgba(248,44,31,.25)";
      markerRef.current = new gl.Marker({ element: el })
        .setLngLat([userLocation.lng, userLocation.lat])
        .addTo(map);
      if (radiusKm) {
        radiusSrc?.setData(circlePolygon(userLocation.lat, userLocation.lng, radiusKm) as never);
        map.easeTo({ center: [userLocation.lng, userLocation.lat], zoom: radiusKm <= 10 ? 10.5 : 9 });
      }
    } else {
      radiusSrc?.setData({ type: "FeatureCollection", features: [] } as never);
    }
  }, [userLocation, radiusKm]);

  return <div ref={containerRef} className={cn("size-full", className)} aria-label={m.map.title} />;
}
