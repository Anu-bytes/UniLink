import { getTranslations } from "next-intl/server";
import { SimplePageHero } from "@/components/simple-page-hero";

export default async function UniversitiesPage() {
  const t = await getTranslations("Universities");
  return <SimplePageHero title={t("title")} subtitle={t("subtitle")} />;
}
