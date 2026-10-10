-- Faculties and 2026/2027 tuition for ten universities that had none, from
-- the client sheet "مصروفات_الجامعات_المصرية_2026_2027 (6).xlsx" (2026-10-10).
-- Where a university publishes fee categories, the full (undiscounted) fee
-- is the tuition and every category is in the program description, the
-- same convention as the earlier tuition files. Campus-specific fees are
-- separate programs named after the campus. Safe to re-run: existing
-- faculties/programs (same slug) are left untouched.

BEGIN;

-- Nile Valley University is in Fayoum (this sheet and the description sheet),
-- not Qena as previously recorded.
UPDATE "University" SET city = 'Fayoum', "cityAr" = 'الفيوم',
  "addressLine" = 'Hadayek Demo, Al-Hay Al-Momayaz, Fayoum Governorate',
  "addressLineAr" = 'حدائق دمو، الحي المميز، محافظة الفيوم'
WHERE slug = 'nile-valley-university';

-- universite-francaise-degypte
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_b25921eb583447cc9fb6', u.id, 'Science, Engineering & Architecture', 'العلوم والهندسة والعمارة', 'science-engineering-and-architecture', 0, now() FROM "University" u WHERE u.slug = 'universite-francaise-degypte'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_6a154be63af34fdcb1fe', u.id, f.id, 'Science, Engineering & Architecture', 'العلوم والهندسة والعمارة', 'science-engineering-and-architecture', 'BACHELOR', 'engineering', 180000, 'YEAR', 'EGP', 'Fee for Egyptian students. International students: €3,800 per year.', 'المصروفات للطلاب المصريين. الطلاب الوافدون: 3,800 يورو سنويًا.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'science-engineering-and-architecture' WHERE u.slug = 'universite-francaise-degypte'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_f10f04a3783b4270ace1', u.id, 'Management & Information Systems', 'الإدارة ونظم المعلومات', 'management-and-information-systems', 1, now() FROM "University" u WHERE u.slug = 'universite-francaise-degypte'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_738d7607325f42458f56', u.id, f.id, 'Management & Information Systems', 'الإدارة ونظم المعلومات', 'management-and-information-systems', 'BACHELOR', 'business_administration', 160000, 'YEAR', 'EGP', 'Fee for Egyptian students. International students: €3,300 per year.', 'المصروفات للطلاب المصريين. الطلاب الوافدون: 3,300 يورو سنويًا.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'management-and-information-systems' WHERE u.slug = 'universite-francaise-degypte'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_437c4129bc8b478aa15a', u.id, 'Applied Languages & Humanities', 'اللغات التطبيقية والعلوم الإنسانية', 'applied-languages-and-humanities', 2, now() FROM "University" u WHERE u.slug = 'universite-francaise-degypte'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_5a4971c4791642f08738', u.id, f.id, 'Applied Languages & Humanities', 'اللغات التطبيقية والعلوم الإنسانية', 'applied-languages-and-humanities', 'BACHELOR', 'languages_translation', 130000, 'YEAR', 'EGP', 'Fee for Egyptian students. International students: €2,800 per year.', 'المصروفات للطلاب المصريين. الطلاب الوافدون: 2,800 يورو سنويًا.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'applied-languages-and-humanities' WHERE u.slug = 'universite-francaise-degypte'
ON CONFLICT ("universityId", slug) DO NOTHING;

