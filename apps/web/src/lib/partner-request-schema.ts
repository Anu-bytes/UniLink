// The public "Work with us" form, validated on the server (the client checks
// the same rules for instant feedback, but this is the boundary).

import { z } from "zod";

import { DEMO_SLOTS, isSafeHttpUrl } from "@/lib/partner-requests";

// Control characters other than newline have no place in a form field.
const CONTROL_CHARS = /[\u0000-\u0009\u000B-\u001F\u007F]/g;
const text = (min: number, max: number) =>
  z
    .string()
    .transform((value) => value.replace(CONTROL_CHARS, " ").trim())
    .pipe(z.string().min(min).max(max));

const optionalText = (max: number) =>
  z
    .string()
    .transform((value) => value.replace(/\r\n?/g, "\n").replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, "").trim())
    .pipe(z.string().max(max))
    .optional()
    .transform((value) => value || null);

/** A demo day from yesterday (time zones) up to a year ahead. */
function inBookingWindow(value: string) {
  const day = Date.parse(`${value}T00:00:00Z`);
  if (Number.isNaN(day)) return false;
  const now = Date.now();
  return day >= now - 2 * 86_400_000 && day <= now + 366 * 86_400_000;
}

const base = {
  fullName: text(2, 120),
  email: z.string().trim().toLowerCase().email().max(200),
  phone: z
    .string()
    .trim()
    .max(30)
    .regex(/^\+?[0-9 ()-]{7,30}$/, "Enter a valid phone number"),
  jobTitle: text(2, 120),
  // A catalogue university, or "" with a typed name.
  universityId: z.string().trim().max(50).optional().transform((value) => value || null),
  universityName: text(2, 200),
  message: optionalText(2000),
  // Honeypot: never shown to people. A bot that fills it gets a normal reply.
  website: z.string().max(500).optional(),
};

export const demoRequestSchema = z.object({
  type: z.literal("DEMO"),
  ...base,
  city: text(2, 100),
  preferredDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .refine(inBookingWindow, "Pick a date from today to a year ahead")
    .optional()
    .or(z.literal(""))
    .transform((value) => value || null),
  preferredSlot: z.enum(DEMO_SLOTS).optional().nullable(),
  attendees: z.number().int().min(1).max(500).optional().nullable(),
});

export const representativeRequestSchema = z.object({
  type: z.literal("REPRESENTATIVE"),
  ...base,
  proofUrl: z
    .string()
    .trim()
    .max(500)
    .refine((value) => value === "" || isSafeHttpUrl(value), "Enter a link starting with https://")
    .optional()
    .transform((value) => value || null),
  confirm: z.literal(true, { errorMap: () => ({ message: "Please confirm you represent this university" }) }),
});

export const partnerRequestSchema = z.discriminatedUnion("type", [demoRequestSchema, representativeRequestSchema]);
export type PartnerRequestInput = z.infer<typeof partnerRequestSchema>;
