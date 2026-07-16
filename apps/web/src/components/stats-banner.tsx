import { getTranslations } from "next-intl/server";
import { Users, BookOpen, Building2, Globe2, Award } from "lucide-react";

const statIcons = [Users, BookOpen, Building2, Globe2, Award] as const;

export async function StatsBanner() {
  const t = await getTranslations("Home.stats");
  const items = t.raw("items") as { value: string; label: string }[];

  return (
    <section className="bg-brand-blue">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-12 text-center text-white sm:grid-cols-5">
        {items.map((item, index) => {
          const Icon = statIcons[index] ?? Users;
          return (
            <div key={item.label} className="flex flex-col items-center">
              <Icon className="mb-2 size-5 text-white/70" />
              <p className="text-2xl font-bold sm:text-3xl">{item.value}</p>
              <p className="mt-1 text-sm text-white/80">{item.label}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