-- egyptian-chinese-university
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_11f54437c1c14fcd8098', u.id, 'Faculty of Physical Therapy', 'كلية العلاج الطبيعي', 'faculty-of-physical-therapy', 0, now() FROM "University" u WHERE u.slug = 'egyptian-chinese-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_558ed7b721474a4ea609', u.id, f.id, 'Physical Therapy – Gesr El Suez Campus', 'العلاج الطبيعي – فرع جسر السويس', 'physical-therapy-gesr-el-suez-campus', 'BACHELOR', 'physical_therapy', 100000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-physical-therapy' WHERE u.slug = 'egyptian-chinese-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_f36ba49d29ae4290a6ca', u.id, 'Faculty of Pharmacy & Drug Technology', 'كلية الصيدلة وتكنولوجيا الدواء', 'faculty-of-pharmacy-and-drug-technology', 1, now() FROM "University" u WHERE u.slug = 'egyptian-chinese-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_88e3b773fc2d4b649c21', u.id, f.id, 'Pharmacy & Drug Technology – Gesr El Suez Campus', 'الصيدلة وتكنولوجيا الدواء – فرع جسر السويس', 'pharmacy-and-drug-technology-gesr-el-suez-campus', 'BACHELOR', 'pharmacy', 100000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-pharmacy-and-drug-technology' WHERE u.slug = 'egyptian-chinese-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_c4be4fcae9ef4e749548', u.id, 'Faculty of Engineering & Technology', 'كلية الهندسة والتكنولوجيا', 'faculty-of-engineering-and-technology', 2, now() FROM "University" u WHERE u.slug = 'egyptian-chinese-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_25661ccde0e248b6ac6a', u.id, f.id, 'Engineering & Technology – Gesr El Suez Campus', 'الهندسة والتكنولوجيا – فرع جسر السويس', 'engineering-and-technology-gesr-el-suez-campus', 'BACHELOR', 'engineering', 70000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-engineering-and-technology' WHERE u.slug = 'egyptian-chinese-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_77295ee5c298401593e6', u.id, 'Faculty of Economics & International Trade', 'كلية الاقتصاد والتجارة الدولية', 'faculty-of-economics-and-international-trade', 3, now() FROM "University" u WHERE u.slug = 'egyptian-chinese-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_ba09b671d68748c0a1c5', u.id, f.id, 'Economics & International Trade – Gesr El Suez Campus', 'الاقتصاد والتجارة الدولية – فرع جسر السويس', 'economics-and-international-trade-gesr-el-suez-campus', 'BACHELOR', 'business_administration', 60000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-economics-and-international-trade' WHERE u.slug = 'egyptian-chinese-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_003712a7e2064a84a781', u.id, 'Faculty of Veterinary Medicine', 'كلية الطب البيطري', 'faculty-of-veterinary-medicine', 4, now() FROM "University" u WHERE u.slug = 'egyptian-chinese-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_a5c6847af51448dd8924', u.id, f.id, 'Veterinary Medicine – Nasr City Campus', 'الطب البيطري – فرع مدينة نصر', 'veterinary-medicine-nasr-city-campus', 'BACHELOR', 'veterinary', 70000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-veterinary-medicine' WHERE u.slug = 'egyptian-chinese-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_8cf3396ea1d2455ebbd1', u.id, 'Faculty of Nursing', 'كلية التمريض', 'faculty-of-nursing', 5, now() FROM "University" u WHERE u.slug = 'egyptian-chinese-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_2892228587aa452c9901', u.id, f.id, 'Nursing – Nasr City Campus', 'التمريض – فرع مدينة نصر', 'nursing-nasr-city-campus', 'BACHELOR', 'nursing', 60000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-nursing' WHERE u.slug = 'egyptian-chinese-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_cf6e869b50cb45839be4', u.id, 'Faculty of Computers & Information Systems', 'كلية الحاسبات ونظم المعلومات', 'faculty-of-computers-and-information-systems', 6, now() FROM "University" u WHERE u.slug = 'egyptian-chinese-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_a91618064ddc4114bcad', u.id, f.id, 'Computers & Information Systems – Nasr City Campus', 'الحاسبات ونظم المعلومات – فرع مدينة نصر', 'computers-and-information-systems-nasr-city-campus', 'BACHELOR', 'computer_science', 75000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-computers-and-information-systems' WHERE u.slug = 'egyptian-chinese-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_d87701336f0b433f8816', u.id, 'Faculty of Arts & Design', 'كلية الفنون والتصميم', 'faculty-of-arts-and-design', 7, now() FROM "University" u WHERE u.slug = 'egyptian-chinese-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_d6fecf388d0d45b19ef5', u.id, f.id, 'Arts & Design – Nasr City Campus', 'الفنون والتصميم – فرع مدينة نصر', 'arts-and-design-nasr-city-campus', 'BACHELOR', 'applied_arts', 60000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-arts-and-design' WHERE u.slug = 'egyptian-chinese-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_671eac29197249a583fb', u.id, 'Faculty of Mass Communication', 'كلية الإعلام', 'faculty-of-mass-communication', 8, now() FROM "University" u WHERE u.slug = 'egyptian-chinese-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_6ba708bb870241ff8324', u.id, f.id, 'Mass Communication – Nasr City Campus', 'الإعلام – فرع مدينة نصر', 'mass-communication-nasr-city-campus', 'BACHELOR', 'mass_communication', 53000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-mass-communication' WHERE u.slug = 'egyptian-chinese-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_91a2eb54b6bc41cfb429', u.id, 'Faculty of Literary Studies', 'كلية الدراسات الأدبية', 'faculty-of-literary-studies', 9, now() FROM "University" u WHERE u.slug = 'egyptian-chinese-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_8f12314cae3d464bb019', u.id, f.id, 'Literary Studies – Nasr City Campus', 'الدراسات الأدبية – فرع مدينة نصر', 'literary-studies-nasr-city-campus', 'BACHELOR', 'arts_humanities', 53000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-literary-studies' WHERE u.slug = 'egyptian-chinese-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_9b14ffd082ce47929deb', u.id, 'Faculty of Law', 'كلية القانون', 'faculty-of-law', 10, now() FROM "University" u WHERE u.slug = 'egyptian-chinese-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_177097d619cd44809ecb', u.id, f.id, 'Law – Nasr City Campus', 'القانون – فرع مدينة نصر', 'law-nasr-city-campus', 'BACHELOR', 'law', 48000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-law' WHERE u.slug = 'egyptian-chinese-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_bca5bdb7e5894ba2bb0c', u.id, 'Faculty of Humanities', 'كلية الإنسانيات', 'faculty-of-humanities', 11, now() FROM "University" u WHERE u.slug = 'egyptian-chinese-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_41baa0132a4d47f7a8e1', u.id, f.id, 'Geographic Information Systems – Nasr City Campus', 'نظم المعلومات الجغرافية – فرع مدينة نصر', 'geographic-information-systems-nasr-city-campus', 'BACHELOR', 'arts_humanities', 44000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-humanities' WHERE u.slug = 'egyptian-chinese-university'
ON CONFLICT ("universityId", slug) DO NOTHING;

