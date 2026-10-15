import { getLocale, getTranslations } from "next-intl/server";

import { PageHeader } from "@/components/admin";
import { BulkGrid, type BulkColumn, type BulkRow } from "@/components/admin/bulk/bulk-grid";
import { BulkUniversityPicker } from "@/components/admin/bulk/university-select";
import { Link } from "@/i18n/navigation";
import { requireAdminPage } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

/**
 * Super admin: edit every university (or one university's programs) in one
 * spreadsheet instead of opening each record.
 */
export default async function BulkEditPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdminPage();
  const t = await getTranslations("Admin.bulk");
  const tCatalog = await getTranslations("Catalog");
  const locale = await getLocale();
  const sp = await searchParams;
  const tab = sp.tab === "programs" ? "programs" : "universities";

  const universities = await prisma.university.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      nameAr: true,
      acronym: true,
      type: true,
      city: true,
      cityAr: true,
      establishedYear: true,
      websiteUrl: true,
      publishedAt: true,
      isFeatured: true,
      isRecommended: true,
      isTrending: true,
      _count: { select: { faculties: true, programs: true } },
    },
  });
  const nameOf = (university: { name: string; nameAr: string | null }) =>
    locale === "ar" ? (university.nameAr ?? university.name) : university.name;

  const tabs = [
    { key: "universities", href: "/admin/bulk-edit", label: t("tabs.universities") },
    { key: "programs", href: "/admin/bulk-edit?tab=programs", label: t("tabs.programs") },
  ];

  let grid: { columns: BulkColumn[]; rows: BulkRow[]; endpoint: string; placeholder: string };
  let universityId = "";

  if (tab === "universities") {
    grid = {
      endpoint: "/api/admin/universities/",
      placeholder: t("searchUniversities"),
      columns: [
        { key: "name", label: t("cols.name"), type: "text", width: 230, dir: "ltr", required: true },
        { key: "nameAr", label: t("cols.nameAr"), type: "text", width: 230, dir: "rtl" },
        { key: "acronym", label: t("cols.acronym"), type: "text", width: 100, dir: "ltr" },
        {
          key: "type",
          label: t("cols.type"),
          type: "select",
          width: 150,
          options: [
            { value: "NATIONAL", label: tCatalog("universityTypes.NATIONAL") },
            { value: "PRIVATE", label: tCatalog("universityTypes.PRIVATE") },
          ],
        },
        { key: "city", label: t("cols.city"), type: "text", width: 160, dir: "ltr", required: true },
        { key: "cityAr", label: t("cols.cityAr"), type: "text", width: 160, dir: "rtl" },
        { key: "establishedYear", label: t("cols.founded"), type: "number", width: 100 },
        { key: "websiteUrl", label: t("cols.website"), type: "text", width: 220, dir: "ltr" },
        { key: "published", label: t("cols.published"), type: "bool", width: 90 },
        { key: "isFeatured", label: t("cols.featured"), type: "bool", width: 90 },
        { key: "isRecommended", label: t("cols.recommended"), type: "bool", width: 110 },
        { key: "isTrending", label: t("cols.trending"), type: "bool", width: 90 },
      ],
      rows: universities.map((university) => ({
        id: university.id,
        title: nameOf(university),
        subtitle: t("counts", { faculties: university._count.faculties, programs: university._count.programs }),
        href: `/admin/universities/${university.id}`,
        values: {
          name: university.name,
          nameAr: university.nameAr,
          acronym: university.acronym,
          type: university.type,
          city: university.city,
          cityAr: university.cityAr,
          establishedYear: university.establishedYear,
          websiteUrl: university.websiteUrl,
          published: university.publishedAt != null,
          isFeatured: university.isFeatured,
          isRecommended: university.isRecommended,
          isTrending: university.isTrending,
        },
      })),
    };
  } else {
    const requested = Array.isArray(sp.university) ? sp.university[0] : sp.university;
    universityId = universities.some((university) => university.id === requested) ? requested! : (universities[0]?.id ?? "");
    const programs = await prisma.program.findMany({
      where: { universityId },
      orderBy: [{ faculty: { sortOrder: "asc" } }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        nameAr: true,
        tuitionFee: true,
        tuitionPeriod: true,
        currency: true,
        minGradePercent: true,
        durationMonths: true,
        isPublished: true,
        faculty: { select: { name: true, nameAr: true } },
      },
    });
    grid = {
      endpoint: "/api/admin/programs/",
      placeholder: t("searchPrograms"),
      columns: [
        { key: "name", label: t("cols.name"), type: "text", width: 240, dir: "ltr", required: true },
        { key: "nameAr", label: t("cols.nameAr"), type: "text", width: 240, dir: "rtl" },
        { key: "tuitionFee", label: t("cols.fee"), type: "number", width: 130 },
        {
          key: "tuitionPeriod",
          label: t("cols.period"),
          type: "select",
          width: 130,
          options: (["YEAR", "TERM", "TOTAL"] as const).map((value) => ({ value, label: t(`periods.${value}`) })),
        },
        { key: "currency", label: t("cols.currency"), type: "text", width: 80, dir: "ltr" },
        { key: "minGradePercent", label: t("cols.minGrade"), type: "number", width: 110 },
        { key: "durationMonths", label: t("cols.duration"), type: "number", width: 110 },
        { key: "isPublished", label: t("cols.published"), type: "bool", width: 90 },
      ],
      rows: programs.map((program) => ({
        id: program.id,
        title: locale === "ar" ? (program.nameAr ?? program.name) : program.name,
        subtitle: program.faculty ? (locale === "ar" ? (program.faculty.nameAr ?? program.faculty.name) : program.faculty.name) : undefined,
        href: `/admin/programs/${program.id}`,
        values: {
          name: program.name,
          nameAr: program.nameAr,
          tuitionFee: program.tuitionFee == null ? null : Number(program.tuitionFee),
          tuitionPeriod: program.tuitionPeriod,
          currency: program.currency,
          minGradePercent: program.minGradePercent,
          durationMonths: program.durationMonths,
          isPublished: program.isPublished,
        },
      })),
    };
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-6 md:px-6 md:py-8">
      <PageHeader title={t("title")} description={t("subtitle")} />

      <div className="mt-5 flex flex-wrap items-end justify-between gap-3 border-b border-slate-200">
        <nav className="flex gap-1" aria-label={t("title")}>
          {tabs.map((entry) => (
            <Link
              key={entry.key}
              href={entry.href}
              aria-current={entry.key === tab ? "page" : undefined}
              className={cn(
                "-mb-px inline-flex min-h-11 items-center border-b-2 px-3 text-[13.5px] font-semibold",
                entry.key === tab ? "border-[#1E6DEB] text-[#1E6DEB]" : "border-transparent text-[#64748B] hover:text-[#0F172A]",
              )}
            >
              {entry.label}
            </Link>
          ))}
        </nav>
        {tab === "programs" ? (
          <div className="pb-2">
            <BulkUniversityPicker
              value={universityId}
              options={universities.map((university) => ({ value: university.id, label: nameOf(university) }))}
            />
          </div>
        ) : null}
      </div>

      <div className="mt-4">
        <BulkGrid key={`${tab}-${universityId}`} columns={grid.columns} rows={grid.rows} endpoint={grid.endpoint} searchPlaceholder={grid.placeholder} />
      </div>
    </div>
  );
}
