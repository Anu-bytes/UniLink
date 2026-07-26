/*
  Warnings:

  - You are about to drop the column `gradingScheme` on the `StudentProfile` table. All the data in the column will be lost.
  - Added the required column `graduationYear` to the `StudentProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `highSchoolSystem` to the `StudentProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StudentProfile" DROP COLUMN "gradingScheme",
ADD COLUMN     "graduationYear" INTEGER NOT NULL,
ADD COLUMN     "highSchoolSystem" TEXT NOT NULL,
ADD COLUMN     "highSchoolSystemOther" TEXT,
ALTER COLUMN "gradeValue" SET DATA TYPE TEXT;
