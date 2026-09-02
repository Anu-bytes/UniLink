import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { PageHeader } from "@/components/admin";
import { DeleteAction } from "@/components/admin/growth/delete-action";
import { PAGE_WRAPPER } from "@/components/admin/growth/styles";
import { TestimonialForm } from "@/components/admin/growth/testimonial-form";
import type { TestimonialRow } from "@/components/admin/growth/types";
import { prisma } from "@/lib/prisma";

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const t = await getTranslations("Admin.testimonials");
  const { id } = await params;

  const testimonial = await prisma.testimonial.findUnique({
    where: { id },
    select: {
      id: true,
      studentName: true,
      quote: true,
      quoteAr: true,
      location: true,
      locationAr: true,
      avatarUrl: true,
      sortOrder: true,
      isPublished: true,
    },
  });

  if (!testimonial) notFound();

  const row: TestimonialRow = testimonial;

  return (
    <div className={PAGE_WRAPPER}>
      <PageHeader
        title={row.studentName}
        description={t("editSubtitle")}
        breadcrumb={[
          { href: "/admin/testimonials", label: t("title") },
          { label: row.studentName },
        ]}
        actions={
          <DeleteAction
            section="testimonials"
            id={row.id}
            name={row.studentName}
            variant="button"
            after="list"
          />
        }
      />

      <div className="mt-6">
        <TestimonialForm testimonial={row} />
      </div>
    </div>
  );
}
