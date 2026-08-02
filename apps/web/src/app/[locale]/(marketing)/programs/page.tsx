import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";

// Program browsing now lives in the signed-in app, where results carry match
// scores and can be compared. The public URL is kept so old links resolve.
export default async function ProgramsPage() {
  const locale = await getLocale();
  return redirect({ href: "/app/search", locale });
}