-- canadian-international-college
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_b7677167ae924b7d81d6', u.id, 'School of Business', 'كلية إدارة الأعمال', 'school-of-business', 0, now() FROM "University" u WHERE u.slug = 'canadian-international-college'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_cd9a3d87037d4fab8fcc', u.id, f.id, 'Business – Sheikh Zayed Campus', 'إدارة الأعمال – فرع الشيخ زايد', 'business-sheikh-zayed-campus', 'BACHELOR', 'business_administration', 31763, 'YEAR', 'EGP', 'Per course: EGP 2,888 (11 courses a year). Optional Canadian dual degree: CAD 1,500.', 'سعر المادة: 2,888 (11 مقررًا سنويًا) جنيه. البرنامج المزدوج الكندي (اختياري): 1,500 دولار كندي.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'school-of-business' WHERE u.slug = 'canadian-international-college'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_63d2d667485946c99fda', u.id, f.id, 'Business – New Cairo Campus', 'إدارة الأعمال – فرع القاهرة الجديدة', 'business-new-cairo-campus', 'BACHELOR', 'business_administration', 45912, 'YEAR', 'EGP', 'Per course: EGP 4,389 (11 courses a year). Optional Canadian dual degree: CAD 1,500.', 'سعر المادة: 4,389 (11 مقررًا سنويًا) جنيه. البرنامج المزدوج الكندي (اختياري): 1,500 دولار كندي.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'school-of-business' WHERE u.slug = 'canadian-international-college'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_a02d8aeaa555402daf4b', u.id, 'School of Computer Science', 'كلية علوم الحاسب', 'school-of-computer-science', 1, now() FROM "University" u WHERE u.slug = 'canadian-international-college'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_caf11307d7f7476a88ae', u.id, f.id, 'Computer Science – Sheikh Zayed Campus', 'علوم الحاسب – فرع الشيخ زايد', 'computer-science-sheikh-zayed-campus', 'BACHELOR', 'computer_science', 40898, 'YEAR', 'EGP', 'Per credit hour: EGP 1,169 (35 credit hours a year).', 'سعر الساعة المعتمدة: 1,169 جنيه (35 ساعة معتمدة سنويًا).', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'school-of-computer-science' WHERE u.slug = 'canadian-international-college'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_d64d51f7efd4441f866f', u.id, f.id, 'Computer Science – New Cairo Campus', 'علوم الحاسب – فرع القاهرة الجديدة', 'computer-science-new-cairo-campus', 'BACHELOR', 'computer_science', 40898, 'YEAR', 'EGP', 'Per credit hour: EGP 1,169 (35 credit hours a year).', 'سعر الساعة المعتمدة: 1,169 جنيه (35 ساعة معتمدة سنويًا).', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'school-of-computer-science' WHERE u.slug = 'canadian-international-college'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_67a54ff144fe485e8c82', u.id, 'School of Engineering', 'كلية الهندسة', 'school-of-engineering', 2, now() FROM "University" u WHERE u.slug = 'canadian-international-college'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_3561343134ac45bb80cc', u.id, f.id, 'Engineering – New Cairo Campus', 'الهندسة – فرع القاهرة الجديدة', 'engineering-new-cairo-campus', 'BACHELOR', 'engineering', 45912, 'YEAR', 'EGP', 'Per course: EGP 3,826 (12 courses a year). Optional Canadian dual degree: CAD 1,500.', 'سعر المادة: 3,826 (12 مقررًا سنويًا) جنيه. البرنامج المزدوج الكندي (اختياري): 1,500 دولار كندي.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'school-of-engineering' WHERE u.slug = 'canadian-international-college'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_bbd02c8f7ea7439a95cd', u.id, 'School of Mass Communication', 'كلية الإعلام', 'school-of-mass-communication', 3, now() FROM "University" u WHERE u.slug = 'canadian-international-college'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_0d07225a53ee4d0b8cb9', u.id, f.id, 'Mass Communication – New Cairo Campus', 'الإعلام – فرع القاهرة الجديدة', 'mass-communication-new-cairo-campus', 'BACHELOR', 'mass_communication', 44352, 'YEAR', 'EGP', 'Per course: EGP 3,696 (12 courses a year). Optional Canadian dual degree: CAD 1,500.', 'سعر المادة: 3,696 (12 مقررًا سنويًا) جنيه. البرنامج المزدوج الكندي (اختياري): 1,500 دولار كندي.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'school-of-mass-communication' WHERE u.slug = 'canadian-international-college'
ON CONFLICT ("universityId", slug) DO NOTHING;

-- al-hayah-university-in-cairo
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_714c71100f8c445b871f', u.id, 'Faculty of Physical Therapy', 'كلية العلاج الطبيعي', 'faculty-of-physical-therapy', 0, now() FROM "University" u WHERE u.slug = 'al-hayah-university-in-cairo'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_a1abc7fbb93c4789ab72', u.id, f.id, 'Physical Therapy', 'العلاج الطبيعي', 'physical-therapy', 'BACHELOR', 'physical_therapy', 90000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-physical-therapy' WHERE u.slug = 'al-hayah-university-in-cairo'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_275fbaf81e3343d0aca1', u.id, 'Faculty of Business Administration', 'كلية إدارة الأعمال', 'faculty-of-business-administration', 1, now() FROM "University" u WHERE u.slug = 'al-hayah-university-in-cairo'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_f01d9c65c58645539492', u.id, f.id, 'Business Administration', 'إدارة الأعمال', 'business-administration', 'BACHELOR', 'business_administration', 50000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-business-administration' WHERE u.slug = 'al-hayah-university-in-cairo'
ON CONFLICT ("universityId", slug) DO NOTHING;

