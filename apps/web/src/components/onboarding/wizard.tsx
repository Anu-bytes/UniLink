"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";

import { cn } from "@/lib/utils";
import { useRouter } from "@/i18n/navigation";
import { WIZARD_STEPS, TOTAL_STEPS } from "@/lib/onboarding-schema";
import { useWizard } from "./wizard-context";
import { WizardProgress } from "./wizard-progress";
import { FindingMatches } from "./finding-matches";
import { STEP_COMPONENTS, AccountStep } from "./steps";

type Phase = "form" | "submitting" | "done";

export function Wizard() {
  const t = useTranslations("Onboarding");
  const router = useRouter();
  const { step, data, hydrated, back, goTo, reset } = useWizard();

  const [phase, setPhase] = useState<Phase>("form");
  const [error, setError] = useState<string | null>(null);

  // Avoid rendering step content until sessionStorage has been read, so a
  // mid-wizard refresh doesn't flash step 1.
  if (!hydrated) {
    return <div className="min-h-[420px]" aria-hidden />;
  }

  async function handleFinish(account: { email: string; password: string }) {
    setError(null);
    setPhase("submitting");

    const { email, password, acceptTerms: _t, ...profile } = {
      ...data,
      ...account,
    };
    void _t;

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, profile }),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        setError(body.error ?? t("account.genericError"));
        setPhase("form");
        return;
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!result || result.error) {
        // Account exists but sign-in failed — send them to login.
        setError(t("account.signInFallback"));
        setPhase("form");
        return;
      }

      setPhase("done");
    } catch {
      setError(t("account.genericError"));
      setPhase("form");
    }
  }

  function handleView() {
    reset();
    router.push("/");
    router.refresh();
  }

  if (phase === "submitting" || phase === "done") {
    return <FindingMatches ready={phase === "done"} onView={handleView} />;
  }

  const stepKey = WIZARD_STEPS[step].key;
  const isAccount = stepKey === "account";
  const StepBody = STEP_COMPONENTS[step];

  return (
    <div className="space-y-8">
      <WizardProgress
        title={t(`${stepKey}.name`)}
        step={step + 1}
        total={TOTAL_STEPS}
        onBack={back}
        backLabel={t("back")}
        onStepSelect={goTo}
        stepAriaLabel={(n) => t("goToStep", { step: n })}
      />

      <div
        key={stepKey}
        className={cn(
          "duration-300 ease-out animate-in fade-in-0 motion-reduce:animate-none",
          "slide-in-from-bottom-4",
        )}
      >
        {isAccount ? (
          <AccountStep onFinish={handleFinish} error={error} />
        ) : (
          <StepBody />
        )}
      </div>
    </div>
  );
}
