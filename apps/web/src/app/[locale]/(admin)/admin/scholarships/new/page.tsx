import { getLocale, getTranslations } from "next-intl/server";

import { PageHeader, type SelectOption } from "@/components/admin";
import { ScholarshipForm } from "@/components/admin/growth/scholarship-form";
import { PAGE_WRAPPER } from "@/components/admin/growth/styles";
import { requireAdminPage } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export default async function NewScholarshipPage() {
  // Authorization lives here, not only in the layout: a client-side
  // navigation between two admin pages skips the layout entirely.
  // See the note at the top of src/lib/admin.ts.
  await requireAdminPage();

  const t = await getTranslations("Admin.scholarships");
  const locale = await getLocale();

  const universities = await prisma.university.findMany({
    orderBy: [{ name: "asc" }, { id: "asc" }],
    select: { id: true, name: true, nameAr: true },
  });

  const options: SelectOption[] = universities.map((university) => ({
    value: university.id,
    label: locale === "ar" ? (university.nameAr ?? university.name) : university.name,
  }));

  return (
    <div className={PAGE_WRAPPER}>
      <PageHeader
        title={t("newTitle")}
        description={t("newSubtitle")}
        breadcrumb={[
          { href: "/admin/scholarships", label: t("title") },
          { label: t("newTitle") },
        ]}
      />

      <div className="mt-6 max-w-3xl">
        <ScholarshipForm universities={options} />
      </div>
    </div>
  );
}
