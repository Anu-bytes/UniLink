"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Flame, Heart, MapPin } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { UniversityCompareToggle } from "@/components/app/university-compare-toggle";
import { UniversityLogo } from "@/components/university-logo";
import { AcronymBadge } from "@/components/university/acronym-badge";
import { useMediaQuery } from "@/hooks/use-media-query";
import type { UniversityCardData } from "@/lib/catalog";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

// Autoplay speed for the featured-universities rail, in CSS pixels per
// second. Tuned to read as a brisk, continuous drift rather than either a
// crawl or a blur. Adjust here if it should feel faster or slower.
const AUTOPLAY_PX_PER_SEC = 90;

// How much a mouse hover slows the rail down, as a fraction of full speed,
// not to a dead stop. Easing down to a slow crawl keeps it feeling alive
// while still making a card easy to aim a click at.
const HOVER_SPEED_FACTOR = 0.28;

// Time constant, in ms, for the speed easing above (both slowing on hover and
// recovering on mouse-leave). Larger = more gradual.
const SPEED_EASE_MS = 450;

// Gap between rail cards, in px. Must match the `gap-4 md:gap-5` on the rail
// below at the width where the fits-in-the-rail check matters (desktop).
const RAIL_GAP_PX = 20;

// Phones, tablets and any touch screen get a plain swipe carousel: no
// autoplay. A rail that drifts on its own while a thumb is trying to land on
// a card (and that clips cards at both edges mid-drift) was reported as
// unusable on mobile.
const COMPACT_QUERY = "(max-width: 1023px), (pointer: coarse)";

