"use client";

import { GaugeCircle, Loader2, Plus, Trash2, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useId, useState } from "react";

import {
  ConfirmDialog,
  EmptyState,
  Field,
  FormSection,
  NumberInput,
  SelectInput,
  useToast,
} from "@/components/admin";
import { useRouter } from "@/i18n/navigation";

import { adminWrite } from "./request";
import { DANGER_BUTTON, ICON_BUTTON, PRIMARY_BUTTON, SECONDARY_BUTTON } from "./styles";
import { HIGH_SCHOOL_SYSTEMS, SCORE_UNITS } from "./types";
import type { FacultyOption, ScoreRow } from "./types";

type ScoreDraft = {
  system: string;
  facultyId: string;
  minScore: string;
  unit: string;
  year: string;
};

function toDraft(score: ScoreRow): ScoreDraft {
  return {
    system: score.system,
    facultyId: score.facultyId ?? "",
    minScore: String(score.minScore),
    unit: score.unit,
    year: score.year === null ? "" : String(score.year),
  };
}

/** Empty clears the column; anything unparseable is left to the API to reject. */
function toNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

export function ScoresPanel({
  universityId,
  scores,
  faculties,
}: {
  universityId: string;
  scores: ScoreRow[];
  /** Only this university's faculties: the API rejects anyone else's. */
  faculties: FacultyOption[];
}) {
  const t = useTranslations("Admin");
  const router = useRouter();
  const { toast } = useToast();

  const [deleteTarget, setDeleteTarget] = useState<ScoreRow | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [creating, setCreating] = useState(false);

  function reportFailure(message: string | null, fallbackKey: string) {
    toast({
      title: t(fallbackKey),
      description: message ?? undefined,
      tone: "error",
    });
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const result = await adminWrite(
      `/api/admin/universities/${universityId}/minimum-scores/${deleteTarget.id}`,
      "DELETE",
    );
    setDeleting(false);

    if (!result.ok) {
      reportFailure(result.message, "common.deleteFailed");
      return;
    }

    setDeleteTarget(null);
    toast({ title: t("universities.scores.removed") });
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <FormSection
        title={t("universities.scores.title")}
        description={t("universities.scores.description")}
      >
        {scores.length === 0 && !creating ? (
          <EmptyState
            icon={GaugeCircle}
            title={t("universities.scores.emptyTitle")}
            description={t("universities.scores.emptyDescription")}
          />
        ) : null}

        {scores.length > 0 ? (
          <ul className="space-y-3">
            {scores.map((score) => (
              <li
                key={score.id}
                className="rounded-xl border border-slate-200/80 bg-white p-4"
              >
                <ScoreFields
                  universityId={universityId}
                  score={score}
                  faculties={faculties}
                  onDelete={() => setDeleteTarget(score)}
                  onFailure={reportFailure}
                />
              </li>
            ))}
          </ul>
        ) : null}

        {creating ? (
          <ScoreCreateCard
            universityId={universityId}
            faculties={faculties}
            onFailure={reportFailure}
            onClose={() => setCreating(false)}
          />
        ) : (
          <button
            type="button"
            onClick={() => setCreating(true)}
            className={SECONDARY_BUTTON}
          >
            <Plus className="size-4" aria-hidden />
            {t("universities.scores.add")}
          </button>
        )}
      </FormSection>

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        destructive
        pending={deleting}
        title={t("universities.scores.deleteTitle")}
        description={t("universities.scores.deleteDescription")}
        confirmLabel={t("common.delete")}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  );
}

/**
 * The five controls of one cut-off row, shared by the editor and the create
 * card so a row looks the same whether it exists yet or not.
 */
