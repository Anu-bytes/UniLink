"use client"

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PasswordRequirements } from "@/components/password-requirements";

export function SignupForm({
  labels,
  termsContent,
}: {
  labels: {
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

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
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
    <form className="space-y-4" onSubmit={onSubmit}>
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

      <label className="flex items-start gap-2 text-sm text-muted-foreground">
        <Checkbox name="terms" required className="mt-0.5" />
        <span>{termsContent}</span>
      </label>

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
