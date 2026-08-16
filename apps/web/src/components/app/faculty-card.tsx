import { ArrowRight, BookOpen, MapPin, Percent, Wallet } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { FacultyCompareButton } from "@/components/app/faculty-compare-button";
import { FacultySaveButton } from "@/components/app/faculty-save-button";
import { UniversityLogo } from "@/components/university-logo";
import { FIELDS_OF_STUDY } from "@/lib/fields";
import { formatMoney, formatNumber } from "@/lib/format";
import { BAND_STYLES } from "@/lib/matching";
import type { FacultyResult } from "@/lib/faculty-search";
import { cn } from "@/lib/utils";

/**
 * A faculty in the search results. The faculty is the unit students choose in
 * Egypt, so this is the primary result card; individual programs live on the
 * faculty's own page.
 */
export async function FacultyCard({ faculty }: { faculty: FacultyResult }) {
  const t = await getTranslations("Search");
  const tFaculty = await getTranslations("FacultySearch");
  const tCatalog = await getTranslations("Catalog");
  const locale = await getLocale();
  const isArabic = locale.startsWith("ar");

  const bandStyle = faculty.match ? BAND_STYLES[faculty.match.band] : null;

  const disciplineLabels = faculty.disciplines.slice(0, 2).map((value) => {
    const field = FIELDS_OF_STUDY.find((entry) => entry.value === value);
    if (!field) return value;
    return isArabic ? field.ar : field.en;
  });

  const from = formatMoney(locale, faculty.tuitionFrom, faculty.currency);
  const to = formatMoney(locale, faculty.tuitionTo, faculty.currency);
  const tuitionLabel =
    from && to && faculty.tuitionFrom !== faculty.tuitionTo
      ? `${from}-${to}`
      : (from ?? t("card.notSpecified"));

  return (
    <article className="hover-lift flex h-full flex-col rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {faculty.match && bandStyle ? (
        <div className="px-4 pt-3.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#1E6DEB]">
              {t("card.successChance")}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-[#1F2A44]">
              <span className={cn("size-1.5 rounded-full", bandStyle.dot)} />
              {t(`bands.${faculty.match.band}`)}
            </span>
          </div>
          <div
            className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100"
            role="meter"
            aria-valuenow={faculty.match.score}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={t("card.successChance")}
          >
            <div
              className={cn("h-full rounded-full", bandStyle.bar)}
              style={{ width: `${faculty.match.score}%` }}
            />
          </div>
        </div>
      ) : null}

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start gap-3">
          <UniversityLogo
            name={faculty.university.name}
            logoUrl={faculty.university.logoUrl}
            className="size-10 shrink-0"
          />
          <div className="min-w-0">
            <h3 className="line-clamp-2 text-sm font-bold leading-snug text-[#1F2A44]">
              {faculty.name}
            </h3>
            <p className="mt-1 truncate text-xs text-[#5a6072]">
              {faculty.university.name}
            </p>
          </div>
        </div>

        {/* Uniform stat tiles — same box, same label treatment for every
            figure — so it reads as one glanceable group instead of a loose
            row of icon+number pairs with no indication of what they mean. */}
        <dl className="mt-3 grid grid-cols-2 gap-1.5">
          <div className="min-w-0 rounded-lg bg-slate-50 px-2.5 py-1.5">
            <dt className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-[#98A0B4]">
              <MapPin className="size-3 shrink-0" aria-hidden />
              {tFaculty("cityLabel")}
            </dt>
            <dd className="mt-0.5 truncate text-[13px] font-bold text-[#1F2A44]">
              {faculty.university.city}
            </dd>
          </div>
          <div className="min-w-0 rounded-lg bg-slate-50 px-2.5 py-1.5">
            <dt className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-[#98A0B4]">
              <Wallet className="size-3 shrink-0" aria-hidden />
              {tFaculty("tuitionRange")}
            </dt>
            <dd className="mt-0.5 truncate text-[13px] font-bold text-[#1F2A44]">
              {tuitionLabel}
            </dd>
          </div>
          <div className="min-w-0 rounded-lg bg-slate-50 px-2.5 py-1.5">
            <dt className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-[#98A0B4]">
              <BookOpen className="size-3 shrink-0" aria-hidden />
              {tFaculty("programs")}
            </dt>
            <dd className="mt-0.5 text-[13px] font-bold text-[#1F2A44]">
              {formatNumber(locale, faculty.programCount)}
            </dd>
          </div>
          <div className="min-w-0 rounded-lg bg-slate-50 px-2.5 py-1.5">
            <dt className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-[#98A0B4]">
              <Percent className="size-3 shrink-0" aria-hidden />
              {tFaculty("minGrade")}
            </dt>
            <dd className="mt-0.5 text-[13px] font-bold text-[#1F2A44]">
              {faculty.minGradePercent != null
                ? `${formatNumber(locale, faculty.minGradePercent)}${tCatalog("units.PERCENT")}`
                : t("card.notSpecified")}
            </dd>
          </div>
        </dl>

        {disciplineLabels.length > 0 ? (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {disciplineLabels.map((label) => (
              <li
                key={label}
                className="rounded-md bg-[#EEF3FF] px-2.5 py-1 text-[11px] font-semibold text-[#1E3A8A]"
              >
                {label}
              </li>
            ))}
            {faculty.disciplines.length > disciplineLabels.length ? (
              <li className="rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-[#5a6072]">
                +
                {formatNumber(
                  locale,
                  faculty.disciplines.length - disciplineLabels.length,
                )}
              </li>
            ) : null}
          </ul>
        ) : null}

        <div className="mt-auto space-y-2 border-t border-slate-100 pt-4">
          <Link
            href={`/app/faculties/${faculty.id}`}
            className="group/cta inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-md bg-[#1E6DEB] text-sm font-bold text-white transition-colors hover:bg-[#1859c4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
          >
            {tFaculty("explorePrograms")}
            <ArrowRight
              className="size-4 transition-transform duration-200 group-hover/cta:translate-x-0.5 rtl:rotate-180 rtl:group-hover/cta:-translate-x-0.5"
              aria-hidden
            />
          </Link>

          <div className="flex gap-2">
            <FacultySaveButton facultyId={faculty.id} initialSaved={faculty.saved} />
            <FacultyCompareButton
              id={faculty.id}
              name={faculty.name}
              universityName={faculty.university.name}
              logoUrl={faculty.university.logoUrl}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
