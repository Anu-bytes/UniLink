"use client";

import { ChevronDown, ChevronUp, Pencil, Plus, Quote, UserRound } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import {
  Badge,
  DataTable,
  EmptyState,
  useToast,
  type Column,
} from "@/components/admin";
import { Link, useRouter } from "@/i18n/navigation";
import { formatNumber } from "@/lib/format";

import { DeleteAction } from "./delete-action";
import { adminWrite } from "./request";
import { ICON_BUTTON, PRIMARY_BUTTON } from "./styles";
import type { TestimonialRow } from "./types";

/**
 * The positions this page should hold after a move, made strictly increasing.
 *
 * sortOrder defaults to 0 for every row, so the obvious "swap the two values"
 * moves nothing at all on a freshly seeded strip. Reusing the page's own
 * numbers — spread apart only where they collide — keeps the rows on either
 * side of the page where they are, which a renumber from zero would not.
 */
function positionsFor(rows: TestimonialRow[]): number[] {
  let previous = -1;
  return rows
    .map((row) => row.sortOrder)
    .sort((a, b) => a - b)
    .map((value) => {
      previous = Math.max(value, previous + 1);
      return previous;
    });
}

export function TestimonialTable({
  rows,
  filtered,
  reorderable,
}: {
  rows: TestimonialRow[];
  /** A search or the status filter is active, so "nothing here" reads differently. */
  filtered: boolean;
  /**
   * Up and down move a row past the one drawn above or below it, which is only
   * true while the list is in its default order and unfiltered.
   */
  reorderable: boolean;
}) {
  const t = useTranslations("Admin");
  const locale = useLocale();
  const router = useRouter();
  const { toast } = useToast();

  const [pending, setPending] = useState(false);

  async function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (pending || target < 0 || target >= rows.length) return;

    const reordered = [...rows];
    const moved = reordered[index];
    reordered[index] = reordered[target];
    reordered[target] = moved;

    const positions = positionsFor(rows);
    const writes = reordered
      .map((row, position) => ({ id: row.id, sortOrder: positions[position] }))
      .filter((write, position) => write.sortOrder !== reordered[position].sortOrder);

    setPending(true);
    for (const write of writes) {
      const result = await adminWrite(
        `/api/admin/testimonials/${write.id}`,
        "PATCH",
        { sortOrder: write.sortOrder },
      );
      if (!result.ok) {
        setPending(false);
        toast({
          title: t("common.saveFailed"),
          description: result.message ?? undefined,
          tone: "error",
        });
        // The refresh redraws whatever did land, so the admin is never left
        // looking at an order the database does not hold.
        router.refresh();
        return;
      }
    }
    setPending(false);

    toast({ title: t("testimonials.toasts.reordered") });
    router.refresh();
  }

  const columns: Column<TestimonialRow>[] = [
    {
      key: "student",
      header: t("testimonials.columns.student"),
      cell: (row) => (
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#EAF2FE] text-[#1E6DEB]"
          >
            {row.avatarUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element -- portraits
                 come from Supabase Storage or a URL the editor pasted, so
                 next/image's loader cannot be relied on. */
              <img src={row.avatarUrl} alt="" className="size-full object-cover" />
            ) : (
              <UserRound className="size-4" />
            )}
          </span>

          <Link
            href={`/admin/testimonials/${row.id}`}
            dir="auto"
            className="block max-w-[12rem] truncate font-semibold text-[#0F172A] transition-colors hover:text-[#1E6DEB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
          >
            {row.studentName}
          </Link>
        </div>
      ),
    },
    {
      key: "quote",
      header: t("testimonials.columns.quote"),
      cell: (row) => (
        <span dir="auto" className="block max-w-[28rem] truncate text-[#64748B]">
          {row.quote}
        </span>
      ),
    },
    {
      key: "location",
      header: t("testimonials.columns.location"),
      cell: (row) =>
        row.location ? (
          <span dir="auto" className="block max-w-[10rem] truncate">
            {row.location}
          </span>
        ) : (
          <span className="text-slate-400">{t("common.notSet")}</span>
        ),
    },
    {
      key: "sortOrder",
      header: t("testimonials.columns.sortOrder"),
      align: "end",
      cell: (row) => {
        const index = rows.indexOf(row);
        return (
          <div className="flex items-center justify-end gap-1.5">
            <span className="tabular-nums text-[#64748B]">
              {formatNumber(locale, row.sortOrder)}
            </span>
            {reorderable ? (
              <>
                <button
                  type="button"
                  onClick={() => void move(index, -1)}
                  disabled={pending || index === 0}
                  aria-label={t("testimonials.reorder.up")}
                  title={t("testimonials.reorder.up")}
                  className={ICON_BUTTON}
                >
                  <ChevronUp className="size-4" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => void move(index, 1)}
                  disabled={pending || index === rows.length - 1}
                  aria-label={t("testimonials.reorder.down")}
                  title={t("testimonials.reorder.down")}
                  className={ICON_BUTTON}
                >
                  <ChevronDown className="size-4" aria-hidden />
                </button>
              </>
            ) : null}
          </div>
        );
      },
    },
    {
      key: "status",
      header: t("testimonials.columns.status"),
      cell: (row) => (
        <Badge tone={row.isPublished ? "green" : "neutral"} dot>
          {row.isPublished ? t("common.published") : t("common.draft")}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: <span className="sr-only">{t("common.actions")}</span>,
      align: "end",
      sticky: "end",
      cell: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <Link
            href={`/admin/testimonials/${row.id}`}
            aria-label={t("common.edit")}
            title={t("common.edit")}
            className={ICON_BUTTON}
          >
            <Pencil className="size-4" aria-hidden />
          </Link>

          <DeleteAction
            section="testimonials"
            id={row.id}
            name={row.studentName}
            variant="icon"
            after="refresh"
          />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={rows}
      getRowKey={(row) => row.id}
      empty={
        filtered ? (
          <EmptyState
            icon={Quote}
            title={t("testimonials.noResults.title")}
            description={t("testimonials.noResults.description")}
          />
        ) : (
          <EmptyState
            icon={Quote}
            title={t("testimonials.empty.title")}
            description={t("testimonials.empty.description")}
            action={
              <Link href="/admin/testimonials/new" className={PRIMARY_BUTTON}>
                <Plus className="size-4" aria-hidden />
                {t("testimonials.new")}
              </Link>
            }
          />
        )
      }
    />
  );
}
