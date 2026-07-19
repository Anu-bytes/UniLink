"use client";

import { useMemo, useState } from "react";
import { signIn } from "next-auth/react";
import { ArrowLeft, ArrowRight, Check, PartyPopper, Loader2 } from "lucide-react";
import { useIntl } from "@/i18n/provider";
import { useSession } from "./session";
import { LocaleLink } from "@/components/LocaleLink";
import { Button, buttonClasses } from "@/components/ui/legacy-button";
import { Field, TextField, PasswordField, ChoiceGroup, Select, MultiSelect } from "./fields";
import { HIGH_SCHOOL_TYPES, CERTIFICATIONS, type HighSchoolTypeId, type CertificationId } from "@/data/student";
import { FIELDS, getField } from "@/data/fields";
import { FEE_BUCKETS, getFeeBucket } from "@/data/fee-buckets";
import { GRAD_YEAR_MIN, GRAD_YEAR_MAX, EG_PHONE, PASSWORD_MIN } from "@/lib/auth/validation";
import { pick, formatYear } from "@/lib/format";
import type { FieldOfStudyId, FeeBucketId } from "@/lib/types";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  highSchoolType: HighSchoolTypeId | "";
  graduationYear: string;
  certification: CertificationId | "";
  fieldsOfInterest: FieldOfStudyId[];
  budgetBucket: FeeBucketId | "";
  age: string;
  schoolName: string;
  nationality: string;
  address: string;
}

const EMPTY: FormData = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  highSchoolType: "",
  graduationYear: "",
  certification: "",
  fieldsOfInterest: [],
  budgetBucket: "",
  age: "",
  schoolName: "",
  nationality: "",
  address: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
type Errors = Partial<Record<keyof FormData, string>>;

