import { getTranslations } from "next-intl/server";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { ProgramMockup } from "@/components/program-mockup";

export async function ProgramHighlight() {
  const t = await getTranslations("Home.highlight");
  const features = t.raw("features") as string[];

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            {t("title")}
          </h2>
          <p className="mt-4 text-muted-foreground">{t("body")}</p>

          <ul className="mt-6 space-y-3">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 text-sm">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand-blue" />
                <span className="text-foreground">{feature}</span>
              </li>
            ))}
          </ul>

          <Button
            size="lg"
            className="mt-8 bg-brand-red text-white hover:bg-brand-red-dark"
            render={<Link href="/onboarding" />}
          >
            {t("cta")}
          </Button>
        </div>

        <ProgramMockup />
      </div>
    </section>
  );
}