export function FeaturedUniversities({
  universities,
  allLabel,
  filterLabel,
  programsLabel,
  viewDetailsLabel,
}: {
  universities: UniversityCardData[];
  allLabel: string;
  filterLabel: string;
  programsLabel: string;
  viewDetailsLabel: string;
}) {
  // Catalog and UniversityDetail supply the type and faculty wording, so the
  // caller does not have to thread another four labels through as props.
  const tCatalog = useTranslations("Catalog");
  const tDetail = useTranslations("UniversityDetail");
  const tHome = useTranslations("Home.landing.partners");
  const locale = useLocale();
  const isRtl = locale.startsWith("ar");

  const [activeCity, setActiveCity] = useState<string | null>(null);
  const cities = useMemo(
    () => Array.from(new Set(universities.map((item) => item.city))),
    [universities],
  );
  const visible = activeCity
    ? universities.filter((item) => item.city === activeCity)
    : universities;

  const wrapRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLUListElement>(null);
  // The rail's first real card and the first card of its looping second copy.
  // The *difference* between their offsetLeft values is the exact pixel
  // distance the rail must wrap by; see the autoplay effect below.
  const firstItemRef = useRef<HTMLLIElement>(null);
  const loopStartRef = useRef<HTMLLIElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  // Scroll position as 0..1 and the visible share of the rail, for the
  // progress bar under the swipe carousel.
  const [progress, setProgress] = useState(0);
  const [viewShare, setViewShare] = useState(1);

  const compact = useMediaQuery(COMPACT_QUERY);

  // True while the real cards all fit inside the rail without scrolling.
  // Starts true so the server render has no looping copy; it is only
  // switched off, after measuring, when the cards genuinely overflow. With
  // only a couple of universities the looping copy would land on screen
  // right next to the originals and read as the same cards repeated.
  const [fits, setFits] = useState(true);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    function measure() {
      const card = firstItemRef.current;
      if (!wrap || !card) return;
      const total =
        visible.length * card.offsetWidth + (visible.length - 1) * RAIL_GAP_PX;
      setFits(total <= wrap.clientWidth);
    }

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(wrap);
    return () => observer.disconnect();
  }, [visible.length]);

  // scrollLeft is negative in RTL in most engines, so compare on magnitude.
  const syncArrows = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const offset = Math.abs(rail.scrollLeft);
    const max = rail.scrollWidth - rail.clientWidth;
    setAtStart(offset <= 1);
    setAtEnd(max - offset <= 1);
    setProgress(max > 0 ? Math.min(1, offset / max) : 0);
    setViewShare(rail.scrollWidth > 0 ? Math.min(1, rail.clientWidth / rail.scrollWidth) : 1);
  }, []);

  useEffect(() => {
    syncArrows();
    const rail = railRef.current;
    if (!rail) return;
    rail.addEventListener("scroll", syncArrows, { passive: true });
    window.addEventListener("resize", syncArrows);
    return () => {
      rail.removeEventListener("scroll", syncArrows);
      window.removeEventListener("resize", syncArrows);
    };
  }, [syncArrows, visible.length, compact]);

  // Reset to the first card whenever the city filter changes the contents.
  useEffect(() => {
    railRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  }, [activeCity]);

  const scrollByCard = useCallback(
    (direction: 1 | -1) => {
      const rail = railRef.current;
      if (!rail) return;
      // Card pitch measured from the DOM, so it is right at every breakpoint
      // (the gap is smaller on a phone than on desktop).
      const [first, second] = rail.querySelectorAll("li");
      const step =
        first && second
          ? Math.abs(second.offsetLeft - first.offsetLeft)
          : (first?.clientWidth ?? 260) + RAIL_GAP_PX;
      rail.scrollBy({ left: step * direction * (isRtl ? -1 : 1), behavior: "smooth" });
    },
    [isRtl],
  );

  // --- Autoplay (desktop with a mouse only): continuous one-direction loop --
  //
  // Advances by a fraction of a pixel on every animation frame, and the rail
  // holds two back-to-back copies of the cards so wrapping past the first
  // copy is invisible: it lands on the pixel-identical start of the second.
  //
  // Hard-pauses on a click/press (resumes a few seconds after), only slows on
  // hover, and is off entirely while scrolled out of view, under
  // prefers-reduced-motion, and on compact/touch screens (see COMPACT_QUERY).
  const [interacting, setInteracting] = useState(false);
  const resumeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [inView, setInView] = useState(false);
  // Whether the mouse is currently over the rail. A ref, not state: it is
  // read once per animation frame by the tick loop below.
  const hoveredRef = useRef(false);

  const shouldLoop = !reducedMotion && !compact && visible.length > 1 && !fits;

  // The rail renders this instead of `visible` directly. The second, looping
  // copy is marked so it can be pulled out of the accessibility tree and tab
  // order below: it is a visual duplicate, not a second university.
  const trackItems = useMemo(
    () =>
      shouldLoop
        ? [
            ...visible.map((university) => ({ university, clone: false as const })),
            ...visible.map((university) => ({ university, clone: true as const })),
          ]
        : visible.map((university) => ({ university, clone: false as const })),
    [visible, shouldLoop],
  );

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const pauseForInteraction = useCallback(() => {
    setInteracting(true);
    if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
    resumeTimeout.current = setTimeout(() => setInteracting(false), 4000);
  }, []);

  useEffect(() => () => {
    if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
  }, []);

  useEffect(() => {
    if (reducedMotion || interacting || !inView || !shouldLoop) return;
    const initialRail = railRef.current;
    if (!initialRail) return;

    let frame = 0;
    let last = performance.now();
    // Tracked separately from rail.scrollLeft in full precision: reading
    // scrollLeft back and accumulating onto it compounds the browser's
    // rounding frame after frame.
    let position = initialRail.scrollLeft;
    let speedFactor = 1;

    const tick = (now: number) => {
      const rail = railRef.current;
      const elapsed = now - last;
      last = now;

      if (rail) {
        // The wrap distance is the gap between the first real card and the
        // first card of the looping copy, measured from the DOM. It has to
        // be a *difference* of two offsetLefts: offsetLeft is a physical
        // measurement, and under dir="rtl" the first card sits far from the
        // physical left edge too.
        const first = firstItemRef.current?.offsetLeft;
        const loopStart = loopStartRef.current?.offsetLeft;
        const period =
          first != null && loopStart != null
            ? Math.abs(first - loopStart)
            : undefined;

        if (period && period > 1) {
          const target = hoveredRef.current ? HOVER_SPEED_FACTOR : 1;
          speedFactor += (target - speedFactor) * Math.min(1, elapsed / SPEED_EASE_MS);

          const delta = (AUTOPLAY_PX_PER_SEC * speedFactor * elapsed) / 1000;
          position += isRtl ? -delta : delta;

          if (!isRtl && position >= period) {
            position -= period;
          } else if (isRtl && position <= -period) {
            position += period;
          }

          rail.scrollLeft = position;
        }
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reducedMotion, interacting, inView, shouldLoop, isRtl]);

  // Mirrors the tick effect's guard exactly: "is the animation currently the
  // thing moving the rail". Mandatory scroll snapping silently rejects the
  // per-frame scrollLeft writes, so snapping is only on when it is not.
  const autoplayActive = shouldLoop && !reducedMotion && !interacting && inView;

  return (
    <>
      {/* City filter. On a phone it is one row of chips that scrolls
          sideways (edge to edge) instead of wrapping onto three lines; from
          md up it is the centred underline tab row. */}
      <div
        role="group"
        aria-label={filterLabel}
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:justify-center md:gap-x-8 md:gap-y-3 md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden"
      >
        {[null, ...cities].map((city) => {
          const selected = city === activeCity;
          return (
            <button
              key={city ?? "all"}
              type="button"
              aria-pressed={selected}
              onClick={() => setActiveCity(city)}
              className={cn(
                "relative inline-flex h-10 shrink-0 items-center rounded-full border px-4 text-sm font-semibold outline-none transition-colors",
                "md:h-auto md:min-h-11 md:rounded-none md:border-0 md:bg-transparent md:px-1 md:pb-1 md:text-[18px] md:shadow-none",
                "md:after:absolute md:after:inset-x-0 md:after:-bottom-px md:after:h-0.5 md:after:origin-center md:after:rounded-full md:after:bg-[#1E6DEB] md:after:transition-transform md:after:duration-300 md:after:content-['']",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]",
                selected
                  ? "border-[#1E6DEB] bg-[#1E6DEB] text-white shadow-[0_6px_16px_-8px_rgba(30,109,235,0.9)] md:text-[#1E6DEB] md:after:scale-x-100"
                  : "border-slate-200 bg-white text-[#292E3E] hover:border-[#1E6DEB]/40 hover:text-[#1E6DEB] md:after:scale-x-0",
              )}
            >
              {city ?? allLabel}
            </button>
          );
        })}
      </div>

      <div
        ref={wrapRef}
        className="relative mt-6 md:mt-10"
        onMouseEnter={() => {
          hoveredRef.current = true;
        }}
        onMouseLeave={() => {
          hoveredRef.current = false;
        }}
        onPointerDown={pauseForInteraction}
      >
        {/* One row at every breakpoint. On compact screens the rail runs edge
            to edge so the next card peeks in from the side (an obvious "swipe
            me" cue) and every card snaps cleanly into place. */}
        <ul
          ref={railRef}
          className={cn(
            "flex gap-4 overflow-x-auto pb-3 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] md:gap-5 [&::-webkit-scrollbar]:hidden",
            !autoplayActive && "snap-x snap-mandatory",
            compact
              ? "-mx-4 scroll-px-4 px-4 md:-mx-6 md:scroll-px-6 md:px-6"
              : // Centres a short row, but caps at the container width so a
                // long one still scrolls from its first card.
                "mx-auto w-fit max-w-full",
          )}
        >
          {trackItems.map(({ university, clone }, index) => (
            <li
              key={clone ? `${university.id}-loop` : university.id}
              ref={
                index === 0
                  ? firstItemRef
                  : index === visible.length
                    ? loopStartRef
                    : undefined
              }
              aria-hidden={clone || undefined}
              className="w-[80vw] max-w-[300px] shrink-0 snap-start sm:w-[264px]"
            >
              <UniversityTile
                university={university}
                programsLabel={programsLabel}
                facultiesLabel={tDetail("facultiesStat")}
                typeLabel={tCatalog(`universityTypes.${university.type}`)}
                recommendedLabel={tDetail("recommended")}
                trendingLabel={tDetail("trending")}
                viewDetailsLabel={viewDetailsLabel}
                locale={locale}
                decorative={clone}
              />
            </li>
          ))}
        </ul>

        {/* Desktop arrows, floating on the rail's edges. */}
        <RailButton
          side="start"
          disabled={atStart}
          onClick={() => scrollByCard(-1)}
          isRtl={isRtl}
        />
        <RailButton
          side="end"
          disabled={atEnd}
          onClick={() => scrollByCard(1)}
          isRtl={isRtl}
        />

        {/* Compact pager: prev / progress / next under the swipe carousel,
            so it is obvious there is more to see and how far along you are. */}
        {compact && !(atStart && atEnd) ? (
          <div className="mt-3 flex items-center justify-center gap-4">
            <PagerButton
              label={tHome("prev")}
              direction="prev"
              disabled={atStart}
              isRtl={isRtl}
              onClick={() => scrollByCard(-1)}
            />
            <div
              aria-hidden
              className="relative h-1.5 w-28 overflow-hidden rounded-full bg-[#E3EAF6]"
            >
              <span
                className="absolute inset-y-0 rounded-full bg-[#1E6DEB] transition-[inset-inline-start] duration-150"
                style={{
                  width: `${Math.max(14, viewShare * 100)}%`,
                  insetInlineStart: `${progress * (100 - Math.max(14, viewShare * 100))}%`,
                }}
              />
            </div>
            <PagerButton
              label={tHome("next")}
              direction="next"
              disabled={atEnd}
              isRtl={isRtl}
              onClick={() => scrollByCard(1)}
            />
          </div>
        ) : null}
      </div>
    </>
  );
}

