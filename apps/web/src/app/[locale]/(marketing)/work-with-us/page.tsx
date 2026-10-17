import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import { auth } from "@/auth";
import { WorkWithUsForm } from "@/components/partners/work-with-us-form";
import { prisma } from "@/lib/prisma";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("WorkWithUs");
  return { title: `${t("title")} | UniLink`, description: t("subtitle") };
}

/**
 * Book a demo, or apply to represent your university on UniLink. Both land
 * in the admin console's Requests inbox. ?type=representative opens the
 * second form directly (the partners page links to each).
 */
export default async function WorkWithUsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const [{ type }, locale, t, session] = await Promise.all([searchParams, getLocale(), getTranslations("WorkWithUs"), auth()]);

  const rows = await prisma.university.findMany({
    where: { publishedAt: { not: null } },
    select: { id: true, name: true, nameAr: true },
  });
  const universities = rows
    .map((row) => ({ id: row.id, name: locale === "ar" ? (row.nameAr ?? row.name) : row.name }))
    .sort((a, b) => a.name.localeCompare(b.name, locale));

  const prefill = session?.user?.email ? { name: session.user.name ?? "", email: session.user.email } : null;

  return (
    <div className="bg-[#F7F9FE]">
      <div className="mx-auto max-w-4xl px-4 py-10 md:px-6 md:py-16">
        <header className="mb-8 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#1E6DEB]">{t("eyebrow")}</span>
          <h1 className="mt-2 text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-tight text-[#16233F]">{t("title")}</h1>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-[#5a6072]">{t("subtitle")}</p>
        </header>
        <WorkWithUsForm
          initialType={type === "representative" ? "REPRESENTATIVE" : "DEMO"}
          universities={universities}
          prefill={prefill}
        />
      </div>
    </div>
  );
}
