import { ArrowUpRight, BookOpen, Flame, Heart, Layers, MapPin } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { SimplePageHero } from "@/components/simple-page-hero";
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

  return (
    <>
      <SimplePageHero title={t("title")} subtitle={t("subtitle")} />

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
        <UniversityDirectoryFiltersBar
          cities={cities}
          initial={{ q: q ?? "", type: type ?? "", city: city ?? "" }}
        />

        <p className="mt-6 text-sm font-semibold text-[#5a6072]">
          {tDirectory("resultCount", { count: universities.length })}
        </p>

        {universities.length > 0 ? (
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative">
        {university.coverImageUrl ? (
          <div
            role="img"
            aria-label={university.name}
            className="aspect-[16/10] w-full bg-slate-200 bg-cover bg-center"
            style={{
              backgroundImage: `url(${JSON.stringify(university.coverImageUrl)})`,
            }}
          />
        ) : (
          <div className="aspect-[16/10] w-full bg-gradient-to-br from-[#E8EFFC] to-[#D5E2F8]" />
        )}

        <div className="absolute inset-x-3 top-3 flex flex-wrap gap-2">
          {university.isRecommended ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-[#1E3A8A]">
              <Heart className="size-3.5 text-[#1E6DEB]" aria-hidden />
              {tDetail("recommended")}
            </span>
          ) : null}
          {university.isTrending ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-[#C81F15]">
              <Flame className="size-3.5 text-[#F82C1F]" aria-hidden />
              {tDetail("trending")}
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="flex items-start gap-3">
          <UniversityLogo
            name={university.name}
            logoUrl={university.logoUrl}
            className="size-11"
          />
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-[#1E6DEB]">
              {tCatalog(`universityTypes.${university.type}`)}
            </p>
            <h2 className="mt-1 text-lg font-bold leading-snug text-[#363B51]">
              {university.name}
            </h2>
          </div>
        </div>

        <dl className="mt-4 space-y-2 text-sm text-[#5a6072]">
          <div className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0 text-[#1E6DEB]" aria-hidden />
            <dt className="sr-only">{tDirectory("cityLabel")}</dt>
            <dd>
              {university.city}, {university.country}
            </dd>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="flex items-center gap-2">
              <Layers className="size-4 shrink-0 text-[#1E6DEB]" aria-hidden />
              {tDirectory("facultyCount", { count: university.facultyCount })}
            </span>
            <span className="flex items-center gap-2">
              <BookOpen className="size-4 shrink-0 text-[#1E6DEB]" aria-hidden />
              {t("programCount", { count: university.programCount })}
            </span>
          </div>
          {university.establishedYear ? (
            <div>
              <dt className="sr-only">{tDetail("established")}</dt>
              <dd>{tDirectory("established", { year: university.establishedYear })}</dd>
            </div>
          ) : null}
        </dl>

        {university.description ? (
          <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#5a6072]">
            {university.description}
          </p>
        ) : null}

        <Link
          href={`/universities/${university.slug}`}
          className="mt-5 inline-flex min-h-11 w-fit items-center gap-2 rounded-lg border border-[#1E6DEB] px-4 py-2 text-sm font-semibold text-[#1E6DEB] transition-colors hover:bg-[#1E6DEB]/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
        >
          {tDirectory("viewProfile")}
          <ArrowUpRight className="size-4" aria-hidden />
        </Link>
      </div>
    </article>
  );
}
