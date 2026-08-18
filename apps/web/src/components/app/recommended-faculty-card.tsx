import { ArrowRight, Star } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { UniversityLogo } from "@/components/university-logo";
import { formatMoney } from "@/lib/format";
import { BAND_STYLES } from "@/lib/matching";
import type { FacultyResult } from "@/lib/faculty-search";
import { cn } from "@/lib/utils";

/**
 * Compact recommendation chip, deliberately not FacultyCard at a smaller
 * size. On mobile, a full FacultyCard per recommendation (stat grid, tag
 * chips, two-button footer) made "Recommended for you" indistinguishable in
 * height and color from the search results below it, so the whole page read
 * as one long undifferentiated stack of tiles. This is a single row: logo,
 * name, match band, one figure, done, and it's gold/amber instead of the
 * results' blue so it reads as a distinct lane even at a glance.
 */
export async function RecommendedFacultyCard({
  faculty,
}: {
  faculty: FacultyResult;
}) {
  const t = await getTranslations("Search");
  const tFaculty = await getTranslations("FacultySearch");
  const locale = await getLocale();

  const bandStyle = faculty.match ? BAND_STYLES[faculty.match.band] : null;
  const from = formatMoney(locale, faculty.tuitionFrom, faculty.currency);
  const to = formatMoney(locale, faculty.tuitionTo, faculty.currency);
  const tuitionLabel =
    from && to && faculty.tuitionFrom !== faculty.tuitionTo
      ? `${from}-${to}`
      : (from ?? t("card.notSpecified"));

  return (
    <Link
      href={`/app/faculties/${faculty.id}`}
      className="group/rec flex h-full items-center gap-2.5 rounded-lg border border-[#F0DCA0] bg-gradient-to-br from-[#FFFCF5] to-[#FFF6E2] p-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B77714]"
    >
      <UniversityLogo
        name={faculty.university.name}
        logoUrl={faculty.university.logoUrl}
        className="size-9 shrink-0"
      />

      <div className="min-w-0 flex-1">
        {/* University first and bold: many faculties share generic names
            ("Faculty of Engineering"), so the university is what actually
            tells two cards apart, not the faculty name. */}
        <h3 className="truncate text-[13px] font-bold leading-snug text-[#1F2A44]">
          {faculty.university.name}
        </h3>
        <p className="truncate text-[11px] font-medium text-[#8a6a2e]">
          {faculty.name}
        </p>

        <div className="mt-1 flex items-center gap-2">
          {faculty.match && bandStyle ? (
            <span
              className={cn(
                "inline-flex items-center gap-1 text-[11px] font-bold",
                bandStyle.text,
              )}
            >
              <Star className="size-3 fill-current" aria-hidden />
              {t(`bands.${faculty.match.band}`)}
            </span>
          ) : (
            <span className="truncate text-[11px] font-semibold text-[#5a6072]">
              {tFaculty("tuitionRange")}: {tuitionLabel}
            </span>
          )}
        </div>
      </div>

      <ArrowRight
        className="size-4 shrink-0 text-[#B77714] transition-transform duration-200 group-hover/rec:translate-x-0.5 rtl:rotate-180 rtl:group-hover/rec:-translate-x-0.5"
        aria-hidden
      />
    </Link>
  );
}
