import { FileText } from "lucide-react";
import type { ApplicationStatus } from "@prisma/client";
import { getLocale, getTranslations } from "next-intl/server";

import { Badge, EmptyState } from "@/components/admin";
import { OverviewCard } from "@/components/admin/overview/overview-card";
import { RelativeDate } from "@/components/admin/overview/relative-date";
import { APPLICATION_STATUS_TONES } from "@/components/admin/overview/tones";
import { localized } from "@/lib/catalog";

export type RecentApplicationRow = {
  id: string;
  status: ApplicationStatus;
  createdAt: Date;
  user: { name: string | null; email: string };
  program: {
    name: string;
    nameAr: string | null;
    university: { name: string; nameAr: string | null };
  };
};

export async function RecentApplications({
  rows,
}: {
  rows: RecentApplicationRow[];
}) {
  const t = await getTranslations("Admin.overview");
  const tStatus = await getTranslations("Applications.status");
  const locale = await getLocale();

  return (
    <OverviewCard title={t("recentApplications.title")} href="/admin/applications">
      {rows.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={t("recentApplications.emptyTitle")}
          description={t("recentApplications.emptyDescription")}
        />
      ) : (
        <ul role="list" className="divide-y divide-slate-100">
          {rows.map((row) => (
            <li key={row.id} className="flex items-center gap-3 px-5 py-3.5">
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13.5px] font-medium text-[#0F172A]">
                  {/* An account can exist before it has a name; the address is
                      the only other thing that identifies the applicant. */}
                  {row.user.name ?? row.user.email}
                </p>
                <p className="mt-0.5 truncate text-[12.5px] text-[#64748B]">
                  {localized(locale, row.program.name, row.program.nameAr)}
                  {" · "}
                  {localized(
                    locale,
                    row.program.university.name,
                    row.program.university.nameAr,
                  )}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1.5">
                <Badge tone={APPLICATION_STATUS_TONES[row.status]}>
                  {tStatus(row.status)}
                </Badge>
                <RelativeDate value={row.createdAt} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </OverviewCard>
  );
}
