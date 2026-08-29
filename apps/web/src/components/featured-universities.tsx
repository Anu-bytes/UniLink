"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Flame, Heart, MapPin } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { UniversityLogo } from "@/components/university-logo";
import type { UniversityCardData } from "@/lib/catalog";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

// Autoplay speed for the featured-universities rail, in CSS pixels per
// second. Tuned to read as a brisk, continuous drift rather than either a
// crawl or a blur — adjust here if it should feel faster or slower.
const AUTOPLAY_PX_PER_SEC = 90;

// How much a mouse hover slows the rail down, as a fraction of full speed —
// not to a dead stop. An instant full stop the moment the cursor merely
// crosses into the rail (the previous behaviour, shared with touch/click)
// read as the rail flinching away from the mouse. Easing down to a slow
// crawl instead keeps it feeling alive while still making a card easy to aim
// a click at, and speeds back up just as smoothly once the cursor leaves.
const HOVER_SPEED_FACTOR = 0.28;

// Time constant, in ms, for the speed easing above (both slowing on hover and
// recovering on mouse-leave). Larger = more gradual.
const SPEED_EASE_MS = 450;

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
  // distance the rail must wrap by — see the autoplay effect below for why it
  // has to be a difference of two measured positions, not either one alone.
  const firstItemRef = useRef<HTMLLIElement>(null);
  const loopStartRef = useRef<HTMLLIElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  // scrollLeft is negative in RTL in most engines, so compare on magnitude.
  const syncArrows = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const offset = Math.abs(rail.scrollLeft);
    const max = rail.scrollWidth - rail.clientWidth;
    setAtStart(offset <= 1);
    setAtEnd(max - offset <= 1);
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
  }, [syncArrows, visible.length]);

  // Reset to the first card whenever the city filter changes the contents.
  useEffect(() => {
    railRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  }, [activeCity]);

  const scrollByCard = useCallback(
    (direction: 1 | -1) => {
      const rail = railRef.current;
      if (!rail) return;
      const card = rail.querySelector("li");
      const step = (card?.clientWidth ?? 260) + 20;
      rail.scrollBy({ left: step * direction * (isRtl ? -1 : 1), behavior: "smooth" });
    },
    [isRtl],
  );

  // --- Autoplay: continuous one-direction rotation --------------------------
  //
  // This used to bounce a card-width at a time between the two ends, with a
  // dead pause between each jump — it read as a slow blink-step, not motion.
  // It now advances by a fraction of a pixel on every animation frame, in one
  // direction only, and the rail holds two back-to-back copies of the cards
  // so wrapping past the first copy is invisible: it lands on the
  // pixel-identical start of the second one. The effect is a loop, never a
  // reversal — closer to a rotating carousel than a left/right slider.
  //
  // Hard-pauses (stops entirely, resumes a few seconds after the last one)
  // on touch or a click/press — real interaction that autoplay would
  // otherwise fight, e.g. mid-swipe or while a card is being tapped. It does
  // NOT hard-pause on a mouse simply hovering; see hoveredRef below for what
  // that does instead. Also off entirely while the section is scrolled out
  // of view, and entirely under prefers-reduced-motion.
  const [interacting, setInteracting] = useState(false);
  const resumeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [inView, setInView] = useState(false);
  // Whether the mouse is currently over the rail. A ref, not state: it is
  // read once per animation frame by the tick loop below, not something the
  // rest of the component needs to re-render for.
  const hoveredRef = useRef(false);

  // Looping needs two distinct cards to loop between, and only matters when
  // motion is allowed — reduced motion never autoplays, so there is no reason
  // to double the DOM for a loop that will never run.
  const shouldLoop = !reducedMotion && visible.length > 1;

  // The rail renders this instead of `visible` directly. The second, looping
  // copy is marked so it can be pulled out of the accessibility tree and tab
  // order below — it is a visual duplicate, not a second university.
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
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);
    const onChange = () => setReducedMotion(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

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
    // Tracked separately from rail.scrollLeft in full JS-number precision.
    // Reading scrollLeft back and accumulating onto THAT compounds whatever
    // rounding the browser applies to the property, frame after frame — a
    // measured 90px/s came out closer to 120px/s over one second of ticks
    // that way. Writing a value we already know exactly sidesteps it, and
    // re-reading it fresh here (once, on effect start, not per frame) still
    // picks up wherever a manual scroll or swipe left the rail before
    // autoplay resumed.
    let position = initialRail.scrollLeft;
    // Eases toward 1 (full speed) or HOVER_SPEED_FACTOR (slowed) each frame,
    // rather than snapping straight to the target — see HOVER_SPEED_FACTOR.
    // Starts at 1 rather than at whatever the target happens to be, so
    // resuming after a hard pause (interacting flipping back to false, which
    // restarts this whole effect) comes back at full speed immediately
    // instead of re-easing up from a stop it never actually had.
    let speedFactor = 1;

    const tick = (now: number) => {
      const rail = railRef.current;
      const elapsed = now - last;
      last = now;

      if (rail) {
        // The distance to wrap by is the gap between the first real card and
        // the first card of the looping second copy, measured from the DOM —
        // not half of rail.scrollWidth. With N cards there are N-1 gaps
        // inside one copy but N gaps across the full doubled rail (the extra
        // one is the seam between the two copies), so that seam gap can't be
        // split evenly between "belongs to copy one" and "belongs to copy
        // two". scrollWidth / 2 quietly assumes it can, landing half a gap
        // short of the real period — a fixed few pixels every wrap that
        // compound, wrap after wrap, into a visible drift.
        //
        // It has to be a *difference* of two offsetLefts, not the second
        // one alone: offsetLeft is always a physical (left-edge) measurement,
        // but under dir="rtl" the layout runs right to left, so the first
        // card sits far from the physical left edge too — confirmed directly
        // in a browser at values like item0 = -285px, loopStart = -2841px.
        // Using loopStart alone as "the" distance (this component's first
        // shipped version) made the wrap condition true from frame one,
        // subtracting a huge wrong number every frame until scrollLeft
        // rocketed past the end of the scrollable range and sat pinned there
        // — the rail froze almost immediately, which is exactly what was
        // reported for the Arabic site. The difference between the two is
        // correct in both directions: confirmed by simulation to reproduce
        // the exact same visible sequence of cards on every wrap, in both
        // dir="ltr" and dir="rtl".
        const first = firstItemRef.current?.offsetLeft;
        const loopStart = loopStartRef.current?.offsetLeft;
        const period =
          first != null && loopStart != null
            ? Math.abs(first - loopStart)
            : undefined;

        if (period && period > 1) {
          // Exponential ease toward the target factor. `elapsed / SPEED_EASE_MS`
          // as the lerp weight approximates that time constant regardless of
          // the actual frame rate, so it looks the same at 60fps or 120fps.
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

  // Mirrors the tick effect's guard above exactly, so the two can never drift
  // out of sync: this is "is the animation currently the thing moving the
  // rail". See the className comment on the <ul> below for why it matters.
  const autoplayActive = shouldLoop && !reducedMotion && !interacting && inView;

  return (
    <>
      <div
        role="group"
        aria-label={filterLabel}
        className="flex flex-wrap justify-center gap-x-3 gap-y-2 md:gap-x-8 md:gap-y-3"
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
                "relative inline-flex min-h-11 items-center px-2 pb-1 text-base font-semibold outline-none transition-colors md:px-1 md:text-[18px]",
                "after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:origin-center after:rounded-full after:bg-[#1E6DEB] after:transition-transform after:duration-300 after:content-['']",
                "focus-visible:text-[#1E6DEB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]",
                selected
                  ? "text-[#1E6DEB] after:scale-x-100"
                  : "text-[#292E3E] after:scale-x-0 hover:text-[#1E6DEB]",
              )}
            >
              {city ?? allLabel}
            </button>
          );
        })}
      </div>

      <div
        ref={wrapRef}
        className="relative mt-8 md:mt-10"
        // Hover only slows the rail (see hoveredRef/HOVER_SPEED_FACTOR in the
        // tick loop above) — it does not hard-pause, so there is nothing to
        // resume from and no cooldown to schedule; the effect keeps running
        // and simply eases back to full speed once the pointer leaves.
        onMouseEnter={() => {
          hoveredRef.current = true;
        }}
        onMouseLeave={() => {
          hoveredRef.current = false;
        }}
        onTouchStart={pauseForInteraction}
        onPointerDown={pauseForInteraction}
      >
        {/* One row at every breakpoint: the rail scrolls horizontally and, for
            manual interaction, snaps card to card rather than wrapping onto a
            second and third row.

            `scroll-smooth` is deliberately absent: it would apply to every
            scrollLeft write, including the autoplay effect's direct
            per-frame writes, and fight the animation it is trying to drive
            smoothly on its own. Manual jumps (the arrows below) opt into
            smoothness explicitly via their own scrollBy() call.

            `snap-x snap-mandatory` is deliberately CONDITIONAL, dropped while
            `autoplayActive`. Confirmed directly in a browser: with mandatory
            snap active, `element.scrollLeft = x` for an x that is not itself
            a snap point is not merely re-corrected later, it is rejected
            synchronously — the property does not move at all. The autoplay
            effect's per-frame writes are essentially never on a snap point,
            so with snap left on throughout, every single write was silently
            discarded and the rail never actually moved. Snapping only earns
            its keep once a person is scrolling by hand, so it switches back
            on exactly then — same condition that gates the effect above. */}
        <ul
          ref={railRef}
          className={cn(
            "flex gap-5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            !autoplayActive && "snap-x snap-mandatory",
          )}
        >
          {trackItems.map(({ university, clone }, index) => (
            <li
              key={clone ? `${university.id}-loop` : university.id}
              // Item 0 and the first item of the second copy double as the
              // autoplay effect's measuring stick — see firstItemRef and
              // loopStartRef above.
              ref={
                index === 0
                  ? firstItemRef
                  : index === visible.length
                    ? loopStartRef
                    : undefined
              }
              aria-hidden={clone || undefined}
              className="w-[248px] shrink-0 snap-start sm:w-[264px]"
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

        {/* Arrows are desktop affordances; touch users swipe the rail. */}
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
      </div>
    </>
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
        "absolute top-1/2 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#E7EDF5] bg-white text-[#16233F] shadow-md transition-opacity hover:bg-[#F5F8FF] lg:flex",
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
   * only — pulled out of the accessibility tree and tab order so a screen
   * reader or keyboard user never lands on the same university twice.
   */
  decorative?: boolean;
}) {
  return (
    // The whole tile is the link, so the tap target is the card rather than a
    // small text CTA. The CTA below is presentational.
    <Link
      href={`/universities/${university.slug}`}
      aria-hidden={decorative || undefined}
      tabIndex={decorative ? -1 : undefined}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#E7EDF5] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#1E6DEB]/40 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden">
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

        {/* Only shown when a real logo exists. The initials fallback looked
            like a stray coloured blob half-overlapping the photo, so an
            absent logo now simply leaves the image clean. */}
        {university.logoUrl ? (
          <UniversityLogo
            name={university.name}
            logoUrl={university.logoUrl}
            className="absolute bottom-3 start-3 size-11 border-2 border-white shadow-md"
          />
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 min-h-12 text-[16px] font-bold leading-6 text-[#16233F]">
          {university.name}
        </h3>

        <p className="mt-1 flex items-center gap-1.5 text-sm text-[#5a6072]">
          <MapPin className="size-4 shrink-0 text-[#1E6DEB]" aria-hidden />
          <span className="truncate">{university.city}</span>
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

        <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#1E6DEB] transition-colors group-hover:text-[#1859c4]">
          {viewDetailsLabel}
          <ArrowRight
            className="size-4 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
            aria-hidden
          />
        </span>
      </div>
    </Link>
  );
}
