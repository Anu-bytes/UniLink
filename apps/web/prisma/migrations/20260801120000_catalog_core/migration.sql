-- CreateEnum
CREATE TYPE "HighSchoolSystem" AS ENUM ('THANAWEYA_AMMA', 'IGCSE', 'AMERICAN_DIPLOMA', 'STEM', 'AL_AZHAR', 'ARAB_CERTIFICATE', 'OTHER');

-- CreateEnum
CREATE TYPE "ContentSection" AS ENUM ('ADMISSION_REQUIREMENTS', 'ADMISSION_CRITERIA', 'TUITION_NOTES', 'ABOUT_EXTRA');

-- CreateEnum
CREATE TYPE "ScoreUnit" AS ENUM ('PERCENT', 'GPA', 'POINTS');

-- CreateEnum
CREATE TYPE "TuitionPeriod" AS ENUM ('YEAR', 'TERM', 'TOTAL');

-- CreateEnum
CREATE TYPE "ProgramTag" AS ENUM ('HIGH_JOB_DEMAND', 'SCHOLARSHIPS_AVAILABLE', 'FAST_ACCEPTANCE', 'WAIVED_APPLICATION_FEE', 'FINANCIAL_AID_AVAILABLE', 'CREDIT_HOURS');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'IN_REVIEW', 'OFFER', 'REJECTED', 'WITHDRAWN');

-- AlterTable: StudentProfile.highSchoolSystem TEXT -> HighSchoolSystem.
-- Existing rows already store exactly these tokens (the onboarding wizard has
-- always written them from HIGH_SCHOOL_SYSTEMS), so a plain cast is safe.
-- Anything unexpected falls back to OTHER rather than failing the migration.
ALTER TABLE "StudentProfile"
  ALTER COLUMN "highSchoolSystem" TYPE "HighSchoolSystem"
  USING (
    CASE
      WHEN "highSchoolSystem" IN (
        'THANAWEYA_AMMA', 'IGCSE', 'AMERICAN_DIPLOMA', 'STEM',
        'AL_AZHAR', 'ARAB_CERTIFICATE', 'OTHER'
      ) THEN "highSchoolSystem"::"HighSchoolSystem"
      ELSE 'OTHER'::"HighSchoolSystem"
    END
  );

-- AlterTable
ALTER TABLE "University" ADD COLUMN     "aboutRich" TEXT,
ADD COLUMN     "aboutRichAr" TEXT,
ADD COLUMN     "establishedYear" INTEGER,
ADD COLUMN     "addressLine" TEXT,
ADD COLUMN     "addressLineAr" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "viewCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "isRecommended" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isTrending" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Program" ADD COLUMN     "facultyId" TEXT,
ADD COLUMN     "durationLabel" TEXT,
ADD COLUMN     "durationLabelAr" TEXT,
ADD COLUMN     "tuitionPeriod" "TuitionPeriod" NOT NULL DEFAULT 'YEAR',
ADD COLUMN     "applicationFee" DECIMAL(12,2),
ADD COLUMN     "applicationFeeWaived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "minGradePercent" DOUBLE PRECISION,
ADD COLUMN     "coopAvailable" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tags" "ProgramTag"[] DEFAULT ARRAY[]::"ProgramTag"[];

-- CreateTable
CREATE TABLE "UniversityImage" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "altAr" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "UniversityImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UniversityFeature" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleAr" TEXT,
    "body" TEXT,
    "bodyAr" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "UniversityFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UniversityContentBlock" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "section" "ContentSection" NOT NULL,
    "title" TEXT,
    "titleAr" TEXT,
    "body" TEXT NOT NULL,
    "bodyAr" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "UniversityContentBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Faculty" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameAr" TEXT,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "descriptionAr" TEXT,
    "imageUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Faculty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MinimumScore" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "facultyId" TEXT,
    "system" "HighSchoolSystem" NOT NULL,
    "minScore" DECIMAL(6,2) NOT NULL,
    "unit" "ScoreUnit" NOT NULL DEFAULT 'PERCENT',
    "year" INTEGER,

    CONSTRAINT "MinimumScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramIntake" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "season" "IntakeSeason" NOT NULL,
    "year" INTEGER NOT NULL,
    "applicationDeadline" TIMESTAMP(3),

    CONSTRAINT "ProgramIntake_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramEnglishRequirement" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "test" "EnglishTest" NOT NULL,
    "minScore" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ProgramEnglishRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedProgram" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedProgram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'DRAFT',
    "submittedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UniversityImage_universityId_sortOrder_idx" ON "UniversityImage"("universityId", "sortOrder");

-- CreateIndex
CREATE INDEX "UniversityFeature_universityId_sortOrder_idx" ON "UniversityFeature"("universityId", "sortOrder");

-- CreateIndex
CREATE INDEX "UniversityContentBlock_universityId_section_sortOrder_idx" ON "UniversityContentBlock"("universityId", "section", "sortOrder");

-- CreateIndex
CREATE INDEX "Faculty_universityId_sortOrder_idx" ON "Faculty"("universityId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Faculty_universityId_slug_key" ON "Faculty"("universityId", "slug");

-- CreateIndex
CREATE INDEX "MinimumScore_universityId_idx" ON "MinimumScore"("universityId");

-- CreateIndex
CREATE INDEX "MinimumScore_facultyId_idx" ON "MinimumScore"("facultyId");

-- CreateIndex
CREATE INDEX "ProgramIntake_programId_idx" ON "ProgramIntake"("programId");

-- CreateIndex
CREATE INDEX "ProgramIntake_year_season_idx" ON "ProgramIntake"("year", "season");

-- CreateIndex
CREATE UNIQUE INDEX "ProgramIntake_programId_season_year_key" ON "ProgramIntake"("programId", "season", "year");

-- CreateIndex
CREATE INDEX "ProgramEnglishRequirement_programId_idx" ON "ProgramEnglishRequirement"("programId");

-- CreateIndex
CREATE UNIQUE INDEX "ProgramEnglishRequirement_programId_test_key" ON "ProgramEnglishRequirement"("programId", "test");

-- CreateIndex
CREATE INDEX "SavedProgram_userId_idx" ON "SavedProgram"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SavedProgram_userId_programId_key" ON "SavedProgram"("userId", "programId");

-- CreateIndex
CREATE INDEX "Application_userId_status_idx" ON "Application"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Application_userId_programId_key" ON "Application"("userId", "programId");

-- CreateIndex
CREATE INDEX "Program_facultyId_idx" ON "Program"("facultyId");

-- AddForeignKey
ALTER TABLE "UniversityImage" ADD CONSTRAINT "UniversityImage_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UniversityFeature" ADD CONSTRAINT "UniversityFeature_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UniversityContentBlock" ADD CONSTRAINT "UniversityContentBlock_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Faculty" ADD CONSTRAINT "Faculty_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MinimumScore" ADD CONSTRAINT "MinimumScore_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MinimumScore" ADD CONSTRAINT "MinimumScore_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "Faculty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "Faculty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramIntake" ADD CONSTRAINT "ProgramIntake_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramEnglishRequirement" ADD CONSTRAINT "ProgramEnglishRequirement_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedProgram" ADD CONSTRAINT "SavedProgram_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedProgram" ADD CONSTRAINT "SavedProgram_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;
