"use client";

import { ChevronDown, ChevronUp, Loader2, Plus, Sparkles, Trash2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useState } from "react";

import {
  BilingualField,
  ConfirmDialog,
  EmptyState,
  Field,
  FormSection,
  TextArea,
  useToast,
} from "@/components/admin";
import { useRouter } from "@/i18n/navigation";

import { adminWrite } from "./request";
import { DANGER_BUTTON, ICON_BUTTON, PRIMARY_BUTTON, SECONDARY_BUTTON } from "./styles";
import type { FeatureRow } from "./types";

export function FeaturesPanel({
  universityId,
  features,
}: {
  universityId: string;
  features: FeatureRow[];
}) {
  const t = useTranslations("Admin");
  const router = useRouter();
  const { toast } = useToast();

  const [movingId, setMovingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FeatureRow | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [creating, setCreating] = useState(false);

  function reportFailure(message: string | null, fallbackKey: string) {
    toast({
      title: t(fallbackKey),
      description: message ?? undefined,
      tone: "error",
    });
  }

  // Positions are rewritten from the rendered order rather than swapped between
  // the two rows: a list seeded with every sortOrder at 0 is ordered by id
  // alone, and swapping two identical values would move nothing.
  async function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    const moved = features[index];
    const displaced = features[target];
    if (!moved || !displaced) return;

    setMovingId(moved.id);
    const base = `/api/admin/universities/${universityId}/features`;
    let result = await adminWrite(`${base}/${moved.id}`, "PATCH", {
      sortOrder: target,
    });
    if (result.ok) {
      result = await adminWrite(`${base}/${displaced.id}`, "PATCH", {
        sortOrder: index,
      });
    }
    setMovingId(null);

    if (!result.ok) {
      reportFailure(result.message, "common.saveFailed");
      return;
    }

    router.refresh();
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const result = await adminWrite(
      `/api/admin/universities/${universityId}/features/${deleteTarget.id}`,
      "DELETE",
    );
    setDeleting(false);

    if (!result.ok) {
      reportFailure(result.message, "common.deleteFailed");
      return;
    }

    setDeleteTarget(null);
    toast({ title: t("universities.features.removed") });
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <FormSection
        title={t("universities.features.title")}
        description={t("universities.features.description")}
      >
        {features.length === 0 && !creating ? (
          <EmptyState
            icon={Sparkles}
            title={t("universities.features.emptyTitle")}
            description={t("universities.features.emptyDescription")}
          />
        ) : null}

        {features.length > 0 ? (
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li
                key={feature.id}
                className="rounded-xl border border-slate-200/80 bg-white p-4"
              >
                <div className="flex items-start justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => void move(index, -1)}
                    disabled={index === 0 || movingId !== null}
                    aria-label={t("universities.features.moveUp")}
                    title={t("universities.features.moveUp")}
                    className={ICON_BUTTON}
                  >
                    {movingId === feature.id ? (
                      <Loader2 className="size-4 animate-spin" aria-hidden />
                    ) : (
                      <ChevronUp className="size-4" aria-hidden />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => void move(index, 1)}
                    disabled={index === features.length - 1 || movingId !== null}
                    aria-label={t("universities.features.moveDown")}
                    title={t("universities.features.moveDown")}
                    className={ICON_BUTTON}
                  >
                    <ChevronDown className="size-4" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(feature)}
                    aria-label={t("common.delete")}
                    title={t("common.delete")}
                    className={`${DANGER_BUTTON} size-9 justify-center px-0`}
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </button>
                </div>

                <FeatureFields
                  universityId={universityId}
                  feature={feature}
                  onFailure={reportFailure}
                />
              </li>
            ))}
          </ul>
        ) : null}

        {creating ? (
          <FeatureCreateCard
            universityId={universityId}
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
            {t("universities.features.add")}
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
        title={t("universities.features.deleteTitle")}
        description={t("universities.features.deleteDescription")}
        confirmLabel={t("common.delete")}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  );
}

