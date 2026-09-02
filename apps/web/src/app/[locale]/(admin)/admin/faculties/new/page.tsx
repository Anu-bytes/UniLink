import { getLocale, getTranslations } from "next-intl/server";

import { PageHeader, type SelectOption } from "@/components/admin";
import { FacultyForm } from "@/components/admin/faculties/faculty-form";
import { PAGE_WRAPPER } from "@/components/admin/faculties/styles";
import { requireAdminPage } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export default async function NewFacultyPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Authorization lives here, not only in the layout: a client-side
  // navigation between two admin pages skips the layout entirely.
  // See the note at the top of src/lib/admin.ts.
  await requireAdminPage();

  const t = await getTranslations("Admin.faculties");
  const locale = await getLocale();
  const sp = await searchParams;

  const universities = await prisma.university.findMany({
    orderBy: [{ name: "asc" }, { id: "asc" }],
    select: { id: true, name: true, nameAr: true },
  });

  const options: SelectOption[] = universities.map((university) => ({
    value: university.id,
    label: locale === "ar" ? (university.nameAr ?? university.name) : university.name,
  }));

  // Arriving from a university's page pre-selects it, but a hand-typed or
  // stale id is dropped rather than pre-selecting nothing under a real label.
  const requested = Array.isArray(sp.universityId)
    ? sp.universityId[0]
    : sp.universityId;
  const defaultUniversityId = options.some((option) => option.value === requested)
    ? (requested ?? "")
    : "";

  return (
    <div className={PAGE_WRAPPER}>
      <PageHeader
        title={t("newTitle")}
        description={t("newSubtitle")}
        breadcrumb={[
          { href: "/admin/faculties", label: t("title") },
          { label: t("newTitle") },
        ]}
      />

      <div className="mt-6 max-w-3xl">
        <FacultyForm
          universities={options}
          defaultUniversityId={defaultUniversityId}
        />
      </div>
    </div>
  );
}
