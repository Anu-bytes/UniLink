-- Tuition fees for October 6 University (O6U), 2026/2027, per faculty (not
-- per program track). Source: a "Safir Uni" (سفير الجامعات) rate-card
-- infographic supplied by the user.
--
-- The Pharmacy row lists two tracks (PharmD 115,000 / Clinical Pharmacy
-- 120,000 EGP); our two Pharmacy programs ("Pharmaceutics" and
-- "Pharmacology & Toxicology") aren't named to tell which is which, so both
-- use the base PharmD rate.

BEGIN;

UPDATE "Program" SET "tuitionFee" = 193600
WHERE "facultyId" = (
  SELECT f.id FROM "Faculty" f
  JOIN "University" u ON u.id = f."universityId"
  WHERE u.slug = 'october-6-university' AND f.name = 'Faculty of Medicine'
);

UPDATE "Program" SET "tuitionFee" = 165000
WHERE "facultyId" = (
  SELECT f.id FROM "Faculty" f
  JOIN "University" u ON u.id = f."universityId"
  WHERE u.slug = 'october-6-university' AND f.name = 'Faculty of Dentistry'
);

UPDATE "Program" SET "tuitionFee" = 115000
WHERE "facultyId" = (
  SELECT f.id FROM "Faculty" f
  JOIN "University" u ON u.id = f."universityId"
  WHERE u.slug = 'october-6-university' AND f.name = 'Faculty of Pharmacy'
);

COMMIT;
