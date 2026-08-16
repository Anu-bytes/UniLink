import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { WizardProvider } from "@/components/onboarding/wizard-context";
import { Wizard } from "@/components/onboarding/wizard";

export default async function OnboardingPage() {
  const t = await getTranslations("Onboarding");

  return (
    <>
      {/* Full-page Egypt-landmarks background (onboarding only). Fixed so it
          covers the whole viewport behind the header and the form card. A
          dark scrim sits on top so the logo stays legible against the sky
          and the white card reads as intentional, not just pasted on. */}
      <div aria-hidden className="fixed inset-0 -z-10">
        <Image
          src="/images/onboarding-bg.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-bottom"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/20 to-black/45" />
      </div>

      <div className="w-full max-w-4xl">
        {/* The wizard's own back arrow only steps between questions (it does
            nothing on step 1), so leaving the flow entirely needs its own,
            clearly separate exit. */}
        <Link
          href="/"
          className="mb-4 inline-flex min-h-11 items-center gap-2 rounded-full border border-[#CFE0FB] bg-white/90 px-4 py-1.5 text-sm font-semibold text-[#1E6DEB] shadow-sm backdrop-blur-sm transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
        >
          <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden />
          {t("backToHome")}
        </Link>

        <div className="relative rounded-3xl bg-card p-6 shadow-xl ring-1 ring-border/50 duration-500 animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 motion-reduce:animate-none sm:p-10">
          <WizardProvider>
            <Wizard />
          </WizardProvider>
        </div>
      </div>
    </>
  );
}
