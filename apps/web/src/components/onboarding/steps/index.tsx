"use client";

import { StepPersonalInfo } from "./step-personal-info";
import { StepAcademics } from "./step-academics";
import { StepField } from "./step-field";
import { StepFinancials } from "./step-financials";
import { AccountStep } from "./step-account";

export { AccountStep };

// Order must match WIZARD_STEPS in lib/onboarding-schema.ts. The account slot
// (index 4) is rendered by the wizard via <AccountStep/>, so it's a no-op here.
export const STEP_COMPONENTS = [
  StepPersonalInfo,
  StepAcademics,
  StepField,
  StepFinancials,
  () => null,
] as const;
