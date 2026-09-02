"use client";

import { GraduationCap, Plus } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Badge, EmptyState } from "@/components/admin";
import { Link } from "@/i18n/navigation";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

import { CARD, SECONDARY_BUTTON } from "./styles";
import type { FacultyProgramRow } from "./types";

/**
 * Read-only on purpose: everything about a program is edited on the program's
 * own page, and duplicating any of it here would give an admin two places to
 * change the same field. The panel exists because someone editing a faculty
 * almost always wants to see what is filed under it.
 */
export function FacultyProgramsPanel({
  facultyId,
  universityId,
  rows,
  total,
}: {
  facultyId: string;
  universityId: string;
  rows: FacultyProgramRow[];
  /** May exceed `rows.length`; the page loads only the first screenful. */
  total: number;
}) {
  const t = useTranslations("Admin");
  const tCatalog = useTranslations("Catalog");
  const locale = useLocale();

  // Both ids travel: the program editor files a row under a university and a
  // faculty, and the faculty alone does not tell it which university to use
  // before the record exists.
  const newHref = `/admin/programs/new?universityId=${universityId}&facultyId=${facultyId}`;

  return (
    <section className={cn(CARD, "overflow-hidden")}>
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] px-5 py-4">
        <div className="min-w-0">
          <h2 className="text-[15px] font-semibold text-[#0F172A]">
            {t("faculties.programs.title")}
          </h2>
          <p className="mt-0.5 text-[13px] text-[#64748B]">
            {t("faculties.programs.count", { count: formatNumber(locale, total) })}
          </p>
        </div>

        {rows.length > 0 ? (
          <Link href={newHref} className={cn(SECONDARY_BUTTON, "h-9")}>
            <Plus className="size-4" aria-hidden />
            {t("faculties.programs.new")}
          </Link>
        ) : null}
      </header>

      {rows.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title={t("faculties.programs.empty.title")}
          description={t("faculties.programs.empty.description")}
          action={
            <Link href={newHref} className={SECONDARY_BUTTON}>
              <Plus className="size-4" aria-hidden />
              {t("faculties.programs.new")}
            </Link>
          }
        />
      ) : (
        <ul className="divide-y divide-slate-100">
          {rows.map((row) => (
            <li key={row.id} className="flex items-center gap-3 px-5 py-3">
              <div className="min-w-0 flex-1">
                <Link
                  href={`/admin/programs/${row.id}`}
                  className="block truncate text-[13.5px] font-semibold text-[#0F172A] transition-colors hover:text-[#1E6DEB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
                >
                  {row.name}
                </Link>
                {row.nameAr ? (
                  <span className="block truncate text-[12.5px] text-[#64748B]" dir="rtl">
                    {row.nameAr}
                  </span>
                ) : null}
              </div>

              <Badge tone="blue">{tCatalog(`levels.${row.studyLevel}`)}</Badge>

              {row.isPublished ? (
                <Badge tone="green" dot>
                  {t("common.published")}
                </Badge>
              ) : (
                <Badge tone="neutral" dot>
                  {t("common.draft")}
                </Badge>
              )}
            </li>
          ))}
        </ul>
      )}

      {total > rows.length ? (
        <footer className="border-t border-slate-100 px-5 py-3">
          <Link
            href={`/admin/programs?facultyId=${facultyId}`}
            className="text-[13px] font-semibold text-[#1E6DEB] transition-colors hover:text-[#1557C0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
          >
            {t("faculties.programs.viewAll", {
              count: formatNumber(locale, total),
            })}
          </Link>
        </footer>
      ) : null}
    </section>
  );
}
