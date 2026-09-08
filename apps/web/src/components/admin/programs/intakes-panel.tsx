"use client";

import { CalendarDays, Loader2, Plus, Trash2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useState } from "react";

import {
  ConfirmDialog,
  EmptyState,
  Field,
  FormSection,
  NumberInput,
  SelectInput,
  TextInput,
  useToast,
} from "@/components/admin";
import { useRouter } from "@/i18n/navigation";

import { adminWrite } from "./request";
import type { WriteResult } from "./request";
import { DANGER_BUTTON, ICON_BUTTON, PRIMARY_BUTTON, SECONDARY_BUTTON } from "./styles";
import { INTAKE_SEASONS } from "./types";
import type { IntakeRow } from "./types";

type IntakeDraft = {
  season: string;
  year: string;
  applicationDeadline: string;
};

/**
 * `<input type="date">` speaks `YYYY-MM-DD`, and the column is read back in
 * UTC by lib/format — so the date is sliced off the ISO string rather than
 * built from the browser's local fields, which would shift the deadline by a
 * day either side of midnight.
 */
function toDateInput(value: Date | null): string {
  if (!value) return "";
  return value.toISOString().slice(0, 10);
}

function toDraft(intake: IntakeRow): IntakeDraft {
  return {
    season: intake.season,
    year: String(intake.year),
    applicationDeadline: toDateInput(intake.applicationDeadline),
  };
}

function toPayload(draft: IntakeDraft) {
  const year = Number.parseInt(draft.year.trim(), 10);
  return {
    season: draft.season,
    year: Number.isFinite(year) ? year : null,
    // A bare date is parsed as UTC midnight, which is the zone the deadline is
    // formatted back in.
    applicationDeadline: draft.applicationDeadline || null,
  };
}

export function ProgramIntakesPanel({
  programId,
  intakes,
}: {
  programId: string;
  intakes: IntakeRow[];
}) {
  const t = useTranslations("Admin");
  const router = useRouter();
  const { toast } = useToast();

  const [deleteTarget, setDeleteTarget] = useState<IntakeRow | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [creating, setCreating] = useState(false);

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const result = await adminWrite(
      `/api/admin/programs/${programId}/intakes/${deleteTarget.id}`,
      "DELETE",
    );
    setDeleting(false);

    if (!result.ok) {
      toast({
        title: t("common.deleteFailed"),
        description: result.message ?? undefined,
        tone: "error",
      });
      return;
    }

    setDeleteTarget(null);
    toast({ title: t("programs.intakes.removed") });
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <FormSection
        title={t("programs.intakes.title")}
        description={t("programs.intakes.description")}
      >
        {intakes.length === 0 && !creating ? (
          <EmptyState
            icon={CalendarDays}
            title={t("programs.intakes.emptyTitle")}
            description={t("programs.intakes.emptyDescription")}
            action={
              <button
                type="button"
                onClick={() => setCreating(true)}
                className={PRIMARY_BUTTON}
              >
                <Plus className="size-4" aria-hidden />
                {t("programs.intakes.add")}
              </button>
            }
          />
        ) : null}

        {intakes.length > 0 ? (
          <ul className="space-y-3">
            {intakes.map((intake) => (
              <li
                key={intake.id}
                className="rounded-xl border border-slate-200/80 bg-white p-4"
              >
                <IntakeCard
                  programId={programId}
                  intake={intake}
                  onDelete={() => setDeleteTarget(intake)}
                />
              </li>
            ))}
          </ul>
        ) : null}

        {creating ? (
          <IntakeCreateCard
            programId={programId}
            onClose={() => setCreating(false)}
          />
        ) : intakes.length > 0 ? (
          <button
            type="button"
            onClick={() => setCreating(true)}
            className={SECONDARY_BUTTON}
          >
            <Plus className="size-4" aria-hidden />
            {t("programs.intakes.add")}
          </button>
        ) : null}
      </FormSection>

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        destructive
        pending={deleting}
        title={t("programs.intakes.deleteTitle")}
        description={t("programs.intakes.deleteDescription")}
        confirmLabel={t("common.delete")}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  );
}

/** The three controls of one intake, shared by the editor and the create card. */
function IntakeControls({
  draft,
  onChange,
  idPrefix,
}: {
  draft: IntakeDraft;
  onChange: <K extends keyof IntakeDraft>(key: K, value: IntakeDraft[K]) => void;
  idPrefix: string;
}) {
  const t = useTranslations("Admin");
  const tCatalog = useTranslations("Catalog");

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Field
        label={t("programs.intakes.season")}
        htmlFor={`${idPrefix}-season`}
        required
      >
        <SelectInput
          id={`${idPrefix}-season`}
          value={draft.season}
          onChange={(event) => onChange("season", event.target.value)}
          options={INTAKE_SEASONS.map((season) => ({
            value: season,
            label: tCatalog(`seasons.${season}`),
          }))}
        />
      </Field>

      <Field label={t("programs.intakes.year")} htmlFor={`${idPrefix}-year`} required>
        <NumberInput
          id={`${idPrefix}-year`}
          dir="ltr"
          min={2000}
          step={1}
          value={draft.year}
          onChange={(event) => onChange("year", event.target.value)}
        />
      </Field>

      <Field
        label={t("programs.intakes.deadline")}
        htmlFor={`${idPrefix}-deadline`}
        hint={t("programs.intakes.deadlineHint")}
      >
        <TextInput
          id={`${idPrefix}-deadline`}
          type="date"
          dir="ltr"
          value={draft.applicationDeadline}
          onChange={(event) => onChange("applicationDeadline", event.target.value)}
        />
      </Field>
    </div>
  );
}

