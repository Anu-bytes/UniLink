import { ArrowRight, ClipboardCheck } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { RelativeDate } from "@/components/admin/overview/relative-date";
import { Link } from "@/i18n/navigation";
import { formatNumber } from "@/lib/format";
import { prisma } from "@/lib/prisma";

/** The review queue at a glance: how many wait, and the newest few. */
export async function ApprovalsSnapshot() {
  const t = await getTranslations("Admin.home");
  const tChanges = await getTranslations("Admin.changes");
  const locale = await getLocale();

  const [count, latest] = await Promise.all([
    prisma.changeRequest.count({ where: { status: "PENDING" } }),
    prisma.changeRequest.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "desc" },
      take: 4,
      select: {
        id: true,
        action: true,
        entityLabel: true,
        createdAt: true,
        university: { select: { name: true, nameAr: true } },
        author: { select: { name: true, email: true } },
      },
    }),
  ]);

  return (
    <section className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className={`flex size-10 items-center justify-center rounded-xl ${count ? "bg-[#FFF6E5] text-[#B77714]" : "bg-[#E7F6EE] text-[#0F7B45]"}`}>
            <ClipboardCheck className="size-5" aria-hidden />
          </span>
          <div>
            <h2 className="text-[15px] font-semibold text-[#0F172A]">{t("queueTitle")}</h2>
            <p className="text-[12.5px] text-[#64748B]">
              {count ? t("queueCount", { count: formatNumber(locale, count) }) : t("queueEmpty")}
            </p>
          </div>
        </div>
        {count ? (
          <Link
            href="/admin/approvals"
            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-[#0B1220] px-3.5 text-[13px] font-semibold text-white hover:bg-[#1F2937]"
          >
            {t("reviewNow")}
            <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
          </Link>
        ) : null}
      </header>
      {latest.length ? (
        <ul className="divide-y divide-slate-100">
          {latest.map((change) => (
            <li key={change.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 px-5 py-3 text-[13px]">
              <span className="rounded-md bg-[#EEF3FF] px-1.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wide text-[#1E6DEB]">
                {tChanges(`actions.${change.action}`)}
              </span>
              <span className="min-w-0 flex-1 truncate font-medium text-[#0F172A]">{change.entityLabel}</span>
              <span className="text-[#64748B]">
                {locale === "ar" ? (change.university.nameAr ?? change.university.name) : change.university.name}
                {" · "}
                {change.author?.name ?? change.author?.email}
              </span>
              <RelativeDate value={change.createdAt} />
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
