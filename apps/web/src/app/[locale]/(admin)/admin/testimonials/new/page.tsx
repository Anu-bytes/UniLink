import { getTranslations } from "next-intl/server";

import { PageHeader } from "@/components/admin";
import { PAGE_WRAPPER } from "@/components/admin/growth/styles";
import { TestimonialForm } from "@/components/admin/growth/testimonial-form";
import { requireAdminPage } from "@/lib/admin";

export default async function NewTestimonialPage() {
  // Authorization lives here, not only in the layout: a client-side
  // navigation between two admin pages skips the layout entirely.
  // See the note at the top of src/lib/admin.ts.
  await requireAdminPage();

  const t = await getTranslations("Admin.testimonials");

  return (
    <div className={PAGE_WRAPPER}>
      <PageHeader
        title={t("newTitle")}
        description={t("newSubtitle")}
        breadcrumb={[
          { href: "/admin/testimonials", label: t("title") },
          { label: t("newTitle") },
        ]}
      />

      <div className="mt-6">
        <TestimonialForm />
      </div>
    </div>
  );
}
