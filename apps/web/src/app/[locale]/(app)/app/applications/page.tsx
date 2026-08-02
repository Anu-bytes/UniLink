import { FileText, MapPin } from "lucide-react";
import { redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import { auth } from "@/auth";
import { Link } from "@/i18n/navigation";
import { ApplicationStatusActions } from "@/components/app/application-actions";
import { UniversityLogo } from "@/components/university-logo";
import { formatDate, formatMoney } from "@/lib/format";
import { getApplications } from "@/lib/program-search";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, string> = {
  DRAFT: "bg-slate-100 text-[#5a6072]",
  SUBMITTED: "bg-[#EEF3FF] text-[#1E3A8A]",
  IN_REVIEW: "bg-[#FFF6E5] text-[#B77714]",
  OFFER: "bg-[#E9F7F0] text-[#1F7A4D]",
  REJECTED: "bg-[#FFF0EE] text-[#C81F15]",
  WITHDRAWN: "bg-slate-100 text-[#98A0B4]",
};

export default async function ApplicationsPage() {
  const t = await getTranslations("Applications");
  const tCatalog = await getTranslations("Catalog");
  const locale = await getLocale();
  const session = await auth();

  if (!session?.user?.id) redirect(`/${locale}/login`);

  const applications = await getApplications(locale, session.user.id);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 pb-32 md:px-6 md:py-8">
      <h1 className="text-2xl font-bold text-[#1F2A44] md:text-3xl">
        {t("title")}
      </h1>
      <p className="mt-1 text-sm text-[#5a6072]">{t("subtitle")}</p>

      {applications.length > 0 ? (
        <ul className="mt-6 space-y-4">
          {applications.map((application) => {
            const program = application.program;
            const tuition = formatMoney(
              locale,
              program.tuitionFee,
              program.currency,
            );

            return (
              <li
                key={application.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:p-5"
              >
                <div className="flex flex-wrap items-start gap-4">
                  <UniversityLogo
                    name={program.university.name}
                    logoUrl={program.university.logoUrl}
                    className="size-12"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-base font-bold text-[#1F2A44]">
                        {program.name}
                      </h2>
                      <span
                        className={cn(
                          "rounded-full px-3 py-1 text-xs font-bold",
                          STATUS_STYLES[application.status] ??
                            "bg-slate-100 text-[#5a6072]",
                        )}
                      >
                        {t(`status.${application.status}`)}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-[#5a6072]">
                      {program.university.name}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-[#5a6072]">
                      <MapPin className="size-3.5" aria-hidden />
                      {program.university.city}, {program.university.country}
                    </p>

                    <p className="mt-3 text-xs text-[#5a6072]">
                      {application.submittedAt
                        ? t("submittedOn", {
                            date: formatDate(locale, application.submittedAt),
                          })
                        : t("startedOn", {
                            date: formatDate(locale, application.createdAt),
                          })}
                      {tuition
                        ? ` · ${tuition}${tCatalog(`tuitionPeriods.${program.tuitionPeriod}`)}`
                        : null}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/universities/${program.university.slug}/programs/${program.slug}`}
                      className="inline-flex min-h-10 items-center rounded-lg border border-slate-200 px-4 text-sm font-semibold text-[#1F2A44] hover:bg-slate-50"
                    >
                      {t("viewProgram")}
                    </Link>
                    <ApplicationStatusActions
                      applicationId={application.id}
                      status={application.status}
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="mt-6 rounded-xl bg-[#F5F8FF] px-6 py-16 text-center">
          <FileText className="mx-auto size-8 text-[#98A0B4]" aria-hidden />
          <h2 className="mt-3 text-lg font-bold text-[#1F2A44]">
            {t("emptyTitle")}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-[#5a6072]">
            {t("emptyBody")}
          </p>
          <Link
            href="/app/search"
            className="mt-6 inline-flex min-h-12 items-center justify-center rounded-lg bg-[#1E6DEB] px-6 text-sm font-bold text-white hover:bg-[#1859c4]"
          >
            {t("browse")}
          </Link>
        </div>
      )}
    </div>
  );
}
