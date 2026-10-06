import { getTranslations } from "next-intl/server";

import { auth } from "@/auth";
import { BottomNav, type BottomNavItem } from "@/components/bottom-nav";

/** Server half of the phone tab bar: resolves labels and where each tab goes
 * for a signed-in visitor versus a guest. */
export async function SiteBottomNav() {
  const t = await getTranslations("Nav.bottom");
  const session = await auth();
  const signedIn = Boolean(session?.user?.id);

  const loginFor = (path: string) => `/login?callbackUrl=${encodeURIComponent(path)}`;

  const items: BottomNavItem[] = [
    { key: "home", href: "/", match: ["/"], label: t("home") },
    { key: "universities", href: "/universities", match: ["/universities"], label: t("universities") },
    {
      key: "search",
      // Guests are sent to register first, the same as the hero's main CTA.
      href: signedIn ? "/app/search" : "/onboarding",
      match: ["/app/search", "/app/faculties", "/app/compare"],
      label: t("search"),
    },
    {
      key: "saved",
      href: signedIn ? "/app/saved" : loginFor("/app/saved"),
      match: ["/app/saved"],
      label: t("saved"),
    },
    {
      key: "account",
      href: signedIn ? "/app" : "/login",
      match: signedIn
        ? ["/app", "/app/profile", "/app/applications"]
        : ["/login", "/signup", "/forgot-password"],
      label: t("account"),
    },
  ];

  return <BottomNav items={items} label={t("label")} />;
}
