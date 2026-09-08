"use client";

import { signIn } from "next-auth/react";
import { useLocale } from "next-intl";

import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/social-icons";

export function SocialAuthButtons({
  googleLabel,
  callbackUrl,
}: {
  googleLabel: string;
  /** Where the auth gate wanted to send the visitor before it redirected
   * here, same prop as LoginForm's. */
  callbackUrl?: string;
}) {
  const locale = useLocale();
  // Same reasoning as LoginForm's fallback: bare "/" re-negotiates its own
  // locale (defaulting to Arabic) instead of returning to the one the user
  // was already on.
  const target =
    callbackUrl && callbackUrl.startsWith("/") && !callbackUrl.startsWith("//")
      ? callbackUrl
      : `/${locale}`;

  return (
    <div className="grid gap-2">
      <Button
        type="button"
        variant="outline"
        className="gap-2"
        onClick={() => signIn("google", { callbackUrl: target })}
      >
        <GoogleIcon />
        {googleLabel}
      </Button>
    </div>
  );
}