-- new-mansoura-university
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_66381f4acaf749da8585', u.id, 'Faculty of Medicine', 'كلية الطب البشري', 'faculty-of-medicine', 0, now() FROM "University" u WHERE u.slug = 'new-mansoura-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_d60e42677921400c869b', u.id, f.id, 'Medicine', 'الطب البشري', 'medicine', 'BACHELOR', 'medicine', 150000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-medicine' WHERE u.slug = 'new-mansoura-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_1c2994a3a07e41549df8', u.id, 'Faculty of Dentistry', 'كلية طب الفم والأسنان', 'faculty-of-dentistry', 1, now() FROM "University" u WHERE u.slug = 'new-mansoura-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_e0e65c54aa8c46da80ca', u.id, f.id, 'Dentistry', 'طب الفم والأسنان', 'dentistry', 'BACHELOR', 'dentistry', 130000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-dentistry' WHERE u.slug = 'new-mansoura-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_73f5b6020d0343218686', u.id, 'Faculty of Pharmacy', 'كلية الصيدلة', 'faculty-of-pharmacy', 2, now() FROM "University" u WHERE u.slug = 'new-mansoura-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_023acbbaf4744a2788c7', u.id, f.id, 'Pharmacy', 'الصيدلة', 'pharmacy', 'BACHELOR', 'pharmacy', 100000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-pharmacy' WHERE u.slug = 'new-mansoura-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_56755177ad4c487894ea', u.id, 'Faculty of Computer Science & Engineering', 'كلية علوم وهندسة الحاسب', 'faculty-of-computer-science-and-engineering', 3, now() FROM "University" u WHERE u.slug = 'new-mansoura-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_0e845b37919f4f0fb27e', u.id, f.id, 'Computer Science & Engineering', 'علوم وهندسة الحاسب', 'computer-science-and-engineering', 'BACHELOR', 'computer_science', 75000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-computer-science-and-engineering' WHERE u.slug = 'new-mansoura-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_07f4ae804e854946ae74', u.id, 'Faculty of Engineering', 'كلية الهندسة', 'faculty-of-engineering', 4, now() FROM "University" u WHERE u.slug = 'new-mansoura-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_731e731306a041c581ce', u.id, f.id, 'Engineering', 'الهندسة', 'engineering', 'BACHELOR', 'engineering', 75000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-engineering' WHERE u.slug = 'new-mansoura-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_5965480ff3bc4b6185c6', u.id, 'Faculty of Applied Health Sciences Technology', 'كلية تكنولوجيا العلوم الصحية التطبيقية', 'faculty-of-applied-health-sciences-technology', 5, now() FROM "University" u WHERE u.slug = 'new-mansoura-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_d7207438f4414d0d99d7', u.id, f.id, 'Applied Health Sciences Technology', 'تكنولوجيا العلوم الصحية التطبيقية', 'applied-health-sciences-technology', 'BACHELOR', 'health_sciences', 60000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-applied-health-sciences-technology' WHERE u.slug = 'new-mansoura-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_fa62587b4b594d5094fb', u.id, 'Faculty of Nursing', 'كلية التمريض', 'faculty-of-nursing', 6, now() FROM "University" u WHERE u.slug = 'new-mansoura-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_cbcbe54271df496db9ff', u.id, f.id, 'Nursing', 'التمريض', 'nursing', 'BACHELOR', 'nursing', 60000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-nursing' WHERE u.slug = 'new-mansoura-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_4e3c4d546f134d26883b', u.id, 'Faculty of Science', 'كلية العلوم', 'faculty-of-science', 7, now() FROM "University" u WHERE u.slug = 'new-mansoura-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_801ffd6281a844f19740', u.id, f.id, 'Science', 'العلوم', 'science', 'BACHELOR', 'science', 55000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-science' WHERE u.slug = 'new-mansoura-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_b09ba2843f4140819772', u.id, 'Faculty of Business', 'كلية الأعمال', 'faculty-of-business', 8, now() FROM "University" u WHERE u.slug = 'new-mansoura-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_7eae147617b34015aadf', u.id, f.id, 'Business', 'الأعمال', 'business', 'BACHELOR', 'business_administration', 50000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-business' WHERE u.slug = 'new-mansoura-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_38663a9146224652af71', u.id, 'Faculty of Law', 'كلية القانون', 'faculty-of-law', 9, now() FROM "University" u WHERE u.slug = 'new-mansoura-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_24f1af7d081944ad86c9', u.id, f.id, 'Law', 'القانون', 'law', 'BACHELOR', 'law', 50000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-law' WHERE u.slug = 'new-mansoura-university'
ON CONFLICT ("universityId", slug) DO NOTHING;

-- egyptian-informatics-university
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_1ed39521ff544ecbbec5', u.id, 'Faculty of Computer & Information Sciences', 'كلية علوم الحاسب والمعلومات', 'faculty-of-computer-and-information-sciences', 0, now() FROM "University" u WHERE u.slug = 'egyptian-informatics-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_be8345e4180647fba5db', u.id, f.id, 'Computer & Information Sciences', 'علوم الحاسب والمعلومات', 'computer-and-information-sciences', 'BACHELOR', 'computer_science', 198000, 'YEAR', 'EGP', 'First term: EGP 96,000 · Second term: EGP 102,000.', 'الترم الأول: 96,000 جنيه · الترم الثاني: 102,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-computer-and-information-sciences' WHERE u.slug = 'egyptian-informatics-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_772d1b24ed0d4c9bb523', u.id, 'Faculty of Engineering', 'كلية الهندسة', 'faculty-of-engineering', 1, now() FROM "University" u WHERE u.slug = 'egyptian-informatics-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_2f5b63159f774b60b6b7', u.id, f.id, 'Engineering', 'الهندسة', 'engineering', 'BACHELOR', 'engineering', 226800, 'YEAR', 'EGP', 'First term: EGP 113,400 · Second term: EGP 113,400.', 'الترم الأول: 113,400 جنيه · الترم الثاني: 113,400 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-engineering' WHERE u.slug = 'egyptian-informatics-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_0b338847193644a892f3', u.id, 'Faculty of Business Information Systems', 'كلية نظم معلومات الأعمال', 'faculty-of-business-information-systems', 2, now() FROM "University" u WHERE u.slug = 'egyptian-informatics-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_9406f8b217a74d2db216', u.id, f.id, 'Business Information Systems', 'نظم معلومات الأعمال', 'business-information-systems', 'BACHELOR', 'business_administration', 179200, 'YEAR', 'EGP', 'First term: EGP 95,200 · Second term: EGP 84,000.', 'الترم الأول: 95,200 جنيه · الترم الثاني: 84,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-business-information-systems' WHERE u.slug = 'egyptian-informatics-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_c6779bf69a1b43dd890c', u.id, 'Faculty of Digital Arts & Design', 'كلية الفنون الرقمية والتصميم', 'faculty-of-digital-arts-and-design', 3, now() FROM "University" u WHERE u.slug = 'egyptian-informatics-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_2e880969badf465994aa', u.id, f.id, 'Digital Arts & Design', 'الفنون الرقمية والتصميم', 'digital-arts-and-design', 'BACHELOR', 'applied_arts', 201600, 'YEAR', 'EGP', 'First term: EGP 100,800 · Second term: EGP 100,800.', 'الترم الأول: 100,800 جنيه · الترم الثاني: 100,800 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-digital-arts-and-design' WHERE u.slug = 'egyptian-informatics-university'
ON CONFLICT ("universityId", slug) DO NOTHING;

