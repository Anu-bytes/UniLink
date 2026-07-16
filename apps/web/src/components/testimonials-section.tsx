import { getTranslations } from "next-intl/server";
import { Quote } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export async function TestimonialsSection() {
  const t = await getTranslations("Home.testimonials");
  const items = t.raw("items") as {
    headline: string;
    quote: string;
    name: string;
    meta: string;
  }[];

  return (
    <section className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mx-auto">
            {t("eyebrow")}
          </Badge>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground">
            {t("title")}
          </h2>
          <p className="mt-3 text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {items.map((item) => (
            <Card key={item.name}>
              <CardContent className="space-y-4">
                <Quote className="size-6 text-brand-blue" />
                <p className="font-semibold text-foreground">
                  {item.headline}
                </p>
                <p className="text-sm text-muted-foreground">{item.quote}</p>
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-full bg-brand-blue-light text-xs font-semibold text-brand-blue-dark">
                    {getInitials(item.name)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.meta}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
