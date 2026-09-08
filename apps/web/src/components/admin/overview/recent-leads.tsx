import { Inbox } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { EmptyState } from "@/components/admin";
import { OverviewCard } from "@/components/admin/overview/overview-card";
import { RelativeDate } from "@/components/admin/overview/relative-date";

export type RecentLeadRow = {
  id: string;
  universityName: string;
  city: string;
  contactEmail: string;
  createdAt: Date;
};

export async function RecentLeads({ rows }: { rows: RecentLeadRow[] }) {
  const t = await getTranslations("Admin.overview");

  return (
    <OverviewCard title={t("recentLeads.title")} href="/admin/leads">
      {rows.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title={t("recentLeads.emptyTitle")}
          description={t("recentLeads.emptyDescription")}
        />
      ) : (
        <ul role="list" className="divide-y divide-slate-100">
          {rows.map((row) => (
            <li
              key={row.id}
              className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3.5 sm:flex-nowrap"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13.5px] font-medium text-[#0F172A]">
                  {row.universityName}
                </p>
                <p className="mt-0.5 truncate text-[12.5px] text-[#64748B]">
                  {row.city}
                </p>
              </div>
              <p className="min-w-0 flex-1 truncate text-[13px] text-[#334155]">
                {/* See RecentUsers: the address carries its own direction, the
                    paragraph keeps the page's. */}
                <span dir="ltr">{row.contactEmail}</span>
              </p>
              <RelativeDate value={row.createdAt} />
            </li>
          ))}
        </ul>
      )}
    </OverviewCard>
  );
}
