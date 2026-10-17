-- Demo requests and university representative applications from the public
-- "Work with us" page, with their review state. Additive only.

-- CreateEnum
CREATE TYPE "PartnerRequestType" AS ENUM ('DEMO', 'REPRESENTATIVE');

-- CreateEnum
CREATE TYPE "PartnerRequestStatus" AS ENUM ('NEW', 'IN_REVIEW', 'SCHEDULED', 'APPROVED', 'DECLINED', 'CLOSED');

-- CreateTable
CREATE TABLE "PartnerRequest" (
    "id" TEXT NOT NULL,
    "type" "PartnerRequestType" NOT NULL,
    "status" "PartnerRequestStatus" NOT NULL DEFAULT 'NEW',
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "universityId" TEXT,
    "universityName" TEXT NOT NULL,
    "city" TEXT,
    "preferredDate" DATE,
    "preferredSlot" TEXT,
    "attendees" INTEGER,
    "proofUrl" TEXT,
    "message" TEXT,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "userId" TEXT,
    "scheduledAt" TIMESTAMP(3),
    "internalNote" TEXT,
    "reviewerId" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "grantedUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PartnerRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PartnerRequest_status_createdAt_idx" ON "PartnerRequest"("status", "createdAt");

-- CreateIndex
CREATE INDEX "PartnerRequest_type_status_createdAt_idx" ON "PartnerRequest"("type", "status", "createdAt");

-- CreateIndex
CREATE INDEX "PartnerRequest_email_createdAt_idx" ON "PartnerRequest"("email", "createdAt");

-- AddForeignKey
ALTER TABLE "PartnerRequest" ADD CONSTRAINT "PartnerRequest_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnerRequest" ADD CONSTRAINT "PartnerRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnerRequest" ADD CONSTRAINT "PartnerRequest_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
