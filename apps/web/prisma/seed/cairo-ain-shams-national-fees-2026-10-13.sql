-- 2026/2027 yearly fees for Cairo National and Ain Shams National universities,
-- per faculty, from the Safir Uni fee infographics supplied by the client
-- (2026-10-13). Not listed there, so left empty: Cairo National's Faculty of
-- Mass Communication and its English-taught Faculty of Commerce programs.
-- Each program's description gets the infographics' note that administrative
-- and service fees may be added (appended once; safe to re-run).

BEGIN;

UPDATE "Program" p SET "tuitionFee" = 210529, "tuitionPeriod" = 'YEAR', currency = 'EGP', "updatedAt" = now(),
  description = CASE WHEN p.description IS NULL THEN 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' WHEN position('Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' in p.description) > 0 THEN p.description ELSE p.description || ' ' || 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' END,
  "descriptionAr" = CASE WHEN p."descriptionAr" IS NULL THEN 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' WHEN position('المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' in p."descriptionAr") > 0 THEN p."descriptionAr" ELSE p."descriptionAr" || ' ' || 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' END
FROM "Faculty" f JOIN "University" u ON u.id = f."universityId"
WHERE p."facultyId" = f.id AND u.slug = 'ain-shams-national-university' AND f.slug = 'faculty-of-medicine';

UPDATE "Program" p SET "tuitionFee" = 117487, "tuitionPeriod" = 'YEAR', currency = 'EGP', "updatedAt" = now(),
  description = CASE WHEN p.description IS NULL THEN 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' WHEN position('Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' in p.description) > 0 THEN p.description ELSE p.description || ' ' || 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' END,
  "descriptionAr" = CASE WHEN p."descriptionAr" IS NULL THEN 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' WHEN position('المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' in p."descriptionAr") > 0 THEN p."descriptionAr" ELSE p."descriptionAr" || ' ' || 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' END
FROM "Faculty" f JOIN "University" u ON u.id = f."universityId"
WHERE p."facultyId" = f.id AND u.slug = 'ain-shams-national-university' AND f.slug = 'faculty-of-engineering';

UPDATE "Program" p SET "tuitionFee" = 115544, "tuitionPeriod" = 'YEAR', currency = 'EGP', "updatedAt" = now(),
  description = CASE WHEN p.description IS NULL THEN 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' WHEN position('Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' in p.description) > 0 THEN p.description ELSE p.description || ' ' || 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' END,
  "descriptionAr" = CASE WHEN p."descriptionAr" IS NULL THEN 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' WHEN position('المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' in p."descriptionAr") > 0 THEN p."descriptionAr" ELSE p."descriptionAr" || ' ' || 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' END
FROM "Faculty" f JOIN "University" u ON u.id = f."universityId"
WHERE p."facultyId" = f.id AND u.slug = 'ain-shams-national-university' AND f.slug = 'faculty-of-computers-information-and-artificial-intelligence';

UPDATE "Program" p SET "tuitionFee" = 87604, "tuitionPeriod" = 'YEAR', currency = 'EGP', "updatedAt" = now(),
  description = CASE WHEN p.description IS NULL THEN 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' WHEN position('Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' in p.description) > 0 THEN p.description ELSE p.description || ' ' || 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' END,
  "descriptionAr" = CASE WHEN p."descriptionAr" IS NULL THEN 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' WHEN position('المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' in p."descriptionAr") > 0 THEN p."descriptionAr" ELSE p."descriptionAr" || ' ' || 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' END
FROM "Faculty" f JOIN "University" u ON u.id = f."universityId"
WHERE p."facultyId" = f.id AND u.slug = 'ain-shams-national-university' AND f.slug = 'faculty-of-business';

UPDATE "Program" p SET "tuitionFee" = 170000, "tuitionPeriod" = 'YEAR', currency = 'EGP', "updatedAt" = now(),
  description = CASE WHEN p.description IS NULL THEN 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' WHEN position('Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' in p.description) > 0 THEN p.description ELSE p.description || ' ' || 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' END,
  "descriptionAr" = CASE WHEN p."descriptionAr" IS NULL THEN 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' WHEN position('المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' in p."descriptionAr") > 0 THEN p."descriptionAr" ELSE p."descriptionAr" || ' ' || 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' END
FROM "Faculty" f JOIN "University" u ON u.id = f."universityId"
WHERE p."facultyId" = f.id AND u.slug = 'cairo-national-university' AND f.slug = 'faculty-of-medicine';

UPDATE "Program" p SET "tuitionFee" = 137000, "tuitionPeriod" = 'YEAR', currency = 'EGP', "updatedAt" = now(),
  description = CASE WHEN p.description IS NULL THEN 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' WHEN position('Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' in p.description) > 0 THEN p.description ELSE p.description || ' ' || 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' END,
  "descriptionAr" = CASE WHEN p."descriptionAr" IS NULL THEN 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' WHEN position('المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' in p."descriptionAr") > 0 THEN p."descriptionAr" ELSE p."descriptionAr" || ' ' || 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' END
