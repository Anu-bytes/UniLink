-- German University in Cairo: 1,200 EGP non-refundable assessment test fee,
-- paid when applying (the user-supplied 2026/2027 fee table).
UPDATE "Program" SET "applicationFee" = 1200, "applicationFeeWaived" = false
WHERE "universityId" = (SELECT "id" FROM "University" WHERE "slug" = 'german-university-in-cairo-guc');
