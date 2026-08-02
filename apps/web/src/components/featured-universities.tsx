"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Flame, Heart, MapPin } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { UniversityLogo } from "@/components/university-logo";
import type { UniversityCardData } from "@/lib/catalog";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

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

  const railRef = useRef<HTMLUListElement>(null);
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

  // Reset to the first card when the city filter changes the contents.
  useEffect(() => {
    railRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  }, [activeCity]);

  function scrollByCard(direction: 1 | -1) {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector("li");
    const step = (card?.clientWidth ?? 260) + 20;
    rail.scrollBy({ left: step * direction * (isRtl ? -1 : 1), behavior: "smooth" });
  }

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

      <div className="relative mt-8 md:mt-10">
        {/* One row at every breakpoint: the rail scrolls horizontally and snaps
            card to card, rather than wrapping onto a second and third row. */}
        <ul
          ref={railRef}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {visible.map((university) => (
            <li
              key={university.id}
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
}: {
  university: UniversityCardData;
  programsLabel: string;
  facultiesLabel: string;
  typeLabel: string;
  recommendedLabel: string;
  trendingLabel: string;
  viewDetailsLabel: string;
  locale: string;
}) {
  return (
    // The whole tile is the link, so the tap target is the card rather than a
    // small text CTA. The CTA below is presentational.
    <Link
      href={`/universities/${university.slug}`}
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
