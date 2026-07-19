"use client";

import { StepStudyLevel } from "./step-study-level";
import { StepAcademics } from "./step-academics";
import { StepField } from "./step-field";
import { StepEnglish } from "./step-english";
import { StepNationality } from "./step-nationality";
import { StepIntake } from "./step-intake";
import { StepFinancials } from "./step-financials";
import { AccountStep } from "./step-account";

export { AccountStep };

// Order must match WIZARD_STEPS in lib/onboarding-schema.ts. The account slot
// (index 7) is rendered by the wizard via <AccountStep/>, so it's a no-op here.
export const STEP_COMPONENTS = [
  StepStudyLevel,
  StepAcademics,
  StepField,
  StepEnglish,
  StepNationality,
  StepIntake,
  StepFinancials,
  () => null,
] as const;
