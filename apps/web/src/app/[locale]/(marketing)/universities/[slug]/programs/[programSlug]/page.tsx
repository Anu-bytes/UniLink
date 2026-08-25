import type { Metadata } from "next";
import {
  ArrowLeft,
  BadgeCheck,
  Banknote,
  CalendarDays,
  Clock,
  GraduationCap,
  Languages,
  Layers,
  Percent,
} from "lucide-react";
import { cache } from "react";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { Paragraphs } from "@/components/university/prose";
import { UniversityLogo } from "@/components/university-logo";
import {
  getUniversityDetail,
  localized,
  localizedOrNull,
} from "@/lib/catalog";
import { formatDate, formatMoney, formatNumber, yearsFromMonths } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string; programSlug: string; locale: string }>;
};

// Deduped for the same reason as getUniversityDetail: generateMetadata and the
// page component each ask for it, and without this both calls hit the database.
const loadProgram = cache(async function loadProgram(
  locale: string,
  slug: string,
  programSlug: string,
) {
  const program = await prisma.program.findFirst({
    where: {
      slug: programSlug,
      isPublished: true,
      university: { slug, publishedAt: { not: null } },
    },
    include: {
      faculty: { select: { name: true, nameAr: true } },
      intakes: { orderBy: [{ year: "asc" }, { season: "asc" }] },
      englishRequirements: true,
    },
  });

  if (!program) return null;

  return {
    id: program.id,
    slug: program.slug,
    name: localized(locale, program.name, program.nameAr),
    description: localizedOrNull(locale, program.description, program.descriptionAr),
    studyLevel: program.studyLevel,
    fieldOfStudy: program.fieldOfStudy,
    durationMonths: program.durationMonths,
    durationLabel: localizedOrNull(
      locale,
      program.durationLabel,
      program.durationLabelAr,
    ),
    tuitionFee: program.tuitionFee ? Number(program.tuitionFee) : null,
    tuitionPeriod: program.tuitionPeriod,
    currency: program.currency,
    applicationFee: program.applicationFee ? Number(program.applicationFee) : null,
    applicationFeeWaived: program.applicationFeeWaived,
    minGradePercent: program.minGradePercent,
    coopAvailable: program.coopAvailable,
    tags: program.tags as string[],
    facultyName: program.faculty
      ? localized(locale, program.faculty.name, program.faculty.nameAr)
      : null,
    intakes: program.intakes.map((intake) => ({
      id: intake.id,
      season: intake.season as string,
      year: intake.year,
      applicationDeadline: intake.applicationDeadline,
    })),
    englishRequirements: program.englishRequirements.map((requirement) => ({
      id: requirement.id,
      test: requirement.test as string,
      minScore: requirement.minScore,
    })),
  };
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, programSlug, locale } = await params;
  const [university, program] = await Promise.all([
    getUniversityDetail(locale, slug),
    loadProgram(locale, slug, programSlug),
  ]);

  if (!university || !program) return {};

  return {
    title: `${program.name} | ${university.name} | UniLink`,
    description: program.description ?? university.description ?? undefined,
  };
}

