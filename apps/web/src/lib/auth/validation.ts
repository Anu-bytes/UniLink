import { z } from "zod";
import { FIELDS } from "@/data/fields";
import { FEE_BUCKETS } from "@/data/fee-buckets";
import {
  HIGH_SCHOOL_IDS,
  CERTIFICATION_IDS,
  type HighSchoolTypeId,
  type CertificationId,
} from "@/data/student";
import type { FieldOfStudyId, FeeBucketId } from "@/lib/types";

const fieldIds = new Set<string>(FIELDS.map((f) => f.id));
const feeIds = new Set<string>(FEE_BUCKETS.map((b) => b.id));
const hsIds = new Set<string>(HIGH_SCHOOL_IDS);
const certIds = new Set<string>(CERTIFICATION_IDS);

const CURRENT_YEAR = new Date().getFullYear();
export const GRAD_YEAR_MIN = CURRENT_YEAR - 8;
export const GRAD_YEAR_MAX = CURRENT_YEAR + 8;

// Egyptian mobile: 01[0125] + 8 digits (local), or with +20 / 0020 / 20 prefix.
export const EG_PHONE = /^(\+?20|0020|0)?1[0125]\d{8}$/;
export const PASSWORD_MIN = 8;

/** Server-side source of truth. The client mirrors these rules with localized messages. */
export const registerSchema = z.object({
  fullName: z.string().trim().min(2).max(80),
  email: z.email().transform((v) => v.toLowerCase().trim()),
  password: z.string().min(PASSWORD_MIN).regex(/[A-Za-z]/).regex(/\d/),
  phone: z.string().trim().regex(EG_PHONE),
  highSchoolType: z.string().refine((v): v is HighSchoolTypeId => hsIds.has(v)),
  graduationYear: z.number().int().min(GRAD_YEAR_MIN).max(GRAD_YEAR_MAX),
  certification: z.string().refine((v): v is CertificationId => certIds.has(v)),
  fieldsOfInterest: z
    .array(z.string().refine((v): v is FieldOfStudyId => fieldIds.has(v)))
    .min(1)
    .max(3),
  budgetBucket: z.string().refine((v): v is FeeBucketId => feeIds.has(v)),
  age: z.number().int().min(14).max(80).optional(),
  schoolName: z.string().trim().max(120).optional(),
  nationality: z.string().trim().max(60).optional(),
  address: z.string().trim().max(200).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.email().transform((v) => v.toLowerCase().trim()),
  password: z.string().min(1),
});
