import { getTranslations } from "next-intl/server";
import { SimplePageHero } from "@/components/simple-page-hero";

export default async function PartnersPage() {
  const t = await getTranslations("Partners");
  return <SimplePageHero title={t("title")} subtitle={t("subtitle")} />;
}
