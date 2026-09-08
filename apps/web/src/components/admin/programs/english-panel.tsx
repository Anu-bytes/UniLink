"use client";

import type { EnglishTest } from "@prisma/client";
import { Languages, Loader2, Plus, Trash2, X } from "lucide-react";
import { useTranslations } from "next-intl";
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
import type { WriteResult } from "./request";
import { DANGER_BUTTON, ICON_BUTTON, PRIMARY_BUTTON, SECONDARY_BUTTON } from "./styles";
import { REQUIREMENT_TESTS, isRequirementTest } from "./types";
import type { EnglishRequirementRow, RequirementTest } from "./types";

type RequirementDraft = {
  test: string;
  minScore: string;
};

function toDraft(requirement: EnglishRequirementRow): RequirementDraft {
  return {
    test: requirement.test,
    minScore: String(requirement.minScore),
  };
}

function toPayload(draft: RequirementDraft) {
  const score = Number(draft.minScore.trim());
  return {
    test: draft.test,
    minScore: Number.isFinite(score) ? score : null,
  };
}

/**
 * `[programId, test]` is unique, so a second IELTS row comes back as a P2002
 * whose message names the database columns — no use to whoever is filling the
 * form, so the 409 is swapped for wording that says what to do about it.
 */
function failureMessage(
  result: Extract<WriteResult<unknown>, { ok: false }>,
  duplicate: string,
  fallback: string,
): string {
  if (result.status === 409) return duplicate;
  return result.message ?? fallback;
}

export function ProgramEnglishPanel({
  programId,
  requirements,
}: {
  programId: string;
  requirements: EnglishRequirementRow[];
}) {
  const t = useTranslations("Admin");
  const router = useRouter();
  const { toast } = useToast();

  const [deleteTarget, setDeleteTarget] = useState<EnglishRequirementRow | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [creating, setCreating] = useState(false);

  // One row per test, so a test that already has a row cannot be added again.
  const taken = new Set(requirements.map((requirement) => requirement.test));
  const available = REQUIREMENT_TESTS.filter((test) => !taken.has(test));

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const result = await adminWrite(
      `/api/admin/programs/${programId}/english-requirements/${deleteTarget.id}`,
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
    toast({ title: t("programs.english.removed") });
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <FormSection
        title={t("programs.english.title")}
        description={t("programs.english.description")}
      >
        {requirements.length === 0 && !creating ? (
          <EmptyState
            icon={Languages}
            title={t("programs.english.emptyTitle")}
            description={t("programs.english.emptyDescription")}
            action={
              <button
                type="button"
                onClick={() => setCreating(true)}
                className={PRIMARY_BUTTON}
              >
                <Plus className="size-4" aria-hidden />
                {t("programs.english.add")}
              </button>
            }
          />
        ) : null}

        {requirements.length > 0 ? (
          <ul className="space-y-3">
            {requirements.map((requirement) => (
              <li
                key={requirement.id}
                className="rounded-xl border border-slate-200/80 bg-white p-4"
              >
                <RequirementCard
                  programId={programId}
                  requirement={requirement}
                  onDelete={() => setDeleteTarget(requirement)}
                />
              </li>
            ))}
          </ul>
        ) : null}

        {creating ? (
          <RequirementCreateCard
            programId={programId}
            available={available}
            onClose={() => setCreating(false)}
          />
        ) : requirements.length > 0 ? (
          available.length > 0 ? (
            <button
              type="button"
              onClick={() => setCreating(true)}
              className={SECONDARY_BUTTON}
            >
              <Plus className="size-4" aria-hidden />
              {t("programs.english.add")}
            </button>
          ) : (
            <p className="text-[13px] text-[#64748B]">
              {t("programs.english.allTestsUsed")}
            </p>
          )
        ) : null}
      </FormSection>

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        destructive
        pending={deleting}
        title={t("programs.english.deleteTitle")}
        description={t("programs.english.deleteDescription")}
        confirmLabel={t("common.delete")}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  );
}

