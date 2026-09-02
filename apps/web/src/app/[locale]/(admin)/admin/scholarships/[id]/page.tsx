import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import { PageHeader, type SelectOption } from "@/components/admin";
import { DeleteAction } from "@/components/admin/growth/delete-action";
import { ScholarshipForm } from "@/components/admin/growth/scholarship-form";
import { PAGE_WRAPPER } from "@/components/admin/growth/styles";
import type { ScholarshipDetail } from "@/components/admin/growth/types";
import { decimalToNumber } from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";

export default async function EditScholarshipPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const t = await getTranslations("Admin.scholarships");
  const locale = await getLocale();
  const { id } = await params;

  const [scholarship, universities] = await prisma.$transaction([
    prisma.scholarship.findUnique({
      where: { id },
      select: {
        id: true,
        universityId: true,
        title: true,
        titleAr: true,
        slug: true,
        description: true,
        descriptionAr: true,
        fundingAmount: true,
        currency: true,
        applicationDeadline: true,
        isPublished: true,
      },
    }),
    prisma.university.findMany({
      orderBy: [{ name: "asc" }, { id: "asc" }],
      select: { id: true, name: true, nameAr: true },
    }),
  ]);

  if (!scholarship) notFound();

  // Decimal never reaches the client: JSON.stringify turns it into a string,
  // which then loses to `<` and `>` in the editor.
  const detail: ScholarshipDetail = {
    ...scholarship,
    fundingAmount: decimalToNumber(scholarship.fundingAmount),
  };

  const options: SelectOption[] = universities.map((university) => ({
    value: university.id,
    label: locale === "ar" ? (university.nameAr ?? university.name) : university.name,
  }));

  return (
    <div className={PAGE_WRAPPER}>
      <PageHeader
        title={detail.title}
        description={t("editSubtitle")}
        breadcrumb={[
          { href: "/admin/scholarships", label: t("title") },
          { label: detail.title },
        ]}
        actions={
          <DeleteAction
            section="scholarships"
            id={detail.id}
            name={detail.title}
            variant="button"
            after="list"
          />
        }
      />

      <div className="mt-6 max-w-3xl">
        <ScholarshipForm universities={options} scholarship={detail} />
      </div>
    </div>
  );
}
