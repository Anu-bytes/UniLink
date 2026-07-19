-- Preserve the fields collected by the Egypt-focused registration flow while
-- keeping the normalized global matching profile from preproduction.
ALTER TABLE "StudentProfile"
ADD COLUMN "phone" TEXT,
ADD COLUMN "highSchoolType" TEXT,
ADD COLUMN "graduationYear" INTEGER,
ADD COLUMN "certification" TEXT,
ADD COLUMN "age" INTEGER,
ADD COLUMN "schoolName" TEXT,
ADD COLUMN "nationalityLabel" TEXT,
ADD COLUMN "address" TEXT;
