import { getTranslations } from "next-intl/server";
import { SimplePageHero } from "@/components/simple-page-hero";

export default async function ProgramsPage() {
  const t = await getTranslations("Programs");
  return <SimplePageHero title={t("title")} subtitle={t("subtitle")} />;
}
