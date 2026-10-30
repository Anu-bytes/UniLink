-- Records when, and which version of, the Terms of Service and Privacy
-- Policy each user accepted. Additive only: both columns are nullable, so
-- existing users are untouched.

-- AlterTable
ALTER TABLE "User" ADD COLUMN "termsAcceptedAt" TIMESTAMP(3),
ADD COLUMN "termsVersion" TEXT;
