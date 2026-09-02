import { Prisma } from "@prisma/client";
import { Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { PageHeader, Pagination, TableToolbar } from "@/components/admin";
import { ProgramFilters } from "@/components/admin/programs/program-filters";
import { ProgramTable } from "@/components/admin/programs/program-table";
import { PAGE_WRAPPER, PRIMARY_BUTTON } from "@/components/admin/programs/styles";
import { STUDY_LEVELS } from "@/components/admin/programs/types";
import type { ProgramRow } from "@/components/admin/programs/types";
import { Link } from "@/i18n/navigation";
import { DEFAULT_PER_PAGE } from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";

/**
 * The columns /api/admin/programs will sort by. The value arrives as a raw
 * query string, so anything else falls back to `createdAt` rather than being
 * handed to Prisma's `ORDER BY`.
 */
const SORT_COLUMNS = ["name", "tuitionFee", "createdAt", "updatedAt"] as const;

/** A repeated query key arrives as an array; the first value wins. */
function single(value: string | string[] | undefined): string {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw?.trim() ?? "";
}

export default async function AdminProgramsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const t = await getTranslations("Admin.programs");
  const sp = await searchParams;

  const q = single(sp.q).slice(0, 120);
  const universityId = single(sp.universityId);
  const facultyId = single(sp.facultyId);
  const levelParam = single(sp.studyLevel);
  const studyLevel = (STUDY_LEVELS as readonly string[]).includes(levelParam)
    ? (levelParam as (typeof STUDY_LEVELS)[number])
    : null;
  const publishedParam = single(sp.published);
  const published =
    publishedParam === "true" ? true : publishedParam === "false" ? false : null;

  const requestedPage = Number.parseInt(single(sp.page), 10);
  const page = Number.isFinite(requestedPage) ? Math.max(1, requestedPage) : 1;

  const sortParam = single(sp.sort);
  const sort = (SORT_COLUMNS as readonly string[]).includes(sortParam)
    ? (sortParam as (typeof SORT_COLUMNS)[number])
    : "createdAt";
  const order = single(sp.order) === "asc" ? "asc" : "desc";

  // The same `where` the list endpoint builds, so the table and the API can
  // never disagree about what a search matches — including the university's
  // name, which is how "Cairo" finds every program at Cairo University.
  const where: Prisma.ProgramWhereInput = {
    ...(universityId ? { universityId } : {}),
    ...(facultyId ? { facultyId } : {}),
    ...(studyLevel ? { studyLevel } : {}),
    ...(published === null ? {} : { isPublished: published }),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { nameAr: { contains: q, mode: "insensitive" } },
            { slug: { contains: q, mode: "insensitive" } },
            { university: { is: { name: { contains: q, mode: "insensitive" } } } },
            { university: { is: { nameAr: { contains: q, mode: "insensitive" } } } },
          ],
        }
      : {}),
  };

  const [items, total, universities] = await prisma.$transaction([
    prisma.program.findMany({
      where,
      // `id` breaks ties. `tuitionFee` is null on most rows and two programs
      // routinely share a name, so without a second key Postgres is free to
      // order the tied rows differently per query — which makes rows jump
      // between pages as the admin pages through.
      orderBy: [{ [sort]: order }, { id: "asc" }],
      skip: (page - 1) * DEFAULT_PER_PAGE,
      take: DEFAULT_PER_PAGE,
      select: {
        id: true,
        name: true,
        nameAr: true,
        slug: true,
        studyLevel: true,
        fieldOfStudy: true,
        tuitionFee: true,
        tuitionPeriod: true,
        currency: true,
        isPublished: true,
        university: { select: { id: true, name: true, nameAr: true } },
        faculty: { select: { id: true, name: true, nameAr: true } },
      },
    }),
    prisma.program.count({ where }),
    prisma.university.findMany({
      orderBy: [{ name: "asc" }, { id: "asc" }],
      select: { id: true, name: true, nameAr: true },
    }),
  ]);

  // The faculties editor links here with a facultyId and no university, so the
  // university in scope is resolved from the faculty itself — otherwise the
  // faculty filter would hold an id it has no name for.
  const scopeUniversityId =
    universityId ||
    (facultyId
      ? ((
          await prisma.faculty.findUnique({
            where: { id: facultyId },
            select: { universityId: true },
          })
        )?.universityId ?? "")
      : "");

  const faculties = scopeUniversityId
    ? await prisma.faculty.findMany({
        where: { universityId: scopeUniversityId },
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        select: { id: true, name: true, nameAr: true, universityId: true },
      })
    : [];

  const rows: ProgramRow[] = items.map((program) => ({
    id: program.id,
    name: program.name,
    nameAr: program.nameAr,
    slug: program.slug,
    studyLevel: program.studyLevel,
    fieldOfStudy: program.fieldOfStudy,
    // Decimal cannot cross into a client component.
    tuitionFee: program.tuitionFee === null ? null : Number(program.tuitionFee),
    tuitionPeriod: program.tuitionPeriod,
    currency: program.currency,
    isPublished: program.isPublished,
    university: program.university,
    faculty: program.faculty,
  }));

  const totalPages = Math.max(1, Math.ceil(total / DEFAULT_PER_PAGE));
  const filtered =
    q !== "" ||
    universityId !== "" ||
    facultyId !== "" ||
    studyLevel !== null ||
    published !== null;

  return (
    <div className={PAGE_WRAPPER}>
      <PageHeader
        title={t("title")}
        description={t("subtitle")}
        actions={
          <Link href="/admin/programs/new" className={PRIMARY_BUTTON}>
            <Plus className="size-4" aria-hidden />
            {t("new")}
          </Link>
        }
      />

      <div className="mt-6 flex flex-col gap-4">
        <TableToolbar placeholder={t("searchPlaceholder")} total={total}>
          <ProgramFilters
            universities={universities}
            faculties={faculties}
          />
        </TableToolbar>

        <ProgramTable rows={rows} filtered={filtered} />

        {totalPages > 1 ? (
          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            perPage={DEFAULT_PER_PAGE}
          />
        ) : null}
      </div>
    </div>
  );
}
