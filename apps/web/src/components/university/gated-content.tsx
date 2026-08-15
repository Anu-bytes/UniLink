import { Lock } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

/**
 * Blurs a tab's content behind a login/register prompt for signed-out
 * visitors. Admission requirements, criteria, minimum scores and tuition
 * fees are only shown to students who create an account.
 */
export async function GatedContent({
  callbackUrl,
  children,
}: {
  callbackUrl: string;
  children: React.ReactNode;
}) {
  const t = await getTranslations("UniversityDetail.gated");

  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none min-h-[220px] select-none blur-sm"
      >
        {children}
      </div>

      <div className="absolute inset-0 flex items-center justify-center bg-white/50 p-4">
        <div className="flex max-w-sm flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-8 text-center shadow-xl">
          <span className="flex size-11 items-center justify-center rounded-full bg-[#EEF3FF] text-[#1E6DEB]">
            <Lock className="size-5" aria-hidden />
          </span>
          <h3 className="text-base font-bold text-[#1F2A44]">{t("title")}</h3>
          <p className="text-sm leading-6 text-[#5a6072]">{t("body")}</p>
          <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
            <Link
              href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#1E6DEB] px-5 text-sm font-semibold text-[#1E6DEB] transition-colors hover:bg-[#1E6DEB]/5"
            >
              {t("login")}
            </Link>
            <Link
              href="/onboarding"
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#1E6DEB] px-5 text-sm font-bold text-white transition-colors hover:bg-[#1859c4]"
            >
              {t("register")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
