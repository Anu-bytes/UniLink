-- A second part of a program's yearly fee in another currency (e.g. USD),
-- shown beside tuitionFee. Additive: both columns are nullable.

-- AlterTable
ALTER TABLE "Program" ADD COLUMN "extraFee" DECIMAL(12,2),
ADD COLUMN "extraFeeCurrency" CHAR(3);
