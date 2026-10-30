"use client";

import { signIn } from "next-auth/react";
import { useLocale } from "next-intl";

import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/social-icons";

export function SocialAuthButtons({
  googleLabel,
  callbackUrl,
  onBeforeSignIn,
}: {
  googleLabel: string;
  /** Return false to stop the sign-in, e.g. while the terms box is unticked. */
  onBeforeSignIn?: () => boolean;
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
      : `/${locale}/continue`;

  return (
    <div className="grid gap-2">
      <Button
        type="button"
        variant="outline"
        className="gap-2"
        onClick={() => {
          if (onBeforeSignIn && !onBeforeSignIn()) return;
          void signIn("google", { callbackUrl: target });
        }}
      >
        <GoogleIcon />
        {googleLabel}
      </Button>
    </div>
  );
}
