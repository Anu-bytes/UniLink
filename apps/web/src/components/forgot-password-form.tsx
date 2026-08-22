"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, CheckCircle2, Eye, EyeOff, Loader2, MailCheck } from "lucide-react";

import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OtpInput } from "@/components/otp-input";
import { cn } from "@/lib/utils";

type Step = "email" | "code" | "password" | "done";

/** Seconds before "Send again" becomes available. Matches the server's window. */
const RESEND_COOLDOWN_S = 60;

export type ForgotPasswordLabels = {
  emailStepTitle: string;
  emailStepSubtitle: string;
  emailLabel: string;
  emailPlaceholder: string;
  sendCode: string;
  codeStepTitle: string;
  codeStepSubtitle: string;
  codeLabel: string;
  verify: string;
  resend: string;
  resendIn: string;
  changeEmail: string;
  passwordStepTitle: string;
  passwordStepSubtitle: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  confirmLabel: string;
  confirmPlaceholder: string;
  showPassword: string;
  hidePassword: string;
  savePassword: string;
  mismatch: string;
  requirements: {
    minLength: string;
    lowercase: string;
    uppercase: string;
    number: string;
  };
  doneTitle: string;
  doneSubtitle: string;
  goToLogin: string;
  backToLogin: string;
  genericError: string;
};

/**
 * Three steps behind one card: ask for the address, take the six-digit code,
 * then set the password.
 *
 * The step-2 exchange returns an opaque ticket which step 3 must present, so
 * the client cannot skip the code by jumping straight to the last request.
 */
