"use client";

import { Check, Loader2, Mail, Pencil, UserRound, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AvatarUploader } from "@/components/app/avatar-uploader";
import {
  CompletenessBar,
  ProfileCard,
  ProfileField,
} from "@/components/app/profile-card";
import { accountEditSchema, type AccountEditData } from "@/lib/onboarding-schema";

export function AccountEditor({
  user,
  storageReady,
  complete,
  total,
}: {
  user: {
    firstName: string | null;
    lastName: string | null;
    name: string | null;
    email: string;
    phone: string | null;
    image: string | null;
  };
  storageReady: boolean;
  complete: number;
  total: number;
}) {
  const t = useTranslations("AppProfile");
  const router = useRouter();

  const initial: AccountEditData = {
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
  };

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [displayName, setDisplayName] = useState(user.name);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startEditing() {
    setDraft(saved);
    setError(null);
    setEditing(true);
  }

  function cancel() {
    setDraft(saved);
    setError(null);
    setEditing(false);
  }

  async function save() {
    setError(null);

    const parsed = accountEditSchema.safeParse(draft);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? t("accountError"));
      return;
    }

    setBusy(true);
    try {
      const response = await fetch("/api/profile/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const payload: { error?: string } = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        setError(payload.error ?? t("accountError"));
        return;
      }

      setSaved(parsed.data);
      setDisplayName(`${parsed.data.firstName} ${parsed.data.lastName}`);
      setEditing(false);
      router.refresh();
    } catch (saveError) {
      console.error("Unable to save account details", saveError);
      setError(t("accountError"));
    } finally {
      setBusy(false);
    }
  }

  const action = editing ? (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={cancel}
        disabled={busy}
        className="inline-flex min-h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-[#5a6072] hover:bg-slate-50 disabled:opacity-60"
      >
        <X className="size-4" aria-hidden />
        {t("cancel")}
      </button>
      <button
        type="button"
        onClick={save}
        disabled={busy}
        className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-[#1E6DEB] px-4 text-sm font-bold text-white hover:bg-[#1859c4] disabled:opacity-60"
      >
        {busy ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : (
          <Check className="size-4" aria-hidden />
        )}
        {t("save")}
      </button>
    </div>
  ) : (
    <button
      type="button"
      onClick={startEditing}
      className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-[#1E6DEB] transition-colors hover:bg-[#EEF3FF]"
    >
      <Pencil className="size-4" aria-hidden />
      {t("edit")}
    </button>
  );

  return (
    <ProfileCard icon={UserRound} title={t("account")} action={action}>
      {error ? (
        <p
          role="alert"
          className="mb-4 rounded-lg bg-[#FFF0EE] px-3 py-2 text-sm font-semibold text-[#C81F15]"
        >
          {error}
        </p>
      ) : null}

      <AvatarUploader
        user={{ name: displayName, email: user.email, image: user.image }}
        storageReady={storageReady}
      >
        {editing ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-[#5a6072]">
                {t("firstName")}
              </span>
              <input
                type="text"
                value={draft.firstName}
                onChange={(event) =>
                  setDraft((previous) => ({
                    ...previous,
                    firstName: event.target.value,
                  }))
                }
                className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus-visible:border-[#1E6DEB]"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-[#5a6072]">
                {t("lastName")}
              </span>
              <input
                type="text"
                value={draft.lastName}
                onChange={(event) =>
                  setDraft((previous) => ({
                    ...previous,
                    lastName: event.target.value,
                  }))
                }
                className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus-visible:border-[#1E6DEB]"
              />
            </label>
          </div>
        ) : (
          <div className="min-w-0">
            <p className="truncate text-xl font-bold text-[#1F2A44]">
              {displayName ?? t("noName")}
            </p>
            <p
              dir="ltr"
              className="mt-0.5 flex items-center gap-1.5 truncate text-sm text-[#5a6072] rtl:justify-end"
            >
              <Mail className="size-3.5 shrink-0" aria-hidden />
              {user.email}
            </p>
          </div>
        )}
      </AvatarUploader>

      <dl className="mt-6 grid gap-5 border-t border-slate-100 pt-5 sm:grid-cols-2">
        <ProfileField
          label={t("email")}
          value={user.email}
          emptyLabel={t("notSet")}
          locked
          lockedLabel={t("lockedHint")}
          ltr
        />
        <ProfileField
          label={t("phone")}
          value={user.phone}
          emptyLabel={t("notSet")}
          locked
          lockedLabel={t("lockedHint")}
          ltr
        />
      </dl>

      <div className="mt-6 rounded-xl bg-[#F7F9FE] p-4">
        <CompletenessBar
          complete={complete}
          total={total}
          label={t("completeness")}
          hint={t("completenessHint")}
        />
      </div>
    </ProfileCard>
  );
}
