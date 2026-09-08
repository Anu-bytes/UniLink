-- Tuition fees for German University in Cairo (GUC), 2026/2027, per faculty
-- (not per program track). Scraped from GUC's own tuition page:
-- https://www.guc.edu.eg/en/admission/undergraduate/tuition_fees/
--
-- GUC bills per SEMESTER, not per year (tuitionPeriod = 'TERM' below), and
-- publishes three admission-score categories (A/B/C); Category C (the
-- highest fee, no scholarship deduction) is used here for consistency with
-- how the other seeded universities' base rates were chosen.
--
-- Also fills in GUC's official address and phone from the same site.

BEGIN;

UPDATE "University"
SET "addressLine" = 'New Cairo City, Main Entrance El-Tagamoa El-Khames',
    phone = '+202 27589990-8'
WHERE slug = 'german-university-in-cairo-guc';

UPDATE "Program" SET "tuitionFee" = 220000, "tuitionPeriod" = 'TERM'
WHERE "facultyId" = (
  SELECT f.id FROM "Faculty" f
  JOIN "University" u ON u.id = f."universityId"
  WHERE u.slug = 'german-university-in-cairo-guc' AND f.name = 'Faculty of Media Engineering & Technology'
);

UPDATE "Program" SET "tuitionFee" = 220000, "tuitionPeriod" = 'TERM'
WHERE "facultyId" = (
  SELECT f.id FROM "Faculty" f
  JOIN "University" u ON u.id = f."universityId"
  WHERE u.slug = 'german-university-in-cairo-guc' AND f.name = 'Faculty of Information Engineering & Technology'
);

UPDATE "Program" SET "tuitionFee" = 220000, "tuitionPeriod" = 'TERM'
WHERE "facultyId" = (
  SELECT f.id FROM "Faculty" f
  JOIN "University" u ON u.id = f."universityId"
  WHERE u.slug = 'german-university-in-cairo-guc' AND f.name = 'Faculty of Engineering & Materials Science'
);

UPDATE "Program" SET "tuitionFee" = 183450, "tuitionPeriod" = 'TERM'
WHERE "facultyId" = (
  SELECT f.id FROM "Faculty" f
  JOIN "University" u ON u.id = f."universityId"
  WHERE u.slug = 'german-university-in-cairo-guc' AND f.name = 'Faculty of Pharmacy & Biotechnology'
);

UPDATE "Program" SET "tuitionFee" = 211200, "tuitionPeriod" = 'TERM'
WHERE "facultyId" = (
  SELECT f.id FROM "Faculty" f
  JOIN "University" u ON u.id = f."universityId"
  WHERE u.slug = 'german-university-in-cairo-guc' AND f.name = 'Faculty of Management Technology'
);

UPDATE "Program" SET "tuitionFee" = 150050, "tuitionPeriod" = 'TERM'
WHERE "facultyId" = (
  SELECT f.id FROM "Faculty" f
  JOIN "University" u ON u.id = f."universityId"
  WHERE u.slug = 'german-university-in-cairo-guc' AND f.name = 'Faculty of Applied Sciences & Arts'
);

UPDATE "Program" SET "tuitionFee" = 218500, "tuitionPeriod" = 'TERM'
WHERE "facultyId" = (
  SELECT f.id FROM "Faculty" f
  JOIN "University" u ON u.id = f."universityId"
  WHERE u.slug = 'german-university-in-cairo-guc' AND f.name = 'Faculty of Dentistry'
);

UPDATE "Program" SET "tuitionFee" = 129000, "tuitionPeriod" = 'TERM'
WHERE "facultyId" = (
  SELECT f.id FROM "Faculty" f
  JOIN "University" u ON u.id = f."universityId"
  WHERE u.slug = 'german-university-in-cairo-guc' AND f.name = 'Faculty of Law & Legal Studies'
);

COMMIT;
