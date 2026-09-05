-- Tuition fees for Misr University for Science and Technology (MUST),
-- 2026/2027, per faculty (not per program track), Egyptian/Azhari
-- secondary-certificate rate (the infographic also lists a higher rate for
-- equivalency/international certificates, not representable in this
-- schema's single tuitionFee field).
--
-- Source: a "Safir Uni" (سفير الجامعات) admissions-agency infographic
-- supplied by the user, not must.edu.eg directly -- treat as a secondary
-- source, not the university's own published rate card.

BEGIN;

UPDATE "Program" SET "tuitionFee" = 165000
WHERE "facultyId" = (
  SELECT f.id FROM "Faculty" f
  JOIN "University" u ON u.id = f."universityId"
  WHERE u.slug = 'misr-university-for-science-and-technology' AND f.name = 'Faculty of Medicine'
);

UPDATE "Program" SET "tuitionFee" = 70000
WHERE "facultyId" = (
  SELECT f.id FROM "Faculty" f
  JOIN "University" u ON u.id = f."universityId"
  WHERE u.slug = 'misr-university-for-science-and-technology' AND f.name = 'Faculty of Engineering'
);

UPDATE "Program" SET "tuitionFee" = 70000
WHERE "facultyId" = (
  SELECT f.id FROM "Faculty" f
  JOIN "University" u ON u.id = f."universityId"
  WHERE u.slug = 'misr-university-for-science-and-technology' AND f.name = 'Faculty of Biotechnology'
);

UPDATE "Program" SET "tuitionFee" = 55000
WHERE "facultyId" = (
  SELECT f.id FROM "Faculty" f
  JOIN "University" u ON u.id = f."universityId"
  WHERE u.slug = 'misr-university-for-science-and-technology' AND f.name = 'Faculty of Applied Health Science Technology'
);

UPDATE "Program" SET "tuitionFee" = 95000
WHERE "facultyId" = (
  SELECT f.id FROM "Faculty" f
  JOIN "University" u ON u.id = f."universityId"
  WHERE u.slug = 'misr-university-for-science-and-technology' AND f.name = 'Faculty of Pharmacy'
);

UPDATE "Program" SET "tuitionFee" = 145000
WHERE "facultyId" = (
  SELECT f.id FROM "Faculty" f
  JOIN "University" u ON u.id = f."universityId"
  WHERE u.slug = 'misr-university-for-science-and-technology' AND f.name = 'Faculty of Oral & Dental Medicine'
);

UPDATE "Program" SET "tuitionFee" = 95000
WHERE "facultyId" = (
  SELECT f.id FROM "Faculty" f
  JOIN "University" u ON u.id = f."universityId"
  WHERE u.slug = 'misr-university-for-science-and-technology' AND f.name = 'Faculty of Physical Therapy'
);

UPDATE "Program" SET "tuitionFee" = 85000
WHERE "facultyId" = (
  SELECT f.id FROM "Faculty" f
  JOIN "University" u ON u.id = f."universityId"
  WHERE u.slug = 'misr-university-for-science-and-technology' AND f.name = 'Faculty of Information Technology'
);

UPDATE "Program" SET "tuitionFee" = 75000
WHERE "facultyId" = (
  SELECT f.id FROM "Faculty" f
  JOIN "University" u ON u.id = f."universityId"
  WHERE u.slug = 'misr-university-for-science-and-technology' AND f.name = 'Faculty of Business & Economics'
);

UPDATE "Program" SET "tuitionFee" = 55000
WHERE "facultyId" = (
  SELECT f.id FROM "Faculty" f
  JOIN "University" u ON u.id = f."universityId"
  WHERE u.slug = 'misr-university-for-science-and-technology' AND f.name = 'Faculty of Mass Media & Communication Technology'
);

UPDATE "Program" SET "tuitionFee" = 40000
WHERE "facultyId" = (
  SELECT f.id FROM "Faculty" f
  JOIN "University" u ON u.id = f."universityId"
  WHERE u.slug = 'misr-university-for-science-and-technology' AND f.name = 'Faculty of Archaeology & Tourism'
);

UPDATE "Program" SET "tuitionFee" = 40000
WHERE "facultyId" = (
  SELECT f.id FROM "Faculty" f
  JOIN "University" u ON u.id = f."universityId"
  WHERE u.slug = 'misr-university-for-science-and-technology' AND f.name = 'Faculty of Foreign Languages & Translation'
);

UPDATE "Program" SET "tuitionFee" = 40000
WHERE "facultyId" = (
  SELECT f.id FROM "Faculty" f
  JOIN "University" u ON u.id = f."universityId"
  WHERE u.slug = 'misr-university-for-science-and-technology' AND f.name = 'Faculty of Special Education'
);

UPDATE "Program" SET "tuitionFee" = 55000
WHERE "facultyId" = (
  SELECT f.id FROM "Faculty" f
  JOIN "University" u ON u.id = f."universityId"
  WHERE u.slug = 'misr-university-for-science-and-technology' AND f.name = 'Faculty of Nursing'
);

COMMIT;
