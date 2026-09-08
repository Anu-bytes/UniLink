-- Tuition fees for Future University in Egypt (FUE), 2026/2027, per faculty
-- (not per program track). Scraped from FUE's own tuition page:
-- https://www.fue.edu.eg/admissions/undergraduate_applicants/tuition_fees
--
-- Each faculty's real Egyptian-student fee is actually "X EGP + $1,800/year"
-- (a flat USD component on top of the EGP base). This schema's Program model
-- has a single tuitionFee + currency field, with no way to represent a
-- second-currency add-on, so only the EGP base is stored here -- the real
-- annual cost for an Egyptian student is somewhat higher than what's shown.
--
-- Also fills in FUE's official address/phone/email from the same site.

BEGIN;

UPDATE "University"
SET "addressLine" = 'End of 90th St., Fifth Settlement, New Cairo',
    phone = '16383',
    email = 'info@fue.edu.eg'
WHERE slug = 'future-university-in-egypt';

UPDATE "Program" SET "tuitionFee" = 230000
WHERE "facultyId" = (
  SELECT f.id FROM "Faculty" f
  JOIN "University" u ON u.id = f."universityId"
  WHERE u.slug = 'future-university-in-egypt' AND f.name = 'Faculty of Oral & Dental Medicine'
);

UPDATE "Program" SET "tuitionFee" = 140000
WHERE "facultyId" = (
  SELECT f.id FROM "Faculty" f
  JOIN "University" u ON u.id = f."universityId"
  WHERE u.slug = 'future-university-in-egypt' AND f.name = 'Faculty of Pharmacy'
);

UPDATE "Program" SET "tuitionFee" = 115000
WHERE "facultyId" = (
  SELECT f.id FROM "Faculty" f
  JOIN "University" u ON u.id = f."universityId"
  WHERE u.slug = 'future-university-in-egypt' AND f.name = 'Faculty of Engineering & Technology'
);

UPDATE "Program" SET "tuitionFee" = 115000
WHERE "facultyId" = (
  SELECT f.id FROM "Faculty" f
  JOIN "University" u ON u.id = f."universityId"
  WHERE u.slug = 'future-university-in-egypt' AND f.name = 'Faculty of Computers & Information Technology'
);

UPDATE "Program" SET "tuitionFee" = 100000
WHERE "facultyId" = (
  SELECT f.id FROM "Faculty" f
  JOIN "University" u ON u.id = f."universityId"
  WHERE u.slug = 'future-university-in-egypt' AND f.name = 'Faculty of Economics & Political Science'
);

UPDATE "Program" SET "tuitionFee" = 100000
WHERE "facultyId" = (
  SELECT f.id FROM "Faculty" f
  JOIN "University" u ON u.id = f."universityId"
  WHERE u.slug = 'future-university-in-egypt' AND f.name = 'Faculty of Commerce & Business Administration'
);

COMMIT;
