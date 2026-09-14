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
      <div className="mx-auto max-w-7xl px-4 pt-6 md:px-6">
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
            <li className="truncate font-semibold text-[#1F2A44]">
              {university.name}
            </li>
          </ol>
        </nav>
      </div>

      {/* Cover banner: the university's own cover photo (falling back to a
          brand-gradient wash) with its logo, name and address overlaid at the
          bottom, and its status badges at the top — the "who is this" story
          told in one glance instead of split across a plain gradient strip
          and a separate text column below it. */}
      <div className="mx-auto max-w-7xl px-4 pt-5 md:px-6">
        <div className="relative isolate h-48 overflow-hidden rounded-3xl shadow-sm sm:h-64 md:h-72">
          {university.coverImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- cover
            // photos come from arbitrary partner hosts, same as the gallery.
            <img
              src={university.coverImageUrl}
              alt=""
              className="absolute inset-0 size-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A8A] via-[#1E6DEB] to-[#3B86F7]" />
          )}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/0"
          />

          <div className="absolute inset-x-4 top-4 flex flex-wrap justify-end gap-2 sm:inset-x-6 sm:top-5">
            {university.isRecommended ? (
              <span className="inline-flex min-h-8 items-center gap-1.5 rounded-full bg-white/90 px-3 text-xs font-bold text-[#1E3A8A] shadow-sm backdrop-blur-sm sm:text-sm">
                <Heart className="size-3.5 text-[#1E6DEB]" aria-hidden />
                {t("recommended")}
              </span>
            ) : null}
            {university.isTrending ? (
              <span className="inline-flex min-h-8 items-center gap-1.5 rounded-full bg-white/90 px-3 text-xs font-bold text-[#C81F15] shadow-sm backdrop-blur-sm sm:text-sm">
                <Flame className="size-3.5 text-[#F82C1F]" aria-hidden />
                {t("trending")}
              </span>
            ) : null}
            <span className="inline-flex min-h-8 items-center rounded-full bg-white/90 px-3 text-xs font-bold text-[#1F2A44] shadow-sm backdrop-blur-sm sm:text-sm">
              {tCatalog(`universityTypes.${university.type}`)}
            </span>
          </div>

          <div className="absolute inset-x-4 bottom-4 flex items-center gap-3 sm:inset-x-6 sm:bottom-5 sm:gap-4">
            <UniversityLogo
              name={university.name}
              logoUrl={university.logoUrl}
              className="size-14 shrink-0 ring-4 ring-white shadow-lg sm:size-16"
            />
            <div className="min-w-0">
              <h1 className="truncate text-xl font-bold text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.4)] sm:text-2xl md:text-3xl">
                {university.name}
              </h1>
              {university.addressLine ? (
                <p className="mt-1 flex items-center gap-1.5 text-sm text-white/90">
                  <MapPin className="size-4 shrink-0" aria-hidden />
                  <span className="truncate">{university.addressLine}</span>
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>

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

        {/* Description and lightweight meta — name/logo/address now live on
            the cover banner above, so this column is just the story and a
            couple of quiet footnotes rather than a second identity block. */}
        <div className="min-w-0">
          {university.description ? (
            <p className="text-base leading-8 text-[#5a6072]">
              {university.description}
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-[#5a6072]">
            <span className="flex items-center gap-1.5">
              <Clock className="size-4 text-[#1E6DEB]" aria-hidden />
              {t("latestUpdate")}: {formatDate(locale, university.updatedAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="size-4 text-[#1E6DEB]" aria-hidden />
              {t("views", { count: formatCompact(locale, university.viewCount) })}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
