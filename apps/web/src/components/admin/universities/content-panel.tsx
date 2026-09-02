"use client";

import { ChevronDown, ChevronUp, FileText, Loader2, Plus, Trash2, X } from "lucide-react";
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
import type { ContentSection } from "@prisma/client";

import { adminWrite, moveRow } from "./request";
import { DANGER_BUTTON, ICON_BUTTON, PRIMARY_BUTTON, SECONDARY_BUTTON } from "./styles";
import { CONTENT_SECTIONS } from "./types";
import type { ContentBlockRow } from "./types";

export function ContentPanel({
  universityId,
  blocks,
}: {
  universityId: string;
  blocks: ContentBlockRow[];
}) {
  const t = useTranslations("Admin");
  const router = useRouter();
  const { toast } = useToast();

  const [movingId, setMovingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContentBlockRow | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [creatingIn, setCreatingIn] = useState<ContentSection | null>(null);

  function reportFailure(message: string | null, fallbackKey: string) {
    toast({
      title: t(fallbackKey),
      description: message ?? undefined,
      tone: "error",
    });
  }

  // Ordering only means anything inside a section, so the positions written
  // here are indices within that section's own list, matching how the API
  // hands out the next sortOrder on create. The whole section is renumbered
  // rather than the moving pair swapped: the seed numbers a university's
  // blocks across all four sections at once, so a section's own rows start at
  // whatever index they happened to land on.
  async function move(sectionBlocks: ContentBlockRow[], index: number, direction: -1 | 1) {
    const moved = sectionBlocks[index];
    if (!moved || !sectionBlocks[index + direction]) return;

    setMovingId(moved.id);
    const result = await moveRow(
      `/api/admin/universities/${universityId}/content-blocks`,
      sectionBlocks,
      index,
      direction,
    );
    setMovingId(null);

    if (!result.ok) {
      reportFailure(result.message, "common.saveFailed");
    }

    // Reloaded either way: the renumbering is several requests, so a failure
    // halfway through leaves an order only the server knows.
    router.refresh();
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const result = await adminWrite(
      `/api/admin/universities/${universityId}/content-blocks/${deleteTarget.id}`,
      "DELETE",
    );
    setDeleting(false);

    if (!result.ok) {
      reportFailure(result.message, "common.deleteFailed");
      return;
    }

    setDeleteTarget(null);
    toast({ title: t("universities.content.removed") });
    router.refresh();
  }

  return (
    <div className="space-y-5">
      {CONTENT_SECTIONS.map((section) => {
        const sectionBlocks = blocks.filter((block) => block.section === section);

        return (
          <FormSection
            key={section}
            title={t(`enums.contentSection.${section}`)}
            description={t(`universities.content.sectionHints.${section}`)}
          >
            {sectionBlocks.length === 0 && creatingIn !== section ? (
              <EmptyState
                icon={FileText}
                title={t("universities.content.emptyTitle")}
                description={t("universities.content.emptyDescription")}
              />
            ) : null}

            {sectionBlocks.length > 0 ? (
              <ul className="space-y-3">
                {sectionBlocks.map((block, index) => (
                  <li
                    key={block.id}
                    className="rounded-xl border border-slate-200/80 bg-white p-4"
                  >
                    <div className="flex items-start justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => void move(sectionBlocks, index, -1)}
                        disabled={index === 0 || movingId !== null}
                        aria-label={t("universities.content.moveUp")}
                        title={t("universities.content.moveUp")}
                        className={ICON_BUTTON}
                      >
                        {movingId === block.id ? (
                          <Loader2 className="size-4 animate-spin" aria-hidden />
                        ) : (
                          <ChevronUp className="size-4" aria-hidden />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => void move(sectionBlocks, index, 1)}
                        disabled={
                          index === sectionBlocks.length - 1 || movingId !== null
                        }
                        aria-label={t("universities.content.moveDown")}
                        title={t("universities.content.moveDown")}
                        className={ICON_BUTTON}
                      >
                        <ChevronDown className="size-4" aria-hidden />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(block)}
                        aria-label={t("common.delete")}
                        title={t("common.delete")}
                        className={`${DANGER_BUTTON} size-9 justify-center px-0`}
                      >
                        <Trash2 className="size-4" aria-hidden />
                      </button>
                    </div>

                    <ContentBlockFields
                      universityId={universityId}
                      block={block}
                      onFailure={reportFailure}
                    />
                  </li>
                ))}
              </ul>
            ) : null}

            {creatingIn === section ? (
              <ContentCreateCard
                universityId={universityId}
                section={section}
                onFailure={reportFailure}
                onClose={() => setCreatingIn(null)}
              />
            ) : (
              <button
                type="button"
                onClick={() => setCreatingIn(section)}
                className={SECONDARY_BUTTON}
              >
                <Plus className="size-4" aria-hidden />
                {t("universities.content.add")}
              </button>
            )}
          </FormSection>
        );
      })}

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        destructive
        pending={deleting}
        title={t("universities.content.deleteTitle")}
        description={t("universities.content.deleteDescription")}
        confirmLabel={t("common.delete")}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  );
}

/** Each block saves on its own, so one empty body cannot block the whole tab. */
function ContentBlockFields({
  universityId,
  block,
  onFailure,
}: {
  universityId: string;
  block: ContentBlockRow;
  onFailure: (message: string | null, fallbackKey: string) => void;
}) {
  const t = useTranslations("Admin");
  const router = useRouter();
  const { toast } = useToast();
  const fieldId = useId();

  const [title, setTitle] = useState(block.title ?? "");
  const [titleAr, setTitleAr] = useState(block.titleAr ?? "");
  const [body, setBody] = useState(block.body);
  const [bodyAr, setBodyAr] = useState(block.bodyAr ?? "");
  const [pending, setPending] = useState(false);

  const dirty =
    title !== (block.title ?? "") ||
    titleAr !== (block.titleAr ?? "") ||
    body !== block.body ||
    bodyAr !== (block.bodyAr ?? "");

  async function save() {
    setPending(true);
    const result = await adminWrite(
      `/api/admin/universities/${universityId}/content-blocks/${block.id}`,
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
        label={t("universities.content.fieldTitle")}
        hint={t("common.optional")}
        en={{ value: title, onChange: (event) => setTitle(event.target.value) }}
        ar={{ value: titleAr, onChange: (event) => setTitleAr(event.target.value) }}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label={t("universities.content.fieldBody")}
          htmlFor={`${fieldId}-body`}
          required
        >
          <TextArea
            id={`${fieldId}-body`}
            dir="ltr"
            rows={8}
            value={body}
            onChange={(event) => setBody(event.target.value)}
          />
        </Field>
        <Field
          label={t("universities.content.fieldBodyAr")}
          htmlFor={`${fieldId}-bodyAr`}
        >
          <TextArea
            id={`${fieldId}-bodyAr`}
            dir="rtl"
            rows={8}
            value={bodyAr}
            onChange={(event) => setBodyAr(event.target.value)}
          />
        </Field>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => void save()}
          disabled={!dirty || pending || body.trim() === ""}
          className={SECONDARY_BUTTON}
        >
          {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
          {pending ? t("common.saving") : t("common.save")}
        </button>
      </div>
    </div>
  );
}

function ContentCreateCard({
  universityId,
  section,
  onFailure,
  onClose,
}: {
  universityId: string;
  section: ContentSection;
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
      `/api/admin/universities/${universityId}/content-blocks`,
      "POST",
      { section, title, titleAr, body, bodyAr },
    );
    setPending(false);

    if (!result.ok) {
      onFailure(result.message, "common.saveFailed");
      return;
    }

    onClose();
    toast({ title: t("universities.content.added") });
    router.refresh();
  }

  return (
    <div className="space-y-4 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-[13.5px] font-semibold text-[#334155]">
          {t("universities.content.addTitle")}
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
        label={t("universities.content.fieldTitle")}
        hint={t("common.optional")}
        en={{ value: title, onChange: (event) => setTitle(event.target.value) }}
        ar={{ value: titleAr, onChange: (event) => setTitleAr(event.target.value) }}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label={t("universities.content.fieldBody")}
          htmlFor={`${fieldId}-body`}
          required
        >
          <TextArea
            id={`${fieldId}-body`}
            dir="ltr"
            rows={8}
            value={body}
            onChange={(event) => setBody(event.target.value)}
          />
        </Field>
        <Field
          label={t("universities.content.fieldBodyAr")}
          htmlFor={`${fieldId}-bodyAr`}
        >
          <TextArea
            id={`${fieldId}-bodyAr`}
            dir="rtl"
            rows={8}
            value={bodyAr}
            onChange={(event) => setBodyAr(event.target.value)}
          />
        </Field>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => void create()}
          disabled={pending || body.trim() === ""}
          className={PRIMARY_BUTTON}
        >
          {pending ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <Plus className="size-4" aria-hidden />
          )}
          {t("universities.content.add")}
        </button>
      </div>
    </div>
  );
}
