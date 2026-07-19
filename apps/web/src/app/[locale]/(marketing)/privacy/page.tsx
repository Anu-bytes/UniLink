import { getTranslations } from "next-intl/server";
import { SimplePageHero } from "@/components/simple-page-hero";

export default async function PrivacyPage() {
  const t = await getTranslations("Privacy");
  return <SimplePageHero title={t("title")} subtitle={t("subtitle")} />;
}
