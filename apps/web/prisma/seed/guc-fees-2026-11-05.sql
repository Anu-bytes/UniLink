-- German University in Cairo, 2026/2027 yearly fees (the user-supplied fee
-- table). The fee depends on the student's category: tuitionFee is category
-- A, tuitionFeeMax category C. Applied Sciences & Arts has one fee.
BEGIN;
UPDATE "Program" SET "tuitionFee" = 354800, "tuitionFeeMax" = 440000, "tuitionPeriod" = 'YEAR', "currency" = 'EGP'
WHERE "facultyId" = (SELECT f."id" FROM "Faculty" f JOIN "University" u ON u."id" = f."universityId"
  WHERE u."slug" = 'german-university-in-cairo-guc' AND f."name" = 'Faculty of Engineering & Materials Science');
UPDATE "Program" SET "tuitionFee" = 354800, "tuitionFeeMax" = 440000, "tuitionPeriod" = 'YEAR', "currency" = 'EGP'
WHERE "facultyId" = (SELECT f."id" FROM "Faculty" f JOIN "University" u ON u."id" = f."universityId"
  WHERE u."slug" = 'german-university-in-cairo-guc' AND f."name" = 'Faculty of Media Engineering & Technology');
UPDATE "Program" SET "tuitionFee" = 354800, "tuitionFeeMax" = 440000, "tuitionPeriod" = 'YEAR', "currency" = 'EGP'
WHERE "facultyId" = (SELECT f."id" FROM "Faculty" f JOIN "University" u ON u."id" = f."universityId"
  WHERE u."slug" = 'german-university-in-cairo-guc' AND f."name" = 'Faculty of Information Engineering & Technology');
UPDATE "Program" SET "tuitionFee" = 325800, "tuitionFeeMax" = 422400, "tuitionPeriod" = 'YEAR', "currency" = 'EGP'
WHERE "facultyId" = (SELECT f."id" FROM "Faculty" f JOIN "University" u ON u."id" = f."universityId"
  WHERE u."slug" = 'german-university-in-cairo-guc' AND f."name" = 'Faculty of Management Technology');
UPDATE "Program" SET "tuitionFee" = 272000, "tuitionFeeMax" = 366900, "tuitionPeriod" = 'YEAR', "currency" = 'EGP'
WHERE "facultyId" = (SELECT f."id" FROM "Faculty" f JOIN "University" u ON u."id" = f."universityId"
  WHERE u."slug" = 'german-university-in-cairo-guc' AND f."name" = 'Faculty of Pharmacy & Biotechnology');
UPDATE "Program" SET "tuitionFee" = 196700, "tuitionFeeMax" = 258000, "tuitionPeriod" = 'YEAR', "currency" = 'EGP'
WHERE "facultyId" = (SELECT f."id" FROM "Faculty" f JOIN "University" u ON u."id" = f."universityId"
  WHERE u."slug" = 'german-university-in-cairo-guc' AND f."name" = 'Faculty of Law & Legal Studies');
UPDATE "Program" SET "tuitionFee" = 300100, "tuitionFeeMax" = NULL, "tuitionPeriod" = 'YEAR', "currency" = 'EGP'
WHERE "facultyId" = (SELECT f."id" FROM "Faculty" f JOIN "University" u ON u."id" = f."universityId"
  WHERE u."slug" = 'german-university-in-cairo-guc' AND f."name" = 'Faculty of Applied Sciences & Arts');
UPDATE "Program" SET "tuitionFee" = 368000, "tuitionFeeMax" = 437000, "tuitionPeriod" = 'YEAR', "currency" = 'EGP'
WHERE "facultyId" = (SELECT f."id" FROM "Faculty" f JOIN "University" u ON u."id" = f."universityId"
  WHERE u."slug" = 'german-university-in-cairo-guc' AND f."name" = 'Faculty of Dentistry');
COMMIT;
