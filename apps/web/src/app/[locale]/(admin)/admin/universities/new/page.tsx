import { getTranslations } from "next-intl/server";

import { PageHeader } from "@/components/admin";
import { PAGE_WRAPPER } from "@/components/admin/universities/styles";
import { UniversityCreateForm } from "@/components/admin/universities/university-create-form";
import { requireAdminPage } from "@/lib/admin";

export default async function NewUniversityPage() {
  // Authorization lives here, not only in the layout: a client-side
  // navigation between two admin pages skips the layout entirely.
  // See the note at the top of src/lib/admin.ts.
  await requireAdminPage();

  const t = await getTranslations("Admin");

  return (
    <div className={PAGE_WRAPPER}>
      <PageHeader
        breadcrumb={[
          { href: "/admin/universities", label: t("universities.title") },
          { label: t("universities.newTitle") },
        ]}
        title={t("universities.newTitle")}
        description={t("universities.newDescription")}
      />

      <div className="mt-6 max-w-3xl">
        <UniversityCreateForm />
      </div>
    </div>
  );
}
