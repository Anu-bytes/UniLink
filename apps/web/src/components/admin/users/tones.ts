import type { ApplicationStatus, UserRole } from "@prisma/client";

import type { BadgeTone } from "@/components/admin";

/** Filter and role-select order: the roles an account is likeliest to hold first. */
export const USER_ROLES = [
  "STUDENT",
  "PARENT",
  "PARTNER",
  "ADMIN",
] as const satisfies readonly UserRole[];

// ADMIN takes the one solid pill the kit reserves for a state that has to
// out-shout everything else: on a page of two hundred students, the accounts
// that can delete the catalogue are the only ones worth spotting at a glance.
//
// The remaining three are kept byte-for-byte in step with
// components/admin/overview/tones.ts. The overview lists recent sign-ups with
// the same pills, so a PARENT that is blue there and amber here would read as
// two different things about the same account.
export const USER_ROLE_TONES: Record<UserRole, BadgeTone> = {
  STUDENT: "neutral",
  PARENT: "blue",
  PARTNER: "amber",
  ADMIN: "slate",
};

// The activity card borrows the pipeline's colours so an application reads the
// same here as it does on the applications board.
export const APPLICATION_STATUS_TONES: Record<ApplicationStatus, BadgeTone> = {
  DRAFT: "neutral",
  SUBMITTED: "blue",
  IN_REVIEW: "amber",
  OFFER: "green",
  REJECTED: "red",
  WITHDRAWN: "slate",
};
