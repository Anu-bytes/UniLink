import { Users } from "lucide-react";
import type { UserRole } from "@prisma/client";
import { getTranslations } from "next-intl/server";

import { Badge, EmptyState } from "@/components/admin";
import { OverviewCard } from "@/components/admin/overview/overview-card";
import { RelativeDate } from "@/components/admin/overview/relative-date";
import { USER_ROLE_TONES } from "@/components/admin/overview/tones";
import { initialsAvatar } from "@/lib/format";

export type RecentUserRow = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: UserRole;
  createdAt: Date;
};

export async function RecentUsers({ rows }: { rows: RecentUserRow[] }) {
  const t = await getTranslations("Admin.overview");
  const tRole = await getTranslations("Admin.enums.userRoles");

  return (
    <OverviewCard title={t("recentUsers.title")} href="/admin/users">
      {rows.length === 0 ? (
        <EmptyState
          icon={Users}
          title={t("recentUsers.emptyTitle")}
          description={t("recentUsers.emptyDescription")}
        />
      ) : (
        <ul role="list" className="divide-y divide-slate-100">
          {rows.map((row) => {
            const avatar = initialsAvatar(row.name ?? row.email);

            return (
              <li key={row.id} className="flex items-center gap-3 px-5 py-3.5">
                {row.image ? (
                  // Avatars come from arbitrary OAuth hosts.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={row.image}
                    alt=""
                    className="size-9 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <span
                    aria-hidden
                    style={{ background: avatar.background, color: avatar.color }}
                    className="flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                  >
                    {avatar.initials}
                  </span>
                )}

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-medium text-[#0F172A]">
                    {row.name ?? row.email}
                  </p>
                  <p className="truncate text-[12.5px] text-[#64748B]">
                    {/* An address stays Latin on the Arabic side, so it carries
                        its own direction. The wrapper keeps the paragraph in the
                        page direction, so the address still hugs the same edge
                        as the name above it. */}
                    <span dir="ltr">{row.email}</span>
                  </p>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <Badge tone={USER_ROLE_TONES[row.role]}>{tRole(row.role)}</Badge>
                  <RelativeDate value={row.createdAt} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </OverviewCard>
  );
}
