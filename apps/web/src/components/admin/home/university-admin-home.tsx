import { CheckCircle2, Clock3, Eye, Heart, PenLine, Send, Star } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { Badge, EmptyState, PageHeader } from "@/components/admin";
import { QuickActions } from "@/components/admin/home/quick-actions";
import { RelativeDate } from "@/components/admin/overview/relative-date";
import { UniversityLogo } from "@/components/university-logo";
import { Link } from "@/i18n/navigation";
import type { AdminActor } from "@/lib/admin";
import { sinceDays } from "@/lib/admin-stats";
import { formatNumber } from "@/lib/format";
import { prisma } from "@/lib/prisma";

const STATUS_TONE = { PENDING: "amber", APPROVED: "green", REJECTED: "red", WITHDRAWN: "neutral" } as const;

/** Level 1: the universities they look after, and where their edits stand. */
export async function UniversityAdminHome({ actor }: { actor: AdminActor }) {
  const t = await getTranslations("Admin.home");
  const tChanges = await getTranslations("Admin.changes");
  const locale = await getLocale();

  const since = sinceDays(30)!;
  const ids = actor.universityIds;

  const [universities, views, saves, ratings, pending, recent] = await Promise.all([
    prisma.university.findMany({
      where: { id: { in: ids } },
      orderBy: { name: "asc" },
      select: {
        id: true,
        slug: true,
        name: true,
        nameAr: true,
        logoUrl: true,
        coverImageUrl: true,
        _count: { select: { faculties: true, programs: true, images: true } },
      },
    }),
    prisma.universityViewDaily.groupBy({ by: ["universityId"], where: { universityId: { in: ids }, day: { gte: since } }, _sum: { views: true } }),
    prisma.savedUniversity.groupBy({ by: ["universityId"], where: { universityId: { in: ids } }, _count: { _all: true } }),
    prisma.universityRating.groupBy({ by: ["universityId"], where: { universityId: { in: ids } }, _avg: { stars: true }, _count: { _all: true } }),
    prisma.changeRequest.groupBy({ by: ["universityId"], where: { universityId: { in: ids }, authorId: actor.id, status: "PENDING" }, _count: { _all: true } }),
    prisma.changeRequest.findMany({
      where: { authorId: actor.id },
      orderBy: { createdAt: "desc" },
      take: 8,
      select: { id: true, action: true, entityLabel: true, status: true, createdAt: true, reviewNote: true },
    }),
  ]);

  const viewsOf = new Map(views.map((row) => [row.universityId, row._sum.views ?? 0]));
  const savesOf = new Map(saves.map((row) => [row.universityId, row._count._all]));
  const ratingOf = new Map(ratings.map((row) => [row.universityId, { avg: row._avg.stars ?? 0, count: row._count._all }]));
  const pendingOf = new Map(pending.map((row) => [row.universityId, row._count._all]));

  const steps = [
    { icon: PenLine, title: t("steps.edit"), body: t("steps.editBody") },
    { icon: Send, title: t("steps.review"), body: t("steps.reviewBody") },
    { icon: CheckCircle2, title: t("steps.live"), body: t("steps.liveBody") },
  ];

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 py-6 md:px-6 md:py-8">
      <PageHeader title={t("welcome", { name: actor.name?.split(" ")[0] ?? "" })} description={t("universityAdminSubtitle")} />

      <ol className="mt-6 grid gap-3 sm:grid-cols-3">
        {steps.map((step, index) => (
          <li key={step.title} className="flex items-start gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#EEF3FF] text-[#1E6DEB]">
              <step.icon className="size-4" aria-hidden />
            </span>
            <div>
              <p className="text-[13.5px] font-semibold text-[#0F172A]">
                {formatNumber(locale, index + 1)}. {step.title}
              </p>
              <p className="mt-0.5 text-[12.5px] leading-snug text-[#64748B]">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-8">
        <QuickActions level={1} />
      </div>

      <h2 className="mt-8 text-[15px] font-semibold text-[#0F172A]">{t("yourUniversities")}</h2>
      {universities.length === 0 ? (
        <div className="mt-3">
          <EmptyState title={t("noAssignments")} description={t("noAssignmentsBody")} />
        </div>
      ) : (
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          {universities.map((university) => {
            const name = locale === "ar" ? (university.nameAr ?? university.name) : university.name;
            const rating = ratingOf.get(university.id);
            const waiting = pendingOf.get(university.id) ?? 0;
            return (
              <article key={university.id} className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
                <div className="relative h-28 bg-gradient-to-br from-[#1E3A8A] via-[#1E6DEB] to-[#3B86F7]">
                  {university.coverImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={university.coverImageUrl} alt="" className="absolute inset-0 size-full object-cover" />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/0" />
                  <div className="absolute inset-x-4 bottom-3 flex items-center gap-3">
                    <UniversityLogo name={university.name} logoUrl={university.logoUrl} className="size-11 ring-2 ring-white" />
                    <p className="truncate text-[15px] font-semibold text-white">{name}</p>
                  </div>
                  {waiting ? (
                    <span className="absolute end-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[11.5px] font-semibold text-[#B77714]">
                      <Clock3 className="size-3" aria-hidden />
                      {t("waiting", { count: waiting })}
                    </span>
                  ) : null}
                </div>
                <dl className="grid grid-cols-4 divide-x divide-slate-100 border-b border-slate-100 py-3 text-center rtl:divide-x-reverse">
                  {[
                    { label: t("facts.programs"), value: formatNumber(locale, university._count.programs) },
                    { label: t("facts.views"), value: formatNumber(locale, viewsOf.get(university.id) ?? 0), icon: Eye },
                    { label: t("facts.saves"), value: formatNumber(locale, savesOf.get(university.id) ?? 0), icon: Heart },
                    { label: t("facts.rating"), value: rating ? `${formatNumber(locale, Math.round(rating.avg * 10) / 10)}` : "–", icon: Star },
                  ].map((fact) => (
                    <div key={fact.label} className="px-2">
                      <dd className="text-[15px] font-semibold text-[#0F172A]">{fact.value}</dd>
                      <dt className="text-[11.5px] text-[#64748B]">{fact.label}</dt>
                    </div>
                  ))}
                </dl>
                <div className="flex flex-wrap gap-2 p-3">
                  <Link
                    href={`/admin/universities/${university.id}`}
                    className="inline-flex min-h-9 flex-1 items-center justify-center rounded-lg bg-[#1E6DEB] px-3 text-[13px] font-semibold text-white hover:bg-[#1859c4]"
                  >
                    {t("editInConsole")}
                  </Link>
                  <Link
                    href={`/universities/${university.slug}?edit=1`}
                    className="inline-flex min-h-9 flex-1 items-center justify-center rounded-lg border border-slate-200 px-3 text-[13px] font-semibold text-[#0F172A] hover:bg-slate-50"
                  >
                    {t("editOnPage")}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <section className="mt-8 rounded-xl border border-[#E2E8F0] bg-white">
        <header className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-3.5">
          <h2 className="text-[15px] font-semibold text-[#0F172A]">{t("recentChanges")}</h2>
          <Link href="/admin/approvals?status=all" className="text-[13px] font-semibold text-[#1E6DEB] hover:underline">
            {t("seeAll")}
          </Link>
        </header>
        {recent.length ? (
          <ul className="divide-y divide-slate-100">
            {recent.map((change) => (
              <li key={change.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 px-5 py-3 text-[13px]">
                <Badge tone={STATUS_TONE[change.status]} dot>
                  {tChanges(`status.${change.status}`)}
                </Badge>
                <span className="min-w-0 flex-1 truncate text-[#0F172A]">
                  <span className="font-semibold">{tChanges(`actions.${change.action}`)}</span> · {change.entityLabel}
                  {change.status === "REJECTED" && change.reviewNote ? (
                    <span className="block truncate text-[12px] text-[#C81F15]">{change.reviewNote}</span>
                  ) : null}
                </span>
                <RelativeDate value={change.createdAt} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-5 py-8 text-center text-[13px] text-[#64748B]">{t("noChangesYet")}</p>
        )}
      </section>
    </div>
  );
}