function ScoreControls({
  draft,
  faculties,
  onChange,
  idPrefix,
}: {
  draft: ScoreDraft;
  faculties: FacultyOption[];
  onChange: <K extends keyof ScoreDraft>(key: K, value: ScoreDraft[K]) => void;
  idPrefix: string;
}) {
  const t = useTranslations("Admin");
  const tCatalog = useTranslations("Catalog");
  const locale = useLocale();

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <Field
        label={t("universities.scores.system")}
        htmlFor={`${idPrefix}-system`}
        required
      >
        <SelectInput
          id={`${idPrefix}-system`}
          value={draft.system}
          onChange={(event) => onChange("system", event.target.value)}
          options={HIGH_SCHOOL_SYSTEMS.map((system) => ({
            value: system,
            label: tCatalog(`systems.${system}`),
          }))}
        />
      </Field>

      <Field label={t("universities.scores.faculty")} htmlFor={`${idPrefix}-faculty`}>
        <SelectInput
          id={`${idPrefix}-faculty`}
          value={draft.facultyId}
          onChange={(event) => onChange("facultyId", event.target.value)}
          placeholder={t("universities.scores.universityWide")}
          options={faculties.map((faculty) => ({
            value: faculty.id,
            label:
              locale === "ar" ? (faculty.nameAr ?? faculty.name) : faculty.name,
          }))}
        />
      </Field>

      <Field
        label={t("universities.scores.minScore")}
        htmlFor={`${idPrefix}-minScore`}
        required
      >
        <NumberInput
          id={`${idPrefix}-minScore`}
          dir="ltr"
          step="0.01"
          min={0}
          value={draft.minScore}
          onChange={(event) => onChange("minScore", event.target.value)}
        />
      </Field>

      <Field label={t("universities.scores.unit")} htmlFor={`${idPrefix}-unit`}>
        <SelectInput
          id={`${idPrefix}-unit`}
          value={draft.unit}
          onChange={(event) => onChange("unit", event.target.value)}
          options={SCORE_UNITS.map((unit) => ({
            value: unit,
            label: tCatalog(`units.${unit}`),
          }))}
        />
      </Field>

      <Field label={t("universities.scores.year")} htmlFor={`${idPrefix}-year`}>
        <NumberInput
          id={`${idPrefix}-year`}
          dir="ltr"
          step="1"
          value={draft.year}
          onChange={(event) => onChange("year", event.target.value)}
        />
      </Field>
    </div>
  );
}

function ScoreFields({
  universityId,
  score,
  faculties,
  onDelete,
  onFailure,
}: {
  universityId: string;
  score: ScoreRow;
  faculties: FacultyOption[];
  onDelete: () => void;
  onFailure: (message: string | null, fallbackKey: string) => void;
}) {
  const t = useTranslations("Admin");
  const router = useRouter();
  const { toast } = useToast();
  const fieldId = useId();

  const [draft, setDraft] = useState<ScoreDraft>(() => toDraft(score));
  const [pending, setPending] = useState(false);

  const dirty = JSON.stringify(draft) !== JSON.stringify(toDraft(score));

  function change<K extends keyof ScoreDraft>(key: K, value: ScoreDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  async function save() {
    setPending(true);
    const result = await adminWrite(
      `/api/admin/universities/${universityId}/minimum-scores/${score.id}`,
      "PATCH",
      {
        system: draft.system,
        facultyId: draft.facultyId || null,
        minScore: toNumber(draft.minScore),
        unit: draft.unit,
        year: toNumber(draft.year),
      },
    );
    setPending(false);

    if (!result.ok) {
      onFailure(result.message, "common.saveFailed");
      return;
    }

    toast({ title: t("universities.toasts.saved") });
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <ScoreControls
        draft={draft}
        faculties={faculties}
        onChange={change}
        idPrefix={fieldId}
      />

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
          disabled={!dirty || pending || draft.minScore.trim() === ""}
          className={SECONDARY_BUTTON}
        >
          {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
          {pending ? t("common.saving") : t("common.save")}
        </button>
      </div>
    </div>
  );
}

function ScoreCreateCard({
  universityId,
  faculties,
  onFailure,
  onClose,
}: {
  universityId: string;
  faculties: FacultyOption[];
  onFailure: (message: string | null, fallbackKey: string) => void;
  onClose: () => void;
}) {
  const t = useTranslations("Admin");
  const router = useRouter();
  const { toast } = useToast();
  const fieldId = useId();

  const [draft, setDraft] = useState<ScoreDraft>({
    system: HIGH_SCHOOL_SYSTEMS[0],
    facultyId: "",
    minScore: "",
    unit: SCORE_UNITS[0],
    year: "",
  });
  const [pending, setPending] = useState(false);

  function change<K extends keyof ScoreDraft>(key: K, value: ScoreDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  async function create() {
    setPending(true);
    const result = await adminWrite(
      `/api/admin/universities/${universityId}/minimum-scores`,
      "POST",
      {
        system: draft.system,
        facultyId: draft.facultyId || null,
        minScore: toNumber(draft.minScore),
        unit: draft.unit,
        year: toNumber(draft.year),
      },
    );
    setPending(false);

    if (!result.ok) {
      onFailure(result.message, "common.saveFailed");
      return;
    }

    onClose();
    toast({ title: t("universities.scores.added") });
    router.refresh();
  }

  return (
    <div className="space-y-4 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-[13.5px] font-semibold text-[#334155]">
          {t("universities.scores.addTitle")}
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

      <ScoreControls
        draft={draft}
        faculties={faculties}
        onChange={change}
        idPrefix={fieldId}
      />

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => void create()}
          disabled={pending || draft.minScore.trim() === ""}
          className={PRIMARY_BUTTON}
        >
          {pending ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <Plus className="size-4" aria-hidden />
          )}
          {t("universities.scores.add")}
        </button>
      </div>
    </div>
  );
}
