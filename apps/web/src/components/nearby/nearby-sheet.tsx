"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export type SheetSnap = "peek" | "half" | "full";

const PEEK = 112;
const TOP_GAP = 72;

/**
 * A non-modal bottom sheet over the map (phones), like a maps app: drag the
 * handle between a peek, half and full height, or flick it. It reports how
 * much of the map it covers so the map can keep results above it.
 */
export function NearbySheet({
  snap,
  onSnap,
  onCover,
  header,
  children,
  scrollKey,
}: {
  snap: SheetSnap;
  onSnap: (snap: SheetSnap) => void;
  /** Pixels of the map the sheet covers at rest. */
  onCover: (pixels: number) => void;
  header: React.ReactNode;
  children: React.ReactNode;
  /** Resets the scroll position when the content changes (list vs detail). */
  scrollKey: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [drag, setDrag] = useState<number | null>(null);
  const gesture = useRef<{ y: number; base: number; time: number; lastY: number; lastTime: number } | null>(null);

  // The sheet spans its container; snaps are heights within it.
  useLayoutEffect(() => {
    const parent = rootRef.current?.parentElement;
    if (!parent) return;
    const observer = new ResizeObserver(() => setHeight(parent.clientHeight));
    observer.observe(parent);
    setHeight(parent.clientHeight);
    return () => observer.disconnect();
  }, []);

  const heights: Record<SheetSnap, number> = {
    peek: PEEK,
    half: Math.round(height * 0.52),
    full: Math.max(PEEK, height - TOP_GAP),
  };
  const visible = drag ?? heights[snap];

  useEffect(() => {
    if (height) onCover(Math.min(heights[snap], heights.half));
    // heights derive from height and snap.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snap, height]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [scrollKey]);

  function onPointerDown(event: React.PointerEvent) {
    // Taps on buttons inside the header still work as taps.
    if ((event.target as HTMLElement).closest("button, a, select, input")) return;
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    const now = performance.now();
    gesture.current = { y: event.clientY, base: heights[snap], time: now, lastY: event.clientY, lastTime: now };
    setDrag(heights[snap]);
  }

  function onPointerMove(event: React.PointerEvent) {
    const g = gesture.current;
    if (!g) return;
    const next = g.base + (g.y - event.clientY);
    // Rubber-band past the ends.
    const min = heights.peek;
    const max = heights.full;
    const banded = next < min ? min - (min - next) * 0.3 : next > max ? max + (next - max) * 0.3 : next;
    g.lastY = event.clientY;
    g.lastTime = performance.now();
    setDrag(banded);
  }

  function onPointerUp(event: React.PointerEvent) {
    const g = gesture.current;
    gesture.current = null;
    if (!g || drag === null) {
      setDrag(null);
      return;
    }
    const moved = Math.abs(event.clientY - g.y);
    const elapsed = Math.max(1, performance.now() - g.time);
    const velocity = (g.y - event.clientY) / elapsed; // px/ms, up is positive
    const order: SheetSnap[] = ["peek", "half", "full"];
    let target: SheetSnap;
    if (moved < 6) {
      // A tap on the handle steps the sheet up (or back to peek from full).
      target = snap === "full" ? "peek" : order[order.indexOf(snap) + 1]!;
    } else if (Math.abs(velocity) > 0.45) {
      const index = order.indexOf(snap) + (velocity > 0 ? 1 : -1);
      target = order[Math.max(0, Math.min(order.length - 1, index))]!;
    } else {
      target = order.reduce((best, key) => (Math.abs(heights[key] - drag) < Math.abs(heights[best] - drag) ? key : best), snap);
    }
    setDrag(null);
    onSnap(target);
  }

  return (
    <div
      ref={rootRef}
      className={cn(
        "absolute inset-x-0 bottom-0 z-[900] flex flex-col rounded-t-[20px] bg-white shadow-[0_-8px_30px_-12px_rgba(15,23,42,0.35),0_0_0_1px_rgba(15,23,42,0.05)]",
        drag === null && "transition-[height] duration-[420ms] ease-[cubic-bezier(0.32,0.72,0,1)]",
      )}
      style={{ height: Math.max(0, visible) }}
    >
      <div
        className="shrink-0 cursor-grab touch-none select-none px-5 pb-3 pt-2.5 active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <span className="mx-auto mb-3 block h-1 w-9 rounded-full bg-slate-300" aria-hidden />
        {header}
      </div>
      <div
        ref={scrollRef}
        className={cn("ul-thin-scroll min-h-0 flex-1 overscroll-contain border-t border-slate-100", snap === "peek" && drag === null ? "overflow-hidden" : "overflow-y-auto")}
      >
        {children}
      </div>
    </div>
  );
}