-- hertfordshire-university-egypt
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_ab66e6b810654fc0a93a', u.id, 'Faculty of Business', 'كلية إدارة الأعمال', 'faculty-of-business', 0, now() FROM "University" u WHERE u.slug = 'hertfordshire-university-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_173ea0f48a714fa6bce8', u.id, f.id, 'Business Administration', 'إدارة الأعمال', 'business-administration', 'BACHELOR', 'business_administration', 330000, 'YEAR', 'EGP', 'Base fee. Categories: A: 280,000 EGP · B: 290,000 EGP · C: 300,000 EGP.', 'المصروفات الأساسية. الفئات: A: 280,000 جنيه · B: 290,000 جنيه · C: 300,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-business' WHERE u.slug = 'hertfordshire-university-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_ba225ff5c1224320b404', u.id, 'Faculty of Engineering & Computer Science', 'كلية الهندسة وعلوم الحاسب', 'faculty-of-engineering-and-computer-science', 1, now() FROM "University" u WHERE u.slug = 'hertfordshire-university-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_5e742ab04e6a4e309b42', u.id, f.id, 'Engineering & Computer Science', 'الهندسة وعلوم الحاسب', 'engineering-and-computer-science', 'BACHELOR', 'engineering', 370000, 'YEAR', 'EGP', 'Base fee. Categories: A: 310,000 EGP · B: 320,000 EGP · C: 330,000 EGP.', 'المصروفات الأساسية. الفئات: A: 310,000 جنيه · B: 320,000 جنيه · C: 330,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-engineering-and-computer-science' WHERE u.slug = 'hertfordshire-university-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_172bda27dc30463b9ab0', u.id, 'Faculty of Pharmaceutical Sciences & Pharmacy', 'كلية العلوم الصيدلانية والصيدلة', 'faculty-of-pharmaceutical-sciences-and-pharmacy', 2, now() FROM "University" u WHERE u.slug = 'hertfordshire-university-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_ac98ce2fae6946ffad34', u.id, f.id, 'Pharmacy (MPharm)', 'الصيدلة (MPharm)', 'pharmacy-mpharm', 'BACHELOR', 'pharmacy', 370000, 'YEAR', 'EGP', 'Base fee. Categories: A: 310,000 EGP · B: 320,000 EGP · C: 330,000 EGP.', 'المصروفات الأساسية. الفئات: A: 310,000 جنيه · B: 320,000 جنيه · C: 330,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-pharmaceutical-sciences-and-pharmacy' WHERE u.slug = 'hertfordshire-university-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_bafd62ead98b4ef7a6a4', u.id, 'Faculty of Psychology, Nutrition & Neuroscience', 'كلية علم النفس والتغذية وعلوم الأعصاب', 'faculty-of-psychology-nutrition-and-neuroscience', 3, now() FROM "University" u WHERE u.slug = 'hertfordshire-university-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_398531cf877941809099', u.id, f.id, 'Psychology, Nutrition & Neuroscience', 'علم النفس والتغذية وعلوم الأعصاب', 'psychology-nutrition-and-neuroscience', 'BACHELOR', 'health_sciences', 330000, 'YEAR', 'EGP', 'Base fee. Categories: A: 280,000 EGP · B: 290,000 EGP · C: 300,000 EGP.', 'المصروفات الأساسية. الفئات: A: 280,000 جنيه · B: 290,000 جنيه · C: 300,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-psychology-nutrition-and-neuroscience' WHERE u.slug = 'hertfordshire-university-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_80bd2407dd4049b8ad3b', u.id, 'Faculty of Physical Therapy', 'كلية العلاج الطبيعي', 'faculty-of-physical-therapy', 4, now() FROM "University" u WHERE u.slug = 'hertfordshire-university-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_f949d55e062241dfbb22', u.id, f.id, 'Physical Therapy', 'العلاج الطبيعي', 'physical-therapy', 'BACHELOR', 'physical_therapy', 370000, 'YEAR', 'EGP', 'Base fee. Categories: A: 310,000 EGP · B: 320,000 EGP · C: 330,000 EGP.', 'المصروفات الأساسية. الفئات: A: 310,000 جنيه · B: 320,000 جنيه · C: 330,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-physical-therapy' WHERE u.slug = 'hertfordshire-university-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_a9642aeff6074fcea251', u.id, 'Faculty of Media', 'كلية الإعلام', 'faculty-of-media', 5, now() FROM "University" u WHERE u.slug = 'hertfordshire-university-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_760bdf688dbe4c3b9fb5', u.id, f.id, 'Media', 'الإعلام', 'media', 'BACHELOR', 'mass_communication', 330000, 'YEAR', 'EGP', 'Base fee. Categories: A: 280,000 EGP · B: 290,000 EGP · C: 300,000 EGP.', 'المصروفات الأساسية. الفئات: A: 280,000 جنيه · B: 290,000 جنيه · C: 300,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-media' WHERE u.slug = 'hertfordshire-university-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_442901c98f6e4da4a579', u.id, 'Faculty of Creative Arts', 'كلية الفنون الإبداعية', 'faculty-of-creative-arts', 6, now() FROM "University" u WHERE u.slug = 'hertfordshire-university-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_2a30c54ae5514bb08439', u.id, f.id, 'Creative Arts', 'الفنون الإبداعية', 'creative-arts', 'BACHELOR', 'applied_arts', 370000, 'YEAR', 'EGP', 'Base fee. Categories: A: 310,000 EGP · B: 320,000 EGP · C: 330,000 EGP.', 'المصروفات الأساسية. الفئات: A: 310,000 جنيه · B: 320,000 جنيه · C: 330,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-creative-arts' WHERE u.slug = 'hertfordshire-university-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;

