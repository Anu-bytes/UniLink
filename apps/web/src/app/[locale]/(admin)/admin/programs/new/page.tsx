import { getTranslations } from "next-intl/server";

import { PageHeader } from "@/components/admin";
import { ProgramCreateForm } from "@/components/admin/programs/program-create-form";
import { PAGE_WRAPPER } from "@/components/admin/programs/styles";
import { requireAdminPage } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

/** A repeated query key arrives as an array; the first value wins. */
function single(value: string | string[] | undefined): string {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw?.trim() ?? "";
}

export default async function NewProgramPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Authorization lives here, not only in the layout: a client-side
  // navigation between two admin pages skips the layout entirely.
  // See the note at the top of src/lib/admin.ts.
  await requireAdminPage();

  const t = await getTranslations("Admin.programs");
  const sp = await searchParams;

  const [universities, faculties] = await prisma.$transaction([
    prisma.university.findMany({
      orderBy: [{ name: "asc" }, { id: "asc" }],
      select: { id: true, name: true, nameAr: true },
    }),
    // Every faculty, not just one university's: the select narrows in the
    // browser as the university changes, which beats a round trip per change
    // for a list this size and keeps the two controls from disagreeing.
    prisma.faculty.findMany({
      orderBy: [{ universityId: "asc" }, { sortOrder: "asc" }, { id: "asc" }],
      select: { id: true, name: true, nameAr: true, universityId: true },
    }),
  ]);

  // The faculties editor links here with both ids, but a hand-typed or stale
  // one is dropped rather than pre-selecting something that cannot be saved.
  const requestedUniversityId = single(sp.universityId);
  const requestedFacultyId = single(sp.facultyId);
  const faculty = faculties.find((row) => row.id === requestedFacultyId) ?? null;

  const defaultUniversityId = faculty
    ? faculty.universityId
    : universities.some((university) => university.id === requestedUniversityId)
      ? requestedUniversityId
      : "";
  // A faculty only survives alongside its own university, which is exactly
  // what the API checks before it accepts the pair.
  const defaultFacultyId =
    faculty && faculty.universityId === defaultUniversityId ? faculty.id : "";

  return (
    <div className={PAGE_WRAPPER}>
      <PageHeader
        title={t("newTitle")}
        description={t("newSubtitle")}
        breadcrumb={[
          { href: "/admin/programs", label: t("title") },
          { label: t("newTitle") },
        ]}
      />

      <div className="mt-6 max-w-3xl">
        <ProgramCreateForm
          universities={universities}
          faculties={faculties}
          defaultUniversityId={defaultUniversityId}
          defaultFacultyId={defaultFacultyId}
        />
      </div>
    </div>
  );
}
