// The current Terms of Service and Privacy Policy. Bump the version whenever
// either document changes materially: it is stored with each user's
// acceptance (User.termsVersion), so we can tell who accepted which text.
export const LEGAL_VERSION = "2026-10-30";

/** Stamp for a user record at the moment they accept the current documents. */
export function legalAcceptance() {
  return { termsAcceptedAt: new Date(), termsVersion: LEGAL_VERSION };
}
