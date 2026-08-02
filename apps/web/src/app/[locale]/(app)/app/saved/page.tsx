import { Heart } from "lucide-react";
import { redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import { auth } from "@/auth";
import { Link } from "@/i18n/navigation";
import { ProgramCard } from "@/components/app/program-card";
import { getSavedPrograms } from "@/lib/program-search";

export const dynamic = "force-dynamic";

export default async function SavedPage() {
  const t = await getTranslations("Saved");
  const locale = await getLocale();
  const session = await auth();

  if (!session?.user?.id) redirect(`/${locale}/login`);

  const programs = await getSavedPrograms(locale, session.user.id);

  return (
    <div className="mx-auto max-w-[86rem] px-4 py-6 pb-32 md:px-6 md:py-8">
      <h1 className="text-2xl font-bold text-[#1F2A44] md:text-3xl">
        {t("title")}
      </h1>
      <p className="mt-1 text-sm text-[#5a6072]">{t("subtitle")}</p>

      {programs.length > 0 ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {programs.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-xl bg-[#F5F8FF] px-6 py-16 text-center">
          <Heart className="mx-auto size-8 text-[#98A0B4]" aria-hidden />
          <h2 className="mt-3 text-lg font-bold text-[#1F2A44]">
            {t("emptyTitle")}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-[#5a6072]">
            {t("emptyBody")}
          </p>
          <Link
            href="/app/search"
            className="mt-6 inline-flex min-h-12 items-center justify-center rounded-lg bg-[#1E6DEB] px-6 text-sm font-bold text-white hover:bg-[#1859c4]"
          >
            {t("browse")}
          </Link>
        </div>
      )}
    </div>
  );
}
