// Sign-up wizard error messages in the page's language. The Zod schemas in
// lib/onboarding-schema.ts (shared with the API) carry English messages, and
// fields left empty get Zod's own wording ("Invalid input: expected string,
// received undefined"). These map both to keys under Onboarding.errors.

/** The schemas' and the API's English messages -> translation key. */
const MESSAGE_KEYS: Record<string, string> = {
  "Select who is signing up": "accountRole",
  "Enter your first name": "firstName",
  "Enter your last name": "lastName",
  "Select your nationality": "nationality",
  "Select your country of residence": "residenceCountry",
  "Enter your city": "city",
  "Please specify your high school system": "highSchoolSystemOther",
  "Select your expected graduation year": "graduationYear",
  "Enter your expected grade": "grade",
  "Select at least one field of study": "fieldsMin",
  "Choose up to 3 fields of study": "fieldsMax",
  "Enter a valid email": "email",
  "Enter a valid phone number": "phone",
  "Password must be at least 10 characters": "passwordLength",
  "Password must contain a lowercase letter": "passwordLower",
  "Password must contain an uppercase letter": "passwordUpper",
  "Password must contain a number": "passwordNumber",
  "You must accept the Terms of Service and Privacy Policy to continue": "terms",
  "You must accept the Terms of Service and Privacy Policy": "terms",
  "Too many attempts. Please try again in a minute.": "tooMany",
  "An account with this email already exists": "emailTaken",
};

/** A field's message when Zod's own wording comes back (empty or wrong type). */
const FIELD_KEYS: Record<string, string> = {
  accountRole: "accountRole",
  firstName: "firstName",
  lastName: "lastName",
  nationality: "nationality",
  residenceCountry: "residenceCountry",
  city: "city",
  highSchoolSystem: "highSchoolSystem",
  highSchoolSystemOther: "highSchoolSystemOther",
  graduationYear: "graduationYear",
  gradeValue: "grade",
  fieldsOfStudy: "fieldsMin",
  budgetBand: "budgetBand",
  email: "email",
  phone: "phone",
  password: "passwordLength",
  acceptTerms: "terms",
};

/**
 * The key under Onboarding.errors for an error message, or null when it is
 * not one we know (the caller then shows a generic message).
 */
export function onboardingErrorKey(message: string | undefined, field?: string): string | null {
  if (message && MESSAGE_KEYS[message]) return MESSAGE_KEYS[message];
  if (field && FIELD_KEYS[field]) return FIELD_KEYS[field];
  return null;
}
