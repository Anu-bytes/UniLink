import type { ApplicationStatus, UserRole } from "@prisma/client";

import type { BadgeTone } from "@/components/admin";

/** Filter and role-select order: the roles an account is likeliest to hold first. */
export const USER_ROLES = [
  "STUDENT",
  "PARENT",
  "PARTNER",
  "ADMIN",
  "REVIEWER",
  "UNIVERSITY_ADMIN",
] as const satisfies readonly UserRole[];

/**
 * The roles the Users page may set. Admin access is granted and removed on
 * the Admins page instead, which also issues a one-time password, manages
 * university assignments and writes the audit log. The users API enforces
 * the same split.
 */
export const NON_ADMIN_ROLES = ["STUDENT", "PARENT", "PARTNER"] as const satisfies readonly UserRole[];

export function isNonAdminRole(role: UserRole): role is (typeof NON_ADMIN_ROLES)[number] {
  return (NON_ADMIN_ROLES as readonly UserRole[]).includes(role);
}

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
  REVIEWER: "green",
  UNIVERSITY_ADMIN: "blue",
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