/**
 * A duplicate season+year comes back as a P2002 whose message names the three
 * database columns, which is no use to whoever is filling the form — so the
 * 409 is swapped for wording that says what to do about it.
 */
function failureMessage(
  result: Extract<WriteResult<unknown>, { ok: false }>,
  duplicate: string,
  fallback: string,
): string {
  if (result.status === 409) return duplicate;
  return result.message ?? fallback;
}

function IntakeCard({
  programId,
  intake,
  onDelete,
}: {
  programId: string;
  intake: IntakeRow;
  onDelete: () => void;
}) {
  const t = useTranslations("Admin");
  const router = useRouter();
  const { toast } = useToast();
  const fieldId = useId();

  const [draft, setDraft] = useState<IntakeDraft>(() => toDraft(intake));
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dirty = JSON.stringify(draft) !== JSON.stringify(toDraft(intake));

  function change<K extends keyof IntakeDraft>(key: K, value: IntakeDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
    setError(null);
  }

  async function save() {
    setPending(true);
    const result = await adminWrite(
      `/api/admin/programs/${programId}/intakes/${intake.id}`,
      "PATCH",
      toPayload(draft),
    );
    setPending(false);

    if (!result.ok) {
      setError(
        failureMessage(
          result,
          t("programs.intakes.duplicate"),
          t("common.saveFailed"),
        ),
      );
      return;
    }

    setError(null);
    toast({ title: t("programs.toasts.saved") });
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <IntakeControls draft={draft} onChange={change} idPrefix={fieldId} />

      {error ? (
        <p role="alert" className="text-[12.5px] font-medium text-[#C81F15]">
          {error}
        </p>
      ) : null}

      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onDelete}
          aria-label={t("common.delete")}
          title={t("common.delete")}
          className={`${DANGER_BUTTON} size-9 justify-center px-0`}
        >
          <Trash2 className="size-4" aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => void save()}
          disabled={!dirty || pending || draft.year.trim() === ""}
          className={SECONDARY_BUTTON}
        >
          {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
          {pending ? t("common.saving") : t("common.save")}
        </button>
      </div>
    </div>
  );
}

function IntakeCreateCard({
  programId,
  onClose,
}: {
  programId: string;
  onClose: () => void;
}) {
  const t = useTranslations("Admin");
  const router = useRouter();
  const { toast } = useToast();
  const fieldId = useId();

  const [draft, setDraft] = useState<IntakeDraft>(() => ({
    season: INTAKE_SEASONS[0],
    // The card only renders after a click, so reading the clock here cannot
    // desynchronise a server-rendered value from the client's.
    year: String(new Date().getFullYear()),
    applicationDeadline: "",
  }));
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function change<K extends keyof IntakeDraft>(key: K, value: IntakeDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
    setError(null);
  }

  async function create() {
    setPending(true);
    const result = await adminWrite(
      `/api/admin/programs/${programId}/intakes`,
      "POST",
      toPayload(draft),
    );
    setPending(false);

    if (!result.ok) {
      setError(
        failureMessage(
          result,
          t("programs.intakes.duplicate"),
          t("common.saveFailed"),
        ),
      );
      return;
    }

    onClose();
    toast({ title: t("programs.intakes.added") });
    router.refresh();
  }

  return (
    <div className="space-y-4 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-[13.5px] font-semibold text-[#334155]">
          {t("programs.intakes.addTitle")}
        </h3>
        <button
          type="button"
          onClick={onClose}
          aria-label={t("common.cancel")}
          title={t("common.cancel")}
          className={ICON_BUTTON}
        >
          <X className="size-4" aria-hidden />
        </button>
      </div>

      <IntakeControls draft={draft} onChange={change} idPrefix={fieldId} />

      {error ? (
        <p role="alert" className="text-[12.5px] font-medium text-[#C81F15]">
          {error}
        </p>
      ) : null}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => void create()}
          disabled={pending || draft.year.trim() === ""}
          className={PRIMARY_BUTTON}
        >
          {pending ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <Plus className="size-4" aria-hidden />
          )}
          {t("programs.intakes.add")}
        </button>
      </div>
    </div>
  );
}
