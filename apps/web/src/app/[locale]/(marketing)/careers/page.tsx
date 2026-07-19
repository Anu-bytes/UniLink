import { getTranslations } from "next-intl/server";
import { SimplePageHero } from "@/components/simple-page-hero";

export default async function CareersPage() {
  const t = await getTranslations("Careers");
  return <SimplePageHero title={t("title")} subtitle={t("subtitle")} />;
}
