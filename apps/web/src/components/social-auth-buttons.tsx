"use client";

import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/social-icons";

export function SocialAuthButtons({ googleLabel }: { googleLabel: string }) {
  return (
    <div className="grid gap-2">
      <Button
        type="button"
        variant="outline"
        className="gap-2"
        onClick={() => signIn("google", { callbackUrl: "/" })}
      >
        <GoogleIcon />
        {googleLabel}
      </Button>
    </div>
  );
}
