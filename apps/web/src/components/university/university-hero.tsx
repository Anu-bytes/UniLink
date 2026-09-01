import {
  Building2,
  CalendarDays,
  Clock,
  Eye,
  Flame,
  GraduationCap,
  Heart,
  MapPin,
} from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { UniversityLogo } from "@/components/university-logo";
import { UniversityGallery } from "@/components/university/university-gallery";
import { ShareButton } from "@/components/university/share-button";
import type { UniversityDetailData } from "@/lib/catalog";
import { formatCompact, formatDate } from "@/lib/format";

export async function UniversityHero({
  university,
}: {
  university: UniversityDetailData;
}) {
  const t = await getTranslations("UniversityDetail");
  const tCatalog = await getTranslations("Catalog");
  const locale = await getLocale();

  const images =
    university.images.length > 0
      ? university.images
      : university.coverImageUrl
        ? [{ id: "cover", url: university.coverImageUrl, alt: university.name }]
        : [];

  const stats = [
    {
      icon: CalendarDays,
      label: t("established"),
      value: university.establishedYear ? String(university.establishedYear) : "—",
    },
    {
      icon: Building2,
      label: t("facultiesStat"),
      value: t("facultiesCount", { count: university.faculties.length }),
    },
    {
      icon: GraduationCap,
      label: t("programsStat"),
      value: String(university.programCount),
    },
  ];

  return (
    <section className="bg-gradient-to-b from-[#F4F7FE] via-[#F9FAFF] to-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 md:px-6 md:py-12 lg:grid-cols-[minmax(0,32rem)_minmax(0,1fr)] lg:gap-10">
        {/* Gallery card, with the stat strip and the primary CTA below it. */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm md:p-5">
          <UniversityGallery images={images} name={university.name} />

          <dl className="mt-5 grid grid-cols-3 gap-2 border-t border-slate-100 pt-5 text-center">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1">
                <stat.icon className="size-5 text-[#1E6DEB]" aria-hidden />
                <dt className="text-xs font-semibold text-[#5a6072]">
                  {stat.label}
                </dt>
                <dd className="text-sm font-bold text-[#1F2A44]">{stat.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-5 flex items-center gap-3">
            <button
              type="button"
              aria-label={t("save")}
              title={t("save")}
              className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-base font-bold text-[#1E6DEB] transition-colors hover:bg-[#EEF3FF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
            >
              <Heart className="size-5" aria-hidden />
              {t("save")}
            </button>

            <ShareButton
              title={university.name}
              label={t("share")}
              copiedLabel={t("shareCopied")}
            />
          </div>
        </div>

        {/* Identity column. */}
        <div className="min-w-0">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-[#5a6072]">
              <li>
                <Link href="/" className="hover:text-[#1E6DEB]">
                  {t("breadcrumbHome")}
                </Link>
              </li>
              <li aria-hidden className="text-slate-300">
                /
              </li>
              <li>
                <Link href="/universities" className="hover:text-[#1E6DEB]">
                  {t("breadcrumbUniversities")}
                </Link>
              </li>
              <li aria-hidden className="text-slate-300">
                /
              </li>
              <li className="font-semibold text-[#1F2A44]">{university.name}</li>
            </ol>
          </nav>

          <div className="mt-5 flex items-start gap-4">
            <UniversityLogo
              name={university.name}
              logoUrl={university.logoUrl}
              className="size-16 md:size-20"
              textClassName="text-xl"
            />
            <div className="min-w-0">
              <h1 className="text-2xl font-bold leading-tight text-[#1F2A44] md:text-3xl lg:text-4xl">
                {university.name}
              </h1>
              {university.addressLine ? (
                <p className="mt-2 flex items-center gap-2 text-sm text-[#5a6072] md:text-base">
                  <MapPin className="size-4 shrink-0 text-[#1E6DEB]" aria-hidden />
                  {university.addressLine}
                </p>
              ) : null}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {university.isRecommended ? (
              <span className="inline-flex min-h-9 items-center gap-2 rounded-full bg-[#EEF3FF] px-4 text-sm font-semibold text-[#1E3A8A]">
                <Heart className="size-4 text-[#1E6DEB]" aria-hidden />
                {t("recommended")}
              </span>
            ) : null}
            {university.isTrending ? (
              <span className="inline-flex min-h-9 items-center gap-2 rounded-full bg-[#FFF0EE] px-4 text-sm font-semibold text-[#C81F15]">
                <Flame className="size-4 text-[#F82C1F]" aria-hidden />
                {t("trending")}
              </span>
            ) : null}
            <span className="inline-flex min-h-9 items-center rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-[#1F2A44] lg:ms-auto">
              {tCatalog(`universityTypes.${university.type}`)}
            </span>
          </div>

          {university.description ? (
            <p className="mt-6 text-base leading-8 text-[#5a6072]">
              {university.description}
            </p>
          ) : null}

          <dl className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="size-5 text-[#1E6DEB]" aria-hidden />
              <div>
                <dt className="font-semibold text-[#1F2A44]">
                  {t("creationDate")}
                </dt>
                <dd className="text-[#5a6072]">
                  {formatDate(locale, university.createdAt)}
                </dd>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="size-5 text-[#1E6DEB]" aria-hidden />
              <div>
                <dt className="font-semibold text-[#1F2A44]">
                  {t("latestUpdate")}
                </dt>
                <dd className="text-[#5a6072]">
                  {formatDate(locale, university.updatedAt)}
                </dd>
              </div>
            </div>
          </dl>

          <p className="mt-4 flex items-center gap-2 text-sm text-[#5a6072]">
            <Eye className="size-5" aria-hidden />
            {t("views", { count: formatCompact(locale, university.viewCount) })}
          </p>
        </div>
      </div>
    </section>
  );
}
