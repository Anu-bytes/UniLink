import { ArrowRight, Handshake, Presentation, ShieldCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { RelativeDate } from "@/components/admin/overview/relative-date";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";

/** Super admin overview: new demo requests and representative applications. */
export async function RequestsSnapshot() {
  const t = await getTranslations("Admin.requests");
  const [count, latest] = await Promise.all([
    prisma.partnerRequest.count({ where: { status: "NEW" } }),
    prisma.partnerRequest.findMany({
      where: { status: "NEW" },
      orderBy: [{ createdAt: "desc" }, { id: "asc" }],
      take: 3,
      select: { id: true, type: true, universityName: true, fullName: true, createdAt: true },
    }),
  ]);

  return (
    <section className="rounded-xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05)]">
      <header className="flex items-center justify-between gap-3 px-5 py-4">
        <span className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-lg bg-[#EEF3FF] text-[#1E6DEB]">
            <Handshake className="size-5" aria-hidden />
          </span>
          <span>
            <span className="block text-[14px] font-semibold text-[#0F172A]">{t("snapshot.title")}</span>
            <span className="block text-[12.5px] text-[#64748B]">
              {count ? t("snapshot.waiting", { count }) : t("snapshot.none")}
            </span>
          </span>
        </span>
        <Link href="/admin/requests" className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#1E6DEB] hover:underline">
          {t("snapshot.open")}
          <ArrowRight className="size-3.5 rtl:rotate-180" aria-hidden />
        </Link>
      </header>
      {latest.length ? (
        <ul className="divide-y divide-slate-100 border-t border-slate-100">
          {latest.map((request) => (
            <li key={request.id}>
              <Link href={`/admin/requests/${request.id}`} className="flex items-center gap-3 px-5 py-3 text-[13px] hover:bg-[#F7F9FE]">
                {request.type === "DEMO" ? (
                  <Presentation className="size-4 shrink-0 text-[#1E6DEB]" aria-hidden />
                ) : (
                  <ShieldCheck className="size-4 shrink-0 text-[#6D4AE0]" aria-hidden />
                )}
                <span className="min-w-0 flex-1 truncate text-[#0F172A]">
                  <span className="font-semibold">{t(`types.${request.type}`)}</span> · <bdi>{request.universityName}</bdi> ·{" "}
                  <bdi className="text-[#64748B]">{request.fullName}</bdi>
                </span>
                <span className="shrink-0 text-[12px] text-[#94A3B8]">
                  <RelativeDate value={request.createdAt} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
