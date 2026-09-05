-- Tuition fees for Misr International University (MIU), 2026/2027, per
-- program (MIU's own tuition page prices several tracks within the same
-- faculty differently, e.g. Business Intelligence vs the rest of Business
-- Administration, or Architecture vs Electronics & Communications within
-- Engineering Sciences & Arts). Egyptian-student Category C rate (0%
-- scholarship discount, the lowest score band) is used for consistency with
-- the other seeded universities' base rates.
--
-- Scraped from MIU's own tuition page:
-- https://www.miuegypt.edu.eg/admission-requirements/tuition-fees/

BEGIN;

UPDATE "Program" SET "tuitionFee" = 110000
WHERE "universityId" = (SELECT id FROM "University" WHERE slug = 'misr-international-university-miu')
  AND name = 'Teaching English as a Foreign Language';

UPDATE "Program" SET "tuitionFee" = 110000
WHERE "universityId" = (SELECT id FROM "University" WHERE slug = 'misr-international-university-miu')
  AND name = 'Translation';

UPDATE "Program" SET "tuitionFee" = 189750
WHERE "universityId" = (SELECT id FROM "University" WHERE slug = 'misr-international-university-miu')
  AND name = 'Accounting';

UPDATE "Program" SET "tuitionFee" = 189750
WHERE "universityId" = (SELECT id FROM "University" WHERE slug = 'misr-international-university-miu')
  AND name = 'Economics & International Trade';

UPDATE "Program" SET "tuitionFee" = 189750
WHERE "universityId" = (SELECT id FROM "University" WHERE slug = 'misr-international-university-miu')
  AND name = 'Finance';

UPDATE "Program" SET "tuitionFee" = 189750
WHERE "universityId" = (SELECT id FROM "University" WHERE slug = 'misr-international-university-miu')
  AND name = 'Entrepreneurship';

UPDATE "Program" SET "tuitionFee" = 198000
WHERE "universityId" = (SELECT id FROM "University" WHERE slug = 'misr-international-university-miu')
  AND name = 'Business Intelligence';

UPDATE "Program" SET "tuitionFee" = 189750
WHERE "universityId" = (SELECT id FROM "University" WHERE slug = 'misr-international-university-miu')
  AND name = 'Human Resource Management';

UPDATE "Program" SET "tuitionFee" = 189750
WHERE "universityId" = (SELECT id FROM "University" WHERE slug = 'misr-international-university-miu')
  AND name = 'Marketing Management & Communication';

UPDATE "Program" SET "tuitionFee" = 189750
WHERE "universityId" = (SELECT id FROM "University" WHERE slug = 'misr-international-university-miu')
  AND name = 'Supply Chain Management';

UPDATE "Program" SET "tuitionFee" = 195500
WHERE "universityId" = (SELECT id FROM "University" WHERE slug = 'misr-international-university-miu')
  AND name = 'Computer Science';

UPDATE "Program" SET "tuitionFee" = 195500
WHERE "universityId" = (SELECT id FROM "University" WHERE slug = 'misr-international-university-miu')
  AND name = 'Data & Information Science';

UPDATE "Program" SET "tuitionFee" = 195500
WHERE "universityId" = (SELECT id FROM "University" WHERE slug = 'misr-international-university-miu')
  AND name = 'Software';

UPDATE "Program" SET "tuitionFee" = 195500
WHERE "universityId" = (SELECT id FROM "University" WHERE slug = 'misr-international-university-miu')
  AND name = 'Software Engineering';

UPDATE "Program" SET "tuitionFee" = 170500
WHERE "universityId" = (SELECT id FROM "University" WHERE slug = 'misr-international-university-miu')
  AND name = 'Architecture Programs (Computational, Conservation, Environmental & Sustainable, Interior Design, Landscape, Real Estate Management)';

UPDATE "Program" SET "tuitionFee" = 157950
WHERE "universityId" = (SELECT id FROM "University" WHERE slug = 'misr-international-university-miu')
  AND name = 'Electronics & Communications Engineering (Communication Systems, Networks, Smart Systems)';

UPDATE "Program" SET "tuitionFee" = 195500
WHERE "universityId" = (SELECT id FROM "University" WHERE slug = 'misr-international-university-miu')
  AND name = 'Pharm-D';

UPDATE "Program" SET "tuitionFee" = 195500
WHERE "universityId" = (SELECT id FROM "University" WHERE slug = 'misr-international-university-miu')
  AND name = 'Pharm-D Clinical';

UPDATE "Program" SET "tuitionFee" = 341000
WHERE "universityId" = (SELECT id FROM "University" WHERE slug = 'misr-international-university-miu')
  AND name = 'Dentistry';

UPDATE "Program" SET "tuitionFee" = 189750
WHERE "universityId" = (SELECT id FROM "University" WHERE slug = 'misr-international-university-miu')
  AND name = 'Audio-Visual Production (AVP)';

UPDATE "Program" SET "tuitionFee" = 189750
WHERE "universityId" = (SELECT id FROM "University" WHERE slug = 'misr-international-university-miu')
  AND name = 'Integrated Marketing Communication (IMC)';

UPDATE "Program" SET "tuitionFee" = 189750
WHERE "universityId" = (SELECT id FROM "University" WHERE slug = 'misr-international-university-miu')
  AND name = 'News Production (NP)';

COMMIT;
