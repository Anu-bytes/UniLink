"use client";

import { Building2, Eye, EyeOff, Loader2, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useLocale, useTranslations } from "next-intl";
import { useRef, useState } from "react";

import {
  Badge,
  ConfirmDialog,
  DataTable,
  EmptyState,
  useToast,
  type Column,
} from "@/components/admin";
import { Link, useRouter } from "@/i18n/navigation";
import { formatDate, formatNumber, initialsAvatar } from "@/lib/format";

import { adminWrite } from "./request";
import { CatalogueDetailsToggle, ContentChecklist, useCatalogueExpansion } from "@/components/admin/catalogue-details";
import { ICON_BUTTON, PRIMARY_BUTTON } from "./styles";
import type { DeleteCounts, UniversityRow } from "./types";

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
  const insights = useTranslations("Admin.catalogue");
  const { expanded, toggle } = useCatalogueExpansion();
  const router = useRouter();
  const { toast } = useToast();

  const [pendingId, setPendingId] = useState<string | null>(null);
  const [target, setTarget] = useState<{
    row: UniversityRow;
    counts: DeleteCounts | null;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const actionTriggers = useRef(new Map<string, HTMLButtonElement>());
  const deleteTrigger = useRef<HTMLButtonElement | null>(null);

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
    deleteTrigger.current = actionTriggers.current.get(row.id) ?? null;
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
      className: "w-[34%]",
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

            <div className="min-w-0">
              <Link
                href={`/admin/universities/${row.id}`}
                title={locale === "ar" ? (row.nameAr ?? row.name) : row.name}
                className="block whitespace-normal [overflow-wrap:anywhere] font-semibold leading-5 text-[#0F172A] transition-colors hover:text-[#1E6DEB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
              >
                <bdi>{locale === "ar" ? (row.nameAr ?? row.name) : row.name}</bdi>
              </Link>
              {row.nameAr ? (
                <span className="mt-1 block whitespace-normal leading-5 text-[12px] text-[#64748B] [overflow-wrap:anywhere]">
                  <bdi>{locale === "ar" ? row.name : row.nameAr}</bdi>
                </span>
              ) : null}
              <span className="mt-2 block text-[11.5px] text-[#64748B]">{tCatalog(`universityTypes.${row.type}`)}</span>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {(["featured", "recommended", "trending"] as const).filter((flag) => ({ featured: row.isFeatured, recommended: row.isRecommended, trending: row.isTrending })[flag]).map((flag) => <span key={flag} className="rounded bg-blue-50 px-1.5 py-0.5 text-[10.5px] font-medium text-blue-700">{insights(flag)}</span>)}
              </div>
              <CatalogueDetailsToggle id={row.id} name={locale === "ar" ? row.nameAr ?? row.name : row.name} checks={row.contentChecks} expanded={expanded.has(row.id)} onToggle={() => toggle(row.id)} />
            </div>
          </div>
        );
      },
    },
    {
      key: "location",
      header: t("universities.columns.location"),
      cell: (row) => {
        const city = locale === "ar" ? (row.cityAr ?? row.city) : row.city;
        const country =
          locale === "ar" ? (row.countryAr ?? row.country) : row.country;
        return (
          <span className="block whitespace-normal leading-5 [overflow-wrap:anywhere]">
            <bdi>{city}</bdi>
            <span className="mt-1 block text-[12px] text-[#64748B]"><bdi>{country}</bdi></span>
          </span>
        );
      },
    },
    {
      key: "catalogue",
      header: insights("catalogue"),
      className: "w-[158px]",
      cell: (row) => (
        <div className="space-y-1.5 text-[12px] leading-5">
          <Link href={`/admin/faculties?universityId=${row.id}`} className="block font-medium text-[#334155] hover:text-[#1E6DEB] focus-visible:outline-2">{insights("faculties", { count: row.facultyCount })}</Link>
          <Link href={`/admin/programs?universityId=${row.id}`} className="block font-semibold text-[#1E6DEB] hover:underline focus-visible:outline-2">{insights("programs", { count: row.programCount })}</Link>
          <div className="flex flex-wrap gap-x-2 text-[11px]">
            <Link href={`/admin/programs?universityId=${row.id}&published=true`} className="text-emerald-700 hover:underline focus-visible:outline-2">{insights("publishedPrograms", { count: row.publishedProgramCount })}</Link>
            <Link href={`/admin/programs?universityId=${row.id}&published=false`} className="text-[#64748B] hover:underline focus-visible:outline-2">{insights("draftPrograms", { count: Math.max(0, row.programCount - row.publishedProgramCount) })}</Link>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: t("universities.columns.status"),
      className: "w-[165px]",
      cell: (row) => (
        <div>
        {row.publishedAt ? (
          <Badge tone="green" dot>
            {t("common.published")}
          </Badge>
        ) : (
          <Badge tone="neutral" dot>
            {t("common.draft")}
          </Badge>
        )}
          <span className="mt-2 block text-[11px] leading-4 text-[#64748B]">{insights("updated")}<br />{formatDate(locale, row.updatedAt)}</span>
        </div>
      ),
    },
    {
      key: "actions",
      header: <span className="sr-only">{t("common.actions")}</span>,
      align: "end",
      sticky: "end",
      className: "w-[108px]",
      cell: (row) => {
        const busy = pendingId === row.id;
        return (
          <div className="flex items-center justify-end gap-1.5">
            <Link
              href={`/admin/universities/${row.id}`}
              aria-label={`${t("common.edit")}: ${locale === "ar" ? row.nameAr ?? row.name : row.name}`}
              title={t("common.edit")}
              className={ICON_BUTTON}
            >
              <Pencil className="size-4" aria-hidden />
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger ref={(node) => { if (node) actionTriggers.current.set(row.id, node); else actionTriggers.current.delete(row.id); }} disabled={busy} aria-label={`${t("common.actions")}: ${locale === "ar" ? row.nameAr ?? row.name : row.name}`} className={ICON_BUTTON}>
                {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <MoreHorizontal className="size-4" aria-hidden />}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-44" dir={locale === "ar" ? "rtl" : "ltr"}>
                <DropdownMenuItem onClick={() => void togglePublished(row)}>
                  {row.publishedAt ? <EyeOff aria-hidden /> : <Eye aria-hidden />}
                  {t(row.publishedAt ? "common.unpublish" : "common.publish")}
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onClick={() => void requestDelete(row)}>
                  <Trash2 aria-hidden />{t("common.delete")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
        tableClassName="min-w-[900px] table-fixed [&_tbody_td]:py-4"
        expandedRowIds={expanded}
        renderExpandedRow={(row) => (
          <div id={`catalogue-details-${row.id}`} className="grid grid-cols-3 gap-6 p-1 text-xs leading-5 [overflow-wrap:anywhere]">
            <ContentChecklist checks={row.contentChecks} editHref={`/admin/universities/${row.id}`} />
            <section className="min-w-0">
              <h3 className="mb-2 font-semibold text-[#0F172A]">{insights("promotion")}</h3>
              <ul className="space-y-1.5">
                {(["featured", "recommended", "trending"] as const).map((flag) => (
                  <li key={flag} className="flex items-center justify-between gap-2">
                    <span>{insights(flag)}</span>
                    <span className={ ({ featured: row.isFeatured, recommended: row.isRecommended, trending: row.isTrending })[flag] ? "text-blue-700" : "text-[#64748B]" }>
                      {insights(({ featured: row.isFeatured, recommended: row.isRecommended, trending: row.isTrending })[flag] ? "enabled" : "disabled")}
                    </span>
                  </li>
                ))}
              </ul>
              <Link href={`/admin/universities/${row.id}`} className="mt-3 inline-block font-medium text-[#1E6DEB] hover:underline focus-visible:outline-2">{t("common.edit")}</Link>
            </section>
            <section className="min-w-0">
              <h3 className="mb-2 font-semibold text-[#0F172A]">{insights("technical")}</h3>
              <dl className="space-y-2">
                <div><dt className="text-[#64748B]">{insights("slug")}</dt><dd><bdi dir="ltr">{row.slug}</bdi></dd></div>
                <div><dt className="text-[#64748B]">{insights("updated")}</dt><dd>{formatDate(locale, row.updatedAt)}</dd></div>
              </dl>
            </section>
          </div>
        )}
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
        returnFocusRef={deleteTrigger}
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
