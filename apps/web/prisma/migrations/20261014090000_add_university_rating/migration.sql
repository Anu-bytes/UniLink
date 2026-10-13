-- CreateTable
CREATE TABLE "UniversityRating" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "stars" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UniversityRating_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "UniversityRating_stars_check" CHECK ("stars" BETWEEN 1 AND 5)
);

-- CreateIndex
CREATE INDEX "UniversityRating_universityId_idx" ON "UniversityRating"("universityId");

-- CreateIndex
CREATE UNIQUE INDEX "UniversityRating_userId_universityId_key" ON "UniversityRating"("userId", "universityId");

-- AddForeignKey
ALTER TABLE "UniversityRating" ADD CONSTRAINT "UniversityRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UniversityRating" ADD CONSTRAINT "UniversityRating_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE CASCADE ON UPDATE CASCADE;