/** Each row saves on its own, so one bad title cannot block the whole tab. */
function FeatureFields({
  universityId,
  feature,
  onFailure,
}: {
  universityId: string;
  feature: FeatureRow;
  onFailure: (message: string | null, fallbackKey: string) => void;
}) {
  const t = useTranslations("Admin");
  const router = useRouter();
  const { toast } = useToast();
  const fieldId = useId();

  const [title, setTitle] = useState(feature.title);
  const [titleAr, setTitleAr] = useState(feature.titleAr ?? "");
  const [body, setBody] = useState(feature.body ?? "");
  const [bodyAr, setBodyAr] = useState(feature.bodyAr ?? "");
  const [pending, setPending] = useState(false);

  const dirty =
    title !== feature.title ||
    titleAr !== (feature.titleAr ?? "") ||
    body !== (feature.body ?? "") ||
    bodyAr !== (feature.bodyAr ?? "");

  async function save() {
    setPending(true);
    const result = await adminWrite(
      `/api/admin/universities/${universityId}/features/${feature.id}`,
      "PATCH",
      { title, titleAr, body, bodyAr },
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
      <BilingualField
        label={t("universities.features.fieldTitle")}
        required
        en={{ value: title, onChange: (event) => setTitle(event.target.value) }}
        ar={{ value: titleAr, onChange: (event) => setTitleAr(event.target.value) }}
      />

      {/* BilingualField pairs single-line inputs; the body runs to a paragraph,
          so its two languages are laid out by hand. */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label={t("universities.features.fieldBody")}
          htmlFor={`${fieldId}-body`}
        >
          <TextArea
            id={`${fieldId}-body`}
            dir="ltr"
            value={body}
            onChange={(event) => setBody(event.target.value)}
          />
        </Field>
        <Field
          label={t("universities.features.fieldBodyAr")}
          htmlFor={`${fieldId}-bodyAr`}
        >
          <TextArea
            id={`${fieldId}-bodyAr`}
            dir="rtl"
            value={bodyAr}
            onChange={(event) => setBodyAr(event.target.value)}
          />
        </Field>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => void save()}
          disabled={!dirty || pending || title.trim() === ""}
          className={SECONDARY_BUTTON}
        >
          {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
          {pending ? t("common.saving") : t("common.save")}
        </button>
      </div>
    </div>
  );
}

function FeatureCreateCard({
  universityId,
  onFailure,
  onClose,
}: {
  universityId: string;
  onFailure: (message: string | null, fallbackKey: string) => void;
  onClose: () => void;
}) {
  const t = useTranslations("Admin");
  const router = useRouter();
  const { toast } = useToast();
  const fieldId = useId();

  const [title, setTitle] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [body, setBody] = useState("");
  const [bodyAr, setBodyAr] = useState("");
  const [pending, setPending] = useState(false);

  async function create() {
    setPending(true);
    const result = await adminWrite(
      `/api/admin/universities/${universityId}/features`,
      "POST",
      { title, titleAr, body, bodyAr },
    );
    setPending(false);

    if (!result.ok) {
      onFailure(result.message, "common.saveFailed");
      return;
    }

    onClose();
    toast({ title: t("universities.features.added") });
    router.refresh();
  }

  return (
    <div className="space-y-4 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-[13.5px] font-semibold text-[#334155]">
          {t("universities.features.addTitle")}
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

      <BilingualField
        label={t("universities.features.fieldTitle")}
        required
        en={{ value: title, onChange: (event) => setTitle(event.target.value) }}
        ar={{ value: titleAr, onChange: (event) => setTitleAr(event.target.value) }}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label={t("universities.features.fieldBody")}
          htmlFor={`${fieldId}-body`}
        >
          <TextArea
            id={`${fieldId}-body`}
            dir="ltr"
            value={body}
            onChange={(event) => setBody(event.target.value)}
          />
        </Field>
        <Field
          label={t("universities.features.fieldBodyAr")}
          htmlFor={`${fieldId}-bodyAr`}
        >
          <TextArea
            id={`${fieldId}-bodyAr`}
            dir="rtl"
            value={bodyAr}
            onChange={(event) => setBodyAr(event.target.value)}
          />
        </Field>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => void create()}
          disabled={pending || title.trim() === ""}
          className={PRIMARY_BUTTON}
        >
          {pending ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <Plus className="size-4" aria-hidden />
          )}
          {t("universities.features.add")}
        </button>
      </div>
    </div>
  );
}
