import { createHmac, timingSafeEqual } from "node:crypto";

// Visitors who are not signed in get one "Find nearest" search. Using it sets
// a signed, HttpOnly cookie holding when it started; the search stays open
// for TRIAL_WINDOW_MS (so a reload or a moved point still works), then the
// map asks them to sign in. The signature stops the start time being edited
// to reopen the window. Clearing cookies resets it, which is acceptable for
// a sign-up nudge rather than a paywall.

export const NEARBY_TRIAL_COOKIE = "ul_nearby_trial";
export const TRIAL_WINDOW_MS = 30 * 60 * 1000;
export const TRIAL_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value) throw new Error("AUTH_SECRET is not set");
  return value;
}

function sign(startedAt: string) {
  return createHmac("sha256", secret()).update(`nearby-trial:${startedAt}`).digest("base64url");
}

export function newTrialCookie(now = Date.now()) {
  const startedAt = String(now);
  return `${startedAt}.${sign(startedAt)}`;
}

/** "none": never searched. "active": inside the one search. "used": spent. */
export type TrialState = "none" | "active" | "used";

export function readTrial(value: string | undefined, now = Date.now()): TrialState {
  if (!value) return "none";
  const [startedAt, signature] = value.split(".");
  if (!startedAt || !signature || !/^\d{10,16}$/.test(startedAt)) return "used";
  const expected = Buffer.from(sign(startedAt));
  const given = Buffer.from(signature);
  // A tampered cookie counts as spent, not as fresh.
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return "used";
  const age = now - Number(startedAt);
  return age >= 0 && age < TRIAL_WINDOW_MS ? "active" : "used";
}
