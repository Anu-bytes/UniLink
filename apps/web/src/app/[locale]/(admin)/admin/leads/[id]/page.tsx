import { Mail, Phone } from "lucide-react";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import { PageHeader } from "@/components/admin";
import { DeleteAction } from "@/components/admin/growth/delete-action";
import { FieldRow, Panel } from "@/components/admin/growth/panel";
import {
  PAGE_WRAPPER,
  PRIMARY_BUTTON,
  SECONDARY_BUTTON,
} from "@/components/admin/growth/styles";
import { requireAdminPage } from "@/lib/admin";
import { formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";

/**
 * Everything on this screen was typed into the public partnership form by
 * someone we have never met. It is rendered as text throughout — the two
 * links are `mailto:` and `tel:`, built from the stored values, and nothing
 * here goes anywhere near dangerouslySetInnerHTML.
 */
export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  // Authorization lives here, not only in the layout: a client-side
  // navigation between two admin pages skips the layout entirely.
  // See the note at the top of src/lib/admin.ts.
  await requireAdminPage();

  const t = await getTranslations("Admin.leads");
  const locale = await getLocale();
  const { id } = await params;

  const lead = await prisma.partnershipLead.findUnique({ where: { id } });
  if (!lead) notFound();

  const contactName = `${lead.contactFirstName} ${lead.contactLastName}`;

  return (
    <div className={PAGE_WRAPPER}>
      <PageHeader
        title={lead.universityName}
        description={`${contactName} · ${lead.contactTitle}`}
        breadcrumb={[
          { href: "/admin/leads", label: t("title") },
          { label: lead.universityName },
        ]}
        actions={
          <>
            <a href={`mailto:${lead.contactEmail}`} className={PRIMARY_BUTTON}>
              <Mail className="size-4" aria-hidden />
              {t("actions.email")}
            </a>
            <a href={`tel:${lead.phone}`} className={SECONDARY_BUTTON}>
              <Phone className="size-4" aria-hidden />
              {t("actions.call")}
            </a>
            <DeleteAction
              section="leads"
              id={lead.id}
              name={lead.universityName}
              variant="button"
              after="list"
            />
          </>
        }
      />

      <div className="mt-6 grid items-start gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <Panel title={t("sections.message")}>
            {lead.message ? (
              // The enquiry was typed into a textarea, so its line breaks are
              // the only formatting it has; `dir="auto"` keeps an English
              // enquiry readable on the Arabic console and vice versa.
              <p
                dir="auto"
                className="whitespace-pre-wrap break-words text-[14px] leading-relaxed text-[#334155]"
              >
                {lead.message}
              </p>
            ) : (
              <p className="text-[13px] text-slate-400">{t("message.empty")}</p>
            )}
          </Panel>
        </div>

        <div className="flex flex-col gap-5">
          <Panel title={t("sections.contact")}>
            <dl>
              <FieldRow label={t("fields.contactName")}>
                <span dir="auto">{contactName}</span>
              </FieldRow>
              <FieldRow label={t("fields.contactTitle")}>
                <span dir="auto">{lead.contactTitle}</span>
              </FieldRow>
              <FieldRow label={t("fields.email")}>
                <a
                  href={`mailto:${lead.contactEmail}`}
                  dir="ltr"
                  className="break-all text-[#1E6DEB] transition-colors hover:text-[#1557C0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
                >
                  {lead.contactEmail}
                </a>
              </FieldRow>
              <FieldRow label={t("fields.phone")}>
                <a
                  href={`tel:${lead.phone}`}
                  dir="ltr"
                  className="text-[#1E6DEB] transition-colors hover:text-[#1557C0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
                >
                  {lead.phone}
                </a>
              </FieldRow>
            </dl>
          </Panel>

          <Panel title={t("sections.enquiry")}>
            <dl>
              <FieldRow label={t("fields.university")}>
                <span dir="auto">{lead.universityName}</span>
              </FieldRow>
              <FieldRow label={t("fields.city")}>
                <span dir="auto">{lead.city}</span>
              </FieldRow>
              <FieldRow label={t("fields.received")}>
                {formatDate(locale, lead.createdAt)}
              </FieldRow>
            </dl>
          </Panel>
        </div>
      </div>
    </div>
  );
}
