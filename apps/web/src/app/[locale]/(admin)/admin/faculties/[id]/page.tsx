import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import { PageHeader, type SelectOption } from "@/components/admin";
import { FacultyDeleteAction } from "@/components/admin/faculties/faculty-delete-action";
import { FacultyForm } from "@/components/admin/faculties/faculty-form";
import { FacultyProgramsPanel } from "@/components/admin/faculties/faculty-programs-panel";
import { PAGE_WRAPPER } from "@/components/admin/faculties/styles";
import type { FacultyProgramRow } from "@/components/admin/faculties/types";
import { Link } from "@/i18n/navigation";
import { requireAdminPage } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

/**
 * One screenful of the faculty's programs. The panel links out to the filtered
 * programs list for the rest rather than paginating a read-only aside.
 */
const PROGRAMS_SHOWN = 25;

export default async function EditFacultyPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  // Authorization lives here, not only in the layout: a client-side
  // navigation between two admin pages skips the layout entirely.
  // See the note at the top of src/lib/admin.ts.
  await requireAdminPage();

  const t = await getTranslations("Admin.faculties");
  const locale = await getLocale();
  const { id } = await params;

  const [faculty, universities, programs] = await prisma.$transaction([
    prisma.faculty.findUnique({
      where: { id },
      select: {
        id: true,
        universityId: true,
        name: true,
        nameAr: true,
        slug: true,
        description: true,
        descriptionAr: true,
        imageUrl: true,
        sortOrder: true,
        university: { select: { name: true, nameAr: true } },
        _count: { select: { programs: true, minimumScores: true } },
      },
    }),
    prisma.university.findMany({
      orderBy: [{ name: "asc" }, { id: "asc" }],
      select: { id: true, name: true, nameAr: true },
    }),
    prisma.program.findMany({
      where: { facultyId: id },
      orderBy: [{ name: "asc" }, { id: "asc" }],
      take: PROGRAMS_SHOWN,
      select: { id: true, name: true, nameAr: true, studyLevel: true, isPublished: true },
    }),
  ]);

  if (!faculty) notFound();

  const options: SelectOption[] = universities.map((university) => ({
    value: university.id,
    label: locale === "ar" ? (university.nameAr ?? university.name) : university.name,
  }));

  const programRows: FacultyProgramRow[] = programs.map((program) => ({
    id: program.id,
    name: program.name,
    nameAr: program.nameAr,
    studyLevel: program.studyLevel,
    isPublished: program.isPublished,
  }));

  const universityLabel =
    locale === "ar"
      ? (faculty.university.nameAr ?? faculty.university.name)
      : faculty.university.name;

  return (
    <div className={PAGE_WRAPPER}>
      <PageHeader
        title={faculty.name}
        breadcrumb={[
          { href: "/admin/faculties", label: t("title") },
          { label: faculty.name },
        ]}
        description={
          <Link
            href={`/admin/universities/${faculty.universityId}`}
            className="transition-colors hover:text-[#1E6DEB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
          >
            {universityLabel}
          </Link>
        }
        actions={
          <FacultyDeleteAction
            faculty={{ id: faculty.id, name: faculty.name }}
            variant="button"
            after="list"
          />
        }
      />

      <div className="mt-6 grid items-start gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <FacultyForm
            universities={options}
            faculty={{
              id: faculty.id,
              universityId: faculty.universityId,
              name: faculty.name,
              nameAr: faculty.nameAr,
              slug: faculty.slug,
              description: faculty.description,
              descriptionAr: faculty.descriptionAr,
              imageUrl: faculty.imageUrl,
              sortOrder: faculty.sortOrder,
            }}
            counts={faculty._count}
          />
        </div>

        <FacultyProgramsPanel
          facultyId={faculty.id}
          universityId={faculty.universityId}
          rows={programRows}
          total={faculty._count.programs}
        />
      </div>
    </div>
  );
}
