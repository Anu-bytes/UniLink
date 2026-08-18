"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { signIn } from "next-auth/react";

import { cn } from "@/lib/utils";
import { WIZARD_STEPS, TOTAL_STEPS } from "@/lib/onboarding-schema";
import { useWizard } from "./wizard-context";
import { WizardProgress } from "./wizard-progress";
import { FindingMatches } from "./finding-matches";
import { STEP_COMPONENTS, AccountStep } from "./steps";

type Phase = "form" | "submitting" | "done";

export function Wizard() {
  const t = useTranslations("Onboarding");
  const locale = useLocale();
  const { step, data, hydrated, back, goTo, reset } = useWizard();

  const [phase, setPhase] = useState<Phase>("form");
  const [error, setError] = useState<string | null>(null);

  // Carries the query typed into the homepage's live-preview search box (if
  // any) through the whole wizard, so finishing registration lands the
  // student straight on the results they typed for instead of a blank
  // search page. Read once on mount, not via a routing hook, so it survives
  // every step without re-triggering on navigation.
  const initialQuery = useRef<string | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    initialQuery.current = new URLSearchParams(window.location.search).get("q");
  }, []);

  // Track direction of travel so the step transition slides the right way.
  const prevStep = useRef(step);
  const forward = step >= prevStep.current;
  useEffect(() => {
    prevStep.current = step;
  }, [step]);

  // Avoid rendering step content until sessionStorage has been read, so a
  // mid-wizard refresh doesn't flash step 1.
  if (!hydrated) {
    return <div className="min-h-[420px]" aria-hidden />;
  }

  async function handleFinish(account: {
    email: string;
    phone: string;
    password: string;
  }) {
    setError(null);
    setPhase("submitting");

    const {
      email,
      phone,
      firstName,
      lastName,
      password,
      acceptTerms: _t,
      ...profile
    } = {
      ...data,
      ...account,
    };
    void _t;

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          phone,
          firstName,
          lastName,
          password,
          profile,
        }),
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
    // The button offers to show the matched programs, so send the student to
    // the search surface rather than the marketing homepage.
    //
    // A full page load rather than a client transition: the session cookie was
    // only just set by signIn, and /app is gated on that cookie in the proxy.
    // A soft navigation can reach the gate before the cookie is visible to it,
    // which bounces the new account straight back to /login.
    const query = initialQuery.current;
    const suffix = query ? `?q=${encodeURIComponent(query)}` : "";
    window.location.assign(`/${locale}/app/search${suffix}`);
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
          forward ? "slide-in-from-bottom-4" : "slide-in-from-top-4",
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
