"use client";

import { Ban, Check, Copy, KeyRound, Loader2, PauseCircle, PlayCircle, Trash2, UserMinus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { useRouter } from "@/i18n/navigation";
import type { SelectOption } from "@/components/admin";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { useToast } from "@/components/admin/toast";
import { cn } from "@/lib/utils";

import { RoleCards, type LevelRole } from "./role-cards";
import { UniversityPicker } from "./university-picker";

type Status = "ACTIVE" | "DISABLED" | "BANNED";

const CARD = "rounded-xl border border-[#E2E8F0] bg-white p-4 sm:p-5";
const H = "text-[14px] font-semibold text-[#0F172A]";
const PRIMARY =
  "inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-[#1E6DEB] px-3.5 text-[13px] font-semibold text-white hover:bg-[#1859c4] disabled:opacity-50";

async function patch(id: string, body: unknown) {
  const response = await fetch(`/api/admin/admins/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).catch(() => null);
  const payload = (await response?.json().catch(() => null)) as { error?: string; temporaryPassword?: string | null } | null;
  return { ok: Boolean(response?.ok), payload };
}

/** Everything a super admin can change about another admin's account. */
export function AdminControls({
  admin,
  universities,
  self,
}: {
  admin: { id: string; email: string; role: LevelRole; status: Status; statusReason: string | null; universityIds: string[] };
  universities: SelectOption[];
  /** Your own account: role and status are locked. */
  self: boolean;
}) {
  const t = useTranslations("Admin.admins");
  const router = useRouter();
  const { toast } = useToast();

  const [role, setRole] = useState<LevelRole>(admin.role);
  const [assigned, setAssigned] = useState(admin.universityIds);
  const [reason, setReason] = useState(admin.statusReason ?? "");
  const [busy, setBusy] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [confirm, setConfirm] = useState<"revoke" | "delete" | null>(null);

  const roleDirty = role !== admin.role;
  const assignDirty =
    role === "UNIVERSITY_ADMIN" &&
    (assigned.length !== admin.universityIds.length || assigned.some((id) => !admin.universityIds.includes(id)));

  async function run(key: string, body: unknown, success: string) {
    setBusy(key);
    const { ok, payload } = await patch(admin.id, body);
    setBusy(null);
    if (!ok) {
      toast({ title: payload?.error ?? t("saveFailed"), tone: "error" });
      return null;
    }
    toast({ title: success });
    router.refresh();
    return payload;
  }

  async function remove(mode: "revoke" | "delete") {
    setBusy(mode);
    const response = await fetch(`/api/admin/admins/${admin.id}?mode=${mode}`, { method: "DELETE" }).catch(() => null);
    const payload = (await response?.json().catch(() => null)) as { error?: string } | null;
    setBusy(null);
    setConfirm(null);
    if (!response?.ok) {
      toast({ title: payload?.error ?? t("saveFailed"), tone: "error" });
      return;
    }
    toast({ title: mode === "delete" ? t("deleted") : t("revoked") });
    router.push("/admin/admins");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <section className={CARD}>
        <h2 className={H}>{t("level")}</h2>
        {self ? <p className="mt-1 text-[12.5px] text-[#64748B]">{t("selfLocked")}</p> : null}
        <div className="mt-3">
          <RoleCards value={role} onChange={setRole} disabled={self} stacked />
        </div>
        {role === "UNIVERSITY_ADMIN" ? (
          <div className="mt-4">
            <p className="mb-1.5 text-[13px] font-semibold text-[#334155]">{t("universities")}</p>
            <UniversityPicker options={universities} value={assigned} onChange={setAssigned} />
          </div>
        ) : null}
        {roleDirty || assignDirty ? (
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setRole(admin.role);
                setAssigned(admin.universityIds);
              }}
              className="min-h-9 rounded-lg px-3 text-[13px] font-semibold text-[#64748B] hover:bg-slate-100"
            >
              {t("cancel")}
            </button>
            <button
              type="button"
              disabled={busy !== null || (role === "UNIVERSITY_ADMIN" && assigned.length === 0)}
              onClick={() =>
                void run(
                  "role",
                  { ...(roleDirty ? { role } : {}), ...(role === "UNIVERSITY_ADMIN" ? { universityIds: assigned } : {}) },
                  t("saved"),
                )
              }
              className={PRIMARY}
            >
              {busy === "role" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
              {t("saveChanges")}
            </button>
          </div>
        ) : null}
      </section>

      <section className={CARD}>
        <h2 className={H}>{t("accessTitle")}</h2>
        <p className="mt-1 text-[12.5px] text-[#64748B]">{t("accessBody")}</p>
        {!self ? (
          <>
            <label className="mt-3 block">
              <span className="mb-1.5 block text-[12.5px] font-semibold text-[#334155]">{t("reason")}</span>
              <input
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                maxLength={500}
                placeholder={t("reasonPlaceholder")}
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-[13.5px] outline-none focus:border-[#1E6DEB] focus:ring-2 focus:ring-[#1E6DEB]/20"
              />
            </label>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {admin.status !== "ACTIVE" ? (
                <button
                  type="button"
                  disabled={busy !== null}
                  onClick={() => void run("status", { status: "ACTIVE" }, t("enabled"))}
                  className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-[#B7E4CB] bg-[#E7F6EE] px-3 text-[13px] font-semibold text-[#0F7B45] disabled:opacity-50"
                >
                  <PlayCircle className="size-4" aria-hidden />
                  {admin.status === "BANNED" ? t("unban") : t("enable")}
                </button>
              ) : null}
              {admin.status !== "DISABLED" ? (
                <button
                  type="button"
                  disabled={busy !== null}
                  onClick={() => void run("status", { status: "DISABLED", statusReason: reason || null }, t("disabled"))}
                  className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-[#F3DFB4] bg-[#FFFBF2] px-3 text-[13px] font-semibold text-[#B77714] disabled:opacity-50"
                >
                  <PauseCircle className="size-4" aria-hidden />
                  {t("disable")}
                </button>
              ) : null}
              {admin.status !== "BANNED" ? (
                <button
                  type="button"
                  disabled={busy !== null}
                  onClick={() => void run("status", { status: "BANNED", statusReason: reason || null }, t("banned"))}
                  className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-[#F5C2BD] bg-[#FFF0EE] px-3 text-[13px] font-semibold text-[#C81F15] disabled:opacity-50"
                >
                  <Ban className="size-4" aria-hidden />
                  {t("ban")}
                </button>
              ) : null}
            </div>
          </>
        ) : (
          <p className="mt-2 text-[12.5px] text-[#64748B]">{t("selfLocked")}</p>
        )}
      </section>

      <section className={CARD}>
        <h2 className={H}>{t("passwordTitle")}</h2>
        <p className="mt-1 text-[12.5px] text-[#64748B]">{t("passwordBody")}</p>
        {password ? (
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <code dir="ltr" className="flex-1 font-mono text-[15px] font-semibold tracking-wider">{password}</code>
            <button
              type="button"
              onClick={() => {
                void navigator.clipboard?.writeText(password);
                setCopied(true);
              }}
              className="inline-flex min-h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-[12.5px] font-semibold"
            >
              {copied ? <Check className="size-3.5 text-[#0F7B45]" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
              {copied ? t("copied") : t("copy")}
            </button>
          </div>
        ) : (
          <button
            type="button"
            disabled={busy !== null || self}
            onClick={async () => {
              const payload = await run("password", { resetPassword: true }, t("passwordReset"));
              if (payload?.temporaryPassword) setPassword(payload.temporaryPassword);
            }}
            className="mt-3 inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-[13px] font-semibold text-[#334155] hover:bg-slate-50 disabled:opacity-50"
          >
            {busy === "password" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <KeyRound className="size-4" aria-hidden />}
            {t("resetPassword")}
          </button>
        )}
      </section>

      {!self ? (
        <section className={cn(CARD, "border-[#F5C2BD]")}>
          <h2 className={cn(H, "text-[#A8180F]")}>{t("dangerTitle")}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy !== null}
              onClick={() => setConfirm("revoke")}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-[#F5C2BD] bg-white px-3 text-[13px] font-semibold text-[#C81F15] hover:bg-[#FFF0EE]"
            >
              <UserMinus className="size-4" aria-hidden />
              {t("revoke")}
            </button>
            <button
              type="button"
              disabled={busy !== null}
              onClick={() => setConfirm("delete")}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-[#C81F15] px-3 text-[13px] font-semibold text-white hover:bg-[#A8180F]"
            >
              <Trash2 className="size-4" aria-hidden />
              {t("deleteAccount")}
            </button>
          </div>
        </section>
      ) : null}

      <ConfirmDialog
        open={confirm !== null}
        onOpenChange={(open) => !open && setConfirm(null)}
        title={confirm === "delete" ? t("deleteTitle") : t("revokeTitle")}
        description={confirm === "delete" ? t("deleteBody", { email: admin.email }) : t("revokeBody", { email: admin.email })}
        confirmLabel={confirm === "delete" ? t("deleteAccount") : t("revoke")}
        onConfirm={() => confirm && void remove(confirm)}
        pending={busy === "revoke" || busy === "delete"}
        destructive
      />
    </div>
  );
}
