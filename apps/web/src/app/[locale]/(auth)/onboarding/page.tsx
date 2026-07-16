import { WizardProvider } from "@/components/onboarding/wizard-context";
import { Wizard } from "@/components/onboarding/wizard";

export default function OnboardingPage() {
  return (
    <div className="w-full max-w-4xl rounded-3xl bg-card p-6 shadow-xl ring-1 ring-border/50 duration-500 animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 motion-reduce:animate-none sm:p-10">
      <WizardProvider>
        <Wizard />
      </WizardProvider>
    </div>
  );
}
