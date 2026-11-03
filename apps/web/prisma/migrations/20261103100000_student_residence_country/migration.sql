-- Country of residence, asked at sign-up next to nationality (which now
-- means nationality only). Additive: the column is nullable. Sign-up used
-- to ask a single "country", so existing profiles start with that answer.

-- AlterTable
ALTER TABLE "StudentProfile" ADD COLUMN "residenceCountry" TEXT;

UPDATE "StudentProfile" SET "residenceCountry" = "nationality" WHERE "residenceCountry" IS NULL;
