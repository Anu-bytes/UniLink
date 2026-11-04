-- Future University in Egypt, 2026/2027: every program's yearly fee is the
-- EGP amount plus 1,800 USD (the university's published fee table).
UPDATE "Program" SET "extraFee" = 1800, "extraFeeCurrency" = 'USD'
WHERE "universityId" = (SELECT "id" FROM "University" WHERE "slug" = 'future-university-in-egypt');