-- university-of-london-egypt
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_cf5778fa30f84f6c991f', u.id, 'Economics, Management, Finance & Social Sciences', 'الاقتصاد والإدارة والتمويل والعلوم الاجتماعية', 'economics-management-finance-and-social-sciences', 0, now() FROM "University" u WHERE u.slug = 'university-of-london-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_0bd5c93706434ca0a2a9', u.id, f.id, 'Economics & Politics', 'الاقتصاد والسياسة', 'economics-and-politics', 'BACHELOR', 'economics_political_science', 400000, 'YEAR', 'EGP', 'Foundation and bachelor''s fees by category: A: 350,000 EGP · B: 375,000 EGP · C: 400,000 EGP · Conditional admission: 420,000 EGP.', 'مصروفات التأسيس والبكالوريوس حسب الفئة: A: 350,000 جنيه · B: 375,000 جنيه · C: 400,000 جنيه · القبول المشروط: 420,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'economics-management-finance-and-social-sciences' WHERE u.slug = 'university-of-london-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_f46ae55c62664e3dbd65', u.id, f.id, 'Business Administration', 'إدارة الأعمال', 'business-administration', 'BACHELOR', 'business_administration', 400000, 'YEAR', 'EGP', 'Foundation and bachelor''s fees by category: A: 350,000 EGP · B: 375,000 EGP · C: 400,000 EGP · Conditional admission: 420,000 EGP.', 'مصروفات التأسيس والبكالوريوس حسب الفئة: A: 350,000 جنيه · B: 375,000 جنيه · C: 400,000 جنيه · القبول المشروط: 420,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'economics-management-finance-and-social-sciences' WHERE u.slug = 'university-of-london-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_65695da7723d405cb082', u.id, f.id, 'Politics & International Relations', 'السياسة والعلاقات الدولية', 'politics-and-international-relations', 'BACHELOR', 'economics_political_science', 400000, 'YEAR', 'EGP', 'Foundation and bachelor''s fees by category: A: 350,000 EGP · B: 375,000 EGP · C: 400,000 EGP · Conditional admission: 420,000 EGP.', 'مصروفات التأسيس والبكالوريوس حسب الفئة: A: 350,000 جنيه · B: 375,000 جنيه · C: 400,000 جنيه · القبول المشروط: 420,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'economics-management-finance-and-social-sciences' WHERE u.slug = 'university-of-london-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_89e1e605d09a4e09927a', u.id, f.id, 'Finance', 'التمويل', 'finance', 'BACHELOR', 'business_administration', 400000, 'YEAR', 'EGP', 'Foundation and bachelor''s fees by category: A: 350,000 EGP · B: 375,000 EGP · C: 400,000 EGP · Conditional admission: 420,000 EGP.', 'مصروفات التأسيس والبكالوريوس حسب الفئة: A: 350,000 جنيه · B: 375,000 جنيه · C: 400,000 جنيه · القبول المشروط: 420,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'economics-management-finance-and-social-sciences' WHERE u.slug = 'university-of-london-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_178ba3aa9820480bb0b3', u.id, f.id, 'Economics', 'الاقتصاد', 'economics', 'BACHELOR', 'economics_political_science', 400000, 'YEAR', 'EGP', 'Foundation and bachelor''s fees by category: A: 350,000 EGP · B: 375,000 EGP · C: 400,000 EGP · Conditional admission: 420,000 EGP.', 'مصروفات التأسيس والبكالوريوس حسب الفئة: A: 350,000 جنيه · B: 375,000 جنيه · C: 400,000 جنيه · القبول المشروط: 420,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'economics-management-finance-and-social-sciences' WHERE u.slug = 'university-of-london-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_eb433239965547dda2e8', u.id, f.id, 'Economics & Finance', 'الاقتصاد والتمويل', 'economics-and-finance', 'BACHELOR', 'economics_political_science', 400000, 'YEAR', 'EGP', 'Foundation and bachelor''s fees by category: A: 350,000 EGP · B: 375,000 EGP · C: 400,000 EGP · Conditional admission: 420,000 EGP.', 'مصروفات التأسيس والبكالوريوس حسب الفئة: A: 350,000 جنيه · B: 375,000 جنيه · C: 400,000 جنيه · القبول المشروط: 420,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'economics-management-finance-and-social-sciences' WHERE u.slug = 'university-of-london-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_ac53840657b542bc8a83', u.id, f.id, 'Economics & Management', 'الاقتصاد والإدارة', 'economics-and-management', 'BACHELOR', 'economics_political_science', 400000, 'YEAR', 'EGP', 'Foundation and bachelor''s fees by category: A: 350,000 EGP · B: 375,000 EGP · C: 400,000 EGP · Conditional admission: 420,000 EGP.', 'مصروفات التأسيس والبكالوريوس حسب الفئة: A: 350,000 جنيه · B: 375,000 جنيه · C: 400,000 جنيه · القبول المشروط: 420,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'economics-management-finance-and-social-sciences' WHERE u.slug = 'university-of-london-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_54783d9b5ecd488486c6', u.id, f.id, 'Data Science & Business Analytics', 'علوم البيانات وتحليلات الأعمال', 'data-science-and-business-analytics', 'BACHELOR', 'computer_science', 400000, 'YEAR', 'EGP', 'Foundation and bachelor''s fees by category: A: 350,000 EGP · B: 375,000 EGP · C: 400,000 EGP · Conditional admission: 420,000 EGP.', 'مصروفات التأسيس والبكالوريوس حسب الفئة: A: 350,000 جنيه · B: 375,000 جنيه · C: 400,000 جنيه · القبول المشروط: 420,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'economics-management-finance-and-social-sciences' WHERE u.slug = 'university-of-london-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_9d3f5c7f546b41ecb903', u.id, f.id, 'International Development', 'التنمية الدولية', 'international-development', 'BACHELOR', 'economics_political_science', 400000, 'YEAR', 'EGP', 'Foundation and bachelor''s fees by category: A: 350,000 EGP · B: 375,000 EGP · C: 400,000 EGP · Conditional admission: 420,000 EGP.', 'مصروفات التأسيس والبكالوريوس حسب الفئة: A: 350,000 جنيه · B: 375,000 جنيه · C: 400,000 جنيه · القبول المشروط: 420,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'economics-management-finance-and-social-sciences' WHERE u.slug = 'university-of-london-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_23ca7bc7b8e348eb908e', u.id, f.id, 'Mathematics & Economics', 'الرياضيات والاقتصاد', 'mathematics-and-economics', 'BACHELOR', 'economics_political_science', 400000, 'YEAR', 'EGP', 'Foundation and bachelor''s fees by category: A: 350,000 EGP · B: 375,000 EGP · C: 400,000 EGP · Conditional admission: 420,000 EGP.', 'مصروفات التأسيس والبكالوريوس حسب الفئة: A: 350,000 جنيه · B: 375,000 جنيه · C: 400,000 جنيه · القبول المشروط: 420,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'economics-management-finance-and-social-sciences' WHERE u.slug = 'university-of-london-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_a239594de5b94b5f959b', u.id, 'Law', 'القانون', 'law', 1, now() FROM "University" u WHERE u.slug = 'university-of-london-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_7782db7c94ae4668b830', u.id, f.id, 'Law', 'القانون', 'law', 'BACHELOR', 'law', 400000, 'YEAR', 'EGP', 'Foundation and bachelor''s fees by category: A: 350,000 EGP · B: 375,000 EGP · C: 400,000 EGP · Conditional admission: 420,000 EGP.', 'مصروفات التأسيس والبكالوريوس حسب الفئة: A: 350,000 جنيه · B: 375,000 جنيه · C: 400,000 جنيه · القبول المشروط: 420,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'law' WHERE u.slug = 'university-of-london-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_47e83e44a77e45e5a382', u.id, 'Psychology', 'علم النفس', 'psychology', 2, now() FROM "University" u WHERE u.slug = 'university-of-london-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_0092d3fe2a0f45f8b365', u.id, f.id, 'Psychology', 'علم النفس', 'psychology', 'BACHELOR', 'arts_humanities', 400000, 'YEAR', 'EGP', 'Foundation and bachelor''s fees by category: A: 350,000 EGP · B: 375,000 EGP · C: 400,000 EGP · Conditional admission: 420,000 EGP.', 'مصروفات التأسيس والبكالوريوس حسب الفئة: A: 350,000 جنيه · B: 375,000 جنيه · C: 400,000 جنيه · القبول المشروط: 420,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'psychology' WHERE u.slug = 'university-of-london-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_aa1442be317d4c78abc0', u.id, 'Computer Science', 'علوم الحاسبات', 'computer-science', 3, now() FROM "University" u WHERE u.slug = 'university-of-london-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_d76ab6a804bd43adaf41', u.id, f.id, 'Computer Science', 'علوم الحاسبات', 'computer-science', 'BACHELOR', 'computer_science', 400000, 'YEAR', 'EGP', 'Foundation and bachelor''s fees by category: A: 350,000 EGP · B: 375,000 EGP · C: 400,000 EGP · Conditional admission: 420,000 EGP.', 'مصروفات التأسيس والبكالوريوس حسب الفئة: A: 350,000 جنيه · B: 375,000 جنيه · C: 400,000 جنيه · القبول المشروط: 420,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'computer-science' WHERE u.slug = 'university-of-london-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_a970819248ae488a9a6f', u.id, f.id, 'Machine Learning & Artificial Intelligence', 'تعلم الآلة والذكاء الاصطناعي', 'machine-learning-and-artificial-intelligence', 'BACHELOR', 'artificial_intelligence', 400000, 'YEAR', 'EGP', 'Foundation and bachelor''s fees by category: A: 350,000 EGP · B: 375,000 EGP · C: 400,000 EGP · Conditional admission: 420,000 EGP.', 'مصروفات التأسيس والبكالوريوس حسب الفئة: A: 350,000 جنيه · B: 375,000 جنيه · C: 400,000 جنيه · القبول المشروط: 420,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'computer-science' WHERE u.slug = 'university-of-london-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_39e2f5affc5d4afd991d', u.id, f.id, 'Web & Mobile Development', 'تطوير الويب والهاتف المحمول', 'web-and-mobile-development', 'BACHELOR', 'computer_science', 400000, 'YEAR', 'EGP', 'Foundation and bachelor''s fees by category: A: 350,000 EGP · B: 375,000 EGP · C: 400,000 EGP · Conditional admission: 420,000 EGP.', 'مصروفات التأسيس والبكالوريوس حسب الفئة: A: 350,000 جنيه · B: 375,000 جنيه · C: 400,000 جنيه · القبول المشروط: 420,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'computer-science' WHERE u.slug = 'university-of-london-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_f95748d34f0440e3a7c5', u.id, f.id, 'Physical Computing & Internet of Things', 'الحوسبة المادية وإنترنت الأشياء', 'physical-computing-and-internet-of-things', 'BACHELOR', 'computer_science', 400000, 'YEAR', 'EGP', 'Foundation and bachelor''s fees by category: A: 350,000 EGP · B: 375,000 EGP · C: 400,000 EGP · Conditional admission: 420,000 EGP.', 'مصروفات التأسيس والبكالوريوس حسب الفئة: A: 350,000 جنيه · B: 375,000 جنيه · C: 400,000 جنيه · القبول المشروط: 420,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'computer-science' WHERE u.slug = 'university-of-london-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_d75f26d5accb4764adf0', u.id, f.id, 'Game Development', 'تطوير الألعاب', 'game-development', 'BACHELOR', 'computer_science', 400000, 'YEAR', 'EGP', 'Foundation and bachelor''s fees by category: A: 350,000 EGP · B: 375,000 EGP · C: 400,000 EGP · Conditional admission: 420,000 EGP.', 'مصروفات التأسيس والبكالوريوس حسب الفئة: A: 350,000 جنيه · B: 375,000 جنيه · C: 400,000 جنيه · القبول المشروط: 420,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'computer-science' WHERE u.slug = 'university-of-london-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_5bff194c684f494fb993', u.id, f.id, 'Virtual Reality', 'الواقع الافتراضي', 'virtual-reality', 'BACHELOR', 'computer_science', 400000, 'YEAR', 'EGP', 'Foundation and bachelor''s fees by category: A: 350,000 EGP · B: 375,000 EGP · C: 400,000 EGP · Conditional admission: 420,000 EGP.', 'مصروفات التأسيس والبكالوريوس حسب الفئة: A: 350,000 جنيه · B: 375,000 جنيه · C: 400,000 جنيه · القبول المشروط: 420,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'computer-science' WHERE u.slug = 'university-of-london-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_f9f43592c9104457b294', u.id, f.id, 'User Experience', 'تجربة المستخدم', 'user-experience', 'BACHELOR', 'computer_science', 400000, 'YEAR', 'EGP', 'Foundation and bachelor''s fees by category: A: 350,000 EGP · B: 375,000 EGP · C: 400,000 EGP · Conditional admission: 420,000 EGP.', 'مصروفات التأسيس والبكالوريوس حسب الفئة: A: 350,000 جنيه · B: 375,000 جنيه · C: 400,000 جنيه · القبول المشروط: 420,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'computer-science' WHERE u.slug = 'university-of-london-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;

