-- Adds the student's city, asked at sign-up after the country. Additive
-- only: the column is nullable, so existing profiles are untouched.

-- AlterTable
ALTER TABLE "StudentProfile" ADD COLUMN "city" TEXT;
