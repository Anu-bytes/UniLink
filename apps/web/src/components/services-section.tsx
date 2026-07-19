import { getTranslations } from "next-intl/server";
import { FileText, Home, GraduationCap, Landmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const serviceIcons = [FileText, Home, GraduationCap, Landmark] as const;

export async function ServicesSection() {
  const t = await getTranslations("Home.services");
  const items = t.raw("items") as { title: string; description: string }[];

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
        <Button
          variant="outline"
          className="mt-6"
          render={<Link href="/programs" />}
        >
          {t("cta")}
        </Button>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => {
          const Icon = serviceIcons[index] ?? FileText;
          return (
            <Card key={item.title}>
              <CardHeader>
                <div className="flex size-10 items-center justify-center rounded-lg bg-brand-red-light text-brand-red">
                  <Icon className="size-5" />
                </div>
                <CardTitle className="mt-2 text-base">{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