-- zewail-city-of-science-technology-and-innovation
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_703220050b8b4fc99ef4', u.id, 'Faculty of Business', 'كلية إدارة الأعمال', 'faculty-of-business', 0, now() FROM "University" u WHERE u.slug = 'zewail-city-of-science-technology-and-innovation'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_fe46558c590749f4a193', u.id, f.id, 'Business', 'إدارة الأعمال', 'business', 'BACHELOR', 'business_administration', 112000, 'TERM', 'EGP', 'Per term, by category: Category 1 (50% discount): 56,000 EGP · Category 2 (25% discount): 84,000 EGP · Category 3 (no discount): 112,000 EGP.', 'للترم الواحد حسب الفئة: الفئة الأولى (خصم 50%): 56,000 جنيه · الفئة الثانية (خصم 25%): 84,000 جنيه · الفئة الثالثة (بدون خصم): 112,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-business' WHERE u.slug = 'zewail-city-of-science-technology-and-innovation'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_4ce628c2f3de4a808a41', u.id, 'Faculty of Computational Sciences & Artificial Intelligence', 'كلية علوم الحوسبة والذكاء الاصطناعي', 'faculty-of-computational-sciences-and-artificial-intelligence', 1, now() FROM "University" u WHERE u.slug = 'zewail-city-of-science-technology-and-innovation'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_9cd1b801817f42399e77', u.id, f.id, 'Computational Sciences & Artificial Intelligence', 'علوم الحوسبة والذكاء الاصطناعي', 'computational-sciences-and-artificial-intelligence', 'BACHELOR', 'artificial_intelligence', 137984, 'TERM', 'EGP', 'Per term, by category: Category 1 (50% discount): 68,992 EGP · Category 2 (25% discount): 103,488 EGP · Category 3 (no discount): 137,984 EGP.', 'للترم الواحد حسب الفئة: الفئة الأولى (خصم 50%): 68,992 جنيه · الفئة الثانية (خصم 25%): 103,488 جنيه · الفئة الثالثة (بدون خصم): 137,984 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-computational-sciences-and-artificial-intelligence' WHERE u.slug = 'zewail-city-of-science-technology-and-innovation'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_66204ed188c14872915d', u.id, 'Faculty of Engineering', 'كلية الهندسة', 'faculty-of-engineering', 2, now() FROM "University" u WHERE u.slug = 'zewail-city-of-science-technology-and-innovation'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_edbb9745b44947ed9da2', u.id, f.id, 'Engineering', 'الهندسة', 'engineering', 'BACHELOR', 'engineering', 173880, 'TERM', 'EGP', 'Per term, by category: Category 1 (50% discount): 86,940 EGP · Category 2 (25% discount): 130,410 EGP · Category 3 (no discount): 173,880 EGP.', 'للترم الواحد حسب الفئة: الفئة الأولى (خصم 50%): 86,940 جنيه · الفئة الثانية (خصم 25%): 130,410 جنيه · الفئة الثالثة (بدون خصم): 173,880 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-engineering' WHERE u.slug = 'zewail-city-of-science-technology-and-innovation'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_d3a152f8cd8645cfad2b', u.id, 'Faculty of Science', 'كلية العلوم', 'faculty-of-science', 3, now() FROM "University" u WHERE u.slug = 'zewail-city-of-science-technology-and-innovation'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_c75bf86d4f1c4148b93d', u.id, f.id, 'Science', 'العلوم', 'science', 'BACHELOR', 'science', 141120, 'TERM', 'EGP', 'Per term, by category: Category 1 (50% discount): 70,560 EGP · Category 2 (25% discount): 105,840 EGP · Category 3 (no discount): 141,120 EGP.', 'للترم الواحد حسب الفئة: الفئة الأولى (خصم 50%): 70,560 جنيه · الفئة الثانية (خصم 25%): 105,840 جنيه · الفئة الثالثة (بدون خصم): 141,120 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-science' WHERE u.slug = 'zewail-city-of-science-technology-and-innovation'
ON CONFLICT ("universityId", slug) DO NOTHING;

