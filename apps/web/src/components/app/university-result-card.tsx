import { ArrowRight, BookOpen, Layers, MapPin } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { UniversityLogo } from "@/components/university-logo";
import type { UniversityCardData } from "@/lib/catalog";
import { formatNumber } from "@/lib/format";

/**
 * A university in the app search's Universities mode. Mirrors FacultyCard's
 * shape (same card chrome, same stat-tile layout) so the two modes read as
 * one family of result cards, red accents standing in for FacultyCard's
 * blue rather than a different card language entirely. Links out to the
 * public university profile: there's no separate authenticated university
 * page in the app, faculties/programs are where the app-specific detail
 * (match scores, saving, comparing) lives.
 */
export async function UniversityResultCard({
  university,
}: {
  university: UniversityCardData;
}) {
  const t = await getTranslations("UniversityDirectory");
  const tDetail = await getTranslations("UniversityDetail");
  const tCatalog = await getTranslations("Catalog");
  const locale = await getLocale();

  return (
    <article className="hover-lift flex h-full flex-col rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start gap-3">
          <UniversityLogo
            name={university.name}
            logoUrl={university.logoUrl}
            className="size-10 shrink-0"
          />
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#F82C1F]">
              {tCatalog(`universityTypes.${university.type}`)}
            </p>
            <h3 className="line-clamp-2 text-sm font-bold leading-snug text-[#1F2A44]">
              {university.name}
            </h3>
          </div>
        </div>

        <dl className="mt-3 grid grid-cols-2 gap-1.5">
          <div className="min-w-0 rounded-lg bg-slate-50 px-2.5 py-1.5">
            <dt className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-[#98A0B4]">
              <MapPin className="size-3 shrink-0" aria-hidden />
              {t("cityLabel")}
            </dt>
            <dd className="mt-0.5 truncate text-[13px] font-bold text-[#1F2A44]">
              {university.city}, {university.country}
            </dd>
          </div>
          <div className="min-w-0 rounded-lg bg-slate-50 px-2.5 py-1.5">
            <dt className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-[#98A0B4]">
              <Layers className="size-3 shrink-0" aria-hidden />
              {tDetail("facultiesStat")}
            </dt>
            <dd className="mt-0.5 text-[13px] font-bold text-[#1F2A44]">
              {formatNumber(locale, university.facultyCount)}
            </dd>
          </div>
          <div className="col-span-2 min-w-0 rounded-lg bg-slate-50 px-2.5 py-1.5">
            <dt className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-[#98A0B4]">
              <BookOpen className="size-3 shrink-0" aria-hidden />
              {tDetail("programsStat")}
            </dt>
            <dd className="mt-0.5 text-[13px] font-bold text-[#1F2A44]">
              {formatNumber(locale, university.programCount)}
            </dd>
          </div>
        </dl>

        <div className="mt-auto pt-4">
          <Link
            href={`/universities/${university.slug}`}
            className="group/cta inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-md bg-[#F82C1F] text-sm font-bold text-white transition-colors hover:bg-[#C81F15] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F82C1F]"
          >
            {t("viewProfile")}
            <ArrowRight
              className="size-4 transition-transform duration-200 group-hover/cta:translate-x-0.5 rtl:rotate-180 rtl:group-hover/cta:-translate-x-0.5"
              aria-hidden
            />
          </Link>
        </div>
      </div>
    </article>
  );
}
