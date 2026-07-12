"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogIn } from "lucide-react";
import { useIntl } from "@/i18n/provider";
import { useSession } from "./session";
import { LocaleLink } from "@/components/LocaleLink";
import { Button } from "@/components/ui/Button";
import { TextField, PasswordField } from "./fields";

export function LoginForm() {
  const { m, locale } = useIntl();
  const router = useRouter();
  const { refresh } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [note, setNote] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      if (res.ok) {
        await refresh();
        router.push(`/${locale}`);
        return;
      }
      setError(m.auth.errors.loginFailed);
    } catch {
      setError(m.auth.errors.generic);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="font-head text-2xl font-bold text-ink">{m.auth.signInTitle}</h1>
      <p className="mt-1 text-sm text-muted">{m.auth.signInSubtitle}</p>

      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
        <TextField
          label={m.auth.email}
          type="email"
          value={email}
          onChange={setEmail}
          placeholder={m.auth.emailPlaceholder}
          autoComplete="email"
          inputMode="email"
          required
        />
        <PasswordField
          label={m.auth.password}
          value={password}
          onChange={setPassword}
          placeholder={m.auth.passwordPlaceholder}
          autoComplete="current-password"
        />

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setNote(true)}
            className="text-sm font-medium text-brand hover:underline"
          >
            {m.auth.forgotPassword}
          </button>
        </div>
        {note && <p className="-mt-2 text-end text-xs text-muted">{m.common.comingSoon}</p>}

        {error && (
          <div className="rounded-[10px] border border-accent/30 bg-accent/5 p-3 text-sm font-medium text-accent">
            {error}
          </div>
        )}

        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" /> {m.auth.signingIn}
            </>
          ) : (
            <>
              <LogIn className="size-4" /> {m.auth.signIn}
            </>
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        {m.auth.noAccount}{" "}
        <LocaleLink href="/register" className="font-medium text-brand hover:underline">
          {m.auth.registerLink}
        </LocaleLink>
      </p>
    </div>
  );
}