export function RegisterWizard() {
  const { m, locale } = useIntl();
  const { refresh } = useSession();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [doneName, setDoneName] = useState<string | null>(null);

  const stepLabels = [
    m.auth.steps.account,
    m.auth.steps.academic,
    m.auth.steps.interests,
    m.auth.steps.details,
    m.auth.steps.review,
  ];
  const TOTAL = stepLabels.length;

  const years = useMemo(
    () => Array.from({ length: GRAD_YEAR_MAX - GRAD_YEAR_MIN + 1 }, (_, i) => GRAD_YEAR_MIN + i),
    [],
  );

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setData((d) => ({ ...d, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function setFields(ids: FieldOfStudyId[]) {
    setData((d) => ({ ...d, fieldsOfInterest: ids }));
    setErrors((e) => (e.fieldsOfInterest ? { ...e, fieldsOfInterest: undefined } : e));
  }

  function validate(s: number): Errors {
    const e: Errors = {};
    const E = m.auth.errors;
    if (s === 0) {
      if (data.fullName.trim().length < 2) e.fullName = E.fullName;
      if (!EMAIL_RE.test(data.email.trim())) e.email = E.email;
      if (!EG_PHONE.test(data.phone.trim())) e.phone = E.phone;
      if (data.password.length < PASSWORD_MIN || !/[A-Za-z]/.test(data.password) || !/\d/.test(data.password))
        e.password = E.password;
      if (data.confirmPassword !== data.password) e.confirmPassword = E.confirm;
    } else if (s === 1) {
      if (!data.highSchoolType) e.highSchoolType = E.highSchoolType;
      if (!data.graduationYear) e.graduationYear = E.graduationYear;
      if (!data.certification) e.certification = E.certification;
    } else if (s === 2) {
      if (data.fieldsOfInterest.length < 1 || data.fieldsOfInterest.length > 3) e.fieldsOfInterest = E.fields;
      if (!data.budgetBucket) e.budgetBucket = E.budget;
    } else if (s === 3) {
      if (data.age && (Number(data.age) < 14 || Number(data.age) > 80)) e.age = E.age;
    }
    return e;
  }

  function next() {
    const e = validate(step);
    setErrors(e);
    if (Object.keys(e).length === 0) setStep((s) => Math.min(s + 1, TOTAL - 1));
  }
  function back() {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  }

  async function submit() {
    setServerError("");
    // validate all steps
    for (let s = 0; s <= 3; s++) {
      const e = validate(s);
      if (Object.keys(e).length) {
        setErrors(e);
        setStep(s);
        return;
      }
    }
    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        fullName: data.fullName.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        password: data.password,
        highSchoolType: data.highSchoolType,
        graduationYear: Number(data.graduationYear),
        certification: data.certification,
        fieldsOfInterest: data.fieldsOfInterest,
        budgetBucket: data.budgetBucket,
      };
      if (data.age) payload.age = Number(data.age);
      if (data.schoolName.trim()) payload.schoolName = data.schoolName.trim();
      if (data.nationality.trim()) payload.nationality = data.nationality.trim();
      if (data.address.trim()) payload.address = data.address.trim();

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (res.status === 201) {
        const result = await signIn("credentials", {
          email: data.email.trim(),
          password: data.password,
          redirect: false,
        });
        if (!result || result.error) {
          setServerError(m.auth.errors.loginFailed);
          return;
        }
        await refresh();
        setDoneName(json.user?.fullName ?? data.fullName.trim());
        return;
      }
      if (res.status === 409) {
        setErrors({ email: m.auth.errors.emailTaken });
        setStep(0);
        return;
      }
      setServerError(m.auth.errors.generic);
    } catch {
      setServerError(m.auth.errors.generic);
    } finally {
      setSubmitting(false);
    }
  }

  if (doneName) return <SuccessCard name={doneName} />;

  return (
    <div>
      <Stepper labels={stepLabels} current={step} />

      <div className="mt-6">
        <h1 className="font-head text-2xl font-bold text-ink">{m.auth.registerTitle}</h1>
        <p className="mt-1 text-sm text-muted">{m.auth.registerSubtitle}</p>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {/* Step 0 — Account */}
        {step === 0 && (
          <>
            <TextField
              label={m.auth.fullName}
              value={data.fullName}
              onChange={(v) => set("fullName", v)}
              placeholder={m.auth.fullNamePlaceholder}
              autoComplete="name"
              required
              error={errors.fullName}
            />
            <TextField
              label={m.auth.email}
              type="email"
              value={data.email}
              onChange={(v) => set("email", v)}
              placeholder={m.auth.emailPlaceholder}
              autoComplete="email"
              inputMode="email"
              required
              error={errors.email}
            />
            <TextField
              label={m.auth.phone}
              type="tel"
              value={data.phone}
              onChange={(v) => set("phone", v)}
              placeholder={m.auth.phonePlaceholder}
              autoComplete="tel"
              inputMode="tel"
              required
              error={errors.phone}
            />
            <PasswordField
              label={m.auth.password}
              value={data.password}
              onChange={(v) => set("password", v)}
              placeholder={m.auth.passwordPlaceholder}
              hint={m.auth.passwordHint}
              autoComplete="new-password"
              error={errors.password}
            />
            <PasswordField
              label={m.auth.confirmPassword}
              value={data.confirmPassword}
              onChange={(v) => set("confirmPassword", v)}
              placeholder={m.auth.confirmPlaceholder}
              autoComplete="new-password"
              error={errors.confirmPassword}
            />
          </>
        )}

        {/* Step 1 — Academic */}
        {step === 1 && (
          <>
            <Field label={m.auth.highSchoolType} required error={errors.highSchoolType}>
              <ChoiceGroup
                options={HIGH_SCHOOL_TYPES}
                selected={data.highSchoolType ? [data.highSchoolType] : []}
                onToggle={(id) => set("highSchoolType", id)}
                columns={2}
              />
            </Field>
            <Select
              label={m.auth.graduationYear}
              value={data.graduationYear}
              onChange={(v) => set("graduationYear", v)}
              options={years.map((y) => ({ value: String(y), label: formatYear(y, locale) }))}
              placeholder="—"
              required
              error={errors.graduationYear}
            />
            <Field label={m.auth.certification} required error={errors.certification}>
              <ChoiceGroup
                options={CERTIFICATIONS}
                selected={data.certification ? [data.certification] : []}
                onToggle={(id) => set("certification", id)}
                columns={2}
              />
            </Field>
          </>
        )}

        {/* Step 2 — Interests & budget */}
        {step === 2 && (
          <>
            <Field
              label={m.auth.fieldsOfInterest}
              required
              hint={m.auth.fieldsHint}
              error={errors.fieldsOfInterest}
            >
              <MultiSelect
                options={FIELDS.map((f) => ({ id: f.id, label: f.name }))}
                value={data.fieldsOfInterest}
                onChange={setFields}
                max={3}
                placeholder={m.auth.fieldsSearchPlaceholder}
                invalid={!!errors.fieldsOfInterest}
              />
            </Field>
            <Field label={m.auth.budget} required hint={m.auth.budgetHint} error={errors.budgetBucket}>
              <ChoiceGroup
                options={FEE_BUCKETS.map((b) => ({ id: b.id, label: b.label }))}
                selected={data.budgetBucket ? [data.budgetBucket] : []}
                onToggle={(id) => set("budgetBucket", id)}
                columns={1}
              />
            </Field>
          </>
        )}

        {/* Step 3 — Optional details */}
        {step === 3 && (
          <>
            <div className="rounded-[10px] bg-brand-50 p-3 text-sm text-muted">{m.auth.detailsSubtitle}</div>
            <TextField
              label={m.auth.age}
              type="number"
              value={data.age}
              onChange={(v) => {
                if (v === "") {
                  set("age", "");
                  return;
                }
                if (!/^\d+$/.test(v)) return;
                set("age", v);
              }}
              inputMode="numeric"
              optional
              error={errors.age}
            />
            <TextField
              label={m.auth.schoolName}
              value={data.schoolName}
              onChange={(v) => set("schoolName", v)}
              optional
            />
            <TextField
              label={m.auth.nationality}
              value={data.nationality}
              onChange={(v) => set("nationality", v)}
              optional
            />
            <TextField
              label={m.auth.address}
              value={data.address}
              onChange={(v) => set("address", v)}
              optional
            />
          </>
        )}

        {/* Step 4 — Review */}
        {step === 4 && (
          <div className="flex flex-col gap-3">
            <ReviewRow label={m.auth.fullName} value={data.fullName} onEdit={() => setStep(0)} m={m} />
            <ReviewRow label={m.auth.email} value={data.email} onEdit={() => setStep(0)} m={m} />
            <ReviewRow label={m.auth.phone} value={data.phone} onEdit={() => setStep(0)} m={m} />
            <ReviewRow
              label={m.auth.highSchoolType}
              value={data.highSchoolType ? pick(HIGH_SCHOOL_TYPES.find((h) => h.id === data.highSchoolType)!.label, locale) : ""}
              onEdit={() => setStep(1)}
              m={m}
            />
            <ReviewRow label={m.auth.graduationYear} value={data.graduationYear} onEdit={() => setStep(1)} m={m} />
            <ReviewRow
              label={m.auth.certification}
              value={data.certification ? pick(CERTIFICATIONS.find((c) => c.id === data.certification)!.label, locale) : ""}
              onEdit={() => setStep(1)}
              m={m}
            />
            <ReviewRow
              label={m.auth.fieldsOfInterest}
              value={data.fieldsOfInterest.map((f) => pick(getField(f).name, locale)).join("، ")}
              onEdit={() => setStep(2)}
              m={m}
            />
            <ReviewRow
              label={m.auth.budget}
              value={data.budgetBucket ? pick(getFeeBucket(data.budgetBucket)!.label, locale) : ""}
              onEdit={() => setStep(2)}
              m={m}
            />
            {(data.age || data.schoolName || data.nationality || data.address) && (
              <ReviewRow
                label={m.auth.steps.details}
                value={[data.age, data.schoolName, data.nationality, data.address].filter(Boolean).join(" · ")}
                onEdit={() => setStep(3)}
                m={m}
              />
            )}
            <p className="mt-2 text-xs text-muted">{m.auth.agree}</p>
          </div>
        )}

        {serverError && (
          <div className="rounded-[10px] border border-accent/30 bg-accent/5 p-3 text-sm font-medium text-accent">
            {serverError}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center gap-3">
        {step > 0 && (
          <Button variant="secondary" onClick={back} disabled={submitting}>
            <ArrowLeft className="size-4 rtl:rotate-180" /> {m.auth.back}
          </Button>
        )}
        {step < TOTAL - 1 ? (
          <Button className="flex-1" onClick={next}>
            {m.auth.next} <ArrowRight className="size-4 rtl:rotate-180" />
          </Button>
        ) : (
          <Button className="flex-1" onClick={submit} disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" /> {m.auth.creating}
              </>
            ) : (
              <>
                <Check className="size-4" /> {m.auth.createAccount}
              </>
            )}
          </Button>
        )}
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        {m.auth.haveAccount}{" "}
        <LocaleLink href="/login" className="font-medium text-brand hover:underline">
          {m.auth.signInLink}
        </LocaleLink>
      </p>
    </div>
  );
}

function Stepper({ labels, current }: { labels: string[]; current: number }) {
  const { m } = useIntl();
  const pct = ((current + 1) / labels.length) * 100;
  return (
    <div>
      <div className="flex items-center justify-between text-xs font-medium">
        <span className="text-brand">
          {m.auth.stepOf.replace("{current}", String(current + 1)).replace("{total}", String(labels.length))}
        </span>
        <span className="text-muted">{labels[current]}</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
        <div className="h-full rounded-full bg-brand transition-all duration-300" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function ReviewRow({
  label,
  value,
  onEdit,
  m,
}: {
  label: string;
  value: string;
  onEdit: () => void;
  m: ReturnType<typeof useIntl>["m"];
}) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-[10px] border border-line bg-surface px-3.5 py-2.5">
      <div className="min-w-0">
        <p className="text-xs text-muted">{label}</p>
        <p className="truncate text-sm font-medium text-ink">{value || m.auth.notProvided}</p>
      </div>
      <button type="button" onClick={onEdit} className="shrink-0 text-xs font-medium text-brand hover:underline">
        {m.auth.edit}
      </button>
    </div>
  );
}

function SuccessCard({ name }: { name: string }) {
  const { m } = useIntl();
  return (
    <div className="flex flex-col items-center rounded-card border border-line bg-surface p-8 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-brand-50 text-brand">
        <PartyPopper className="size-8" />
      </span>
      <h1 className="mt-5 font-head text-2xl font-bold text-ink">
        {m.auth.successTitle.replace("{name}", name)}
      </h1>
      <p className="mt-2 max-w-sm text-sm text-muted">{m.auth.successSubtitle}</p>
      <div className="mt-6 flex w-full flex-col gap-2 sm:flex-row">
        <LocaleLink href="/search" className={buttonClasses("primary", "md", "flex-1")}>
          {m.auth.exploreMatches}
        </LocaleLink>
        <LocaleLink href="/map" className={buttonClasses("secondary", "md", "flex-1")}>
          {m.auth.browseAll}
        </LocaleLink>
      </div>
    </div>
  );
}
