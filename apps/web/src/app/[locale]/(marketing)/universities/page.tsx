import {
  ArrowUpRight,
  Building2,
  BookOpen,
  Flame,
  Heart,
  Layers,
  MapPin,
} from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { UniversityLogo } from "@/components/university-logo";
import { UniversityDirectoryFiltersBar } from "@/components/university/directory-filters";
import {
  getPublishedUniversities,
  getUniversityCities,
  type UniversityCardData,
} from "@/lib/catalog";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ q?: string; type?: string; city?: string }>;
};

export default async function UniversitiesPage({ searchParams }: PageProps) {
  const t = await getTranslations("Universities");
  const tDirectory = await getTranslations("UniversityDirectory");
  const locale = await getLocale();

  const { q, type, city } = await searchParams;
  const [universities, cities] = await Promise.all([
    getPublishedUniversities(locale, {
      q: q?.trim() || undefined,
      types: type ? [type] : undefined,
      cities: city ? [city] : undefined,
    }),
    getUniversityCities(locale),
  ]);

  const hasActiveFilters = Boolean(q?.trim() || type || city);

  return (
    <>
      {/* Colored banner carrying the title straight down into the search
          card, so the page opens with one dense block instead of a tall
          empty hero followed by a thin filter strip. */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1E6DEB] to-[#12224A] pb-20 pt-12 md:pb-24 md:pt-16">
        <div
          aria-hidden
          className="ul-dots pointer-events-none absolute -inset-8 opacity-20"
        />
        <div className="relative mx-auto max-w-3xl px-4 text-center md:px-6">
          <h1 className="text-3xl font-bold text-white md:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-3 text-white/80">{t("subtitle")}</p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-semibold text-white/90">
            <span className="flex items-center gap-1.5">
              <Building2 className="size-4" aria-hidden />
              {tDirectory("resultCount", { count: universities.length })}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4" aria-hidden />
              {tDirectory("cityCount", { count: cities.length })}
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 md:px-6 md:pb-20">
        <div className="-mt-12 md:-mt-16">
          <UniversityDirectoryFiltersBar
            cities={cities}
            initial={{ q: q ?? "", type: type ?? "", city: city ?? "" }}
          />
        </div>

        {hasActiveFilters ? (
          <p className="mt-6 text-sm font-semibold text-[#5a6072]">
            {tDirectory("resultCount", { count: universities.length })}
          </p>
        ) : null}

        {universities.length > 0 ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {universities.map((university) => (
              <UniversityCard key={university.id} university={university} />
            ))}
          </div>
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
}: {
  university: UniversityCardData;
}) {
  const t = await getTranslations("Universities");
  const tDirectory = await getTranslations("UniversityDirectory");
  const tCatalog = await getTranslations("Catalog");
  const tDetail = await getTranslations("UniversityDetail");

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative">
        {university.coverImageUrl ? (
          <div
            role="img"
            aria-label={university.name}
            className="aspect-[16/7] w-full bg-slate-200 bg-cover bg-center"
            style={{
              backgroundImage: `url(${JSON.stringify(university.coverImageUrl)})`,
            }}
          />
        ) : (
          <div className="aspect-[16/7] w-full bg-gradient-to-br from-[#E8EFFC] to-[#D5E2F8]" />
        )}

        <div className="absolute inset-x-2 top-2 flex flex-wrap gap-1.5">
          {university.isRecommended ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-[11px] font-bold text-[#1E3A8A]">
              <Heart className="size-3 text-[#1E6DEB]" aria-hidden />
              {tDetail("recommended")}
            </span>
          ) : null}
          {university.isTrending ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-[11px] font-bold text-[#C81F15]">
              <Flame className="size-3 text-[#F82C1F]" aria-hidden />
              {tDetail("trending")}
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3.5">
        <div className="flex items-start gap-2.5">
          <UniversityLogo
            name={university.name}
            logoUrl={university.logoUrl}
            className="size-9"
          />
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#1E6DEB]">
              {tCatalog(`universityTypes.${university.type}`)}
            </p>
            <h2 className="mt-0.5 line-clamp-1 text-sm font-bold leading-snug text-[#363B51]">
              {university.name}
            </h2>
          </div>
        </div>

        <dl className="mt-3 space-y-1.5 text-xs text-[#5a6072]">
          <div className="flex items-center gap-1.5">
            <MapPin className="size-3.5 shrink-0 text-[#1E6DEB]" aria-hidden />
            <dt className="sr-only">{tDirectory("cityLabel")}</dt>
            <dd className="truncate">
              {university.city}, {university.country}
            </dd>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="flex items-center gap-1.5">
              <Layers className="size-3.5 shrink-0 text-[#1E6DEB]" aria-hidden />
              {tDirectory("facultyCount", { count: university.facultyCount })}
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="size-3.5 shrink-0 text-[#1E6DEB]" aria-hidden />
              {t("programCount", { count: university.programCount })}
            </span>
          </div>
        </dl>

        <div className="mt-auto pt-3">
          <Link
            href={`/universities/${university.slug}`}
            className="group/cta inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-md bg-[#1E6DEB] px-4 text-xs font-bold text-white transition-colors hover:bg-[#1859c4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
          >
            {tDirectory("viewProfile")}
            <ArrowUpRight
              className="size-3.5 transition-transform duration-200 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5 rtl:rotate-90 rtl:group-hover/cta:translate-x-0 rtl:group-hover/cta:-translate-y-1"
              aria-hidden
            />
          </Link>
        </div>
      </div>
    </article>
  );
}
