"use client";

import { useTranslations } from "next-intl";

import { destinationSchema } from "@/lib/onboarding-schema";
import { useWizard } from "../wizard-context";
import { StepShell, Field, useStepForm } from "./step-primitives";
import { CountryCardGrid } from "./country-select";

// UniLink currently offers Egypt as a study destination.
const DESTINATIONS = ["EG"] as const;

export function StepDestination() {
  const t = useTranslations("Onboarding");
  const { data, setData, next } = useWizard();
  const form = useStepForm(destinationSchema, {
    destinations: data.destinations ?? [],
  });

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const valid = form.validate();
    if (!valid) return;
    setData(valid);
    next();
  }

  return (
    <StepShell
      onSubmit={submit}
      question={t("destination.heading")}
      help={t("destination.help")}
      submitLabel={t("continue")}
      illustration={
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/flags/eg.svg"
          alt="Flag of Egypt"
          className="h-14 w-20 rounded-md object-cover shadow-sm"
        />
      }
    >
      <Field error={form.errors.destinations}>
        <CountryCardGrid
          value={(form.values.destinations as string[]) ?? []}
          onChange={(codes) => form.setValue("destinations", codes)}
          codes={DESTINATIONS}
        />
      </Field>
    </StepShell>
  );
}
