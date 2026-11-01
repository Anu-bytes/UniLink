-- Splits the lowest budget band (under EGP 100,000) into two: up to 50,000
-- and 50,000 to 100,000. Students who picked "under 100,000" move to
-- 50,000 to 100,000, which keeps the same ceiling, so their matches do not
-- change. They can narrow it from their profile.

-- AlterEnum
BEGIN;
CREATE TYPE "BudgetBand_new" AS ENUM ('UNDER_50K', 'B50_100K', 'B100_200K', 'B200_300K', 'B300_500K', 'OVER_500K');
ALTER TABLE "StudentProfile" ALTER COLUMN "budgetBand" TYPE "BudgetBand_new" USING (
  CASE "budgetBand"::text WHEN 'UNDER_100K' THEN 'B50_100K' ELSE "budgetBand"::text END
)::"BudgetBand_new";
ALTER TYPE "BudgetBand" RENAME TO "BudgetBand_old";
ALTER TYPE "BudgetBand_new" RENAME TO "BudgetBand";
DROP TYPE "public"."BudgetBand_old";
COMMIT;