FROM "Faculty" f JOIN "University" u ON u.id = f."universityId"
WHERE p."facultyId" = f.id AND u.slug = 'cairo-national-university' AND f.slug = 'faculty-of-dentistry';

UPDATE "Program" p SET "tuitionFee" = 120000, "tuitionPeriod" = 'YEAR', currency = 'EGP', "updatedAt" = now(),
  description = CASE WHEN p.description IS NULL THEN 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' WHEN position('Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' in p.description) > 0 THEN p.description ELSE p.description || ' ' || 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' END,
  "descriptionAr" = CASE WHEN p."descriptionAr" IS NULL THEN 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' WHEN position('المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' in p."descriptionAr") > 0 THEN p."descriptionAr" ELSE p."descriptionAr" || ' ' || 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' END
FROM "Faculty" f JOIN "University" u ON u.id = f."universityId"
WHERE p."facultyId" = f.id AND u.slug = 'cairo-national-university' AND f.slug = 'faculty-of-pharmacy';

UPDATE "Program" p SET "tuitionFee" = 120000, "tuitionPeriod" = 'YEAR', currency = 'EGP', "updatedAt" = now(),
  description = CASE WHEN p.description IS NULL THEN 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' WHEN position('Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' in p.description) > 0 THEN p.description ELSE p.description || ' ' || 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' END,
  "descriptionAr" = CASE WHEN p."descriptionAr" IS NULL THEN 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' WHEN position('المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' in p."descriptionAr") > 0 THEN p."descriptionAr" ELSE p."descriptionAr" || ' ' || 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' END
FROM "Faculty" f JOIN "University" u ON u.id = f."universityId"
WHERE p."facultyId" = f.id AND u.slug = 'cairo-national-university' AND f.slug = 'faculty-of-physical-therapy';

UPDATE "Program" p SET "tuitionFee" = 88000, "tuitionPeriod" = 'YEAR', currency = 'EGP', "updatedAt" = now(),
  description = CASE WHEN p.description IS NULL THEN 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' WHEN position('Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' in p.description) > 0 THEN p.description ELSE p.description || ' ' || 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' END,
  "descriptionAr" = CASE WHEN p."descriptionAr" IS NULL THEN 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' WHEN position('المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' in p."descriptionAr") > 0 THEN p."descriptionAr" ELSE p."descriptionAr" || ' ' || 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' END
FROM "Faculty" f JOIN "University" u ON u.id = f."universityId"
WHERE p."facultyId" = f.id AND u.slug = 'cairo-national-university' AND f.slug = 'faculty-of-engineering';

UPDATE "Program" p SET "tuitionFee" = 88000, "tuitionPeriod" = 'YEAR', currency = 'EGP', "updatedAt" = now(),
  description = CASE WHEN p.description IS NULL THEN 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' WHEN position('Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' in p.description) > 0 THEN p.description ELSE p.description || ' ' || 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' END,
  "descriptionAr" = CASE WHEN p."descriptionAr" IS NULL THEN 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' WHEN position('المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' in p."descriptionAr") > 0 THEN p."descriptionAr" ELSE p."descriptionAr" || ' ' || 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' END
FROM "Faculty" f JOIN "University" u ON u.id = f."universityId"
WHERE p."facultyId" = f.id AND u.slug = 'cairo-national-university' AND f.slug = 'faculty-of-computers-information-and-artificial-intelligence';

UPDATE "Program" p SET "tuitionFee" = 85000, "tuitionPeriod" = 'YEAR', currency = 'EGP', "updatedAt" = now(),
  description = CASE WHEN p.description IS NULL THEN 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' WHEN position('Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' in p.description) > 0 THEN p.description ELSE p.description || ' ' || 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' END,
  "descriptionAr" = CASE WHEN p."descriptionAr" IS NULL THEN 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' WHEN position('المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' in p."descriptionAr") > 0 THEN p."descriptionAr" ELSE p."descriptionAr" || ' ' || 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' END
FROM "Faculty" f JOIN "University" u ON u.id = f."universityId"
WHERE p."facultyId" = f.id AND u.slug = 'cairo-national-university' AND f.slug = 'faculty-of-veterinary-medicine';

UPDATE "Program" p SET "tuitionFee" = 66000, "tuitionPeriod" = 'YEAR', currency = 'EGP', "updatedAt" = now(),
  description = CASE WHEN p.description IS NULL THEN 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' WHEN position('Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' in p.description) > 0 THEN p.description ELSE p.description || ' ' || 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' END,
  "descriptionAr" = CASE WHEN p."descriptionAr" IS NULL THEN 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' WHEN position('المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' in p."descriptionAr") > 0 THEN p."descriptionAr" ELSE p."descriptionAr" || ' ' || 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' END
