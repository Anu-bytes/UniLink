"use client"

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PasswordRequirements } from "@/components/password-requirements";
import { Separator } from "@/components/ui/separator";
import { SocialAuthButtons } from "@/components/social-auth-buttons";

export function SignupForm({
  labels,
  termsContent,
}: {
  labels: {
    google: string;
    orContinueWith: string;
    termsRequired: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    submit: string;
    requirements: {
      minLength: string;
      lowercase: string;
      uppercase: string;
      number: string;
    };
  };
  termsContent: React.ReactNode;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // Mandatory for both ways of signing up; checked again by /api/register.
  const [accepted, setAccepted] = useState(false);
  const [termsError, setTermsError] = useState(false);

  function requireTerms() {
    if (accepted) return true;
    setTermsError(true);
    document.getElementById("signup-terms")?.focus();
    return false;
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!requireTerms()) return;
    setLoading(true);

    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, acceptTerms: accepted }),
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
      };
      setError(data.error ?? "Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    // Account created — sign the user straight in.
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (!result || result.error) {
      setError("Account created. Please log in.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit} noValidate>
      <div
        className={
          termsError
            ? "rounded-lg border border-destructive/50 bg-destructive/5 p-3"
            : "rounded-lg border border-slate-200 bg-slate-50 p-3"
        }
      >
        <label className="flex items-start gap-2.5 text-sm leading-6 text-slate-700">
          <Checkbox
            id="signup-terms"
            checked={accepted}
            onCheckedChange={(value) => {
              setAccepted(value === true);
              if (value === true) setTermsError(false);
            }}
            aria-invalid={termsError || undefined}
            aria-describedby={termsError ? "signup-terms-error" : undefined}
            className="mt-1"
          />
          <span>{termsContent}</span>
        </label>
        {termsError ? (
          <p id="signup-terms-error" className="mt-1.5 ps-7 text-sm text-destructive" role="alert">
            {labels.termsRequired}
          </p>
        ) : null}
      </div>

      <SocialAuthButtons googleLabel={labels.google} onBeforeSignIn={requireTerms} />

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">{labels.orContinueWith}</span>
        <Separator className="flex-1" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="signup-email">{labels.emailLabel}</Label>
        <Input
          id="signup-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder={labels.emailPlaceholder}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="signup-password">{labels.passwordLabel}</Label>
        <Input
          id="signup-password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          placeholder={labels.passwordPlaceholder}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <PasswordRequirements password={password} labels={labels.requirements} />
      </div>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-brand-red text-white hover:bg-brand-red-dark"
      >
        {labels.submit}
      </Button>
    </form>
  );
}