export default async function ProgramDetailPage({ params }: PageProps) {
  const { slug, programSlug } = await params;
  const locale = await getLocale();
  const t = await getTranslations("ProgramDetail");
  const tCatalog = await getTranslations("Catalog");

  const [university, program] = await Promise.all([
    getUniversityDetail(locale, slug),
    loadProgram(locale, slug, programSlug),
  ]);

  if (!university || !program) notFound();

  const years = yearsFromMonths(program.durationMonths);
  const duration =
    program.durationLabel ??
    (years
      ? tCatalog("durationYears", {
          count: years,
          value: formatNumber(locale, years),
        })
      : program.durationMonths
        ? tCatalog("durationMonths", { count: program.durationMonths })
        : null);

  const facts = [
    { icon: GraduationCap, label: t("level"), value: tCatalog(`levels.${program.studyLevel}`) },
    program.facultyName
      ? { icon: Layers, label: t("faculty"), value: program.facultyName }
      : null,
    duration ? { icon: Clock, label: t("duration"), value: duration } : null,
    {
      icon: Banknote,
      label: t("tuition"),
      value: formatMoney(locale, program.tuitionFee, program.currency)
        ? `${formatMoney(locale, program.tuitionFee, program.currency)}${tCatalog(`tuitionPeriods.${program.tuitionPeriod}`)}`
        : t("notSpecified"),
    },
    {
      icon: BadgeCheck,
      label: t("applicationFee"),
      value: program.applicationFeeWaived
        ? t("waived")
        : (formatMoney(locale, program.applicationFee, program.currency) ??
          t("notSpecified")),
    },
    program.minGradePercent != null
      ? {
          icon: Percent,
          label: t("minimumGrade"),
          value: `${formatNumber(locale, program.minGradePercent)}${tCatalog("units.PERCENT")}`,
        }
      : null,
  ].filter((fact): fact is NonNullable<typeof fact> => fact != null);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-14">
      <Link
        href={`/universities/${university.slug}?tab=faculties`}
        className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#1E6DEB] hover:underline"
      >
        <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden />
        {t("backToUniversity", { name: university.name })}
      </Link>

      <header className="mt-6 flex flex-wrap items-start gap-4">
        <UniversityLogo
          name={university.name}
          logoUrl={university.logoUrl}
          className="size-14"
          textClassName="text-base"
        />
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-[#1F2A44] md:text-3xl">
            {program.name}
          </h1>
          <p className="mt-2 text-base text-[#5a6072]">
            {university.name} · {university.city}
          </p>
        </div>
      </header>

      {program.tags.length > 0 ? (
        <ul className="mt-5 flex flex-wrap gap-2">
          {program.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full bg-[#EEF3FF] px-3 py-1 text-sm font-semibold text-[#1E3A8A]"
            >
              {tCatalog(`tags.${tag}`)}
            </li>
          ))}
          {program.coopAvailable ? (
            <li className="rounded-full bg-[#E9F7F0] px-3 py-1 text-sm font-semibold text-[#1F7A4D]">
              {t("coopAvailable")}
            </li>
          ) : null}
        </ul>
      ) : null}

      <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {facts.map((fact) => (
          <div
            key={fact.label}
            className="rounded-2xl border border-slate-200 p-4"
          >
            <dt className="flex items-center gap-2 text-sm font-semibold text-[#5a6072]">
              <fact.icon className="size-4 text-[#1E6DEB]" aria-hidden />
              {fact.label}
            </dt>
            <dd className="mt-2 text-base font-bold text-[#1F2A44]">
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>

      {program.description ? (
        <section className="mt-10">
          <h2 className="text-xl font-bold text-[#1F2A44]">
            {t("aboutProgram")}
          </h2>
          <div className="mt-4">
            <Paragraphs text={program.description} />
          </div>
        </section>
      ) : null}

      {program.englishRequirements.length > 0 ? (
        <section className="mt-10">
          <h2 className="flex items-center gap-2 text-xl font-bold text-[#1F2A44]">
            <Languages className="size-5 text-[#1E6DEB]" aria-hidden />
            {t("englishRequirements")}
          </h2>
          <ul className="mt-4 flex flex-wrap gap-3">
            {program.englishRequirements.map((requirement) => (
              <li
                key={requirement.id}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm"
              >
                <span className="font-semibold text-[#1F2A44]">
                  {tCatalog(`englishTests.${requirement.test}`)}
                </span>
                <span className="ms-2 text-[#5a6072]">
                  {formatNumber(locale, requirement.minScore)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {program.intakes.length > 0 ? (
        <section className="mt-10">
          <h2 className="flex items-center gap-2 text-xl font-bold text-[#1F2A44]">
            <CalendarDays className="size-5 text-[#1E6DEB]" aria-hidden />
            {t("intakes")}
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {program.intakes.map((intake) => (
              <li
                key={intake.id}
                className="rounded-2xl border border-slate-200 p-4"
              >
                <p className="font-semibold text-[#1F2A44]">
                  {tCatalog(`seasons.${intake.season}`)}{" "}
                  {formatNumber(locale, intake.year)}
                </p>
                <p className="mt-1 text-sm text-[#5a6072]">
                  {intake.applicationDeadline
                    ? t("deadline", {
                        date: formatDate(locale, intake.applicationDeadline),
                      })
                    : t("noDeadline")}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href={`/app/search?universities=${university.slug}`}
          className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#1E6DEB] px-6 text-base font-bold text-white transition-colors hover:bg-[#1859c4]"
        >
          {t("startApplication")}
        </Link>
        <Link
          href={`/app/compare?ids=${program.id}`}
          className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#1E6DEB] px-6 text-base font-bold text-[#1E6DEB] transition-colors hover:bg-[#EEF3FF]"
        >
          {t("compare")}
        </Link>
      </div>
    </div>
  );
}