-- nile-valley-university
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_69f243aff9c349a1ae10', u.id, 'Faculty of Dentistry', 'كلية طب الفم والأسنان', 'faculty-of-dentistry', 0, now() FROM "University" u WHERE u.slug = 'nile-valley-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_9ba0a08686be4e7e9daa', u.id, f.id, 'Dentistry', 'طب الفم والأسنان', 'dentistry', 'BACHELOR', 'dentistry', 139000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-dentistry' WHERE u.slug = 'nile-valley-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_64f72a1acb144d278a0d', u.id, 'Faculty of Pharmacy', 'كلية الصيدلة', 'faculty-of-pharmacy', 1, now() FROM "University" u WHERE u.slug = 'nile-valley-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_7e3509763312402ba1db', u.id, f.id, 'Clinical Pharmacy', 'الصيدلة الإكلينيكية', 'clinical-pharmacy', 'BACHELOR', 'pharmacy', 110000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-pharmacy' WHERE u.slug = 'nile-valley-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_2ca4badbfd304c84a473', u.id, 'Faculty of Applied Health Sciences Technology', 'كلية تكنولوجيا العلوم الصحية التطبيقية', 'faculty-of-applied-health-sciences-technology', 2, now() FROM "University" u WHERE u.slug = 'nile-valley-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_bc75e5593a594a92b7f8', u.id, f.id, 'Applied Health Sciences Technology', 'تكنولوجيا العلوم الصحية التطبيقية', 'applied-health-sciences-technology', 'BACHELOR', 'health_sciences', 56000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-applied-health-sciences-technology' WHERE u.slug = 'nile-valley-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_061d19f7d6cc43178940', u.id, 'Faculty of Nursing', 'كلية التمريض', 'faculty-of-nursing', 3, now() FROM "University" u WHERE u.slug = 'nile-valley-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_4b9aed9307b64e58aaea', u.id, f.id, 'Nursing', 'التمريض', 'nursing', 'BACHELOR', 'nursing', 58000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-nursing' WHERE u.slug = 'nile-valley-university'
ON CONFLICT ("universityId", slug) DO NOTHING;

COMMIT;
