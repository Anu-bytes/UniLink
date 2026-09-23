import {
  Building2,
  CalendarDays,
  Clock,
  Compass,
  Eye,
  Flame,
  GraduationCap,
  Heart,
  Lock,
  MapPin,
} from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { UniversityCompareButton } from "@/components/app/university-compare-button";
import { UniversityLogo } from "@/components/university-logo";
import { ShareButton } from "@/components/university/share-button";
import type { UniversityDetailData } from "@/lib/catalog";
import { formatCompact, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

// The site's own two brand colors (blue/red), alternated, rather than a
// wider palette borrowed from the Faculties tab — this is the hero, so it
// should read as UniLink's own identity, not a generic multicolor accent.
const STAT_ACCENTS = [
  "bg-gradient-to-br from-[#1E6DEB] to-[#3B86F7]",
  "bg-gradient-to-br from-[#F82C1F] to-[#ff6b5b]",
  "bg-gradient-to-br from-[#1E6DEB] to-[#3B86F7]",
];

export async function UniversityHero({
  university,
  isAuthenticated,
}: {
  university: UniversityDetailData;
  isAuthenticated: boolean;
}) {
  const t = await getTranslations("UniversityDetail");
  const tCatalog = await getTranslations("Catalog");
  const locale = await getLocale();

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

      {/* Stat bar right below the banner, so the headline facts (established,
          faculties, programs) are the first thing read after the photo
          instead of hiding in the gallery card's footer as small same-size
          text. Sits after the banner with normal spacing rather than
          overlapping it — a negative margin here collided with the logo and
          name/address text anchored to the banner's own bottom edge. */}
      <div className="mx-auto max-w-7xl px-4 pt-4 md:px-6">
        <dl className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:grid-cols-3 sm:p-5">
          {stats.map((stat, index) => (
            <div key={stat.label} className="flex items-center gap-3">
              <span
                className={cn(
                  "flex size-11 shrink-0 items-center justify-center rounded-xl text-white shadow-sm sm:size-12",
                  STAT_ACCENTS[index % STAT_ACCENTS.length],
                )}
              >
                <stat.icon className="size-5" aria-hidden />
              </span>
              <div className="min-w-0">
                <dd className="truncate text-lg font-bold text-[#1F2A44] sm:text-xl">
                  {stat.value}
                </dd>
                <dt className="truncate text-xs font-semibold text-[#5a6072] sm:text-sm">
                  {stat.label}
                </dt>
              </div>
            </div>
          ))}
        </dl>
      </div>

      {/* Description, meta and actions — the only content column now that
          identity lives on the banner, the headline facts have their own
          bar above, and photos got a real tab of their own (a compact
          thumbnail strip here didn't do the campus justice, and duplicated
          the Photos tab). */}
      <div className="mx-auto max-w-3xl px-4 pb-8 pt-8 md:px-6 md:pb-12">
        {university.description ? (
          isAuthenticated ? (
            <p className="text-base leading-8 text-[#5a6072]">
              {university.description}
            </p>
          ) : (
            // The real text is never rendered for signed-out visitors (a CSS
            // blur would leave it in the page source): blurred placeholder
            // lines stand in for it.
            <div>
              <div aria-hidden className="space-y-3 blur-[4px]">
                <div className="h-4 w-full rounded-full bg-slate-200" />
                <div className="h-4 w-11/12 rounded-full bg-slate-200" />
                <div className="h-4 w-2/3 rounded-full bg-slate-200" />
              </div>
              <Link
                href={`/login?callbackUrl=${encodeURIComponent(`/universities/${university.slug}`)}`}
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1E6DEB] hover:underline"
              >
                <Lock className="size-4" aria-hidden />
                {t("lockedDescription")}
              </Link>
            </div>
          )
        ) : null}

        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-[#5a6072]">
          <span className="flex items-center gap-1.5">
            <Clock className="size-4 text-[#1E6DEB]" aria-hidden />
            {t("latestUpdate")}: {formatDate(locale, university.updatedAt)}
          </span>
          <span className="flex items-center gap-1.5">
            <Eye className="size-4 text-[#1E6DEB]" aria-hidden />
            {t("views", { count: formatCompact(locale, university.viewCount) })}
          </span>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href={`/universities/${university.slug}?tab=faculties#tabs`}
            className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#1E6DEB] px-6 text-base font-bold text-white shadow-[0_16px_36px_-16px_rgba(30,109,235,0.6)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1859c4]"
          >
            <Compass className="size-5" aria-hidden />
            {t("exploreProgramsCta")}
          </Link>

          <button
            type="button"
            aria-label={t("save")}
            title={t("save")}
            className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-base font-bold text-[#1E6DEB] transition-colors hover:bg-[#EEF3FF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
          >
            <Heart className="size-5" aria-hidden />
            {t("save")}
          </button>

          <ShareButton
            title={university.name}
            label={t("share")}
            copiedLabel={t("shareCopied")}
          />

          <UniversityCompareButton
            id={university.id}
            name={university.name}
            logoUrl={university.logoUrl}
            className="h-12 flex-none rounded-xl border-slate-200 px-5 text-base font-bold text-[#1E6DEB] hover:bg-[#EEF3FF]"
          />
        </div>
      </div>
    </section>
  );
}
