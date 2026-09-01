"use client";

import { useState } from "react";
import {
  Briefcase,
  Building2,
  Check,
  Loader2,
  Mail,
  MapPin,
  Phone,
  User,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { z } from "zod";

import { cn } from "@/lib/utils";

type Values = {
  universityName: string;
  city: string;
  contactFirstName: string;
  contactLastName: string;
  contactEmail: string;
  contactTitle: string;
  phone: string;
  message: string;
  /** Honeypot: real visitors never see or fill this field (hidden via CSS).
   * A bot that does gets a normal-looking success response, nothing stored. */
  website: string;
};

const initialValues: Values = {
  universityName: "",
  city: "",
  contactFirstName: "",
  contactLastName: "",
  contactEmail: "",
  contactTitle: "",
  phone: "",
  message: "",
  website: "",
};

/**
 * The "Partnership Request" lead form on /contact, linked from every CTA on
 * /partners. Validates client-side for instant feedback and server-side
 * (the actual source of truth) at POST /api/partners/lead, which also rate
 * limits and re-checks the honeypot; this component's checks are UX, not
 * the security boundary.
 */
export function PartnershipRequestForm() {
  const t = useTranslations("Contact");

  const schema = z.object({
    universityName: z.string().trim().min(2, t("form.errors.universityName")),
    city: z.string().trim().min(2, t("form.errors.city")),
    contactFirstName: z.string().trim().min(1, t("form.errors.contactFirstName")),
    contactLastName: z.string().trim().min(1, t("form.errors.contactLastName")),
    contactEmail: z.string().trim().email(t("form.errors.contactEmail")),
    contactTitle: z.string().trim().min(2, t("form.errors.contactTitle")),
    phone: z.string().trim().min(7, t("form.errors.phone")),
    message: z.string().trim().max(2000).optional(),
  });

  const [values, setValues] = useState<Values>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  function update(name: keyof Values, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = schema.safeParse(values);
    if (!result.success) {
      const mapped: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = String(issue.path[0] ?? "");
        if (key && !mapped[key]) mapped[key] = issue.message;
      }
      setErrors(mapped);
      return;
    }

    setStatus("submitting");
    setServerError(null);
    try {
      const response = await fetch("/api/partners/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...result.data, website: values.website }),
      });

      if (response.status === 429) {
        setServerError(t("form.rateLimited"));
        setStatus("idle");
        return;
      }
      if (!response.ok) {
        setServerError(t("form.genericError"));
        setStatus("idle");
        return;
      }
      setStatus("success");
    } catch {
      setServerError(t("form.genericError"));
      setStatus("idle");
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#12224A] to-[#1E6DEB] shadow-[0_30px_70px_-30px_rgba(15,23,42,0.4)]">
        <div className="px-6 pb-16 pt-8 sm:px-10 sm:pt-10">
          <span className="text-xs font-bold uppercase tracking-widest text-white/70">
            {t("eyebrow")}
          </span>
          <h1 className="mt-2 text-[26px] font-bold leading-tight text-white sm:text-[34px]">
            {t("title")}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-7 text-white/85 sm:text-base">
            {t("subtitle")}
          </p>
        </div>

        <div className="relative -mt-8 rounded-t-[2rem] bg-white px-5 pb-8 pt-7 sm:px-8 sm:pb-10 sm:pt-8">
          {status === "success" ? (
            <div className="flex flex-col items-center py-6 text-center">
              <span className="flex size-14 items-center justify-center rounded-full bg-[#EAF6EE] text-[#1F7A4D]">
                <Check className="size-7" strokeWidth={2.5} aria-hidden />
              </span>
              <h2 className="mt-4 text-xl font-bold text-[#16233F]">
                {t("form.successTitle")}
              </h2>
              <p className="mt-2 max-w-sm text-sm leading-6 text-[#5a6072]">
                {t("form.successBody", { email: values.contactEmail })}
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="space-y-5">
              {/* Honeypot: visually hidden, not just display:none (some bots
                  skip hidden fields, fewer skip off-screen ones), and never
                  focusable. */}
              <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
                <label htmlFor="partner-lead-website">Website</label>
                <input
                  id="partner-lead-website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={values.website}
                  onChange={(e) => update("website", e.target.value)}
                />
              </div>

              {serverError ? (
                <p
                  role="alert"
                  className="rounded-lg bg-[#FFF0EE] px-4 py-3 text-sm font-semibold text-[#F82C1F]"
                >
                  {serverError}
                </p>
              ) : null}

              <div className="grid gap-5 sm:grid-cols-2">
                <TextField
                  label={t("form.universityName")}
                  icon={Building2}
                  value={values.universityName}
                  onChange={(v) => update("universityName", v)}
                  error={errors.universityName}
                  autoComplete="organization"
                />
                <TextField
                  label={t("form.city")}
                  icon={MapPin}
                  value={values.city}
                  onChange={(v) => update("city", v)}
                  error={errors.city}
                  autoComplete="address-level2"
                />
                <TextField
                  label={t("form.contactFirstName")}
                  icon={User}
                  value={values.contactFirstName}
                  onChange={(v) => update("contactFirstName", v)}
                  error={errors.contactFirstName}
                  autoComplete="given-name"
                />
                <TextField
                  label={t("form.contactLastName")}
                  icon={User}
                  value={values.contactLastName}
                  onChange={(v) => update("contactLastName", v)}
                  error={errors.contactLastName}
                  autoComplete="family-name"
                />
                <TextField
                  label={t("form.contactEmail")}
                  type="email"
                  icon={Mail}
                  value={values.contactEmail}
                  onChange={(v) => update("contactEmail", v)}
                  error={errors.contactEmail}
                  autoComplete="email"
                />
                <TextField
                  label={t("form.contactTitle")}
                  icon={Briefcase}
                  value={values.contactTitle}
                  onChange={(v) => update("contactTitle", v)}
                  error={errors.contactTitle}
                  autoComplete="organization-title"
                />
              </div>

              <TextField
                label={t("form.phone")}
                type="tel"
                icon={Phone}
                value={values.phone}
                onChange={(v) => update("phone", v)}
                error={errors.phone}
                autoComplete="tel"
              />

              <div className="space-y-1.5">
                <label
                  htmlFor="partner-lead-message"
                  className="text-sm font-semibold text-[#1F2A44]"
                >
                  {t("form.message")}
                </label>
                <textarea
                  id="partner-lead-message"
                  rows={4}
                  value={values.message}
                  onChange={(e) => update("message", e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-[15px] text-[#1F2A44] outline-none transition-colors placeholder:text-[#98A0B4] focus:border-[#1E6DEB] focus:ring-2 focus:ring-[#1E6DEB]/20"
                />
              </div>

              <button
                type="submit"
                disabled={status === "submitting"}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#1E6DEB] text-base font-bold text-white transition-colors hover:bg-[#1859c4] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:px-10"
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 className="size-5 animate-spin" aria-hidden />
                    {t("form.submitting")}
                  </>
                ) : (
                  t("form.submit")
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  error,
  icon: Icon,
  type = "text",
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  icon: LucideIcon;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-[#1F2A44]">{label}</label>
      <div className="relative">
        <Icon
          className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-[#98A0B4]"
          aria-hidden
        />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={Boolean(error)}
          autoComplete={autoComplete}
          className={cn(
            "h-11 w-full rounded-lg border bg-white ps-9 pe-3.5 text-[15px] text-[#1F2A44] outline-none transition-colors placeholder:text-[#98A0B4] focus:ring-2",
            error
              ? "border-[#F82C1F] focus:border-[#F82C1F] focus:ring-[#F82C1F]/20"
              : "border-slate-200 focus:border-[#1E6DEB] focus:ring-[#1E6DEB]/20",
          )}
        />
      </div>
      {error ? (
        <p role="alert" className="text-xs font-semibold text-[#F82C1F]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
