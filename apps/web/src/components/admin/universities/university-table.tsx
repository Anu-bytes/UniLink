"use client";

import { Building2, Eye, EyeOff, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import {
  Badge,
  ConfirmDialog,
  DataTable,
  EmptyState,
  useToast,
  type BadgeTone,
  type Column,
} from "@/components/admin";
import { Link, useRouter } from "@/i18n/navigation";
import { formatNumber, initialsAvatar } from "@/lib/format";
import type { UniversityType } from "@prisma/client";

import { adminWrite } from "./request";
import { DANGER_BUTTON, ICON_BUTTON, PRIMARY_BUTTON } from "./styles";
import type { DeleteCounts, UniversityRow } from "./types";

const TYPE_TONES: Record<UniversityType, BadgeTone> = {
  PUBLIC: "blue",
  PRIVATE: "neutral",
  SPECIALIZED: "amber",
};

/** Rendered in the delete dialog in the order an admin reads them. */
const COUNT_KEYS = [
  "faculties",
  "programs",
  "images",
  "features",
  "contentBlocks",
  "minimumScores",
] as const satisfies readonly (keyof DeleteCounts)[];

export function UniversityTable({
  rows,
  filtered,
}: {
  rows: UniversityRow[];
  /** A search or filter is active, so "nothing here" is a different message. */
  filtered: boolean;
}) {
  const t = useTranslations("Admin");
  const tCatalog = useTranslations("Catalog");
  const locale = useLocale();
  const router = useRouter();
  const { toast } = useToast();

  const [pendingId, setPendingId] = useState<string | null>(null);
  const [target, setTarget] = useState<{
    row: UniversityRow;
    counts: DeleteCounts | null;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);

  function failed(message: string | null, fallbackKey: string) {
    toast({
      title: t(fallbackKey),
      description: message ?? undefined,
      tone: "error",
    });
  }

  async function togglePublished(row: UniversityRow) {
    setPendingId(row.id);
    const result = await adminWrite(
      `/api/admin/universities/${row.id}`,
      "PATCH",
      { published: row.publishedAt === null },
    );
    setPendingId(null);

    if (!result.ok) {
      failed(result.message, "common.saveFailed");
      return;
    }

    toast({
      title: t(
        row.publishedAt === null
          ? "universities.toasts.published"
          : "universities.toasts.unpublished",
      ),
    });
    router.refresh();
  }

  // Step one of the two-step delete: the request goes out without ?confirm so
  // the API answers 409 with what the cascade would take, and those counts are
  // what the dialog asks about.
  async function requestDelete(row: UniversityRow) {
    setPendingId(row.id);
    const result = await adminWrite(
      `/api/admin/universities/${row.id}`,
      "DELETE",
    );
    setPendingId(null);

    if (result.ok) {
      toast({ title: t("universities.toasts.deleted") });
      router.refresh();
      return;
    }

    if (result.status === 409) {
      const body = result.body as { counts?: DeleteCounts } | null;
      setTarget({ row, counts: body?.counts ?? null });
      return;
    }

    failed(result.message, "common.deleteFailed");
  }

  async function confirmDelete() {
    if (!target) return;
    setDeleting(true);
    const result = await adminWrite(
      `/api/admin/universities/${target.row.id}?confirm=true`,
      "DELETE",
    );
    setDeleting(false);

    if (!result.ok) {
      failed(result.message, "common.deleteFailed");
      return;
    }

    setTarget(null);
    toast({ title: t("universities.toasts.deleted") });
    router.refresh();
  }

  const columns: Column<UniversityRow>[] = [
    {
      key: "name",
      header: t("universities.columns.name"),
      // Capped, because the longest Egyptian institution names run past 50
      // characters and an uncapped cell widens the table until the columns
      // that matter fall off the screen.
      className: "max-w-[360px]",
      cell: (row) => {
        const avatar = initialsAvatar(row.name, "organization");
        return (
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              style={
                row.logoUrl
                  ? undefined
                  : { backgroundColor: avatar.background, color: avatar.color }
              }
              className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200/80 bg-white text-[13px] font-semibold"
            >
              {row.logoUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element -- logos
                   come from Supabase Storage or the university's own domain,
                   so next/image's loader cannot be relied on. */
                <img src={row.logoUrl} alt="" className="size-full object-contain" />
              ) : (
                avatar.initials
              )}
            </span>

            <span className="min-w-0">
              <Link
                href={`/admin/universities/${row.id}`}
                className="block truncate font-semibold text-[#0F172A] transition-colors hover:text-[#1E6DEB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
              >
                {row.name}
              </Link>
              {row.nameAr ? (
                <span className="block truncate text-[12.5px] text-[#64748B]" dir="rtl">
                  {row.nameAr}
                </span>
              ) : null}
              <span className="block truncate text-[12px] text-slate-400" dir="ltr">
                /{row.slug}
              </span>
            </span>
          </div>
        );
      },
    },
    {
      key: "type",
      header: t("universities.columns.type"),
      cell: (row) => (
        <Badge tone={TYPE_TONES[row.type]}>
          {tCatalog(`universityTypes.${row.type}`)}
        </Badge>
      ),
    },
    {
      key: "location",
      header: t("universities.columns.location"),
      cell: (row) => {
        const city = locale === "ar" ? (row.cityAr ?? row.city) : row.city;
        const country =
          locale === "ar" ? (row.countryAr ?? row.country) : row.country;
        return (
          <span className="whitespace-nowrap">
            {city}
            <span className="text-[#64748B]">{` · ${country}`}</span>
          </span>
        );
      },
    },
    {
      key: "faculties",
      header: t("universities.columns.faculties"),
      align: "end",
      className: "tabular-nums",
      cell: (row) => formatNumber(locale, row.facultyCount),
    },
    {
      key: "programs",
      header: t("universities.columns.programs"),
      align: "end",
      className: "tabular-nums",
      cell: (row) => formatNumber(locale, row.programCount),
    },
    {
      key: "status",
      header: t("universities.columns.status"),
      cell: (row) =>
        row.publishedAt ? (
          <Badge tone="green" dot>
            {t("common.published")}
          </Badge>
        ) : (
          <Badge tone="neutral" dot>
            {t("common.draft")}
          </Badge>
        ),
    },
    {
      key: "actions",
      header: <span className="sr-only">{t("common.actions")}</span>,
      align: "end",
      sticky: "end",
      cell: (row) => {
        const busy = pendingId === row.id;
        return (
          <div className="flex items-center justify-end gap-1.5">
            <Link
              href={`/admin/universities/${row.id}`}
              aria-label={t("common.edit")}
              title={t("common.edit")}
              className={ICON_BUTTON}
            >
              <Pencil className="size-4" aria-hidden />
            </Link>

            <button
              type="button"
              onClick={() => void togglePublished(row)}
              disabled={busy}
              aria-label={t(row.publishedAt ? "common.unpublish" : "common.publish")}
              title={t(row.publishedAt ? "common.unpublish" : "common.publish")}
              className={ICON_BUTTON}
            >
              {busy ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : row.publishedAt ? (
                <EyeOff className="size-4" aria-hidden />
              ) : (
                <Eye className="size-4" aria-hidden />
              )}
            </button>

            <button
              type="button"
              onClick={() => void requestDelete(row)}
              disabled={busy}
              aria-label={t("common.delete")}
              title={t("common.delete")}
              className={`${DANGER_BUTTON} size-9 justify-center px-0`}
            >
              <Trash2 className="size-4" aria-hidden />
            </button>
          </div>
        );
      },
    },
  ];

  // Pulled out of the JSX so the narrowing survives into the map callback;
  // the kit's dialog takes a node, not a render prop.
  const deleteCounts = target?.counts ?? null;

  return (
    <>
      <DataTable
        columns={columns}
        rows={rows}
        getRowKey={(row) => row.id}
        empty={
          filtered ? (
            <EmptyState
              icon={Building2}
              title={t("universities.noResults.title")}
              description={t("universities.noResults.description")}
            />
          ) : (
            <EmptyState
              icon={Building2}
              title={t("universities.empty.title")}
              description={t("universities.empty.description")}
              action={
                <Link href="/admin/universities/new" className={PRIMARY_BUTTON}>
                  <Plus className="size-4" aria-hidden />
                  {t("universities.new")}
                </Link>
              }
            />
          )
        }
      />

      <ConfirmDialog
        open={target !== null}
        onOpenChange={(open) => {
          if (!open) setTarget(null);
        }}
        destructive
        pending={deleting}
        title={t("universities.delete.title")}
        confirmLabel={t("universities.delete.confirm")}
        onConfirm={() => void confirmDelete()}
        description={
          target ? (
            <>
              <p>{t("universities.delete.description", { name: target.row.name })}</p>
              {deleteCounts ? (
                <ul className="mt-3 space-y-1">
                  {COUNT_KEYS.filter((key) => deleteCounts[key] > 0).map((key) => (
                    <li key={key} className="flex items-center justify-between gap-4">
                      <span>{t(`universities.delete.counts.${key}`)}</span>
                      <span className="font-semibold tabular-nums text-[#0F172A]">
                        {formatNumber(locale, deleteCounts[key])}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </>
          ) : null
        }
      />
    </>
  );
}
