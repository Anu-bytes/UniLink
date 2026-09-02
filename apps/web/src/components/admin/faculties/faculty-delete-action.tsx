"use client";

import { Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import { ConfirmDialog, useToast } from "@/components/admin";
import { useRouter } from "@/i18n/navigation";
import { formatNumber } from "@/lib/format";

import { adminWrite } from "./request";
import { DANGER_BUTTON } from "./styles";
import type { FacultyCounts } from "./types";

/** Rendered in the dialog in the order an admin reads them. */
const COUNT_KEYS = [
  "programs",
  "minimumScores",
] as const satisfies readonly (keyof FacultyCounts)[];

/**
 * The two-step delete, shared by the table row and the editor's header so both
 * ask the same question. Step one goes out without `?confirm`, which the API
 * answers with a 409 carrying what the delete would take; the dialog quotes
 * those counts and only then repeats the request with `?confirm=true`.
 */
export function FacultyDeleteAction({
  faculty,
  variant,
  after,
}: {
  faculty: { id: string; name: string };
  /** The table row has no space for a label; the editor header does. */
  variant: "icon" | "button";
  /** Where the admin ends up once the row is gone. */
  after: "refresh" | "list";
}) {
  const t = useTranslations("Admin");
  const locale = useLocale();
  const router = useRouter();
  const { toast } = useToast();

  const [counts, setCounts] = useState<FacultyCounts | null>(null);
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  function failed(message: string | null) {
    toast({
      title: t("common.deleteFailed"),
      description: message ?? undefined,
      tone: "error",
    });
  }

  function done() {
    toast({ title: t("faculties.toasts.deleted") });
    if (after === "list") {
      router.push("/admin/faculties");
      return;
    }
    router.refresh();
  }

  async function requestDelete() {
    setPending(true);
    const result = await adminWrite(`/api/admin/faculties/${faculty.id}`, "DELETE");
    setPending(false);

    if (result.ok) {
      done();
      return;
    }

    if (result.status === 409) {
      const body = result.body as { counts?: FacultyCounts } | null;
      setCounts(body?.counts ?? null);
      setOpen(true);
      return;
    }

    failed(result.message);
  }

  async function confirmDelete() {
    setPending(true);
    const result = await adminWrite(
      `/api/admin/faculties/${faculty.id}?confirm=true`,
      "DELETE",
    );
    setPending(false);

    if (!result.ok) {
      failed(result.message);
      return;
    }

    setOpen(false);
    done();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => void requestDelete()}
        disabled={pending}
        aria-label={variant === "icon" ? t("common.delete") : undefined}
        title={variant === "icon" ? t("common.delete") : undefined}
        className={
          variant === "icon"
            ? `${DANGER_BUTTON} size-9 justify-center px-0`
            : DANGER_BUTTON
        }
      >
        <Trash2 className="size-4" aria-hidden />
        {variant === "button" ? t("common.delete") : null}
      </button>

      <ConfirmDialog
        open={open}
        onOpenChange={(next) => {
          if (!next) setOpen(false);
        }}
        destructive
        pending={pending}
        title={t("faculties.delete.title")}
        confirmLabel={t("faculties.delete.confirm")}
        onConfirm={() => void confirmDelete()}
        description={
          <>
            <p>{t("faculties.delete.description", { name: faculty.name })}</p>
            {counts ? (
              <ul className="mt-3 space-y-1">
                {COUNT_KEYS.filter((key) => counts[key] > 0).map((key) => (
                  <li key={key} className="flex items-center justify-between gap-4">
                    <span>{t(`faculties.delete.counts.${key}`)}</span>
                    <span className="font-semibold tabular-nums text-[#0F172A]">
                      {formatNumber(locale, counts[key])}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
            <p className="mt-3">{t("faculties.delete.note")}</p>
          </>
        }
      />
    </>
  );
}
