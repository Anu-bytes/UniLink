import { getTranslations } from "next-intl/server";
import { SimplePageHero } from "@/components/simple-page-hero";

export default async function AboutPage() {
  const t = await getTranslations("About");
  return <SimplePageHero title={t("title")} subtitle={t("subtitle")} />;
}
