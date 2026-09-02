"use client";

import type { ApplicationStatus } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useState } from "react";

import {
  Field,
  FormActions,
  FormSection,
  SelectInput,
  TextArea,
  useToast,
} from "@/components/admin";
import { useRouter } from "@/i18n/navigation";

import { patchApplication } from "./request";
import { PRIMARY_BUTTON } from "./styles";
import { APPLICATION_STATUSES } from "./types";

/** The API's own ceiling on the notes column; the counter mirrors it. */
const NOTES_MAX = 5000;

/**
 * The two writable things on the review screen, saved together: an admin who
 * moves an application to REJECTED almost always writes the reason in the same
 * breath, and two separate saves would let one land without the other.
 */
export function ApplicationReviewForm({
  id,
  status,
  notes,
}: {
  id: string;
  status: ApplicationStatus;
  notes: string | null;
}) {
  const t = useTranslations("Admin");
  const tStatus = useTranslations("Applications.status");
  const router = useRouter();
  const { toast } = useToast();

  const statusId = useId();
  const notesId = useId();

  const [value, setValue] = useState<ApplicationStatus>(status);
  const [note, setNote] = useState(notes ?? "");
  const [pending, setPending] = useState(false);

  const dirty = value !== status || note !== (notes ?? "");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);

    // The API trims before it stores, so the trimmed text is what comes back on
    // the refresh; sending it as-is would leave the form permanently "dirty"
    // against a value the server had already normalised.
    const trimmed = note.trim();
    const result = await patchApplication(id, {
      status: value,
      notes: trimmed,
    });
    setPending(false);

    if (!result.ok) {
      toast({
        title: t("common.saveFailed"),
        description: result.message ?? undefined,
        tone: "error",
      });
      return;
    }

    setNote(trimmed);
    toast({ title: t("applications.toasts.saved") });
    router.refresh();
  }

  return (
    <form onSubmit={(event) => void submit(event)} className="space-y-5">
      <FormSection
        title={t("applications.review.title")}
        description={t("applications.review.description")}
      >
        <Field
          label={t("applications.review.status")}
          htmlFor={statusId}
          hint={t("applications.review.statusHint")}
        >
          <SelectInput
            id={statusId}
            value={value}
            disabled={pending}
            onChange={(event) =>
              setValue(event.target.value as ApplicationStatus)
            }
            options={APPLICATION_STATUSES.map((option) => ({
              value: option,
              label: tStatus(option),
            }))}
          />
        </Field>

        <Field
          label={t("applications.review.notes")}
          htmlFor={notesId}
          hint={t("applications.review.notesHint")}
        >
          <TextArea
            id={notesId}
            rows={8}
            maxLength={NOTES_MAX}
            value={note}
            disabled={pending}
            onChange={(event) => setNote(event.target.value)}
            placeholder={t("applications.review.notesPlaceholder")}
          />
        </Field>
      </FormSection>

      <FormActions>
        {dirty ? (
          <p className="me-auto text-[12.5px] text-[#B77714]">
            {t("common.unsavedChanges")}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={pending || !dirty}
          className={PRIMARY_BUTTON}
        >
          {pending ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : null}
          {pending ? t("common.saving") : t("common.save")}
        </button>
      </FormActions>
    </form>
  );
}
