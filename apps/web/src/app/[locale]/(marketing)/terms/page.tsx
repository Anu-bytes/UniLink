import { getTranslations } from "next-intl/server";
import { SimplePageHero } from "@/components/simple-page-hero";

export default async function TermsPage() {
  const t = await getTranslations("Terms");
  return <SimplePageHero title={t("title")} subtitle={t("subtitle")} />;
}
