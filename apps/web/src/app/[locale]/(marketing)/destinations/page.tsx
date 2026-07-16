import { getTranslations } from "next-intl/server";
import { SimplePageHero } from "@/components/simple-page-hero";

export default async function DestinationsPage() {
  const t = await getTranslations("Destinations");
  return <SimplePageHero title={t("title")} subtitle={t("subtitle")} />;
}