export function ForgotPasswordForm({ labels }: { labels: ForgotPasswordLabels }) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [ticket, setTicket] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Guards the auto-submit in OtpInput's onComplete: without it, a re-render
  // while the request is in flight can fire a second verify for the same code
  // and burn an attempt.
  const verifying = useRef(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((n) => n - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  async function post(path: string, body: unknown) {
    const response = await fetch(`/api/auth/password-reset/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(
        typeof data?.error === "string" ? data.error : labels.genericError,
      );
    }
    return data;
  }

  async function requestCode(event?: React.FormEvent) {
    event?.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await post("request", { email });
      setCode("");
      setStep("code");
      setCooldown(RESEND_COOLDOWN_S);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : labels.genericError);
    } finally {
      setLoading(false);
    }
  }

  async function verifyCode(submitted?: string) {
    const value = submitted ?? code;
    if (value.length !== 6 || verifying.current) return;

    verifying.current = true;
    setError(null);
    setLoading(true);
    try {
      const data = await post("verify", { email, code: value });
      setTicket(data.ticket);
      setStep("password");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : labels.genericError);
      setCode("");
    } finally {
      setLoading(false);
      verifying.current = false;
    }
  }

  async function savePassword(event: React.FormEvent) {
    event.preventDefault();
    if (password !== confirm) {
      setError(labels.mismatch);
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await post("confirm", { email, ticket, password });
      setStep("done");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : labels.genericError);
    } finally {
      setLoading(false);
    }
  }

  const checks = [
    { key: "minLength", ok: password.length >= 10, text: labels.requirements.minLength },
    { key: "lowercase", ok: /[a-z]/.test(password), text: labels.requirements.lowercase },
    { key: "uppercase", ok: /[A-Z]/.test(password), text: labels.requirements.uppercase },
    { key: "number", ok: /[0-9]/.test(password), text: labels.requirements.number },
  ];
  const passwordOk = checks.every((check) => check.ok);

  return (
    <div className="w-full max-w-md rounded-3xl bg-card p-8 shadow-xl ring-1 ring-border/50 sm:p-10">
      {step === "email" ? (
        <form onSubmit={requestCode} className="space-y-5">
          <Header title={labels.emailStepTitle} subtitle={labels.emailStepSubtitle} />

          <div className="space-y-1.5">
            <Label htmlFor="reset-email">{labels.emailLabel}</Label>
            <Input
              id="reset-email"
              type="email"
              name="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={labels.emailPlaceholder}
            />
          </div>

          <ErrorNote message={error} />

          <Button type="submit" className="w-full" disabled={loading || !email}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : null}
            {labels.sendCode}
          </Button>

          <BackLink label={labels.backToLogin} />
        </form>
      ) : null}

      {step === "code" ? (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void verifyCode();
          }}
          className="space-y-5"
        >
          <Header
            icon={<MailCheck className="size-6" />}
            title={labels.codeStepTitle}
            // The address is echoed so a typo is obvious before the user waits
            // on an email that will never arrive.
            subtitle={labels.codeStepSubtitle.replace("{email}", email)}
          />

          <OtpInput
            label={labels.codeLabel}
            value={code}
            onChange={setCode}
            onComplete={(value) => void verifyCode(value)}
            disabled={loading}
            invalid={error != null}
          />

          <ErrorNote message={error} />

          <Button
            type="submit"
            className="w-full"
            disabled={loading || code.length !== 6}
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : null}
            {labels.verify}
          </Button>

          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={() => {
                setStep("email");
                setError(null);
                setCode("");
              }}
              className="text-muted-foreground hover:underline"
            >
              {labels.changeEmail}
            </button>

            <button
              type="button"
              disabled={cooldown > 0 || loading}
              onClick={() => void requestCode()}
              className="font-medium text-brand-blue hover:underline disabled:text-muted-foreground disabled:no-underline"
            >
              {cooldown > 0
                ? labels.resendIn.replace("{seconds}", String(cooldown))
                : labels.resend}
            </button>
          </div>
        </form>
      ) : null}

      {step === "password" ? (
        <form onSubmit={savePassword} className="space-y-5">
          <Header
            title={labels.passwordStepTitle}
            subtitle={labels.passwordStepSubtitle}
          />

          <div className="space-y-1.5">
            <Label htmlFor="reset-password">{labels.passwordLabel}</Label>
            <div className="relative">
              <Input
                id="reset-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={labels.passwordPlaceholder}
                className="pe-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((shown) => !shown)}
                aria-label={showPassword ? labels.hidePassword : labels.showPassword}
                className="absolute inset-y-0 end-0 flex items-center px-3 text-muted-foreground"
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </div>

          <ul className="space-y-1.5">
            {checks.map((check) => (
              <li
                key={check.key}
                className={cn(
                  "flex items-center gap-2 text-sm transition-colors",
                  check.ok ? "text-emerald-600" : "text-muted-foreground",
                )}
              >
                <CheckCircle2
                  className={cn("size-4", check.ok ? "opacity-100" : "opacity-40")}
                />
                {check.text}
              </li>
            ))}
          </ul>

          <div className="space-y-1.5">
            <Label htmlFor="reset-confirm">{labels.confirmLabel}</Label>
            <Input
              id="reset-confirm"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
              placeholder={labels.confirmPlaceholder}
            />
          </div>

          <ErrorNote message={error} />

          <Button
            type="submit"
            className="w-full"
            disabled={loading || !passwordOk || !confirm}
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : null}
            {labels.savePassword}
          </Button>
        </form>
      ) : null}

      {step === "done" ? (
        <div className="space-y-5 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="size-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{labels.doneTitle}</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {labels.doneSubtitle}
            </p>
          </div>
          <Button className="w-full" onClick={() => router.push("/login")}>
            {labels.goToLogin}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function Header({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      {icon ? (
        <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-brand-blue-light text-brand-blue">
          {icon}
        </div>
      ) : null}
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function ErrorNote({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
    >
      {message}
    </p>
  );
}

function BackLink({ label }: { label: string }) {
  return (
    <Link
      href="/login"
      className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:underline"
    >
      <ArrowLeft className="size-3.5 rtl:rotate-180" />
      {label}
    </Link>
  );
}
