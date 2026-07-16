import { getTranslations } from "next-intl/server";
import { ArrowRight, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";

interface University {
  name: string;
  location: string;
  description: string;
}

export async function PartnerLogos() {
  const t = await getTranslations("Home.partners");
  const countries = t.raw("countries") as {
    name: string;
    universities: University[];
  }[];

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <Badge variant="secondary" className="mx-auto">
          {t("eyebrow")}
        </Badge>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground">
          {t("title")}
        </h2>
        <p className="mt-3 text-muted-foreground">{t("subtitle")}</p>
      </div>

      <Tabs defaultValue={countries[0]?.name} className="mt-10">
        <TabsList className="mx-auto flex w-fit flex-wrap justify-center">
          {countries.map((country) => (
            <TabsTab key={country.name} value={country.name}>
              {country.name}
            </TabsTab>
          ))}
        </TabsList>

        {countries.map((country) => (
          <TabsPanel key={country.name} value={country.name} className="mt-8">
            <div className="grid gap-4 sm:grid-cols-3">
              {country.universities.map((university) => (
                <Card key={university.name}>
                  <CardContent className="space-y-2">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-brand-blue-light text-brand-blue">
                      <Building2 className="size-4" />
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      {university.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {university.location}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {university.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Link
              href="/universities"
              className="mt-6 flex items-center justify-center gap-1.5 text-sm font-medium text-brand-blue hover:underline"
            >
              {t("exploreLabel", { country: country.name })}
              <ArrowRight className="size-4 rtl:rotate-180" />
            </Link>
          </TabsPanel>
        ))}
      </Tabs>
    </section>
  );
}
