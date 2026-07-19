import { getTranslations } from "next-intl/server";
import { SimplePageHero } from "@/components/simple-page-hero";

export default async function ContactPage() {
  const t = await getTranslations("Contact");
  return <SimplePageHero title={t("title")} subtitle={t("subtitle")} />;
}
