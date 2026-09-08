-- Tuition fees for Nile University, 2026/2027 first-year, per school (not
-- per program track), Thanawya Amma/STEM/Azhar rate, Category 4 (0%
-- discount, the base/no-scholarship rate). Scraped from Nile University's
-- own page: https://www.nu.edu.eg/fees-and-financials
--
-- That page only prices 5 of NU's 8 schools; School of Digital Humanities,
-- School of Water Science & Food Security, and School of Sciences are left
-- untouched (still NULL) rather than guessed.

BEGIN;

UPDATE "University"
SET "addressLine" = 'Juhayna Square, 26th of July Corridor, El Sheikh Zayed, Giza, Egypt',
    phone = '16453'
WHERE slug = 'nile-university';

UPDATE "Program" SET "tuitionFee" = 193680
WHERE "facultyId" = (
  SELECT f.id FROM "Faculty" f
  JOIN "University" u ON u.id = f."universityId"
  WHERE u.slug = 'nile-university' AND f.name = 'School of Engineering & Applied Sciences'
);

UPDATE "Program" SET "tuitionFee" = 193680
WHERE "facultyId" = (
  SELECT f.id FROM "Faculty" f
  JOIN "University" u ON u.id = f."universityId"
  WHERE u.slug = 'nile-university' AND f.name = 'School of Information Technology & Computer Science'
);

UPDATE "Program" SET "tuitionFee" = 152640
WHERE "facultyId" = (
  SELECT f.id FROM "Faculty" f
  JOIN "University" u ON u.id = f."universityId"
  WHERE u.slug = 'nile-university' AND f.name = 'School of Business Administration'
);

UPDATE "Program" SET "tuitionFee" = 183960
WHERE "facultyId" = (
  SELECT f.id FROM "Faculty" f
  JOIN "University" u ON u.id = f."universityId"
  WHERE u.slug = 'nile-university' AND f.name = 'School of Biotechnology'
);

UPDATE "Program" SET "tuitionFee" = 96840
WHERE "facultyId" = (
  SELECT f.id FROM "Faculty" f
  JOIN "University" u ON u.id = f."universityId"
  WHERE u.slug = 'nile-university' AND f.name = 'School of Energy & Environmental Engineering'
);

COMMIT;
