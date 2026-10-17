import { ExternalLink, Mail, Phone, Presentation, ShieldCheck } from "lucide-react";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import { Badge, PageHeader } from "@/components/admin";
import { FieldRow, Panel } from "@/components/admin/growth/panel";
import { PAGE_WRAPPER, PRIMARY_BUTTON, SECONDARY_BUTTON } from "@/components/admin/growth/styles";
import { RequestReview } from "@/components/admin/requests/request-review";
import { Link } from "@/i18n/navigation";
import { requireAdminPage } from "@/lib/admin";
import { formatDate } from "@/lib/format";
import { isSafeHttpUrl, STATUS_TONE } from "@/lib/partner-requests";
import { prisma } from "@/lib/prisma";

/**
 * One demo request or representative application. Every value here came from
 * a public form: it is rendered as text, the links are mailto:/tel: built
 * from the stored values, and the proof link is shown as a link only when it
 * is http(s), opened without a referrer or opener.
 */
export default async function AdminRequestPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminPage();
  const t = await getTranslations("Admin.requests");
  const locale = await getLocale();
  const { id } = await params;

  const request = await prisma.partnerRequest.findUnique({
    where: { id },
    include: {
      university: { select: { id: true, name: true, nameAr: true, slug: true } },
      reviewer: { select: { name: true, email: true } },
      user: { select: { id: true, email: true, role: true } },
    },
  });
  if (!request) notFound();

  const universities =
    request.type === "REPRESENTATIVE"
      ? (await prisma.university.findMany({ select: { id: true, name: true, nameAr: true } }))
          .map((row) => ({ value: row.id, label: locale === "ar" ? (row.nameAr ?? row.name) : row.name }))
          .sort((a, b) => a.label.localeCompare(b.label, locale))
      : [];
  const grantedAccount = request.grantedUserId
    ? await prisma.user.findUnique({ where: { id: request.grantedUserId }, select: { id: true, email: true } })
    : null;

  const Icon = request.type === "DEMO" ? Presentation : ShieldCheck;

  return (
    <div className={PAGE_WRAPPER}>
      <PageHeader
        title={<bdi>{request.universityName}</bdi>}
        description={
          <span className="inline-flex flex-wrap items-center gap-2">
            <Icon className="size-4 text-[#1E6DEB]" aria-hidden />
            {t(`types.${request.type}`)}
            <Badge tone={STATUS_TONE[request.status]} dot>
              {t(`status.${request.status}`)}
            </Badge>
            <span className="text-[#94A3B8]">{t("detail.received", { date: formatDate(locale, request.createdAt) })}</span>
          </span>
        }
        breadcrumb={[{ href: "/admin/requests", label: t("title") }, { label: request.universityName }]}
        actions={
          <>
            <a href={`mailto:${request.email}`} className={PRIMARY_BUTTON}>
              <Mail className="size-4" aria-hidden />
              {t("detail.email")}
            </a>
            <a href={`tel:${request.phone.replace(/[^0-9+]/g, "")}`} className={SECONDARY_BUTTON}>
              <Phone className="size-4" aria-hidden />
              {t("detail.call")}
            </a>
          </>
        }
      />

      <div className="mt-6 grid items-start gap-5 xl:grid-cols-3">
        <div className="flex flex-col gap-5 xl:col-span-2">
          <Panel title={t("detail.message")}>
            {request.message ? (
              <p dir="auto" className="whitespace-pre-wrap break-words text-[14px] leading-relaxed text-[#334155]">
                {request.message}
              </p>
            ) : (
              <p className="text-[13px] text-slate-400">{t("detail.noMessage")}</p>
            )}
          </Panel>

          <RequestReview
            request={{
              id: request.id,
              type: request.type,
              status: request.status,
              internalNote: request.internalNote,
              scheduledAt: request.scheduledAt?.toISOString() ?? null,
              universityId: request.university?.id ?? null,
              email: request.email,
            }}
            universities={universities}
            granted={grantedAccount ? { id: grantedAccount.id, email: grantedAccount.email } : null}
          />
        </div>

        <div className="flex flex-col gap-5">
          <Panel title={t("detail.applicant")}>
            <dl>
              <FieldRow label={t("fields.fullName")}>
                <bdi>{request.fullName}</bdi>
              </FieldRow>
              <FieldRow label={t("fields.jobTitle")}>
                <bdi>{request.jobTitle}</bdi>
              </FieldRow>
              <FieldRow label={t("fields.email")}>
                <a href={`mailto:${request.email}`} dir="ltr" className="break-all text-[#1E6DEB] hover:underline">
                  {request.email}
                </a>
              </FieldRow>
              <FieldRow label={t("fields.phone")}>
                <span dir="ltr">{request.phone}</span>
              </FieldRow>
              <FieldRow label={t("fields.account")}>
                {request.user ? (
                  <Link href={`/admin/users/${request.user.id}`} className="text-[#1E6DEB] hover:underline">
                    {t("detail.signedIn")}
                  </Link>
                ) : (
                  <span className="text-[#94A3B8]">{t("detail.notSignedIn")}</span>
                )}
              </FieldRow>
            </dl>
          </Panel>

          <Panel title={t("detail.details")}>
            <dl>
              <FieldRow label={t("fields.university")}>
                {request.university ? (
                  <Link href={`/universities/${request.university.slug}`} className="text-[#1E6DEB] hover:underline">
                    <bdi>{locale === "ar" ? (request.university.nameAr ?? request.university.name) : request.university.name}</bdi>
                  </Link>
                ) : (
                  <span>
                    <bdi>{request.universityName}</bdi> <span className="text-[12px] text-[#B77714]">({t("detail.notListed")})</span>
                  </span>
                )}
              </FieldRow>
              {request.type === "DEMO" ? (
                <>
                  <FieldRow label={t("fields.city")}>
                    <bdi>{request.city ?? "-"}</bdi>
                  </FieldRow>
                  <FieldRow label={t("fields.preferredDate")}>
                    {request.preferredDate ? formatDate(locale, request.preferredDate) : t("detail.anyDay")}
                    {request.preferredSlot ? ` · ${t(`slots.${request.preferredSlot}`)}` : ""}
                  </FieldRow>
                  <FieldRow label={t("fields.attendees")}>{request.attendees ?? "-"}</FieldRow>
                </>
              ) : (
                <FieldRow label={t("fields.proofUrl")}>
                  {isSafeHttpUrl(request.proofUrl) ? (
                    <a
                      href={request.proofUrl}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      dir="ltr"
                      className="inline-flex items-center gap-1 break-all text-[#1E6DEB] hover:underline"
                    >
                      {request.proofUrl}
                      <ExternalLink className="size-3.5 shrink-0" aria-hidden />
                    </a>
                  ) : (
                    <span className="text-[#94A3B8]">{t("detail.noProof")}</span>
                  )}
                </FieldRow>
              )}
              <FieldRow label={t("fields.language")}>{request.locale === "ar" ? "العربية" : "English"}</FieldRow>
            </dl>
          </Panel>

          {request.reviewer ? (
            <Panel title={t("detail.history")}>
              <p className="text-[13px] text-[#475569]">
                {t("detail.lastReviewed", {
                  name: request.reviewer.name ?? request.reviewer.email,
                  date: request.reviewedAt ? formatDate(locale, request.reviewedAt) : "",
                })}
              </p>
            </Panel>
          ) : null}
        </div>
      </div>
    </div>
  );
}
