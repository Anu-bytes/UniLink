import Image from "next/image";

import { WizardProvider } from "@/components/onboarding/wizard-context";
import { Wizard } from "@/components/onboarding/wizard";

export default function OnboardingPage() {
  return (
    <>
      {/* Full-page Egypt-landmarks background (onboarding only). Fixed so it
          covers the whole viewport behind the header and the form card. */}
      <div aria-hidden className="fixed inset-0 -z-10">
        <Image
          src="/images/onboarding-bg.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-bottom"
        />
      </div>

      <div className="relative w-full max-w-4xl rounded-3xl bg-card/80 p-6 shadow-xl ring-1 ring-border/50 backdrop-blur-md duration-500 animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 motion-reduce:animate-none sm:p-10">
        <WizardProvider>
          <Wizard />
        </WizardProvider>
      </div>
    </>
  );
}