/** The two controls of one requirement, shared by the editor and create card. */
function RequirementControls({
  draft,
  tests,
  onChange,
  idPrefix,
}: {
  draft: RequirementDraft;
  /** The tests this row may choose; NONE is never offered for a new one. */
  tests: readonly EnglishTest[];
  onChange: <K extends keyof RequirementDraft>(
    key: K,
    value: RequirementDraft[K],
  ) => void;
  idPrefix: string;
}) {
  const t = useTranslations("Admin");
  const tCatalog = useTranslations("Catalog");

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label={t("programs.english.test")} htmlFor={`${idPrefix}-test`} required>
        <SelectInput
          id={`${idPrefix}-test`}
          value={draft.test}
          onChange={(event) => onChange("test", event.target.value)}
          options={tests.map((test) => ({
            value: test,
            label: tCatalog(`englishTests.${test}`),
          }))}
        />
      </Field>

      <Field
        label={t("programs.english.minScore")}
        htmlFor={`${idPrefix}-minScore`}
        required
        hint={t("programs.english.minScoreHint")}
      >
        <NumberInput
          id={`${idPrefix}-minScore`}
          dir="ltr"
          min={0}
          max={200}
          step="0.5"
          className="max-w-[10rem]"
          value={draft.minScore}
          onChange={(event) => onChange("minScore", event.target.value)}
        />
      </Field>
    </div>
  );
}

function RequirementCard({
  programId,
  requirement,
  onDelete,
}: {
  programId: string;
  requirement: EnglishRequirementRow;
  onDelete: () => void;
}) {
  const t = useTranslations("Admin");
  const router = useRouter();
  const { toast } = useToast();
  const fieldId = useId();

  const [draft, setDraft] = useState<RequirementDraft>(() => toDraft(requirement));
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dirty = JSON.stringify(draft) !== JSON.stringify(toDraft(requirement));

  // A stored row can only hold NONE if it predates the API's rejection of it;
  // keeping it in this row's list stops the select from silently rewriting the
  // value to IELTS before the admin has touched anything.
  const tests: readonly EnglishTest[] = isRequirementTest(requirement.test)
    ? REQUIREMENT_TESTS
    : [...REQUIREMENT_TESTS, requirement.test];

  function change<K extends keyof RequirementDraft>(
    key: K,
    value: RequirementDraft[K],
  ) {
    setDraft((current) => ({ ...current, [key]: value }));
    setError(null);
  }

  async function save() {
    setPending(true);
    const result = await adminWrite(
      `/api/admin/programs/${programId}/english-requirements/${requirement.id}`,
      "PATCH",
      toPayload(draft),
    );
    setPending(false);

    if (!result.ok) {
      setError(
        failureMessage(result, t("programs.english.duplicate"), t("common.saveFailed")),
      );
      return;
    }

    setError(null);
    toast({ title: t("programs.toasts.saved") });
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <RequirementControls
        draft={draft}
        tests={tests}
        onChange={change}
        idPrefix={fieldId}
      />

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

function RequirementCreateCard({
  programId,
  available,
  onClose,
}: {
  programId: string;
  /** Tests with no row yet; the unique index would reject any other choice. */
  available: readonly RequirementTest[];
  onClose: () => void;
}) {
  const t = useTranslations("Admin");
  const router = useRouter();
  const { toast } = useToast();
  const fieldId = useId();

  const [draft, setDraft] = useState<RequirementDraft>(() => ({
    test: available[0] ?? REQUIREMENT_TESTS[0],
    minScore: "",
  }));
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function change<K extends keyof RequirementDraft>(
    key: K,
    value: RequirementDraft[K],
  ) {
    setDraft((current) => ({ ...current, [key]: value }));
    setError(null);
  }

  async function create() {
    setPending(true);
    const result = await adminWrite(
      `/api/admin/programs/${programId}/english-requirements`,
      "POST",
      toPayload(draft),
    );
    setPending(false);

    if (!result.ok) {
      setError(
        failureMessage(result, t("programs.english.duplicate"), t("common.saveFailed")),
      );
      return;
    }

    onClose();
    toast({ title: t("programs.english.added") });
    router.refresh();
  }

  return (
    <div className="space-y-4 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-[13.5px] font-semibold text-[#334155]">
          {t("programs.english.addTitle")}
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

      <RequirementControls
        draft={draft}
        tests={available.length > 0 ? available : REQUIREMENT_TESTS}
        onChange={change}
        idPrefix={fieldId}
      />

      {error ? (
        <p role="alert" className="text-[12.5px] font-medium text-[#C81F15]">
          {error}
        </p>
      ) : null}

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
          {t("programs.english.add")}
        </button>
      </div>
    </div>
  );
}
