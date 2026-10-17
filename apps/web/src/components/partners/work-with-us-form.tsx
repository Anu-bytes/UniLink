"use client";

import { Briefcase, Building2, CalendarDays, Check, Link2, Loader2, Mail, MapPin, Phone, Presentation, ShieldCheck, User, Users, type LucideIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import { DEMO_SLOTS, isSafeHttpUrl, type PartnerRequestKind } from "@/lib/partner-requests";
import { cn } from "@/lib/utils";

export type UniversityOption = { id: string; name: string };

const OTHER = "__other__";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^\+?[0-9 ()-]{7,30}$/;

type Values = {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  universityChoice: string;
  universityOther: string;
  city: string;
  preferredDate: string;
  preferredSlot: string;
  attendees: string;
  proofUrl: string;
  message: string;
  confirm: boolean;
  /** Honeypot: hidden from people, filled by bots. */
  website: string;
};

/**
 * The two ways a university can work with UniLink, on one page: book a demo,
 * or apply to represent your university (manage its profile). The server
 * re-validates everything; these checks only give instant feedback.
 */
export function WorkWithUsForm({
  initialType,
  universities,
  prefill,
}: {
  initialType: PartnerRequestKind;
  universities: UniversityOption[];
  prefill: { name: string; email: string } | null;
}) {
  const t = useTranslations("WorkWithUs");
  const locale = useLocale();
  const [type, setType] = useState<PartnerRequestKind>(initialType);
  const [values, setValues] = useState<Values>({
    fullName: prefill?.name ?? "",
    jobTitle: "",
    email: prefill?.email ?? "",
    phone: "",
    universityChoice: "",
    universityOther: "",
    city: "",
    preferredDate: "",
    preferredSlot: "",
    attendees: "",
    proofUrl: "",
    message: "",
    confirm: false,
    website: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  function update<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => {
      if (!previous[key]) return previous;
      const next = { ...previous };
      delete next[key];
      return next;
    });
  }

  const today = new Date().toISOString().slice(0, 10);

  function validate() {
    const next: Record<string, string> = {};
    if (values.fullName.trim().length < 2) next.fullName = t("errors.fullName");
    if (values.jobTitle.trim().length < 2) next.jobTitle = t("errors.jobTitle");
    if (!EMAIL.test(values.email.trim())) next.email = t("errors.email");
    if (!PHONE.test(values.phone.trim())) next.phone = t("errors.phone");
    if (!values.universityChoice) next.universityChoice = t("errors.university");
    if (values.universityChoice === OTHER && values.universityOther.trim().length < 2) next.universityOther = t("errors.university");
    if (type === "DEMO") {
      if (values.city.trim().length < 2) next.city = t("errors.city");
      if (values.preferredDate && values.preferredDate < today) next.preferredDate = t("errors.date");
    } else {
      if (values.proofUrl.trim() && !isSafeHttpUrl(values.proofUrl.trim())) next.proofUrl = t("errors.proofUrl");
      if (!values.confirm) next.confirm = t("errors.confirm");
    }
    return next;
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) return;

    const picked = universities.find((university) => university.id === values.universityChoice);
    const common = {
      type,
      fullName: values.fullName,
      jobTitle: values.jobTitle,
      email: values.email,
      phone: values.phone,
      universityId: picked?.id ?? "",
      universityName: picked?.name ?? values.universityOther,
      message: values.message,
      website: values.website,
    };
    const payload =
      type === "DEMO"
        ? {
            ...common,
            city: values.city,
            preferredDate: values.preferredDate,
            preferredSlot: values.preferredSlot || null,
            attendees: values.attendees ? Number(values.attendees) : null,
          }
        : { ...common, proofUrl: values.proofUrl, confirm: values.confirm };

    setStatus("submitting");
    setServerError(null);
    try {
      const response = await fetch("/api/partners/request", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-unilink-locale": locale },
        body: JSON.stringify(payload),
      });
      const data = (await response.json().catch(() => null)) as { error?: string; field?: string; code?: string } | null;
      if (response.status === 429) {
        setServerError(data?.code === "too_many_open" ? t("errors.tooManyOpen") : t("errors.rateLimited"));
        setStatus("idle");
        return;
      }
      if (!response.ok) {
        if (data?.field) setErrors({ [data.field]: data.error ?? t("errors.generic") });
        setServerError(t("errors.generic"));
        setStatus("idle");
        return;
      }
      setStatus("success");
    } catch {
      setServerError(t("errors.generic"));
      setStatus("idle");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center rounded-3xl bg-white px-6 py-14 text-center shadow-sm">
        <span className="flex size-14 items-center justify-center rounded-full bg-[#EAF6EE] text-[#1F7A4D]">
          <Check className="size-7" strokeWidth={2.5} aria-hidden />
        </span>
        <h2 className="mt-4 text-xl font-bold text-[#16233F]">{t(`success.${type}.title`)}</h2>
        <p className="mt-2 max-w-md text-sm leading-6 text-[#5a6072]">{t(`success.${type}.body`, { email: values.email })}</p>
      </div>
    );
  }

  const choices: { key: PartnerRequestKind; icon: LucideIcon }[] = [
    { key: "DEMO", icon: Presentation },
    { key: "REPRESENTATIVE", icon: ShieldCheck },
  ];

  return (
    <div className="space-y-6">
      <div role="radiogroup" aria-label={t("chooseLabel")} className="grid gap-3 sm:grid-cols-2">
        {choices.map((choice) => {
          const active = type === choice.key;
          return (
            <button
              key={choice.key}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => {
                setType(choice.key);
                setErrors({});
                setServerError(null);
              }}
              className={cn(
                "flex items-start gap-3 rounded-2xl border bg-white p-4 text-start transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]",
                active ? "border-[#1E6DEB] ring-2 ring-[#1E6DEB]/20" : "border-slate-200 hover:border-[#1E6DEB]/40",
              )}
            >
              <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", active ? "bg-[#1E6DEB] text-white" : "bg-[#EEF3FF] text-[#1E6DEB]")}>
                <choice.icon className="size-5" aria-hidden />
              </span>
              <span>
                <span className="block text-base font-bold text-[#16233F]">{t(`types.${choice.key}.title`)}</span>
                <span className="mt-0.5 block text-[13px] leading-5 text-[#5a6072]">{t(`types.${choice.key}.body`)}</span>
              </span>
            </button>
          );
        })}
      </div>

      <form onSubmit={onSubmit} noValidate className="relative space-y-5 rounded-3xl bg-white p-5 shadow-sm sm:p-8">
        <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
          <label htmlFor="work-with-us-website">Website</label>
          <input id="work-with-us-website" type="text" tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => update("website", e.target.value)} />
        </div>

        {serverError ? (
          <p role="alert" className="rounded-lg bg-[#FFF0EE] px-4 py-3 text-sm font-semibold text-[#C81F15]">
            {serverError}
          </p>
        ) : null}

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={t("fields.fullName")} icon={User} value={values.fullName} onChange={(v) => update("fullName", v)} error={errors.fullName} autoComplete="name" maxLength={120} />
          <Field label={t("fields.jobTitle")} icon={Briefcase} value={values.jobTitle} onChange={(v) => update("jobTitle", v)} error={errors.jobTitle} autoComplete="organization-title" maxLength={120} />
          <Field label={type === "REPRESENTATIVE" ? t("fields.workEmail") : t("fields.email")} icon={Mail} type="email" dir="ltr" value={values.email} onChange={(v) => update("email", v)} error={errors.email} autoComplete="email" maxLength={200} />
          <Field label={t("fields.phone")} icon={Phone} type="tel" dir="ltr" value={values.phone} onChange={(v) => update("phone", v)} error={errors.phone} autoComplete="tel" maxLength={30} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className={cn("space-y-1.5", values.universityChoice !== OTHER && "sm:col-span-2")}>
            <label htmlFor="work-with-us-university" className="text-sm font-semibold text-[#1F2A44]">{t("fields.university")}</label>
            <div className="relative">
              <Building2 className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-[#98A0B4]" aria-hidden />
              <select
                id="work-with-us-university"
                value={values.universityChoice}
                onChange={(e) => update("universityChoice", e.target.value)}
                aria-invalid={Boolean(errors.universityChoice)}
                className={cn(INPUT, "ps-9", errors.universityChoice ? INVALID : VALID)}
              >
                <option value="">{t("fields.universityPlaceholder")}</option>
                {universities.map((university) => (
                  <option key={university.id} value={university.id}>
                    {university.name}
                  </option>
                ))}
                <option value={OTHER}>{t("fields.universityOther")}</option>
              </select>
            </div>
            {errors.universityChoice ? <p role="alert" className={ERROR}>{errors.universityChoice}</p> : null}
          </div>
          {values.universityChoice === OTHER ? (
            <Field label={t("fields.universityName")} icon={Building2} value={values.universityOther} onChange={(v) => update("universityOther", v)} error={errors.universityOther} autoComplete="organization" maxLength={200} />
          ) : null}
        </div>

        {type === "DEMO" ? (
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={t("fields.city")} icon={MapPin} value={values.city} onChange={(v) => update("city", v)} error={errors.city} autoComplete="address-level2" maxLength={100} />
            <Field label={t("fields.preferredDate")} icon={CalendarDays} type="date" min={today} value={values.preferredDate} onChange={(v) => update("preferredDate", v)} error={errors.preferredDate} />
            <div className="space-y-1.5">
              <label htmlFor="work-with-us-slot" className="text-sm font-semibold text-[#1F2A44]">{t("fields.preferredSlot")}</label>
              <select id="work-with-us-slot" value={values.preferredSlot} onChange={(e) => update("preferredSlot", e.target.value)} className={cn(INPUT, "px-3.5", VALID)}>
                <option value="">{t("fields.anyTime")}</option>
                {DEMO_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {t(`slots.${slot}`)}
                  </option>
                ))}
              </select>
            </div>
            <Field label={t("fields.attendees")} icon={Users} type="number" min="1" max="500" value={values.attendees} onChange={(v) => update("attendees", v)} />
          </div>
        ) : (
          <Field label={t("fields.proofUrl")} hint={t("fields.proofUrlHint")} icon={Link2} type="url" dir="ltr" value={values.proofUrl} onChange={(v) => update("proofUrl", v)} error={errors.proofUrl} maxLength={500} />
        )}

        <div className="space-y-1.5">
          <label htmlFor="work-with-us-message" className="text-sm font-semibold text-[#1F2A44]">{t(type === "DEMO" ? "fields.messageDemo" : "fields.messageRep")}</label>
          <textarea
            id="work-with-us-message"
            rows={4}
            maxLength={2000}
            value={values.message}
            onChange={(e) => update("message", e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-[15px] text-[#1F2A44] outline-none focus:border-[#1E6DEB] focus:ring-2 focus:ring-[#1E6DEB]/20"
          />
        </div>

        {type === "REPRESENTATIVE" ? (
          <div className="space-y-1.5">
            <label className="flex items-start gap-3 text-sm leading-6 text-[#334155]">
              <input type="checkbox" checked={values.confirm} onChange={(e) => update("confirm", e.target.checked)} className="mt-1 size-4 shrink-0 accent-[#1E6DEB]" />
              {t("fields.confirm")}
            </label>
            {errors.confirm ? <p role="alert" className={ERROR}>{errors.confirm}</p> : null}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#1E6DEB] text-base font-bold text-white transition-colors hover:bg-[#1859c4] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:px-10"
        >
          {status === "submitting" ? <Loader2 className="size-5 animate-spin" aria-hidden /> : null}
          {status === "submitting" ? t("submitting") : t(`submit.${type}`)}
        </button>
        <p className="text-[12.5px] leading-5 text-[#64748B]">{t("privacy")}</p>
      </form>
    </div>
  );
}

const INPUT = "h-11 w-full rounded-lg border bg-white text-[15px] text-[#1F2A44] outline-none transition-colors focus:ring-2";
const VALID = "border-slate-200 focus:border-[#1E6DEB] focus:ring-[#1E6DEB]/20";
const INVALID = "border-[#F82C1F] focus:border-[#F82C1F] focus:ring-[#F82C1F]/20";
const ERROR = "text-xs font-semibold text-[#C81F15]";

function Field({
  label,
  hint,
  value,
  onChange,
  error,
  icon: Icon,
  type = "text",
  dir,
  ...rest
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  icon: LucideIcon;
  type?: string;
  dir?: "ltr" | "rtl";
  autoComplete?: string;
  maxLength?: number;
  min?: string;
  max?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-semibold text-[#1F2A44]">{label}</span>
      <span className="relative block">
        <Icon className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-[#98A0B4]" aria-hidden />
        <input
          type={type}
          dir={dir}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={Boolean(error)}
          className={cn(INPUT, "ps-9 pe-3.5", error ? INVALID : VALID)}
          {...rest}
        />
      </span>
      {hint ? <span className="block text-xs text-[#64748B]">{hint}</span> : null}
      {error ? <span role="alert" className={cn("block", ERROR)}>{error}</span> : null}
    </label>
  );
}
