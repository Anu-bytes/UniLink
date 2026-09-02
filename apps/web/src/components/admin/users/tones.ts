import type { UserRole } from "@prisma/client";

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
export const USER_ROLE_TONES: Record<UserRole, BadgeTone> = {
  STUDENT: "neutral",
  PARENT: "amber",
  PARTNER: "blue",
  ADMIN: "slate",
};
