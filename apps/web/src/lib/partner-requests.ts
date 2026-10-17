// Demo requests and university representative applications (PartnerRequest).
// Client-safe constants and rules; the public form's schema lives in
// partner-request-schema.ts so zod stays out of the browser bundle.

export const PARTNER_REQUEST_TYPES = ["DEMO", "REPRESENTATIVE"] as const;
export type PartnerRequestKind = (typeof PARTNER_REQUEST_TYPES)[number];

export const PARTNER_REQUEST_STATUSES = [
  "NEW",
  "IN_REVIEW",
  "SCHEDULED",
  "APPROVED",
  "DECLINED",
  "CLOSED",
] as const;
export type PartnerRequestState = (typeof PARTNER_REQUEST_STATUSES)[number];

/** Part of the day a demo is wanted in (Cairo time). */
export const DEMO_SLOTS = ["MORNING", "AFTERNOON", "EVENING"] as const;
export type DemoSlot = (typeof DEMO_SLOTS)[number];

/**
 * The statuses a reviewer can set by hand, per kind. A representative is only
 * APPROVED through "Grant access" (which creates their admin account), never
 * by flipping the status alone; a demo is never "approved", it is scheduled
 * and then closed once it happened.
 */
export const SETTABLE_STATUSES: Record<PartnerRequestKind, readonly PartnerRequestState[]> = {
  DEMO: ["NEW", "IN_REVIEW", "SCHEDULED", "CLOSED", "DECLINED"],
  REPRESENTATIVE: ["NEW", "IN_REVIEW", "DECLINED", "CLOSED"],
};

/** Statuses that still need someone to act. */
export const OPEN_STATUSES: readonly PartnerRequestState[] = ["NEW", "IN_REVIEW", "SCHEDULED"];

export const STATUS_TONE: Record<PartnerRequestState, "blue" | "amber" | "green" | "red" | "neutral"> = {
  NEW: "blue",
  IN_REVIEW: "amber",
  SCHEDULED: "green",
  APPROVED: "green",
  DECLINED: "red",
  CLOSED: "neutral",
};

/** One applicant can have this many open requests of a kind at once. */
export const MAX_OPEN_PER_EMAIL = 3;

/** Only http(s) links are ever stored or rendered as links. */
export function isSafeHttpUrl(value: string | null | undefined): value is string {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}
