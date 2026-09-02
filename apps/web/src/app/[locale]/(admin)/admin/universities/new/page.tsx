import { getTranslations } from "next-intl/server";

import { PageHeader } from "@/components/admin";
import { PAGE_WRAPPER } from "@/components/admin/universities/styles";
import { UniversityCreateForm } from "@/components/admin/universities/university-create-form";

export default async function NewUniversityPage() {
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
