import {
  ArrowUpRight,
  Building2,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Flame,
  Heart,
  Layers,
  MapPin,
} from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { ViewTransition } from "react";

import { auth } from "@/auth";
import { Link } from "@/i18n/navigation";
import { UniversityCompareToggle } from "@/components/app/university-compare-toggle";
import { UniversitySaveToggle } from "@/components/app/university-save-toggle";
import { UniversityLogo } from "@/components/university-logo";
import { AcronymBadge } from "@/components/university/acronym-badge";
import { AdvancedSearchPromo } from "@/components/university/advanced-search-promo";
import { UniversityDirectoryFiltersBar } from "@/components/university/directory-filters";
import {
  getPublishedUniversities,
  getUniversityCities,
  type UniversityCardData,
} from "@/lib/catalog";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{
    q?: string;
    type?: string;
    city?: string;
    page?: string;
  }>;
};

export default async function UniversitiesPage({ searchParams }: PageProps) {
  const t = await getTranslations("Universities");
  const tDirectory = await getTranslations("UniversityDirectory");
  const locale = await getLocale();

  const { q, type, city, page } = await searchParams;
  const requested = Number.parseInt(page ?? "1", 10);
  const [session, directory, cities] = await Promise.all([
    auth(),
    getPublishedUniversities(
      locale,
      {
        q: q?.trim() || undefined,
        types: type ? [type] : undefined,
        cities: city ? [city] : undefined,
      },
      Number.isFinite(requested) && requested > 0 ? requested : 1,
    ),
    getUniversityCities(locale),
  ]);

  const universities = directory.results;
  const hasActiveFilters = Boolean(q?.trim() || type || city);

  // The filter bar rebuilds the query string from scratch, so changing a filter
  // already drops the page; only these links need to carry it.
  const pageHref = (target: number) => {
    const params = new URLSearchParams();
    if (q?.trim()) params.set("q", q.trim());
    if (type) params.set("type", type);
    if (city) params.set("city", city);
    if (target > 1) params.set("page", String(target));
    const query = params.toString();
    return `/universities${query ? `?${query}` : ""}`;
  };

  return (
    <>
      {/* Colored banner carrying the title straight down into the search
          card, so the page opens with one dense block instead of a tall
          empty hero followed by a thin filter strip. */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1E6DEB] to-[#12224A] pb-11 pt-7 md:pb-14 md:pt-9">
        <div
          aria-hidden
          className="ul-dots pointer-events-none absolute -inset-8 opacity-20"
        />
        <div className="relative mx-auto max-w-3xl px-4 text-center md:px-6">
          <h1 className="text-2xl font-bold text-white md:text-3xl">
            {t("title")}
          </h1>
          <p className="mt-1.5 text-sm text-white/80 md:text-base">{t("subtitle")}</p>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-sm font-semibold text-white/90">
            <span className="flex items-center gap-1.5">
              <Building2 className="size-4" aria-hidden />
              {tDirectory("resultCount", { count: directory.total })}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4" aria-hidden />
              {tDirectory("cityCount", { count: cities.length })}
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 md:px-6 md:pb-20">
        <div className="-mt-6 md:-mt-7">
          <UniversityDirectoryFiltersBar
            cities={cities}
            initial={{ q: q ?? "", type: type ?? "", city: city ?? "" }}
            isAuthenticated={Boolean(session)}
          />
        </div>

        {!session ? (
          <div className="mt-3">
            <AdvancedSearchPromo />
          </div>
        ) : null}

        {hasActiveFilters ? (
          <p className="mt-4 text-sm font-semibold text-[#5a6072]">
            {tDirectory("resultCount", { count: directory.total })}
          </p>
        ) : null}

        {universities.length > 0 ? (
          <>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-5">
              {universities.map((university, index) => (
                <UniversityCard key={university.id} university={university} index={index} />
              ))}
            </div>

            {directory.pageCount > 1 ? (
              <nav
                aria-label={tDirectory("pageOf", {
                  page: directory.page,
                  total: directory.pageCount,
                })}
                className="mt-10 flex items-center justify-center gap-3"
              >
                {directory.page > 1 ? (
                  <Link
                    href={pageHref(directory.page - 1)}
                    className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-[#1F2A44] shadow-sm transition-colors hover:border-[#1E6DEB]/40 hover:text-[#1E6DEB]"
                  >
                    <ChevronLeft className="size-4 rtl:rotate-180" aria-hidden />
                    {tDirectory("previous")}
                  </Link>
                ) : null}

                <span className="text-sm font-semibold text-[#5a6072]">
                  {tDirectory("pageOf", {
                    page: directory.page,
                    total: directory.pageCount,
                  })}
                </span>

                {directory.page < directory.pageCount ? (
                  <Link
                    href={pageHref(directory.page + 1)}
                    className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-[#1F2A44] shadow-sm transition-colors hover:border-[#1E6DEB]/40 hover:text-[#1E6DEB]"
                  >
                    {tDirectory("next")}
                    <ChevronRight className="size-4 rtl:rotate-180" aria-hidden />
                  </Link>
                ) : null}
              </nav>
            ) : null}
          </>
        ) : (
          <div className="mt-6 rounded-2xl bg-[#F5F8FF] px-6 py-14 text-center">
            <h2 className="text-xl font-bold text-[#363B51]">
              {t("emptyTitle")}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-[#5a6072]">
              {t("emptyBody")}
            </p>
          </div>
        )}
      </section>
    </>
  );
}

async function UniversityCard({
  university,
  index,
}: {
  university: UniversityCardData;
  /** Position in the grid, staggering the entrance animation. */
  index: number;
}) {
  const t = await getTranslations("Universities");
  const tDirectory = await getTranslations("UniversityDirectory");
  const tCatalog = await getTranslations("Catalog");
  const tDetail = await getTranslations("UniversityDetail");

  return (
    // A plain wrapper, not the link itself: the compare toggle is a real
    // <button>, which can't nest inside an <a>. The stretched Link below
    // covers the whole tile and handles navigation and keyboard focus; the
    // toggle sits on top of it as its own focusable, clickable sibling.
    <div
      style={{ "--i": index } as React.CSSProperties}
      className="ul-spotlight ul-card-in group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-[#1E6DEB]/30 hover:shadow-[0_22px_45px_-22px_rgba(30,109,235,0.55)]"
    >
      <Link
        href={`/universities/${university.slug}`}
        aria-label={`${university.name}, ${tDirectory("viewProfile")}`}
        className="absolute inset-0 z-0 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
      />

      {/* pointer-events-none so this purely visual layer doesn't sit on top
          of (and swallow clicks meant for) the stretched Link above — only
          the compare toggle re-enables pointer events for itself. */}
      <div className="relative pointer-events-none">
        {/* Shared with the profile banner: the photo flies from this card
            into the banner on navigation (see globals.css .ul-morph). */}
        <ViewTransition name={`uni-cover-${university.slug}`} share="ul-morph" default="none">
          {university.coverImageUrl ? (
            <div
              role="img"
              aria-label={university.name}
              className="h-40 w-full bg-slate-200 bg-cover bg-center transition-transform duration-300 group-hover:scale-[1.03] sm:h-24"
              style={{
                backgroundImage: `url(${JSON.stringify(university.coverImageUrl)})`,
              }}
            />
          ) : (
            <div className="h-40 w-full bg-gradient-to-br from-[#E8EFFC] to-[#D5E2F8] sm:h-24" />
          )}
        </ViewTransition>

        {/* Scrim so the badges stay legible over any photograph. */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B3A]/45 via-transparent to-transparent sm:hidden" />

        <div className="absolute inset-x-2.5 top-2.5 flex flex-wrap gap-1 sm:inset-x-1.5 sm:top-1.5">
          {university.isRecommended ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-[11px] font-bold text-[#1E3A8A] sm:px-1.5 sm:text-[10px]">
              <Heart className="size-3 text-[#1E6DEB] sm:size-2.5" aria-hidden />
              {tDetail("recommended")}
            </span>
          ) : null}
          {university.isTrending ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-[11px] font-bold text-[#C81F15] sm:px-1.5 sm:text-[10px]">
              <Flame className="size-3 text-[#F82C1F] sm:size-2.5" aria-hidden />
              {tDetail("trending")}
            </span>
          ) : null}
        </div>

        {university.acronym ? (
          <AcronymBadge
            acronym={university.acronym}
            variant="solid"
            size="md"
            className="absolute bottom-2.5 start-2.5 sm:bottom-1.5 sm:start-1.5"
          />
        ) : null}

        <div className="pointer-events-auto absolute bottom-2.5 end-2.5 flex items-center gap-1.5 sm:bottom-1.5 sm:end-1.5 sm:gap-1">
          <UniversitySaveToggle id={university.id} className="sm:size-7" />
          <UniversityCompareToggle
            id={university.id}
            name={university.name}
            logoUrl={university.logoUrl}
            className="sm:h-7 sm:px-2.5 sm:text-[11px]"
          />
        </div>
      </div>

      <div className="pointer-events-none relative flex flex-1 flex-col p-3.5 sm:p-2.5">
        <div className="flex items-start gap-2.5 sm:gap-2">
          <ViewTransition name={`uni-logo-${university.slug}`} share="ul-morph" default="none">
            <UniversityLogo
              name={university.name}
              logoUrl={university.logoUrl}
              className="size-11 shrink-0 sm:size-8"
            />
          </ViewTransition>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#1E6DEB] sm:text-[9px]">
              {tCatalog(`universityTypes.${university.type}`)}
            </p>
            <h2 className="mt-0.5 line-clamp-2 text-base font-bold leading-snug text-[#16233F] sm:line-clamp-1 sm:text-[13px] sm:text-[#363B51]">
              {university.name}
            </h2>
          </div>
          <ArrowUpRight
            className="mt-0.5 size-4 shrink-0 text-[#C7CCDA] transition-all duration-200 group-hover:text-[#1E6DEB] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:size-3.5 rtl:rotate-90 rtl:group-hover:translate-x-0 rtl:group-hover:-translate-y-1"
            aria-hidden
          />
        </div>

        <dl className="mt-3 space-y-1.5 text-[13px] text-[#5a6072] sm:mt-2 sm:space-y-1 sm:text-[11px]">
          <div className="flex items-center gap-1">
            <MapPin className="size-3.5 shrink-0 text-[#1E6DEB] sm:size-3" aria-hidden />
            <dt className="sr-only">{tDirectory("cityLabel")}</dt>
            <dd className="truncate">
              {university.city}
              {university.governorate ? `, ${university.governorate}` : ""}, {university.country}
            </dd>
          </div>
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <span className="flex items-center gap-1">
              <Layers className="size-3.5 shrink-0 text-[#1E6DEB] sm:size-3" aria-hidden />
              {tDirectory("facultyCount", { count: university.facultyCount })}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="size-3.5 shrink-0 text-[#1E6DEB] sm:size-3" aria-hidden />
              {t("programCount", { count: university.programCount })}
            </span>
          </div>
        </dl>
      </div>
    </div>
  );
}
