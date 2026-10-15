import { Clock3 } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import type { AdminActor } from "@/lib/admin";
import { formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";

/**
 * The changes to a university (or one of its faculties or programs) that are
 * still waiting for review, shown above its editor. A university admin sees
 * their own; reviewers and super admins see all of them, with a link to
 * review. Renders nothing when the queue is empty.
 */
export async function PendingChangesNotice({
  actor,
  universityId,
  entityId,
}: {
  actor: AdminActor;
  universityId: string;
  /** Only changes to this faculty/program (and its sub-records) when given. */
  entityId?: string;
}) {
  const pending = await prisma.changeRequest.findMany({
    where: {
      universityId,
      status: "PENDING",
      ...(actor.level === 1 ? { authorId: actor.id } : {}),
      ...(entityId ? { OR: [{ entityId }, { path: { contains: entityId } }] } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 6,
    select: { id: true, entityLabel: true, action: true, createdAt: true, author: { select: { name: true, email: true } } },
  });
  if (pending.length === 0) return null;

  const t = await getTranslations("Admin.changes");
  const locale = await getLocale();

  return (
    <section className="rounded-xl border border-[#F3DFB4] bg-[#FFFBF2] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#FFF0D1] text-[#B77714]">
            <Clock3 className="size-4" aria-hidden />
          </span>
          <div>
            <p className="text-[14px] font-semibold text-[#5C4310]">
              {actor.level === 1 ? t("noticeMine", { count: pending.length }) : t("noticeAll", { count: pending.length })}
            </p>
            <p className="mt-0.5 text-[12.5px] text-[#7A6440]">
              {actor.level === 1 ? t("noticeMineBody") : t("noticeAllBody")}
            </p>
          </div>
        </div>
        <Link
          href={`/admin/approvals?university=${universityId}`}
          className="inline-flex min-h-9 items-center rounded-lg border border-[#E8CC8F] bg-white px-3 text-[13px] font-semibold text-[#5C4310] transition-colors hover:bg-[#FFF6E5]"
        >
          {actor.level === 1 ? t("viewMine") : t("review")}
        </Link>
      </div>
      <ul className="mt-3 space-y-1.5 border-t border-[#F3DFB4] pt-3">
        {pending.map((change) => (
          <li key={change.id} className="flex flex-wrap items-center gap-x-2 text-[13px] text-[#5C4310]">
            <span className="rounded-md bg-[#FFF0D1] px-1.5 py-0.5 text-[11px] font-bold uppercase tracking-wide">
              {t(`actions.${change.action}`)}
            </span>
            <span className="font-medium">{change.entityLabel}</span>
            <span className="text-[#A08550]">
              · {actor.level === 1 ? formatDate(locale, change.createdAt) : (change.author?.name ?? change.author?.email ?? "")}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
