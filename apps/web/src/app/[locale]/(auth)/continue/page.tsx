import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";

import { getAdminActor } from "@/lib/admin";

export const dynamic = "force-dynamic";

/**
 * Where sign-in lands when nothing asked for a particular page: admins go
 * straight to the admin console, everyone else to the home page. An explicit
 * ?callbackUrl= (a link that required signing in) still wins in the forms.
 */
export default async function ContinueAfterSignIn() {
  const locale = await getLocale();
  const actor = await getAdminActor();
  redirect(actor ? `/${locale}/admin` : `/${locale}`);
}
