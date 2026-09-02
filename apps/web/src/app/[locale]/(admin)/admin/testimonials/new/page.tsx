import { getTranslations } from "next-intl/server";

import { PageHeader } from "@/components/admin";
import { PAGE_WRAPPER } from "@/components/admin/growth/styles";
import { TestimonialForm } from "@/components/admin/growth/testimonial-form";

export default async function NewTestimonialPage() {
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
