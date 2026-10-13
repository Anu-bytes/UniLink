-- Cairo National University: fees for the two faculties missing from the
-- 2026/2027 fee infographic (2026-10-13).
--
-- Mass Communication: EGP 50,000 in 2025/2026 (Al-Ahram, 13 Jul 2025), and the
-- university announced a 10% increase for new students in 2026/2027 (Youm7,
-- 22 Apr 2026). Every other faculty moved exactly that way (rounded down, e.g.
-- Law 50,000 -> 55,000), so 55,000.
--
-- Commerce (English-taught programs): no separate English-track fee has been
-- published; every list gives a single business faculty fee, 66,000 for
-- 2026/2027 (Al-Watan, 4 Aug 2026; matches the infographic).

BEGIN;

UPDATE "Program" p SET "tuitionFee" = 55000, "tuitionPeriod" = 'YEAR', currency = 'EGP', "updatedAt" = now(),
  description = 'Annual fee for 2026/2027, based on the published 2025/2026 fee (EGP 50,000) plus the 10% increase the university announced for new students; administrative and service fees may be added under the university''s regulations.',
  "descriptionAr" = 'المصروفات السنوية للعام الجامعي 2026/2027، محسوبة من مصروفات 2025/2026 المعلنة (50 ألف جنيه) مع زيادة 10% التي أعلنتها الجامعة للطلاب الجدد، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.'
FROM "Faculty" f JOIN "University" u ON u.id = f."universityId"
WHERE p."facultyId" = f.id AND u.slug = 'cairo-national-university' AND f.slug = 'faculty-of-mass-communication';

UPDATE "Program" p SET "tuitionFee" = 66000, "tuitionPeriod" = 'YEAR', currency = 'EGP', "updatedAt" = now(),
  description = 'Annual fee for 2026/2027: the university''s published business faculty fee, as no separate fee has been announced for the English-taught programs; administrative and service fees may be added under the university''s regulations.',
  "descriptionAr" = 'المصروفات السنوية للعام الجامعي 2026/2027: مصروفات كلية الأعمال المعلنة، إذ لم تُعلن مصروفات منفصلة للبرامج باللغة الإنجليزية، وقد تُضاف إليها رسوم إدارية وخدمات وفقًا للوائح الجامعة.'
FROM "Faculty" f JOIN "University" u ON u.id = f."universityId"
WHERE p."facultyId" = f.id AND u.slug = 'cairo-national-university' AND f.slug = 'faculty-of-commerce';

COMMIT;
