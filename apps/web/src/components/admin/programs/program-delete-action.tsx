"use client";

import { Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import { ConfirmDialog, useToast } from "@/components/admin";
import { useRouter } from "@/i18n/navigation";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

import { adminWrite } from "./request";
import { DANGER_BUTTON } from "./styles";
import type { ProgramCounts } from "./types";

/** Rendered in the dialog in the order an admin reads them. */
const COUNT_KEYS = [
  "applications",
  "savedBy",
  "intakes",
  "englishRequirements",
] as const satisfies readonly (keyof ProgramCounts)[];

function readCounts(body: unknown): ProgramCounts | null {
  const counts = (body as { counts?: unknown } | null)?.counts;
  if (!counts || typeof counts !== "object") return null;

  const record = counts as Record<string, unknown>;
  if (COUNT_KEYS.some((key) => typeof record[key] !== "number")) return null;

  return counts as ProgramCounts;
}

/**
 * The two-step delete, shared by the table row and the editor's header so both
 * ask the same question. Step one goes out without `?confirm`, which the API
 * answers with a 409 carrying what the delete would take; the dialog quotes
 * those counts and only then repeats the request with `?confirm=true`.
 */
export function ProgramDeleteAction({
  program,
  variant,
  after,
}: {
  program: { id: string; name: string };
  /** The table row has no space for a label; the editor header does. */
  variant: "icon" | "button";
  /** Where the admin ends up once the row is gone. */
  after: "refresh" | "list";
}) {
  const t = useTranslations("Admin");
  const locale = useLocale();
  const router = useRouter();
  const { toast } = useToast();

  const [counts, setCounts] = useState<ProgramCounts | null>(null);
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  function failed(message: string | null) {
    toast({
      title: t("common.deleteFailed"),
      description: message ?? undefined,
      tone: "error",
    });
  }

  async function requestDelete() {
    setPending(true);
    const result = await adminWrite(`/api/admin/programs/${program.id}`, "DELETE");
    setPending(false);

    // The 409 is the expected answer here, not a failure: it is how the API
    // hands back what the delete would take with it.
    if (!result.ok && result.status === 409) {
      setCounts(readCounts(result.body));
      setOpen(true);
      return;
    }

    if (result.ok) {
      // The route answers 409 for every unconfirmed delete, childless rows
      // included, so this only fires if that contract ever softens.
      done();
      return;
    }

    failed(result.message);
  }

  function done() {
    toast({ title: t("programs.toasts.deleted") });
    if (after === "list") {
      router.push("/admin/programs");
      return;
    }
    router.refresh();
  }

  async function confirmDelete() {
    setPending(true);
    const result = await adminWrite(
      `/api/admin/programs/${program.id}?confirm=true`,
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

  const losesApplications = (counts?.applications ?? 0) > 0;

  return (
    <>
      <button
        type="button"
        onClick={() => void requestDelete()}
        disabled={pending}
        aria-label={variant === "icon" ? t("common.delete") : undefined}
        title={variant === "icon" ? t("common.delete") : undefined}
        className={cn(DANGER_BUTTON, variant === "icon" && "size-9 justify-center px-0")}
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
        title={t("programs.delete.title")}
        confirmLabel={t("programs.delete.confirm")}
        onConfirm={() => void confirmDelete()}
        description={
          <>
            <p>{t("programs.delete.description", { name: program.name })}</p>
            {counts ? (
              <ul className="mt-3 space-y-1">
                {COUNT_KEYS.filter((key) => counts[key] > 0).map((key) => (
                  <li key={key} className="flex items-center justify-between gap-4">
                    <span>{t(`programs.delete.counts.${key}`)}</span>
                    <span className="font-semibold tabular-nums text-[#0F172A]">
                      {formatNumber(locale, counts[key])}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
            <p className="mt-3 font-semibold text-[#C81F15]">
              {losesApplications
                ? t("programs.delete.applicationsWarning")
                : t("programs.delete.note")}
            </p>
          </>
        }
      />
    </>
  );
}