FROM "Faculty" f JOIN "University" u ON u.id = f."universityId"
WHERE p."facultyId" = f.id AND u.slug = 'cairo-national-university' AND f.slug = 'faculty-of-nursing';

UPDATE "Program" p SET "tuitionFee" = 66000, "tuitionPeriod" = 'YEAR', currency = 'EGP', "updatedAt" = now(),
  description = CASE WHEN p.description IS NULL THEN 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' WHEN position('Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' in p.description) > 0 THEN p.description ELSE p.description || ' ' || 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' END,
  "descriptionAr" = CASE WHEN p."descriptionAr" IS NULL THEN 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' WHEN position('المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' in p."descriptionAr") > 0 THEN p."descriptionAr" ELSE p."descriptionAr" || ' ' || 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' END
FROM "Faculty" f JOIN "University" u ON u.id = f."universityId"
WHERE p."facultyId" = f.id AND u.slug = 'cairo-national-university' AND f.slug = 'faculty-of-science';

UPDATE "Program" p SET "tuitionFee" = 66000, "tuitionPeriod" = 'YEAR', currency = 'EGP', "updatedAt" = now(),
  description = CASE WHEN p.description IS NULL THEN 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' WHEN position('Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' in p.description) > 0 THEN p.description ELSE p.description || ' ' || 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' END,
  "descriptionAr" = CASE WHEN p."descriptionAr" IS NULL THEN 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' WHEN position('المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' in p."descriptionAr") > 0 THEN p."descriptionAr" ELSE p."descriptionAr" || ' ' || 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' END
FROM "Faculty" f JOIN "University" u ON u.id = f."universityId"
WHERE p."facultyId" = f.id AND u.slug = 'cairo-national-university' AND f.slug = 'faculty-of-business';

UPDATE "Program" p SET "tuitionFee" = 66000, "tuitionPeriod" = 'YEAR', currency = 'EGP', "updatedAt" = now(),
  description = CASE WHEN p.description IS NULL THEN 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' WHEN position('Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' in p.description) > 0 THEN p.description ELSE p.description || ' ' || 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' END,
  "descriptionAr" = CASE WHEN p."descriptionAr" IS NULL THEN 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' WHEN position('المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' in p."descriptionAr") > 0 THEN p."descriptionAr" ELSE p."descriptionAr" || ' ' || 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' END
FROM "Faculty" f JOIN "University" u ON u.id = f."universityId"
WHERE p."facultyId" = f.id AND u.slug = 'cairo-national-university' AND f.slug = 'faculty-of-economics-and-political-science';

UPDATE "Program" p SET "tuitionFee" = 55000, "tuitionPeriod" = 'YEAR', currency = 'EGP', "updatedAt" = now(),
  description = CASE WHEN p.description IS NULL THEN 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' WHEN position('Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' in p.description) > 0 THEN p.description ELSE p.description || ' ' || 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' END,
  "descriptionAr" = CASE WHEN p."descriptionAr" IS NULL THEN 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' WHEN position('المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' in p."descriptionAr") > 0 THEN p."descriptionAr" ELSE p."descriptionAr" || ' ' || 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' END
FROM "Faculty" f JOIN "University" u ON u.id = f."universityId"
WHERE p."facultyId" = f.id AND u.slug = 'cairo-national-university' AND f.slug = 'faculty-of-law';

UPDATE "Program" p SET "tuitionFee" = 33000, "tuitionPeriod" = 'YEAR', currency = 'EGP', "updatedAt" = now(),
  description = CASE WHEN p.description IS NULL THEN 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' WHEN position('Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' in p.description) > 0 THEN p.description ELSE p.description || ' ' || 'Annual fee for 2026/2027; administrative and service fees may be added under the university''s regulations.' END,
  "descriptionAr" = CASE WHEN p."descriptionAr" IS NULL THEN 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' WHEN position('المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' in p."descriptionAr") > 0 THEN p."descriptionAr" ELSE p."descriptionAr" || ' ' || 'المصروفات السنوية للعام الجامعي 2026/2027، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.' END
FROM "Faculty" f JOIN "University" u ON u.id = f."universityId"
WHERE p."facultyId" = f.id AND u.slug = 'cairo-national-university' AND f.slug = 'faculty-of-early-childhood-education';

-- Ain Shams National's temporary home, per its fee infographic.
UPDATE "University" SET description = description || ' Until its campus opens, teaching takes place at Ain Shams University''s Abbassia campus in Cairo.', "descriptionAr" = "descriptionAr" || ' وتجري الدراسة مؤقتًا في مقر جامعة عين شمس بالعباسية في القاهرة لحين افتتاح حرمها الجامعي.', "updatedAt" = now()
WHERE slug = 'ain-shams-national-university' AND position('Until its campus opens, teaching takes place at Ain Shams University''s Abbassia campus in Cairo.' in description) = 0;

COMMIT;
