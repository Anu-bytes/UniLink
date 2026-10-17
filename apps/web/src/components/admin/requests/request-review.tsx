"use client";

import { Check, Copy, KeyRound, Loader2, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { useToast, type SelectOption } from "@/components/admin";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { DANGER_BUTTON, PRIMARY_BUTTON, SECONDARY_BUTTON } from "@/components/admin/growth/styles";
import { Link, useRouter } from "@/i18n/navigation";
import { SETTABLE_STATUSES, type PartnerRequestKind, type PartnerRequestState } from "@/lib/partner-requests";
import { cn } from "@/lib/utils";

type ReviewRequest = {
  id: string;
  type: PartnerRequestKind;
  status: PartnerRequestState;
  internalNote: string | null;
  scheduledAt: string | null;
  universityId: string | null;
  email: string;
};

/** ISO -> the value a datetime-local input wants, in the reviewer's time zone. */
function toLocalInput(iso: string | null) {
  if (!iso) return "";
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

const INPUT =
  "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-[14px] outline-none focus:border-[#1E6DEB] focus:ring-2 focus:ring-[#1E6DEB]/20";

export function RequestReview({
  request,
  universities,
  granted,
}: {
  request: ReviewRequest;
  universities: SelectOption[];
  granted: { id: string; email: string } | null;
}) {
  const t = useTranslations("Admin.requests");
  const { toast } = useToast();
  const router = useRouter();
  const [status, setStatus] = useState<PartnerRequestState>(request.status);
  const [note, setNote] = useState(request.internalNote ?? "");
  const [scheduled, setScheduled] = useState(toLocalInput(request.scheduledAt));
  const [universityId, setUniversityId] = useState(request.universityId ?? "");
  const [busy, setBusy] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmGrant, setConfirmGrant] = useState(false);
  const [password, setPassword] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const approved = request.status === "APPROVED";
  // Once approved the status is no longer editable here, so a stale local
  // status (from before "Grant access") must not count as a change.
  const statusChanged = !approved && status !== request.status;
  const dirty =
    statusChanged ||
    note !== (request.internalNote ?? "") ||
    scheduled !== toLocalInput(request.scheduledAt);

  async function send(key: string, url: string, method: "PATCH" | "POST" | "DELETE", body?: unknown) {
    if (busy) return null;
    setBusy(key);
    const response = await fetch(url, {
      method,
      ...(body === undefined ? {} : { headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }),
    }).catch(() => null);
    const data = (await response?.json().catch(() => null)) as Record<string, unknown> | null;
    setBusy(null);
    if (!response?.ok) {
      toast({ title: (data?.error as string) ?? t("review.failed"), tone: "error" });
      return null;
    }
    return data ?? {};
  }

  async function save() {
    const result = await send("save", `/api/admin/requests/${request.id}`, "PATCH", {
      ...(statusChanged ? { status } : {}),
      ...(note !== (request.internalNote ?? "") ? { internalNote: note || null } : {}),
      ...(scheduled !== toLocalInput(request.scheduledAt)
        ? { scheduledAt: scheduled ? new Date(scheduled).toISOString() : null }
        : {}),
    });
    if (result) {
      toast({ title: t("review.saved") });
      router.refresh();
    }
  }

  async function grant() {
    setConfirmGrant(false);
    const result = await send("grant", `/api/admin/requests/${request.id}/grant`, "POST", { universityId });
    if (result) {
      toast({ title: result.promoted ? t("grant.promoted") : t("grant.created") });
      if (typeof result.temporaryPassword === "string") setPassword(result.temporaryPassword);
      router.refresh();
    }
  }

  async function remove() {
    setConfirmDelete(false);
    const result = await send("delete", `/api/admin/requests/${request.id}`, "DELETE");
    if (result) {
      toast({ title: t("review.deleted") });
      router.push("/admin/requests");
      router.refresh();
    }
  }

  const statuses = SETTABLE_STATUSES[request.type];

  return (
    <section className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.05)]">
      <h2 className="text-[15px] font-semibold text-[#0F172A]">{t("review.title")}</h2>

      {approved ? (
        <p className="mt-3 rounded-lg bg-[#E7F6EE] px-3 py-2.5 text-[13px] text-[#0F7B45]">
          {t("review.approvedNote")}{" "}
          {granted ? (
            <Link href={`/admin/admins/${granted.id}`} className="font-semibold underline">
              {t("review.openAdmin")}
            </Link>
          ) : null}
        </p>
      ) : (
        <div className="mt-4">
          <p className="mb-2 text-[12.5px] font-semibold text-[#334155]">{t("review.status")}</p>
          <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label={t("review.status")}>
            {statuses.map((entry) => (
              <button
                key={entry}
                type="button"
                role="radio"
                aria-checked={status === entry}
                onClick={() => setStatus(entry)}
                className={cn(
                  "inline-flex h-9 items-center rounded-lg border px-3 text-[13px] font-semibold transition-colors",
                  status === entry ? "border-[#1E6DEB] bg-[#EEF3FF] text-[#1E6DEB]" : "border-slate-200 text-[#475569] hover:bg-slate-50",
                )}
              >
                {t(`status.${entry}`)}
              </button>
            ))}
          </div>
        </div>
      )}

      {request.type === "DEMO" ? (
        <label className="mt-4 block max-w-xs">
          <span className="mb-1 block text-[12.5px] font-semibold text-[#334155]">{t("review.scheduledAt")}</span>
          <input type="datetime-local" value={scheduled} onChange={(e) => setScheduled(e.target.value)} className={INPUT} />
          <span className="mt-1 block text-[12px] text-[#64748B]">{t("review.scheduledHint")}</span>
        </label>
      ) : null}

      <label className="mt-4 block">
        <span className="mb-1 block text-[12.5px] font-semibold text-[#334155]">{t("review.note")}</span>
        <textarea
          rows={3}
          maxLength={4000}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={t("review.notePlaceholder")}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-[14px] leading-6 outline-none focus:border-[#1E6DEB] focus:ring-2 focus:ring-[#1E6DEB]/20"
        />
      </label>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={() => setConfirmDelete(true)} disabled={busy !== null} className={DANGER_BUTTON}>
          <Trash2 className="size-4" aria-hidden />
          {t("review.delete")}
        </button>
        <button type="button" onClick={() => void save()} disabled={!dirty || busy !== null} className={PRIMARY_BUTTON}>
          {busy === "save" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Check className="size-4" aria-hidden />}
          {t("review.save")}
        </button>
      </div>

      {request.type === "REPRESENTATIVE" && !approved ? (
        <div className="mt-6 border-t border-slate-100 pt-5">
          <h3 className="flex items-center gap-2 text-[14px] font-semibold text-[#0F172A]">
            <KeyRound className="size-4 text-[#6D4AE0]" aria-hidden />
            {t("grant.title")}
          </h3>
          <p className="mt-1 text-[13px] leading-5 text-[#64748B]">{t("grant.body", { email: request.email })}</p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end">
            <label className="block flex-1">
              <span className="mb-1 block text-[12.5px] font-semibold text-[#334155]">{t("grant.university")}</span>
              <select value={universityId} onChange={(e) => setUniversityId(e.target.value)} className={INPUT}>
                <option value="">{t("grant.choose")}</option>
                {universities.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <button type="button" disabled={!universityId || busy !== null} onClick={() => setConfirmGrant(true)} className={SECONDARY_BUTTON}>
              {busy === "grant" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <KeyRound className="size-4" aria-hidden />}
              {t("grant.button")}
            </button>
          </div>
        </div>
      ) : null}

      {password ? (
        <div className="mt-5 rounded-lg border border-[#F5A524]/50 bg-[#FFF6E5] p-4">
          <p className="text-[13px] font-semibold text-[#8A5A0B]">{t("grant.passwordTitle")}</p>
          <p className="mt-1 text-[12.5px] text-[#8A5A0B]">{t("grant.passwordBody")}</p>
          <div className="mt-2 flex items-center gap-2">
            <code dir="ltr" className="rounded bg-white px-2 py-1 font-mono text-[14px] text-[#0F172A]">{password}</code>
            <button
              type="button"
              onClick={() => {
                void navigator.clipboard?.writeText(password).then(() => setCopied(true));
              }}
              className="inline-flex h-8 items-center gap-1 rounded-md px-2 text-[12.5px] font-semibold text-[#8A5A0B] hover:bg-white/60"
            >
              {copied ? <Check className="size-3.5" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
              {copied ? t("grant.copied") : t("grant.copy")}
            </button>
          </div>
        </div>
      ) : null}

      <ConfirmDialog
        open={confirmGrant}
        title={t("grant.confirmTitle")}
        description={t("grant.confirmBody", { email: request.email })}
        confirmLabel={t("grant.button")}
        onConfirm={() => void grant()}
        onOpenChange={setConfirmGrant}
      />
      <ConfirmDialog
        open={confirmDelete}
        title={t("review.deleteTitle")}
        description={t("review.deleteBody")}
        confirmLabel={t("review.delete")}
        destructive
        onConfirm={() => void remove()}
        onOpenChange={setConfirmDelete}
      />
    </section>
  );
}
