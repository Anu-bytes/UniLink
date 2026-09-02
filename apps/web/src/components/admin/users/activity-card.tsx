import { ArrowRight, Bookmark, FileText } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { Badge, EmptyState } from "@/components/admin";
import { Link } from "@/i18n/navigation";
import { formatDate, formatNumber } from "@/lib/format";

import { Panel } from "./panel";
import { APPLICATION_STATUS_TONES } from "./tones";
import type { UserApplicationRow } from "./types";

export async function ActivityCard({
  userId,
  applications,
  applicationCount,
  savedFacultyCount,
}: {
  userId: string;
  /** One screenful; the header links out to the filtered board for the rest. */
  applications: UserApplicationRow[];
  applicationCount: number;
  savedFacultyCount: number;
}) {
  const t = await getTranslations("Admin.users.activity");
  const tStatus = await getTranslations("Applications.status");
  const locale = await getLocale();

  const arabic = locale === "ar";

  return (
    <Panel
      title={t("title")}
      action={
        applicationCount > 0 ? (
          <Link
            href={`/admin/applications?userId=${userId}`}
            className="inline-flex items-center gap-1.5 rounded text-[13px] font-semibold text-[#1E6DEB] transition-colors hover:text-[#1557C0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
          >
            {t("viewAll")}
            <ArrowRight className="size-3.5 rtl:rotate-180" aria-hidden />
          </Link>
        ) : null
      }
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-lg border border-slate-200/80 p-3.5">
          <span
            aria-hidden
            className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#EAF2FE] text-[#1E6DEB]"
          >
            <FileText className="size-[18px]" />
          </span>
          <div className="min-w-0">
            <p className="text-[12.5px] text-[#64748B]">{t("applications")}</p>
            <p className="text-[18px] font-semibold tabular-nums text-[#0F172A]">
              {formatNumber(locale, applicationCount)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg border border-slate-200/80 p-3.5">
          <span
            aria-hidden
            className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#EAF2FE] text-[#1E6DEB]"
          >
            <Bookmark className="size-[18px]" />
          </span>
          <div className="min-w-0">
            <p className="text-[12.5px] text-[#64748B]">{t("savedFaculties")}</p>
            <p className="text-[18px] font-semibold tabular-nums text-[#0F172A]">
              {formatNumber(locale, savedFacultyCount)}
            </p>
          </div>
        </div>
      </div>

      {applications.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={t("empty.title")}
          description={t("empty.description")}
        />
      ) : (
        <ul role="list" className="mt-4 divide-y divide-slate-100 border-t border-slate-100">
          {applications.map((application) => (
            <li key={application.id}>
              <Link
                href={`/admin/applications/${application.id}`}
                className="flex items-center gap-4 py-3 transition-colors hover:bg-[#F8FAFC] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#1E6DEB]"
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13.5px] font-semibold text-[#0F172A]">
                    {arabic
                      ? (application.programNameAr ?? application.programName)
                      : application.programName}
                  </span>
                  <span className="block truncate text-[12.5px] text-[#64748B]">
                    {arabic
                      ? (application.universityNameAr ?? application.universityName)
                      : application.universityName}
                  </span>
                </span>

                <span className="flex shrink-0 flex-col items-end gap-1.5">
                  <Badge tone={APPLICATION_STATUS_TONES[application.status]}>
                    {tStatus(application.status)}
                  </Badge>
                  <span className="whitespace-nowrap text-[12px] text-[#94A3B8]">
                    {application.submittedAt
                      ? t("submittedOn", {
                          date: formatDate(locale, application.submittedAt),
                        })
                      : t("createdOn", {
                          date: formatDate(locale, application.createdAt),
                        })}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
