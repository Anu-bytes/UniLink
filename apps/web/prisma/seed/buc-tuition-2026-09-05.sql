-- Tuition fees for Badr University in Cairo (BUC), 2026/2027, per faculty
-- (not per program track). Source: a "Safir Uni" (سفير الجامعات) admissions-agency
-- infographic supplied by the user, not buc.edu.eg directly -- treat as a
-- secondary source, not the university's own published rate card.

BEGIN;

UPDATE "Program" SET "tuitionFee" = 253000
WHERE "facultyId" = (
  SELECT f.id FROM "Faculty" f
  JOIN "University" u ON u.id = f."universityId"
  WHERE u.slug = 'badr-university-in-cairo' AND f.name = 'School of Medicine'
);

UPDATE "Program" SET "tuitionFee" = 205700
WHERE "facultyId" = (
  SELECT f.id FROM "Faculty" f
  JOIN "University" u ON u.id = f."universityId"
  WHERE u.slug = 'badr-university-in-cairo' AND f.name = 'Oral and Dental Medicine'
);

UPDATE "Program" SET "tuitionFee" = 60500
WHERE "facultyId" = (
  SELECT f.id FROM "Faculty" f
  JOIN "University" u ON u.id = f."universityId"
  WHERE u.slug = 'badr-university-in-cairo' AND f.name = 'School of Nursing'
);

UPDATE "Program" SET "tuitionFee" = 82500
WHERE "facultyId" = (
  SELECT f.id FROM "Faculty" f
  JOIN "University" u ON u.id = f."universityId"
  WHERE u.slug = 'badr-university-in-cairo' AND f.name = 'School of Engineering & Technology'
);

UPDATE "Program" SET "tuitionFee" = 79200
WHERE "facultyId" = (
  SELECT f.id FROM "Faculty" f
  JOIN "University" u ON u.id = f."universityId"
  WHERE u.slug = 'badr-university-in-cairo' AND f.name = 'School of Applied Arts'
);

UPDATE "Program" SET "tuitionFee" = 88000
WHERE "facultyId" = (
  SELECT f.id FROM "Faculty" f
  JOIN "University" u ON u.id = f."universityId"
  WHERE u.slug = 'badr-university-in-cairo' AND f.name = 'Filmmaking and Performing Arts'
);

UPDATE "Program" SET "tuitionFee" = 80500
WHERE "facultyId" = (
  SELECT f.id FROM "Faculty" f
  JOIN "University" u ON u.id = f."universityId"
  WHERE u.slug = 'badr-university-in-cairo' AND f.name = 'School of Business and Economics'
);

UPDATE "Program" SET "tuitionFee" = 66550
WHERE "facultyId" = (
  SELECT f.id FROM "Faculty" f
  JOIN "University" u ON u.id = f."universityId"
  WHERE u.slug = 'badr-university-in-cairo' AND f.name = 'School of Linguistics & Translation'
);

COMMIT;
