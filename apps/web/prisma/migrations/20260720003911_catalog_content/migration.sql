-- CreateEnum
CREATE TYPE "UniversityType" AS ENUM ('PUBLIC', 'PRIVATE', 'SPECIALIZED');

-- Improve foreign-key lookup and cascade performance for Auth.js tables.
CREATE INDEX "Account_userId_idx" ON "Account"("userId");
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- ExtendTable
ALTER TABLE "University"
ADD COLUMN "nameAr" TEXT,
ADD COLUMN "type" "UniversityType" NOT NULL,
ADD COLUMN "countryAr" TEXT,
ADD COLUMN "cityAr" TEXT,
ADD COLUMN "descriptionAr" TEXT,
ADD COLUMN "logoUrl" TEXT,
ADD COLUMN "coverImageUrl" TEXT,
ADD COLUMN "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "publishedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Program" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameAr" TEXT,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "descriptionAr" TEXT,
    "studyLevel" "StudyLevel" NOT NULL,
    "fieldOfStudy" TEXT NOT NULL,
    "durationMonths" INTEGER,
    "tuitionFee" DECIMAL(12,2),
    "currency" CHAR(3) NOT NULL DEFAULT 'EGP',
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scholarship" (
    "id" TEXT NOT NULL,
    "universityId" TEXT,
    "title" TEXT NOT NULL,
    "titleAr" TEXT,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "descriptionAr" TEXT,
    "fundingAmount" DECIMAL(12,2),
    "currency" CHAR(3) NOT NULL DEFAULT 'EGP',
    "applicationDeadline" TIMESTAMP(3),
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Scholarship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "quoteAr" TEXT,
    "location" TEXT,
    "locationAr" TEXT,
    "avatarUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "University_type_idx" ON "University"("type");
CREATE INDEX "University_isFeatured_publishedAt_idx" ON "University"("isFeatured", "publishedAt");
CREATE UNIQUE INDEX "Program_universityId_slug_key" ON "Program"("universityId", "slug");
CREATE INDEX "Program_universityId_idx" ON "Program"("universityId");
CREATE INDEX "Program_studyLevel_idx" ON "Program"("studyLevel");
CREATE INDEX "Program_fieldOfStudy_idx" ON "Program"("fieldOfStudy");
CREATE INDEX "Program_isPublished_idx" ON "Program"("isPublished");
CREATE UNIQUE INDEX "Scholarship_slug_key" ON "Scholarship"("slug");
CREATE INDEX "Scholarship_universityId_idx" ON "Scholarship"("universityId");
CREATE INDEX "Scholarship_applicationDeadline_idx" ON "Scholarship"("applicationDeadline");
CREATE INDEX "Scholarship_isPublished_idx" ON "Scholarship"("isPublished");
CREATE INDEX "Testimonial_isPublished_sortOrder_idx" ON "Testimonial"("isPublished", "sortOrder");

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_universityId_fkey"
FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Scholarship" ADD CONSTRAINT "Scholarship_universityId_fkey"
FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Seed the three institutions that were previously embedded in landing-page translations.
INSERT INTO "University" (
    "id", "name", "nameAr", "slug", "type", "country", "countryAr",
    "city", "cityAr", "isFeatured", "publishedAt", "updatedAt"
)
VALUES
    (
        'univ_cairo', 'Cairo University', 'جامعة القاهرة', 'cairo-university',
        'PUBLIC', 'Egypt', 'مصر', 'Giza', 'الجيزة', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ),
    (
        'univ_ain_shams', 'Ain Shams University', 'جامعة عين شمس', 'ain-shams-university',
        'PUBLIC', 'Egypt', 'مصر', 'Cairo', 'القاهرة', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ),
    (
        'univ_alexandria', 'Alexandria University', 'جامعة الإسكندرية', 'alexandria-university',
        'PUBLIC', 'Egypt', 'مصر', 'Alexandria', 'الإسكندرية', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    );