function PagerButton({
  label,
  direction,
  disabled,
  isRtl,
  onClick,
}: {
  label: string;
  direction: "prev" | "next";
  disabled: boolean;
  isRtl: boolean;
  onClick: () => void;
}) {
  const pointsLeft = direction === "prev" ? !isRtl : isRtl;
  const Icon = pointsLeft ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex size-10 items-center justify-center rounded-full border border-[#E3EAF6] bg-white text-[#16233F] shadow-sm transition-all active:scale-95 disabled:opacity-35"
    >
      <Icon className="size-5" aria-hidden />
    </button>
  );
}

function RailButton({
  side,
  disabled,
  onClick,
  isRtl,
}: {
  side: "start" | "end";
  disabled: boolean;
  onClick: () => void;
  isRtl: boolean;
}) {
  // The chevron points outward in reading order, which flips with direction.
  const pointsLeft = side === "start" ? !isRtl : isRtl;
  const Icon = pointsLeft ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-hidden
      tabIndex={-1}
      className={cn(
        "absolute top-[42%] hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#E7EDF5] bg-white text-[#16233F] shadow-md transition-opacity hover:bg-[#F5F8FF] lg:flex",
        side === "start" ? "start-0 -translate-x-1/2" : "end-0 translate-x-1/2",
        disabled && "pointer-events-none opacity-0",
      )}
    >
      <Icon className="size-5" />
    </button>
  );
}

