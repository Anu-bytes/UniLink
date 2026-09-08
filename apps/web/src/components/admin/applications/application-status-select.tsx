"use client";

import type { ApplicationStatus } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { SelectInput, useToast } from "@/components/admin";
import { useRouter } from "@/i18n/navigation";

import { patchApplication } from "./request";
import { APPLICATION_STATUSES } from "./types";

/**
 * The board's whole point is moving applications along, so the select saves on
 * change rather than behind a Save button — a row that looks changed but was
 * never submitted is worse than no control at all.
 *
 * The value moves before the request does so the row reads as done at once,
 * and moves back if the server refuses: the select must never sit on a status
 * that was not stored.
 */
export function ApplicationStatusSelect({
  id,
  status,
  applicant,
}: {
  id: string;
  status: ApplicationStatus;
  /** Names the row for screen readers — six identical selects otherwise. */
  applicant: string;
}) {
  const t = useTranslations("Admin");
  const tStatus = useTranslations("Applications.status");
  const router = useRouter();
  const { toast } = useToast();

  const [value, setValue] = useState<ApplicationStatus>(status);
  const [pending, setPending] = useState(false);

  async function change(next: ApplicationStatus) {
    const previous = value;
    setValue(next);
    setPending(true);
    const result = await patchApplication(id, { status: next });
    setPending(false);

    if (!result.ok) {
      setValue(previous);
      toast({
        title: t("common.saveFailed"),
        description: result.message ?? undefined,
        tone: "error",
      });
      return;
    }

    toast({
      title: t("applications.toasts.statusChanged", {
        status: tStatus(next),
      }),
    });
    router.refresh();
  }

  return (
    <div className="relative">
      <SelectInput
        aria-label={t("applications.statusFor", { name: applicant })}
        className="h-9 w-auto min-w-[9.5rem] text-[13px]"
        value={value}
        disabled={pending}
        onChange={(event) =>
          void change(event.target.value as ApplicationStatus)
        }
        options={APPLICATION_STATUSES.map((option) => ({
          value: option,
          label: tStatus(option),
        }))}
      />
      {pending ? (
        <Loader2
          aria-hidden
          className="pointer-events-none absolute end-8 top-1/2 size-3.5 -translate-y-1/2 animate-spin text-[#1E6DEB]"
        />
      ) : null}
    </div>
  );
}
