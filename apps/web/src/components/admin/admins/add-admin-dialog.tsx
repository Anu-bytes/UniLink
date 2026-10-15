"use client";

import { Check, Copy, Loader2, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { useRouter } from "@/i18n/navigation";
import type { SelectOption } from "@/components/admin";
import { Modal } from "@/components/admin/modal";
import { useToast } from "@/components/admin/toast";
import { cn } from "@/lib/utils";

import { LEVEL_ROLES, RoleCards } from "./role-cards";
import { UniversityPicker } from "./university-picker";

const INPUT =
  "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-[14px] outline-none focus:border-[#1E6DEB] focus:ring-2 focus:ring-[#1E6DEB]/20";

export function AddAdminButton({ universities }: { universities: SelectOption[] }) {
  const t = useTranslations("Admin.admins");
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<(typeof LEVEL_ROLES)[number]>("UNIVERSITY_ADMIN");
  const [assigned, setAssigned] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<{ field: string | null; message: string } | null>(null);
  const [created, setCreated] = useState<{ password: string | null; email: string } | null>(null);
  const [copied, setCopied] = useState(false);

  function reset() {
    setName("");
    setEmail("");
    setRole("UNIVERSITY_ADMIN");
    setAssigned([]);
    setError(null);
    setCreated(null);
    setCopied(false);
  }

  function close() {
    setOpen(false);
    if (created) router.refresh();
    reset();
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const response = await fetch("/api/admin/admins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, role, universityIds: role === "UNIVERSITY_ADMIN" ? assigned : [] }),
    }).catch(() => null);
    const payload = (await response?.json().catch(() => null)) as { error?: string; field?: string; temporaryPassword?: string | null; promoted?: boolean } | null;
    setBusy(false);
    if (!response?.ok) {
      setError({ field: payload?.field ?? null, message: payload?.error ?? t("createFailed") });
      return;
    }
    toast({ title: payload?.promoted ? t("promoted") : t("created") });
    setCreated({ password: payload?.temporaryPassword ?? null, email });
    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#1E6DEB] px-4 text-[13.5px] font-semibold text-white shadow-sm hover:bg-[#1859c4]"
      >
        <Plus className="size-4" aria-hidden />
        {t("add")}
      </button>

      <Modal
        open={open}
        onClose={close}
        size="lg"
        title={created ? t("createdTitle") : t("addTitle")}
        description={created ? undefined : t("addBody")}
        footer={
          created ? (
            <button type="button" onClick={close} className="min-h-10 rounded-lg bg-[#1E6DEB] px-4 text-[13.5px] font-semibold text-white">
              {t("done")}
            </button>
          ) : (
            <>
              <button type="button" onClick={close} className="min-h-10 rounded-lg px-4 text-[13.5px] font-semibold text-[#64748B] hover:bg-slate-100">
                {t("cancel")}
              </button>
              <button
                type="submit"
                form="add-admin-form"
                disabled={busy}
                className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#1E6DEB] px-4 text-[13.5px] font-semibold text-white disabled:opacity-60"
              >
                {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
                {t("create")}
              </button>
            </>
          )
        }
      >
        {created ? (
          <div className="space-y-4 text-[14px] text-[#334155]">
            {created.password ? (
              <>
                <p>{t("passwordIntro", { email: created.email })}</p>
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <code dir="ltr" className="flex-1 font-mono text-[16px] font-semibold tracking-wider text-[#0F172A]">
                    {created.password}
                  </code>
                  <button
                    type="button"
                    onClick={() => {
                      void navigator.clipboard?.writeText(created.password ?? "");
                      setCopied(true);
                    }}
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-[13px] font-semibold"
                  >
                    {copied ? <Check className="size-4 text-[#0F7B45]" aria-hidden /> : <Copy className="size-4" aria-hidden />}
                    {copied ? t("copied") : t("copy")}
                  </button>
                </div>
                <p className="text-[12.5px] text-[#B77714]">{t("passwordWarning")}</p>
              </>
            ) : (
              <p>{t("promotedBody", { email: created.email })}</p>
            )}
          </div>
        ) : (
          <form id="add-admin-form" onSubmit={submit} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-[13px] font-semibold text-[#334155]">{t("name")}</span>
                <input required value={name} onChange={(event) => setName(event.target.value)} className={INPUT} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[13px] font-semibold text-[#334155]">{t("email")}</span>
                <input
                  required
                  type="email"
                  dir="ltr"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className={cn(INPUT, error?.field === "email" && "border-[#F5C2BD]")}
                />
              </label>
            </div>

            <fieldset>
              <legend className="mb-2 text-[13px] font-semibold text-[#334155]">{t("level")}</legend>
              <RoleCards value={role} onChange={setRole} />
            </fieldset>

            {role === "UNIVERSITY_ADMIN" ? (
              <div>
                <p className="mb-1.5 text-[13px] font-semibold text-[#334155]">{t("universities")}</p>
                <UniversityPicker options={universities} value={assigned} onChange={setAssigned} invalid={error?.field === "universityIds"} />
              </div>
            ) : null}

            {error ? <p className="rounded-lg bg-[#FFF0EE] px-3 py-2 text-[13px] font-medium text-[#A8180F]">{error.message}</p> : null}
          </form>
        )}
      </Modal>
    </>
  );
}