function UniversityTile({
  university,
  programsLabel,
  facultiesLabel,
  typeLabel,
  recommendedLabel,
  trendingLabel,
  viewDetailsLabel,
  locale,
  decorative = false,
}: {
  university: UniversityCardData;
  programsLabel: string;
  facultiesLabel: string;
  typeLabel: string;
  recommendedLabel: string;
  trendingLabel: string;
  viewDetailsLabel: string;
  locale: string;
  /**
   * True for the second, looping copy of the rail. It is a visual duplicate
   * only, pulled out of the accessibility tree and tab order so a screen
   * reader or keyboard user never lands on the same university twice.
   */
  decorative?: boolean;
}) {
  return (
    // A plain wrapper rather than the link itself: the compare toggle is a
    // real <button>, which can't nest inside an <a>. The stretched Link
    // covers the whole tile; the visual layers are pointer-events-none so
    // taps fall through to it, and only the toggle takes its own taps.
    <div
      aria-hidden={decorative || undefined}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#E7EDF5] bg-white shadow-[0_10px_30px_-18px_rgba(15,23,42,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-[#1E6DEB]/40 hover:shadow-lg"
    >
      <Link
        href={`/universities/${university.slug}`}
        aria-label={university.name}
        tabIndex={decorative ? -1 : undefined}
        className="absolute inset-0 z-0 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
      />

      <div className="pointer-events-none relative aspect-[16/10] w-full overflow-hidden">
        {university.coverImageUrl ? (
          <div
            role="img"
            aria-label={university.name}
            className="size-full bg-slate-200 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{
              backgroundImage: `url(${JSON.stringify(university.coverImageUrl)})`,
            }}
          />
        ) : (
          <div className="size-full bg-gradient-to-br from-[#EAF1FF] to-[#DCE7FA] transition-transform duration-500 group-hover:scale-105" />
        )}

        {/* Scrim so the type chip stays legible over any photograph. */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B3A]/55 via-transparent to-transparent" />

        <span className="absolute start-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-[#1E3A8A] shadow-sm">
          {typeLabel}
        </span>

        {university.isRecommended || university.isTrending ? (
          <span className="absolute end-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold shadow-sm">
            {university.isTrending ? (
              <>
                <Flame className="size-3 text-[#F82C1F]" aria-hidden />
                <span className="text-[#C81F15]">{trendingLabel}</span>
              </>
            ) : (
              <>
                <Heart className="size-3 text-[#1E6DEB]" aria-hidden />
                <span className="text-[#1E3A8A]">{recommendedLabel}</span>
              </>
            )}
          </span>
        ) : null}

        {university.acronym ? (
          <AcronymBadge
            acronym={university.acronym}
            variant="solid"
            size="lg"
            className="absolute bottom-3 end-3"
          />
        ) : null}

        {/* Only shown when a real logo exists; the initials fallback looked
            like a stray coloured blob over the photo. */}
        {university.logoUrl ? (
          <UniversityLogo
            name={university.name}
            logoUrl={university.logoUrl}
            className="absolute bottom-3 start-3 size-11 border-2 border-white shadow-md"
          />
        ) : null}
      </div>

      <div className="pointer-events-none relative flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 min-h-12 text-[16px] font-bold leading-6 text-[#16233F]">
          {university.name}
        </h3>

        <p className="mt-1 flex items-center gap-1.5 text-sm text-[#5a6072]">
          <MapPin className="size-4 shrink-0 text-[#1E6DEB]" aria-hidden />
          <span className="truncate">
            {university.city}
            {university.governorate ? `, ${university.governorate}` : ""}
          </span>
        </p>

        {/* Both counts carry a label; a bare number beside an icon read as
            noise at this size. */}
        <dl className="mt-3 grid grid-cols-2 gap-3 rounded-xl bg-[#F7F9FE] px-3 py-2.5">
          <div className="min-w-0">
            <dt className="truncate text-[11px] font-medium text-[#5a6072]">
              {facultiesLabel}
            </dt>
            <dd className="mt-0.5 text-[15px] font-bold text-[#16233F]">
              {formatNumber(locale, university.facultyCount)}
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="truncate text-[11px] font-medium text-[#5a6072]">
              {programsLabel}
            </dt>
            <dd className="mt-0.5 text-[15px] font-bold text-[#16233F]">
              {formatNumber(locale, university.programCount)}
            </dd>
          </div>
        </dl>

        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#1E6DEB] transition-colors group-hover:text-[#1859c4]">
            {viewDetailsLabel}
            <ArrowRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
              aria-hidden
            />
          </span>
          {decorative ? null : (
            <UniversityCompareToggle
              id={university.id}
              name={university.name}
              logoUrl={university.logoUrl}
              className="pointer-events-auto shadow-none ring-slate-200"
            />
          )}
        </div>
      </div>
    </div>
  );
}
