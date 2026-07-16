/*
  Warnings:

  - The values [UNDER_10K,B10_20K,B20_30K,B30_50K,OVER_50K] on the enum `BudgetBand` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `fieldOfStudy` on the `StudentProfile` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BudgetBand_new" AS ENUM ('UNDER_100K', 'B100_200K', 'B200_300K', 'B300_500K', 'OVER_500K');
ALTER TABLE "StudentProfile" ALTER COLUMN "budgetBand" TYPE "BudgetBand_new" USING ("budgetBand"::text::"BudgetBand_new");
ALTER TYPE "BudgetBand" RENAME TO "BudgetBand_old";
ALTER TYPE "BudgetBand_new" RENAME TO "BudgetBand";
DROP TYPE "public"."BudgetBand_old";
COMMIT;

-- AlterTable
ALTER TABLE "StudentProfile" DROP COLUMN "fieldOfStudy",
ADD COLUMN     "fieldsOfStudy" TEXT[];
