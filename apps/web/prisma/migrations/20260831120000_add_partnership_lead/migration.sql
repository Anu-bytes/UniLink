-- CreateTable
CREATE TABLE "PartnershipLead" (
    "id" TEXT NOT NULL,
    "universityName" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "contactFirstName" TEXT NOT NULL,
    "contactLastName" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "contactTitle" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PartnershipLead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PartnershipLead_createdAt_idx" ON "PartnershipLead"("createdAt");
