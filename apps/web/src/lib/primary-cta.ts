import { getTranslations } from "next-intl/server";

import { auth } from "@/auth";

/**
 * Resolves the marketing site's primary call to action.
 *
 * Signed out it invites the visitor to register. Once they have an account,
 * "Register as a Student" is a dead end, so it becomes a route into the
 * program search instead.
 *
 * Returns href and label rather than rendering a link, so each call site keeps
 * its own markup: the homepage CTA wraps icons and animated layers around the
 * label that a shared component would flatten.
 */
export async function getPrimaryCta(signedOutLabel: string): Promise<{
  href: string;
  label: string;
  signedIn: boolean;
}> {
  const session = await auth();

  if (!session?.user) {
    return { href: "/onboarding", label: signedOutLabel, signedIn: false };
  }

  const t = await getTranslations("Nav");
  return { href: "/app/search", label: t("searchPrograms"), signedIn: true };
}
