import { ArrowLeft, BookOpen, MapPin, Percent } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import { auth } from "@/auth";
import { Link } from "@/i18n/navigation";
import { FacultySaveButton } from "@/components/app/faculty-save-button";
import { ProgramCard } from "@/components/app/program-card";
import { UniversityLogo } from "@/components/university-logo";
import { getFacultyDetail } from "@/lib/faculty-search";
import { FIELDS_OF_STUDY } from "@/lib/fields";
import { formatMoney, formatNumber } from "@/lib/format";
import {
  getMatchProfile,
  getProgramsForCompare,
  type ProgramResult,
} from "@/lib/program-search";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ facultyId: string; locale: string }>;
};

export default async function FacultyProfilePage({ params }: PageProps) {
  const { facultyId } = await params;
  const locale = await getLocale();
  const session = await auth();

  if (!session?.user?.id) redirect(`/${locale}/login`);

  const t = await getTranslations("FacultySearch");
  const tCatalog = await getTranslations("Catalog");
  const tSearch = await getTranslations("Search");
  const isArabic = locale.startsWith("ar");

  const faculty = await getFacultyDetail(locale, facultyId, session.user.id);
  if (!faculty) notFound();

  // Reuse the program mapper so cards get match scores, saved and applied
  // state exactly as they do in search results.
  const programIds = await prisma.program.findMany({
    where: { facultyId, isPublished: true },
    orderBy: { name: "asc" },
    select: { id: true },
  });

  const programs: ProgramResult[] = await getProgramsForCompare(
    locale,
    programIds.map((row) => row.id),
    session.user.id,
  );

  const profile = await getMatchProfile(session.user.id);

  const disciplineLabels = faculty.disciplines.map((value) => {
    const field = FIELDS_OF_STUDY.find((entry) => entry.value === value);
    if (!field) return value;
    return isArabic ? field.ar : field.en;
  });

  const from = formatMoney(locale, faculty.tuitionFrom, faculty.currency);
  const to = formatMoney(locale, faculty.tuitionTo, faculty.currency);

  return (
    <div className="mx-auto max-w-[86rem] px-4 py-6 pb-32 md:px-6 md:py-8">
      <Link
        href="/app/search"
        className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#1E6DEB] hover:underline"
      >
        <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden />
        {t("backToSearch")}
      </Link>

      <header className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-wrap items-start gap-4">
          <UniversityLogo
            name={faculty.university.name}
            logoUrl={faculty.university.logoUrl}
            className="size-14"
          />
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-[#1F2A44] md:text-3xl">
              {faculty.name}
            </h1>
            <Link
              href={`/universities/${faculty.university.slug}`}
              className="mt-1 inline-block text-sm font-semibold text-[#1E6DEB] hover:underline"
            >
              {faculty.university.name}
            </Link>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-[#5a6072]">
              <MapPin className="size-4 shrink-0" aria-hidden />
              {faculty.university.city}, {faculty.university.country}
            </p>
          </div>
          <div className="w-full sm:w-auto">
            <FacultySaveButton facultyId={faculty.id} initialSaved={faculty.saved} />
          </div>
        </div>

        {faculty.description ? (
          <p className="mt-4 text-base leading-7 text-[#5a6072]">
            {faculty.description}
          </p>
        ) : null}

        <dl className="mt-5 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-3">
          <div>
            <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[#98A0B4]">
              <BookOpen className="size-3.5" aria-hidden />
              {t("programs")}
            </dt>
            <dd className="mt-1 text-lg font-bold text-[#1F2A44]">
              {formatNumber(locale, faculty.programCount)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-[#98A0B4]">
              {t("tuitionRange")}
            </dt>
            <dd className="mt-1 text-lg font-bold text-[#1F2A44]">
              {from && to && faculty.tuitionFrom !== faculty.tuitionTo
                ? `${from} - ${to}`
                : (from ?? tSearch("card.notSpecified"))}
            </dd>
          </div>
          <div>
            <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[#98A0B4]">
              <Percent className="size-3.5" aria-hidden />
              {t("minGrade")}
            </dt>
            <dd className="mt-1 text-lg font-bold text-[#1F2A44]">
              {faculty.minGradePercent != null
                ? `${formatNumber(locale, faculty.minGradePercent)}${tCatalog("units.PERCENT")}`
                : tSearch("card.notSpecified")}
            </dd>
          </div>
        </dl>

        {disciplineLabels.length > 0 ? (
          <ul className="mt-5 flex flex-wrap gap-2">
            {disciplineLabels.map((label) => (
              <li
                key={label}
                className="rounded-full bg-[#EEF3FF] px-3 py-1 text-sm font-semibold text-[#1E3A8A]"
              >
                {label}
              </li>
            ))}
          </ul>
        ) : null}
      </header>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-[#1F2A44] md:text-2xl">
          {t("programsInFaculty")}
        </h2>
        <p className="mt-1 text-sm text-[#5a6072]">
          {profile ? t("programsSubtitle") : t("programsSubtitleNoProfile")}
        </p>

        {programs.length > 0 ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {programs.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-xl bg-[#F5F8FF] px-6 py-14 text-center">
            <p className="text-sm text-[#5a6072]">{t("noPrograms")}</p>
          </div>
        )}
      </section>
    </div>
  );
}
