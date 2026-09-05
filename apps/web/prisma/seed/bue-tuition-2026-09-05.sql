-- Real tuition fees for The British University in Egypt (BUE), scraped from
-- https://www.bue.edu.eg/tuition-fees-for-egyptian-students (2026-2027 schedule,
-- Category C: no academic scholarship, annual fee in EGP). Also fills in BUE's
-- official address/phone/email from the same site's contact footer.

BEGIN;

UPDATE "University"
SET "addressLine" = 'El Sherouk City, Suez Desert Road, Cairo 11837, P.O. Box 43',
    phone = '+20 19283',
    email = 'info@bue.edu.eg'
WHERE slug = 'british-university-in-egypt';

UPDATE "Program" SET "tuitionFee" = 330000 WHERE name = 'Architectural Engineering' AND "universityId" = (SELECT id FROM "University" WHERE slug = 'british-university-in-egypt');
UPDATE "Program" SET "tuitionFee" = 330000 WHERE name = 'Chemical Engineering' AND "universityId" = (SELECT id FROM "University" WHERE slug = 'british-university-in-egypt');
UPDATE "Program" SET "tuitionFee" = 330000 WHERE name = 'Civil Engineering' AND "universityId" = (SELECT id FROM "University" WHERE slug = 'british-university-in-egypt');
UPDATE "Program" SET "tuitionFee" = 330000 WHERE name = 'Construction Engineering and Management' AND "universityId" = (SELECT id FROM "University" WHERE slug = 'british-university-in-egypt');
UPDATE "Program" SET "tuitionFee" = 330000 WHERE name = 'Electrical Engineering and Communications' AND "universityId" = (SELECT id FROM "University" WHERE slug = 'british-university-in-egypt');
UPDATE "Program" SET "tuitionFee" = 330000 WHERE name = 'Computer Engineering' AND "universityId" = (SELECT id FROM "University" WHERE slug = 'british-university-in-egypt');
UPDATE "Program" SET "tuitionFee" = 330000 WHERE name = 'Landscape and Urban Development for Sustainable Cities' AND "universityId" = (SELECT id FROM "University" WHERE slug = 'british-university-in-egypt');
UPDATE "Program" SET "tuitionFee" = 330000 WHERE name = 'Mechanical Engineering' AND "universityId" = (SELECT id FROM "University" WHERE slug = 'british-university-in-egypt');
UPDATE "Program" SET "tuitionFee" = 330000 WHERE name = 'Mechatronics and Robotics' AND "universityId" = (SELECT id FROM "University" WHERE slug = 'british-university-in-egypt');
UPDATE "Program" SET "tuitionFee" = 300000 WHERE name = 'Artificial Intelligence' AND "universityId" = (SELECT id FROM "University" WHERE slug = 'british-university-in-egypt');
UPDATE "Program" SET "tuitionFee" = 300000 WHERE name = 'Computer Science' AND "universityId" = (SELECT id FROM "University" WHERE slug = 'british-university-in-egypt');
UPDATE "Program" SET "tuitionFee" = 300000 WHERE name = 'Software Engineering' AND "universityId" = (SELECT id FROM "University" WHERE slug = 'british-university-in-egypt');
UPDATE "Program" SET "tuitionFee" = 300000 WHERE name = 'Information Systems' AND "universityId" = (SELECT id FROM "University" WHERE slug = 'british-university-in-egypt');
UPDATE "Program" SET "tuitionFee" = 300000 WHERE name = 'Networks and Cybersecurity' AND "universityId" = (SELECT id FROM "University" WHERE slug = 'british-university-in-egypt');
UPDATE "Program" SET "tuitionFee" = 295000 WHERE name = 'Accounting & Finance' AND "universityId" = (SELECT id FROM "University" WHERE slug = 'british-university-in-egypt');
UPDATE "Program" SET "tuitionFee" = 295000 WHERE name = 'Marketing' AND "universityId" = (SELECT id FROM "University" WHERE slug = 'british-university-in-egypt');
UPDATE "Program" SET "tuitionFee" = 295000 WHERE name = 'International Business' AND "universityId" = (SELECT id FROM "University" WHERE slug = 'british-university-in-egypt');
UPDATE "Program" SET "tuitionFee" = 295000 WHERE name = 'Human Resources Management' AND "universityId" = (SELECT id FROM "University" WHERE slug = 'british-university-in-egypt');
UPDATE "Program" SET "tuitionFee" = 295000 WHERE name = 'Entrepreneurship and Sustainability' AND "universityId" = (SELECT id FROM "University" WHERE slug = 'british-university-in-egypt');
UPDATE "Program" SET "tuitionFee" = 295000 WHERE name = 'Business Information Systems' AND "universityId" = (SELECT id FROM "University" WHERE slug = 'british-university-in-egypt');
UPDATE "Program" SET "tuitionFee" = 220000 WHERE name = 'Content Creation and Social Media' AND "universityId" = (SELECT id FROM "University" WHERE slug = 'british-university-in-egypt');
UPDATE "Program" SET "tuitionFee" = 220000 WHERE name = 'Advertising and Brand Communication' AND "universityId" = (SELECT id FROM "University" WHERE slug = 'british-university-in-egypt');
UPDATE "Program" SET "tuitionFee" = 220000 WHERE name = 'PR and Digital Marketing' AND "universityId" = (SELECT id FROM "University" WHERE slug = 'british-university-in-egypt');
UPDATE "Program" SET "tuitionFee" = 220000 WHERE name = 'Creative Broadcast Production' AND "universityId" = (SELECT id FROM "University" WHERE slug = 'british-university-in-egypt');
UPDATE "Program" SET "tuitionFee" = 220000 WHERE name = 'Filmmaking and Media Narratives' AND "universityId" = (SELECT id FROM "University" WHERE slug = 'british-university-in-egypt');
UPDATE "Program" SET "tuitionFee" = 265000 WHERE name = 'Interior Design' AND "universityId" = (SELECT id FROM "University" WHERE slug = 'british-university-in-egypt');
UPDATE "Program" SET "tuitionFee" = 265000 WHERE name = 'Fashion Design' AND "universityId" = (SELECT id FROM "University" WHERE slug = 'british-university-in-egypt');
UPDATE "Program" SET "tuitionFee" = 265000 WHERE name = 'Fine Art and Mixed Media' AND "universityId" = (SELECT id FROM "University" WHERE slug = 'british-university-in-egypt');
UPDATE "Program" SET "tuitionFee" = 265000 WHERE name = 'Game Design' AND "universityId" = (SELECT id FROM "University" WHERE slug = 'british-university-in-egypt');
UPDATE "Program" SET "tuitionFee" = 265000 WHERE name = 'Illustration & Animation' AND "universityId" = (SELECT id FROM "University" WHERE slug = 'british-university-in-egypt');
UPDATE "Program" SET "tuitionFee" = 130000 WHERE name = 'English Language and Literature' AND "universityId" = (SELECT id FROM "University" WHERE slug = 'british-university-in-egypt');
UPDATE "Program" SET "tuitionFee" = 95000 WHERE name = 'Chinese Language and Culture' AND "universityId" = (SELECT id FROM "University" WHERE slug = 'british-university-in-egypt');
UPDATE "Program" SET "tuitionFee" = 220000 WHERE name = 'Law (Anglo-Egyptian Law)' AND "universityId" = (SELECT id FROM "University" WHERE slug = 'british-university-in-egypt');
UPDATE "Program" SET "tuitionFee" = 240000 WHERE name = 'PharmD' AND "universityId" = (SELECT id FROM "University" WHERE slug = 'british-university-in-egypt');
UPDATE "Program" SET "tuitionFee" = 250000 WHERE name = 'PharmD Clinical' AND "universityId" = (SELECT id FROM "University" WHERE slug = 'british-university-in-egypt');
UPDATE "Program" SET "tuitionFee" = 350000 WHERE name = 'Oral & Dental Medicine and Surgery' AND "universityId" = (SELECT id FROM "University" WHERE slug = 'british-university-in-egypt');
UPDATE "Program" SET "tuitionFee" = 85000 WHERE name = 'Nursing' AND "universityId" = (SELECT id FROM "University" WHERE slug = 'british-university-in-egypt');
UPDATE "Program" SET "tuitionFee" = 260000 WHERE name = 'Physiotherapy / Physical Therapy' AND "universityId" = (SELECT id FROM "University" WHERE slug = 'british-university-in-egypt');

COMMIT;
