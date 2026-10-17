-- 13 universities from the client sheets مصروفات_الجامعات_المصرية_2026_2027 (7).xlsx
-- (national universities) and (8).xlsx (national universities and three
-- international branches), added 2026-10-17: faculties, programs and 2026/2027
-- annual fees. Website, city and address from each university's official site;
-- logos, covers and gallery photos from the official sites (Lancashire's from
-- Wikimedia Commons, see PHOTO-CREDITS.md). Lancashire stores its highest fee
-- category and lists every category in the description; the Russian branches
-- store the EGP part with the USD part in the description. The sheets give no
-- descriptions, durations, founding years or acronyms, so those stay empty.
-- Safe to re-run.

BEGIN;

-- Assiut National University
INSERT INTO "University" (id, name, "nameAr", slug, type, country, "countryAr", city, "cityAr", "addressLine", "addressLineAr", "websiteUrl", "logoUrl", "coverImageUrl", "publishedAt", "updatedAt")
VALUES ('univ_d3544c42ca88a26b92c5', 'Assiut National University', 'جامعة أسيوط الأهلية', 'assiut-national-university', 'NATIONAL', 'Egypt', 'مصر', 'New Assiut', 'أسيوط الجديدة', NULL, NULL, 'https://asnu.edu.eg', '/img/universities/assiut-national-university/logo.png', '/img/universities/assiut-national-university/cover.jpg', now(), now())
ON CONFLICT (slug) DO NOTHING;
INSERT INTO "UniversityImage" (id, "universityId", url, alt, "altAr", "sortOrder")
SELECT 'img_ae17667393ca71db3426', u.id, '/img/universities/assiut-national-university/gallery-1.jpg', 'Assiut National University campus', 'حرم جامعة أسيوط الأهلية', 0 FROM "University" u WHERE u.slug = 'assiut-national-university'
  AND NOT EXISTS (SELECT 1 FROM "UniversityImage" i WHERE i."universityId" = u.id AND i.url = '/img/universities/assiut-national-university/gallery-1.jpg');
INSERT INTO "UniversityImage" (id, "universityId", url, alt, "altAr", "sortOrder")
SELECT 'img_3b50fb783dc8fd1e5984', u.id, '/img/universities/assiut-national-university/gallery-2.jpg', 'Assiut National University campus', 'حرم جامعة أسيوط الأهلية', 1 FROM "University" u WHERE u.slug = 'assiut-national-university'
  AND NOT EXISTS (SELECT 1 FROM "UniversityImage" i WHERE i."universityId" = u.id AND i.url = '/img/universities/assiut-national-university/gallery-2.jpg');
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_4f6dea2b6d028b525179', u.id, 'Faculty of Medicine', 'كلية الطب البشري', 'faculty-of-medicine', 0, now() FROM "University" u WHERE u.slug = 'assiut-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_5955400dc94749ed5ece', u.id, f.id, 'Medicine', 'الطب البشري', 'medicine', 'BACHELOR', 'medicine', 165000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-medicine' WHERE u.slug = 'assiut-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_77506da059c0a85a030b', u.id, 'Faculty of Dentistry', 'كلية طب الأسنان', 'faculty-of-dentistry', 1, now() FROM "University" u WHERE u.slug = 'assiut-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_e0682a368cd690797b2f', u.id, f.id, 'Dentistry', 'طب الأسنان', 'dentistry', 'BACHELOR', 'dentistry', 130000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-dentistry' WHERE u.slug = 'assiut-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_9f105de2f9dbca54cf02', u.id, 'Faculty of Pharmacy', 'كلية الصيدلة', 'faculty-of-pharmacy', 2, now() FROM "University" u WHERE u.slug = 'assiut-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_ced4fa1323c361dcb9e3', u.id, f.id, 'Pharmacy', 'الصيدلة', 'pharmacy', 'BACHELOR', 'pharmacy', 100000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-pharmacy' WHERE u.slug = 'assiut-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_64d5851e1ab234a42bbe', u.id, 'Faculty of Engineering', 'كلية الهندسة', 'faculty-of-engineering', 3, now() FROM "University" u WHERE u.slug = 'assiut-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_d7d83dc52add9bae99d5', u.id, f.id, 'Engineering', 'الهندسة', 'engineering', 'BACHELOR', 'engineering', 65000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-engineering' WHERE u.slug = 'assiut-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_59e5b087bbff9dcf7c78', u.id, 'Faculty of Computers and Artificial Intelligence', 'كلية الحاسبات والذكاء الاصطناعي', 'faculty-of-computers-and-artificial-intelligence', 4, now() FROM "University" u WHERE u.slug = 'assiut-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_101e3d3ba94fa5a709cb', u.id, f.id, 'Computers and Artificial Intelligence', 'الحاسبات والذكاء الاصطناعي', 'computers-and-artificial-intelligence', 'BACHELOR', 'computer_science', 65000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-computers-and-artificial-intelligence' WHERE u.slug = 'assiut-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_2f2223aa5b9046bf39e4', u.id, 'Faculty of Administrative and Financial Sciences', 'كلية العلوم الإدارية والمالية', 'faculty-of-administrative-and-financial-sciences', 5, now() FROM "University" u WHERE u.slug = 'assiut-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_7effc3b2290e33795862', u.id, f.id, 'Administrative and Financial Sciences', 'العلوم الإدارية والمالية', 'administrative-and-financial-sciences', 'BACHELOR', 'business_administration', 50000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-administrative-and-financial-sciences' WHERE u.slug = 'assiut-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_9c88e93a13eef1f79dfc', u.id, 'Faculty of Al-Alsun and Applied Languages', 'كلية الألسن واللغات التطبيقية', 'faculty-of-al-alsun-and-applied-languages', 6, now() FROM "University" u WHERE u.slug = 'assiut-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_034bdcf724bfe22afe47', u.id, f.id, 'Al-Alsun and Applied Languages', 'الألسن واللغات التطبيقية', 'al-alsun-and-applied-languages', 'BACHELOR', 'languages_translation', 45000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-al-alsun-and-applied-languages' WHERE u.slug = 'assiut-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;

-- Alexandria National University
INSERT INTO "University" (id, name, "nameAr", slug, type, country, "countryAr", city, "cityAr", "addressLine", "addressLineAr", "websiteUrl", "logoUrl", "coverImageUrl", "publishedAt", "updatedAt")
VALUES ('univ_d7df0de94fe60b1e07ca', 'Alexandria National University', 'جامعة الإسكندرية الأهلية', 'alexandria-national-university', 'NATIONAL', 'Egypt', 'مصر', 'Alexandria', 'الإسكندرية', 'Alexandria University campus, Abis', 'حرم جامعة الإسكندرية، أبيس', 'https://anu.edu.eg', '/img/universities/alexandria-national-university/logo.png', '/img/universities/alexandria-national-university/cover.jpg', now(), now())
ON CONFLICT (slug) DO NOTHING;
INSERT INTO "UniversityImage" (id, "universityId", url, alt, "altAr", "sortOrder")
SELECT 'img_157f97a11fcfc6d47526', u.id, '/img/universities/alexandria-national-university/gallery-1.jpg', 'Alexandria National University campus', 'حرم جامعة الإسكندرية الأهلية', 0 FROM "University" u WHERE u.slug = 'alexandria-national-university'
  AND NOT EXISTS (SELECT 1 FROM "UniversityImage" i WHERE i."universityId" = u.id AND i.url = '/img/universities/alexandria-national-university/gallery-1.jpg');
INSERT INTO "UniversityImage" (id, "universityId", url, alt, "altAr", "sortOrder")
SELECT 'img_d1ba27a4ff962c9b03db', u.id, '/img/universities/alexandria-national-university/gallery-2.jpg', 'Alexandria National University campus', 'حرم جامعة الإسكندرية الأهلية', 1 FROM "University" u WHERE u.slug = 'alexandria-national-university'
  AND NOT EXISTS (SELECT 1 FROM "UniversityImage" i WHERE i."universityId" = u.id AND i.url = '/img/universities/alexandria-national-university/gallery-2.jpg');
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_437bb997cdfa31a928c7', u.id, 'Medicine and Surgery', 'الطب والجراحة', 'medicine-and-surgery', 0, now() FROM "University" u WHERE u.slug = 'alexandria-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_cb240e76c99e45dc1240', u.id, f.id, 'Medicine and Surgery', 'الطب والجراحة', 'medicine-and-surgery', 'BACHELOR', 'medicine', 176000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'medicine-and-surgery' WHERE u.slug = 'alexandria-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_5ad9be95ee20fbe59257', u.id, 'Oral and Dental Surgery', 'جراحة الفم والأسنان', 'oral-and-dental-surgery', 1, now() FROM "University" u WHERE u.slug = 'alexandria-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_3b653d6bc0b837d683af', u.id, f.id, 'Oral and Dental Surgery', 'جراحة الفم والأسنان', 'oral-and-dental-surgery', 'BACHELOR', 'dentistry', 155000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'oral-and-dental-surgery' WHERE u.slug = 'alexandria-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_edbb0c524b2a6f5a6556', u.id, 'Pharmacy', 'الصيدلة', 'pharmacy', 2, now() FROM "University" u WHERE u.slug = 'alexandria-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_d5f3ac322a08dc062c7a', u.id, f.id, 'Clinical Pharmacy', 'الصيدلة (كلينيكل)', 'clinical-pharmacy', 'BACHELOR', 'pharmacy', 137000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'pharmacy' WHERE u.slug = 'alexandria-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_1006356749f81f4948a6', u.id, 'Engineering', 'الهندسة', 'engineering', 3, now() FROM "University" u WHERE u.slug = 'alexandria-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_b8ca2df285578a4a1851', u.id, f.id, 'Engineering', 'الهندسة', 'engineering', 'BACHELOR', 'engineering', 101000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'engineering' WHERE u.slug = 'alexandria-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_8c2d20183eb176bbf986', u.id, 'Computer and Data Science', 'علوم الحاسب والبيانات', 'computer-and-data-science', 4, now() FROM "University" u WHERE u.slug = 'alexandria-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_868d899b352a64a148de', u.id, f.id, 'Software Industry and Multimedia', 'صناعة البرمجيات والوسائط المتعددة', 'software-industry-and-multimedia', 'BACHELOR', 'computer_science', 84000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'computer-and-data-science' WHERE u.slug = 'alexandria-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_1bb85595e01f39a761bc', u.id, f.id, 'Computer and Data Science (other departments)', 'علوم الحاسب والبيانات (باقي الأقسام)', 'computer-and-data-science-other-departments', 'BACHELOR', 'computer_science', 69000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'computer-and-data-science' WHERE u.slug = 'alexandria-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_7844082fda307f88fda0', u.id, 'Media and Communication', 'الإعلام والاتصال', 'media-and-communication', 5, now() FROM "University" u WHERE u.slug = 'alexandria-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_a851e83bcb30bcf7d742', u.id, f.id, 'Digital Media', 'الإعلام الرقمي', 'digital-media', 'BACHELOR', 'mass_communication', 66000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'media-and-communication' WHERE u.slug = 'alexandria-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_9c150054208cfbd49724', u.id, 'Economics and Administrative Sciences', 'الاقتصاد والعلوم الإدارية', 'economics-and-administrative-sciences', 6, now() FROM "University" u WHERE u.slug = 'alexandria-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_b159ab991aef11a7e176', u.id, f.id, 'Economics and Administrative Sciences', 'الاقتصاد والعلوم الإدارية', 'economics-and-administrative-sciences', 'BACHELOR', 'economics_political_science', 69000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'economics-and-administrative-sciences' WHERE u.slug = 'alexandria-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_571c0773169d524e975d', u.id, 'Humanities and Social Sciences', 'العلوم الإنسانية والاجتماعية', 'humanities-and-social-sciences', 7, now() FROM "University" u WHERE u.slug = 'alexandria-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_0da29a71c647f7c9908e', u.id, f.id, 'Humanities and Social Sciences', 'العلوم الإنسانية والاجتماعية', 'humanities-and-social-sciences', 'BACHELOR', 'arts_humanities', 64000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'humanities-and-social-sciences' WHERE u.slug = 'alexandria-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;

-- National University of Sadat City
INSERT INTO "University" (id, name, "nameAr", slug, type, country, "countryAr", city, "cityAr", "addressLine", "addressLineAr", "websiteUrl", "logoUrl", "coverImageUrl", "publishedAt", "updatedAt")
VALUES ('univ_9b7e0221769952b94fec', 'National University of Sadat City', 'جامعة مدينة السادات الأهلية', 'sadat-city-national-university', 'NATIONAL', 'Egypt', 'مصر', 'Sadat City', 'مدينة السادات', NULL, NULL, 'https://nusc.edu.eg', '/img/universities/sadat-city-national-university/logo.png', '/img/universities/sadat-city-national-university/cover.jpg', now(), now())
ON CONFLICT (slug) DO NOTHING;
INSERT INTO "UniversityImage" (id, "universityId", url, alt, "altAr", "sortOrder")
SELECT 'img_f69c91ec535845798509', u.id, '/img/universities/sadat-city-national-university/gallery-1.jpg', 'National University of Sadat City campus', 'حرم جامعة مدينة السادات الأهلية', 0 FROM "University" u WHERE u.slug = 'sadat-city-national-university'
  AND NOT EXISTS (SELECT 1 FROM "UniversityImage" i WHERE i."universityId" = u.id AND i.url = '/img/universities/sadat-city-national-university/gallery-1.jpg');
INSERT INTO "UniversityImage" (id, "universityId", url, alt, "altAr", "sortOrder")
SELECT 'img_ba755171d7574f973baf', u.id, '/img/universities/sadat-city-national-university/gallery-2.jpg', 'National University of Sadat City campus', 'حرم جامعة مدينة السادات الأهلية', 1 FROM "University" u WHERE u.slug = 'sadat-city-national-university'
  AND NOT EXISTS (SELECT 1 FROM "UniversityImage" i WHERE i."universityId" = u.id AND i.url = '/img/universities/sadat-city-national-university/gallery-2.jpg');
INSERT INTO "UniversityImage" (id, "universityId", url, alt, "altAr", "sortOrder")
SELECT 'img_5b9aed742f12de356a03', u.id, '/img/universities/sadat-city-national-university/gallery-3.jpg', 'National University of Sadat City campus', 'حرم جامعة مدينة السادات الأهلية', 2 FROM "University" u WHERE u.slug = 'sadat-city-national-university'
  AND NOT EXISTS (SELECT 1 FROM "UniversityImage" i WHERE i."universityId" = u.id AND i.url = '/img/universities/sadat-city-national-university/gallery-3.jpg');
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_db6cf68ed962d866f9c7', u.id, 'Faculty of Pharmacy', 'كلية الصيدلة', 'faculty-of-pharmacy', 0, now() FROM "University" u WHERE u.slug = 'sadat-city-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_356ce61dd8ac372d6251', u.id, f.id, 'Clinical Pharmacy (Pharm D)', 'الصيدلة الإكلينيكية Pharm D', 'clinical-pharmacy-pharm-d', 'BACHELOR', 'pharmacy', 90000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-pharmacy' WHERE u.slug = 'sadat-city-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_351077cfb0b9a11b62cd', u.id, f.id, 'Pharm D', 'فارم دي Pharm D', 'pharm-d', 'BACHELOR', 'pharmacy', 80000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-pharmacy' WHERE u.slug = 'sadat-city-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_7491b7c53a35af1f81ec', u.id, 'Faculty of Computers', 'كلية الحاسبات', 'faculty-of-computers', 1, now() FROM "University" u WHERE u.slug = 'sadat-city-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_3662966caeb1ba69543b', u.id, f.id, 'Artificial Intelligence and Big Data', 'الذكاء الاصطناعي والبيانات الضخمة', 'artificial-intelligence-and-big-data', 'BACHELOR', 'artificial_intelligence', 62000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-computers' WHERE u.slug = 'sadat-city-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_7305dc292799e2125dc7', u.id, f.id, 'Networks and Cloud Computing', 'الشبكات والحوسبة السحابية', 'networks-and-cloud-computing', 'BACHELOR', 'computer_science', 58000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-computers' WHERE u.slug = 'sadat-city-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_99874c63471c0ee3d9a6', u.id, 'Faculty of Veterinary Medicine', 'كلية الطب البيطري', 'faculty-of-veterinary-medicine', 2, now() FROM "University" u WHERE u.slug = 'sadat-city-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_d539c42f3b7c74a1ce40', u.id, f.id, 'General Veterinary Medicine', 'الطب البيطري العام', 'general-veterinary-medicine', 'BACHELOR', 'veterinary', 65000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-veterinary-medicine' WHERE u.slug = 'sadat-city-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_3438f000083a6cb9a94b', u.id, f.id, 'Distinguished Veterinary Medicine: Food Health and Safety', 'الطب البيطري المتميز - صحة وسلامة الغذاء', 'distinguished-veterinary-medicine-food-health-and-safety', 'BACHELOR', 'veterinary', 65000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-veterinary-medicine' WHERE u.slug = 'sadat-city-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_78437233ee5472086110', u.id, 'Faculty of Science', 'كلية العلوم', 'faculty-of-science', 3, now() FROM "University" u WHERE u.slug = 'sadat-city-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_4514d7f31d4b443deafb', u.id, f.id, 'Applied Industrial Chemistry', 'الكيمياء الصناعية التطبيقية', 'applied-industrial-chemistry', 'BACHELOR', 'science', 45000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-science' WHERE u.slug = 'sadat-city-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_a647a41711e05d48a595', u.id, f.id, 'Data Science and Artificial Intelligence Applications', 'علوم البيانات وتطبيقات الذكاء الاصطناعي', 'data-science-and-artificial-intelligence-applications', 'BACHELOR', 'artificial_intelligence', 45000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-science' WHERE u.slug = 'sadat-city-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_17884e481d651413b626', u.id, 'Faculty of Business', 'كلية الأعمال', 'faculty-of-business', 4, now() FROM "University" u WHERE u.slug = 'sadat-city-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_99bd69362dc11b04bffe', u.id, f.id, 'Business Information Systems (BIS), Arabic', 'نظم معلومات الأعمال BIS - عربي', 'business-information-systems-bis-arabic', 'BACHELOR', 'business_administration', 30000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-business' WHERE u.slug = 'sadat-city-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_49caf90fd0acb9d84c07', u.id, f.id, 'Digital Accounting (English)', 'المحاسبة الرقمية - إنجليزي', 'digital-accounting-english', 'BACHELOR', 'business_administration', 40000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-business' WHERE u.slug = 'sadat-city-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_dd50240cba9e921f721b', u.id, f.id, 'Digital Marketing (English)', 'التسويق الرقمي - إنجليزي', 'digital-marketing-english', 'BACHELOR', 'business_administration', 40000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-business' WHERE u.slug = 'sadat-city-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_6914254cfdfbcee69179', u.id, 'Faculty of Tourism', 'كلية السياحة', 'faculty-of-tourism', 5, now() FROM "University" u WHERE u.slug = 'sadat-city-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_fde3bf5d3920f45cae8a', u.id, f.id, 'Aviation Management', 'إدارة الطيران', 'aviation-management', 'BACHELOR', 'tourism_hotels', 30000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-tourism' WHERE u.slug = 'sadat-city-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_5279f7df2ab4b68c7ee0', u.id, f.id, 'International Hotel and Restaurant Operations Management', 'الإدارة الدولية لعمليات الفنادق والمطاعم', 'international-hotel-and-restaurant-operations-management', 'BACHELOR', 'tourism_hotels', 30000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-tourism' WHERE u.slug = 'sadat-city-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_b7276c85455f769d4c44', u.id, 'Faculty of Sports Science', 'كلية علوم الرياضة', 'faculty-of-sports-science', 6, now() FROM "University" u WHERE u.slug = 'sadat-city-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_ea769a3631dde75a8c22', u.id, f.id, 'Training Load Planning', 'تخطيط الأحمال', 'training-load-planning', 'BACHELOR', 'physical_education', 25000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-sports-science' WHERE u.slug = 'sadat-city-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_2eab7f84a154761ad285', u.id, f.id, 'Sports Recovery', 'الاستشفاء', 'sports-recovery', 'BACHELOR', 'physical_education', 25000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-sports-science' WHERE u.slug = 'sadat-city-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_52f505abf7171b26afcf', u.id, f.id, 'Sports Business Management', 'إدارة الأعمال الرياضية', 'sports-business-management', 'BACHELOR', 'physical_education', 25000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-sports-science' WHERE u.slug = 'sadat-city-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_d77d9f01bc603a2cb369', u.id, f.id, 'Sports Data Analysis', 'تحليل البيانات', 'sports-data-analysis', 'BACHELOR', 'physical_education', 25000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-sports-science' WHERE u.slug = 'sadat-city-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_b9247a89195e121ef94a', u.id, f.id, 'Recreation', 'الترويح', 'recreation', 'BACHELOR', 'physical_education', 25000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-sports-science' WHERE u.slug = 'sadat-city-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_8588c267d66b6c6ae9c9', u.id, f.id, 'Specialised English-taught Programmes', 'برامج إنجليزية متخصصة', 'specialised-english-taught-programmes', 'BACHELOR', 'physical_education', 35000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-sports-science' WHERE u.slug = 'sadat-city-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;

-- Mansoura National University
INSERT INTO "University" (id, name, "nameAr", slug, type, country, "countryAr", city, "cityAr", "addressLine", "addressLineAr", "websiteUrl", "logoUrl", "coverImageUrl", "publishedAt", "updatedAt")
VALUES ('univ_93e3ac71846e40d729a9', 'Mansoura National University', 'جامعة المنصورة الأهلية', 'mansoura-national-university', 'NATIONAL', 'Egypt', 'مصر', 'Gamasa', 'جمصة', 'International Coastal Road, Dakahlia', 'الطريق الدولي الساحلي، الدقهلية', 'https://mansnu.edu.eg', '/img/universities/mansoura-national-university/logo.png', '/img/universities/mansoura-national-university/cover.jpg', now(), now())
ON CONFLICT (slug) DO NOTHING;
INSERT INTO "UniversityImage" (id, "universityId", url, alt, "altAr", "sortOrder")
SELECT 'img_0c578c3acc622351de0b', u.id, '/img/universities/mansoura-national-university/gallery-1.jpg', 'Mansoura National University campus', 'حرم جامعة المنصورة الأهلية', 0 FROM "University" u WHERE u.slug = 'mansoura-national-university'
  AND NOT EXISTS (SELECT 1 FROM "UniversityImage" i WHERE i."universityId" = u.id AND i.url = '/img/universities/mansoura-national-university/gallery-1.jpg');
INSERT INTO "UniversityImage" (id, "universityId", url, alt, "altAr", "sortOrder")
SELECT 'img_b5a34a2a17569e3206bc', u.id, '/img/universities/mansoura-national-university/gallery-2.jpg', 'Mansoura National University campus', 'حرم جامعة المنصورة الأهلية', 1 FROM "University" u WHERE u.slug = 'mansoura-national-university'
  AND NOT EXISTS (SELECT 1 FROM "UniversityImage" i WHERE i."universityId" = u.id AND i.url = '/img/universities/mansoura-national-university/gallery-2.jpg');
INSERT INTO "UniversityImage" (id, "universityId", url, alt, "altAr", "sortOrder")
SELECT 'img_0f168d631cc5b1780143', u.id, '/img/universities/mansoura-national-university/gallery-3.jpg', 'Mansoura National University campus', 'حرم جامعة المنصورة الأهلية', 2 FROM "University" u WHERE u.slug = 'mansoura-national-university'
  AND NOT EXISTS (SELECT 1 FROM "UniversityImage" i WHERE i."universityId" = u.id AND i.url = '/img/universities/mansoura-national-university/gallery-3.jpg');
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_75aaab0d6503608a5b36', u.id, 'Faculty of Medicine', 'كلية الطب', 'faculty-of-medicine', 0, now() FROM "University" u WHERE u.slug = 'mansoura-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_650541b9df1e3af273f4', u.id, f.id, 'Medicine', 'الطب', 'medicine', 'BACHELOR', 'medicine', 165000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-medicine' WHERE u.slug = 'mansoura-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_46ba48fab5be8b57ed3e', u.id, 'Faculty of Dentistry', 'كلية طب الأسنان', 'faculty-of-dentistry', 1, now() FROM "University" u WHERE u.slug = 'mansoura-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_dcb5c79994c0fe17cd5d', u.id, f.id, 'Dentistry', 'طب الأسنان', 'dentistry', 'BACHELOR', 'dentistry', 137000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-dentistry' WHERE u.slug = 'mansoura-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_eb8d3a7e6724659d5f29', u.id, 'Faculty of Pharmacy', 'كلية الصيدلة', 'faculty-of-pharmacy', 2, now() FROM "University" u WHERE u.slug = 'mansoura-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_e812cc43464a8b036f1f', u.id, f.id, 'Pharmacy: Manchester Programme', 'الصيدلة - برنامج مانشستر', 'pharmacy-manchester-programme', 'BACHELOR', 'pharmacy', 135000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-pharmacy' WHERE u.slug = 'mansoura-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_a46df269e760ab3a8b41', u.id, f.id, 'Pharm D (Clinical Pharmacy)', 'برنامج فارم دي (الصيدلة الإكلينيكية)', 'pharm-d-clinical-pharmacy', 'BACHELOR', 'pharmacy', 121000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-pharmacy' WHERE u.slug = 'mansoura-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_98b37219e0241d53ac9d', u.id, 'Faculty of Physical Therapy', 'كلية العلاج الطبيعي', 'faculty-of-physical-therapy', 3, now() FROM "University" u WHERE u.slug = 'mansoura-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_dfbbd73d7515b0732db4', u.id, f.id, 'Physical Therapy', 'العلاج الطبيعي', 'physical-therapy', 'BACHELOR', 'physical_therapy', 125000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-physical-therapy' WHERE u.slug = 'mansoura-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_cbe050271395648f6d6d', u.id, 'Faculty of Engineering', 'كلية الهندسة', 'faculty-of-engineering', 4, now() FROM "University" u WHERE u.slug = 'mansoura-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_ac0cdf5705edb34f4b8c', u.id, f.id, 'Engineering', 'الهندسة', 'engineering', 'BACHELOR', 'engineering', 82000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-engineering' WHERE u.slug = 'mansoura-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_29d9ccb56c52e41ed863', u.id, 'Faculty of Nursing', 'كلية التمريض', 'faculty-of-nursing', 5, now() FROM "University" u WHERE u.slug = 'mansoura-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_f34701e6b84de9990a6f', u.id, f.id, 'Nursing', 'التمريض', 'nursing', 'BACHELOR', 'nursing', 77000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-nursing' WHERE u.slug = 'mansoura-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_4580f91acc28ecd6603a', u.id, 'Faculty of Applied Health Sciences Technology', 'كلية تكنولوجيا العلوم الصحية التطبيقية', 'faculty-of-applied-health-sciences-technology', 6, now() FROM "University" u WHERE u.slug = 'mansoura-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_0a83301d456cc050e0e6', u.id, f.id, 'Applied Health Sciences Technology', 'تكنولوجيا العلوم الصحية التطبيقية', 'applied-health-sciences-technology', 'BACHELOR', 'health_sciences', 66000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-applied-health-sciences-technology' WHERE u.slug = 'mansoura-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_97986ff1a8415c837497', u.id, 'Faculty of Economics and Administrative Sciences', 'كلية الاقتصاد والعلوم الإدارية', 'faculty-of-economics-and-administrative-sciences', 7, now() FROM "University" u WHERE u.slug = 'mansoura-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_7ddea25d3df1ed4a04c7', u.id, f.id, 'Economics and Administrative Sciences', 'الاقتصاد والعلوم الإدارية', 'economics-and-administrative-sciences', 'BACHELOR', 'economics_political_science', 44000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-economics-and-administrative-sciences' WHERE u.slug = 'mansoura-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_00559f083b747089eb4d', u.id, 'Faculty of Arts and Humanities', 'كلية الآداب والعلوم الإنسانية', 'faculty-of-arts-and-humanities', 8, now() FROM "University" u WHERE u.slug = 'mansoura-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_655b4d48ac8d2bf6cc92', u.id, f.id, 'Arts and Humanities', 'الآداب والعلوم الإنسانية', 'arts-and-humanities', 'BACHELOR', 'arts_humanities', 40000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-arts-and-humanities' WHERE u.slug = 'mansoura-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;

-- Minia National University
INSERT INTO "University" (id, name, "nameAr", slug, type, country, "countryAr", city, "cityAr", "addressLine", "addressLineAr", "websiteUrl", "logoUrl", "coverImageUrl", "publishedAt", "updatedAt")
VALUES ('univ_6e86caea76f5ab06a8da', 'Minia National University', 'جامعة المنيا الأهلية', 'minia-national-university', 'NATIONAL', 'Egypt', 'مصر', 'New Minya', 'المنيا الجديدة', 'Seventh District, New Minya', 'الحي السابع، المنيا الجديدة', 'https://minianu.edu.eg', '/img/universities/minia-national-university/logo.png', '/img/universities/minia-national-university/cover.jpg', now(), now())
ON CONFLICT (slug) DO NOTHING;
INSERT INTO "UniversityImage" (id, "universityId", url, alt, "altAr", "sortOrder")
SELECT 'img_f4427b2e2d6de5dee1d5', u.id, '/img/universities/minia-national-university/gallery-1.jpg', 'Minia National University campus', 'حرم جامعة المنيا الأهلية', 0 FROM "University" u WHERE u.slug = 'minia-national-university'
  AND NOT EXISTS (SELECT 1 FROM "UniversityImage" i WHERE i."universityId" = u.id AND i.url = '/img/universities/minia-national-university/gallery-1.jpg');
INSERT INTO "UniversityImage" (id, "universityId", url, alt, "altAr", "sortOrder")
SELECT 'img_e71d28d17d53fe58caa9', u.id, '/img/universities/minia-national-university/gallery-2.jpg', 'Minia National University campus', 'حرم جامعة المنيا الأهلية', 1 FROM "University" u WHERE u.slug = 'minia-national-university'
  AND NOT EXISTS (SELECT 1 FROM "UniversityImage" i WHERE i."universityId" = u.id AND i.url = '/img/universities/minia-national-university/gallery-2.jpg');
INSERT INTO "UniversityImage" (id, "universityId", url, alt, "altAr", "sortOrder")
SELECT 'img_68abdaef259b1ed44ab7', u.id, '/img/universities/minia-national-university/gallery-3.jpg', 'Minia National University campus', 'حرم جامعة المنيا الأهلية', 2 FROM "University" u WHERE u.slug = 'minia-national-university'
  AND NOT EXISTS (SELECT 1 FROM "UniversityImage" i WHERE i."universityId" = u.id AND i.url = '/img/universities/minia-national-university/gallery-3.jpg');
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_9d04e4bedc75d9744b07', u.id, 'Medicine', 'الطب البشري', 'medicine', 0, now() FROM "University" u WHERE u.slug = 'minia-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_6ff831f6acd7522caa92', u.id, f.id, 'Medicine', 'الطب البشري', 'medicine', 'BACHELOR', 'medicine', 165000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'medicine' WHERE u.slug = 'minia-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_9d714d7cfd4875fd670f', u.id, 'Dentistry', 'طب الأسنان', 'dentistry', 1, now() FROM "University" u WHERE u.slug = 'minia-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_95c342b209a3aabc0c87', u.id, f.id, 'Dentistry', 'طب الأسنان', 'dentistry', 'BACHELOR', 'dentistry', 130000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'dentistry' WHERE u.slug = 'minia-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_4dfbc8bcb5cf356b55d7', u.id, 'Pharmacy', 'الصيدلة', 'pharmacy', 2, now() FROM "University" u WHERE u.slug = 'minia-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_da518e800832991b360e', u.id, f.id, 'Pharmacy', 'الصيدلة', 'pharmacy', 'BACHELOR', 'pharmacy', 100000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'pharmacy' WHERE u.slug = 'minia-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_4163346eed031700a1c0', u.id, 'Physical Therapy', 'العلاج الطبيعي', 'physical-therapy', 3, now() FROM "University" u WHERE u.slug = 'minia-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_3e767e821b7d3d527e41', u.id, f.id, 'Physical Therapy', 'العلاج الطبيعي', 'physical-therapy', 'BACHELOR', 'physical_therapy', 100000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'physical-therapy' WHERE u.slug = 'minia-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_e33e92e535846a496d12', u.id, 'Engineering', 'الهندسة', 'engineering', 4, now() FROM "University" u WHERE u.slug = 'minia-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_6e2a6770a43eb2d440d5', u.id, f.id, 'Engineering', 'الهندسة', 'engineering', 'BACHELOR', 'engineering', 75000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'engineering' WHERE u.slug = 'minia-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_7e5371754c5c0f652085', u.id, 'Computers and Artificial Intelligence', 'الحاسبات والذكاء الاصطناعي', 'computers-and-artificial-intelligence', 5, now() FROM "University" u WHERE u.slug = 'minia-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_cefd67892428e6e1b5ee', u.id, f.id, 'Computers and Artificial Intelligence', 'الحاسبات والذكاء الاصطناعي', 'computers-and-artificial-intelligence', 'BACHELOR', 'computer_science', 70000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'computers-and-artificial-intelligence' WHERE u.slug = 'minia-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_9a91536e9ae97b0afc29', u.id, 'Public Relations and Advertising', 'العلاقات العامة والإعلان', 'public-relations-and-advertising', 6, now() FROM "University" u WHERE u.slug = 'minia-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_58a7afe86552cc05fc02', u.id, f.id, 'Public Relations and Advertising', 'برنامج العلاقات العامة والإعلان', 'public-relations-and-advertising', 'BACHELOR', 'mass_communication', 40000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'public-relations-and-advertising' WHERE u.slug = 'minia-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;

-- New Valley National University
INSERT INTO "University" (id, name, "nameAr", slug, type, country, "countryAr", city, "cityAr", "addressLine", "addressLineAr", "websiteUrl", "logoUrl", "coverImageUrl", "publishedAt", "updatedAt")
VALUES ('univ_dd520e6eebdcbcd880b8', 'New Valley National University', 'جامعة الوادي الجديد الأهلية', 'new-valley-national-university', 'NATIONAL', 'Egypt', 'مصر', 'Kharga', 'الخارجة', 'Km 10, Kharga–Assiut Road', 'الكيلو 10 طريق الخارجة - أسيوط', 'https://nvnu.edu.eg', '/img/universities/new-valley-national-university/logo.png', '/img/universities/new-valley-national-university/cover.jpg', now(), now())
ON CONFLICT (slug) DO NOTHING;
INSERT INTO "UniversityImage" (id, "universityId", url, alt, "altAr", "sortOrder")
SELECT 'img_13341dd0ebdbef8e7718', u.id, '/img/universities/new-valley-national-university/gallery-1.jpg', 'New Valley National University campus', 'حرم جامعة الوادي الجديد الأهلية', 0 FROM "University" u WHERE u.slug = 'new-valley-national-university'
  AND NOT EXISTS (SELECT 1 FROM "UniversityImage" i WHERE i."universityId" = u.id AND i.url = '/img/universities/new-valley-national-university/gallery-1.jpg');
INSERT INTO "UniversityImage" (id, "universityId", url, alt, "altAr", "sortOrder")
SELECT 'img_b9828e127abae3f26ddb', u.id, '/img/universities/new-valley-national-university/gallery-2.jpg', 'New Valley National University campus', 'حرم جامعة الوادي الجديد الأهلية', 1 FROM "University" u WHERE u.slug = 'new-valley-national-university'
  AND NOT EXISTS (SELECT 1 FROM "UniversityImage" i WHERE i."universityId" = u.id AND i.url = '/img/universities/new-valley-national-university/gallery-2.jpg');
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_dd4e780200d4b0ac7310', u.id, 'Faculty of Pharmacy', 'كلية الصيدلة', 'faculty-of-pharmacy', 0, now() FROM "University" u WHERE u.slug = 'new-valley-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_be2ba7558fcd191be173', u.id, f.id, 'Pharm D', 'برنامج الصيدلة فارم دي', 'pharm-d', 'BACHELOR', 'pharmacy', 85000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-pharmacy' WHERE u.slug = 'new-valley-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_20512a808ad02a7398b5', u.id, f.id, 'Clinical Pharmacy', 'برنامج الصيدلة الإكلينيكية', 'clinical-pharmacy', 'BACHELOR', 'pharmacy', 100000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-pharmacy' WHERE u.slug = 'new-valley-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_a79f3317326328849619', u.id, 'Faculty of Science', 'كلية العلوم', 'faculty-of-science', 1, now() FROM "University" u WHERE u.slug = 'new-valley-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_54c74d6fde3becdc34c7', u.id, f.id, 'Artificial Intelligence and Data Science', 'الذكاء الاصطناعي وعلوم البيانات', 'artificial-intelligence-and-data-science', 'BACHELOR', 'artificial_intelligence', 50000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-science' WHERE u.slug = 'new-valley-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_b601ea89745367e83625', u.id, f.id, 'Forensic Chemistry and Biology', 'الكيمياء والبيولوجيا في الأدلة الجنائية', 'forensic-chemistry-and-biology', 'BACHELOR', 'science', 50000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-science' WHERE u.slug = 'new-valley-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_4f65dd9a199dffe7da37', u.id, f.id, 'Biochemistry', 'الكيمياء الحيوية', 'biochemistry', 'BACHELOR', 'science', 50000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-science' WHERE u.slug = 'new-valley-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_ff8ba43a17071c28da2f', u.id, 'Faculty of Veterinary Medicine', 'كلية الطب البيطري', 'faculty-of-veterinary-medicine', 2, now() FROM "University" u WHERE u.slug = 'new-valley-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_e48670683d29360dc035', u.id, f.id, 'Veterinary Medicine (General Programme)', 'الطب البيطري (البرنامج العام)', 'veterinary-medicine-general-programme', 'BACHELOR', 'veterinary', 70000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-veterinary-medicine' WHERE u.slug = 'new-valley-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_15ee46a4c34631317826', u.id, 'Faculty of Agriculture', 'كلية الزراعة', 'faculty-of-agriculture', 3, now() FROM "University" u WHERE u.slug = 'new-valley-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_a13d017db8509dbb2cae', u.id, f.id, 'Agricultural Biotechnology', 'التكنولوجيا الحيوية الزراعية', 'agricultural-biotechnology', 'BACHELOR', 'agriculture', 35000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-agriculture' WHERE u.slug = 'new-valley-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_b3d44909052a7f89e4bd', u.id, f.id, 'Desert Land Reclamation and Cultivation', 'استصلاح واستزراع الأراضي الصحراوية', 'desert-land-reclamation-and-cultivation', 'BACHELOR', 'agriculture', 35000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-agriculture' WHERE u.slug = 'new-valley-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_7719adc23200fda4ba4f', u.id, 'Faculty of Languages and Humanities', 'كلية اللغات والعلوم الإنسانية', 'faculty-of-languages-and-humanities', 4, now() FROM "University" u WHERE u.slug = 'new-valley-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_f06171847e87cb5d4c1c', u.id, f.id, 'Written and Simultaneous Translation', 'الترجمة التحريرية والفورية', 'written-and-simultaneous-translation', 'BACHELOR', 'languages_translation', 35000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-languages-and-humanities' WHERE u.slug = 'new-valley-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_69d377390141d22e926d', u.id, f.id, 'English Language', 'شعبة اللغة الإنجليزية', 'english-language', 'BACHELOR', 'languages_translation', 35000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-languages-and-humanities' WHERE u.slug = 'new-valley-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_2bcdbd1bc9578129c1ff', u.id, f.id, 'French Language', 'شعبة اللغة الفرنسية', 'french-language', 'BACHELOR', 'languages_translation', 35000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-languages-and-humanities' WHERE u.slug = 'new-valley-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_8895a8445e987931f147', u.id, f.id, 'Iratex Programme', 'برنامج إيراتكس', 'iratex-programme', 'BACHELOR', 'languages_translation', 45000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-languages-and-humanities' WHERE u.slug = 'new-valley-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;

-- Damanhour National University
INSERT INTO "University" (id, name, "nameAr", slug, type, country, "countryAr", city, "cityAr", "addressLine", "addressLineAr", "websiteUrl", "logoUrl", "coverImageUrl", "publishedAt", "updatedAt")
VALUES ('univ_4e343c6aac808f6f726d', 'Damanhour National University', 'جامعة دمنهور الأهلية', 'damanhour-national-university', 'NATIONAL', 'Egypt', 'مصر', 'Delengat', 'الدلنجات', 'Al-Bustan District, Delengat, Beheira', 'حي البستان بمدينة الدلنجات، محافظة البحيرة', 'https://dnu.edu.eg', '/img/universities/damanhour-national-university/logo.png', '/img/universities/damanhour-national-university/cover.jpg', now(), now())
ON CONFLICT (slug) DO NOTHING;
INSERT INTO "UniversityImage" (id, "universityId", url, alt, "altAr", "sortOrder")
SELECT 'img_92199e49723e2a76d87d', u.id, '/img/universities/damanhour-national-university/gallery-1.jpg', 'Damanhour National University campus', 'حرم جامعة دمنهور الأهلية', 0 FROM "University" u WHERE u.slug = 'damanhour-national-university'
  AND NOT EXISTS (SELECT 1 FROM "UniversityImage" i WHERE i."universityId" = u.id AND i.url = '/img/universities/damanhour-national-university/gallery-1.jpg');
INSERT INTO "UniversityImage" (id, "universityId", url, alt, "altAr", "sortOrder")
SELECT 'img_8da9823e3df47352fb12', u.id, '/img/universities/damanhour-national-university/gallery-2.jpg', 'Damanhour National University campus', 'حرم جامعة دمنهور الأهلية', 1 FROM "University" u WHERE u.slug = 'damanhour-national-university'
  AND NOT EXISTS (SELECT 1 FROM "UniversityImage" i WHERE i."universityId" = u.id AND i.url = '/img/universities/damanhour-national-university/gallery-2.jpg');
INSERT INTO "UniversityImage" (id, "universityId", url, alt, "altAr", "sortOrder")
SELECT 'img_a6935b853879b53e2b62', u.id, '/img/universities/damanhour-national-university/gallery-3.jpg', 'Damanhour National University campus', 'حرم جامعة دمنهور الأهلية', 2 FROM "University" u WHERE u.slug = 'damanhour-national-university'
  AND NOT EXISTS (SELECT 1 FROM "UniversityImage" i WHERE i."universityId" = u.id AND i.url = '/img/universities/damanhour-national-university/gallery-3.jpg');
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_dd4c7bf3e5921c8c4c24', u.id, 'Veterinary Medicine', 'الطب البيطري', 'veterinary-medicine', 0, now() FROM "University" u WHERE u.slug = 'damanhour-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_2f71101c8280ee7f1f44', u.id, f.id, 'Bachelor of Veterinary Medicine', 'بكالوريوس الطب البيطري', 'bachelor-of-veterinary-medicine', 'BACHELOR', 'veterinary', 70000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'veterinary-medicine' WHERE u.slug = 'damanhour-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_86e3c6984c8af9892d42', u.id, 'Nursing', 'التمريض', 'nursing', 1, now() FROM "University" u WHERE u.slug = 'damanhour-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_9b4aa978c82f00b25668', u.id, f.id, 'Bachelor of Nursing Science', 'بكالوريوس في علوم التمريض', 'bachelor-of-nursing-science', 'BACHELOR', 'nursing', 60000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'nursing' WHERE u.slug = 'damanhour-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_b9491c11f1005f6242b2', u.id, 'Computing and Artificial Intelligence', 'الحاسبات والذكاء الاصطناعي', 'computing-and-artificial-intelligence', 2, now() FROM "University" u WHERE u.slug = 'damanhour-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_82cf63bd33cecaadd6dd', u.id, f.id, 'Artificial Intelligence and Robotics', 'بكالوريوس الذكاء الاصطناعي والروبوتات', 'artificial-intelligence-and-robotics', 'BACHELOR', 'artificial_intelligence', 60000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'computing-and-artificial-intelligence' WHERE u.slug = 'damanhour-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_94dac9386b41a78ec2c0', u.id, f.id, 'Cybersecurity and Digital Forensics', 'بكالوريوس الأمن السيبراني والأدلة الجنائية الرقمية', 'cybersecurity-and-digital-forensics', 'BACHELOR', 'computer_science', 60000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'computing-and-artificial-intelligence' WHERE u.slug = 'damanhour-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_0ccd1d50bd6b16e0441e', u.id, f.id, 'Computing and Smart Software Engineering', 'بكالوريوس الحوسبة وصناعة البرمجيات الذكية', 'computing-and-smart-software-engineering', 'BACHELOR', 'computer_science', 50000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'computing-and-artificial-intelligence' WHERE u.slug = 'damanhour-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_81495e76bfec0edeb8a7', u.id, 'Business', 'الأعمال', 'business', 3, now() FROM "University" u WHERE u.slug = 'damanhour-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_d310495c636ea528ddac', u.id, f.id, 'Accounting and Finance', 'بكالوريوس المحاسبة والتمويل', 'accounting-and-finance', 'BACHELOR', 'business_administration', 35000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'business' WHERE u.slug = 'damanhour-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_539c9cd28d441a1f1c5c', u.id, f.id, 'Business Information Systems', 'بكالوريوس نظم معلومات الأعمال', 'business-information-systems', 'BACHELOR', 'business_administration', 35000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'business' WHERE u.slug = 'damanhour-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;

-- St Petersburg University in Cairo
INSERT INTO "University" (id, name, "nameAr", slug, type, country, "countryAr", city, "cityAr", "addressLine", "addressLineAr", "websiteUrl", "logoUrl", "coverImageUrl", "publishedAt", "updatedAt")
VALUES ('univ_169837f1cd222ac32a49', 'St Petersburg University in Cairo', 'جامعة سان بطرسبرج الروسية - مصر', 'st-petersburg-university-cairo', 'PRIVATE', 'Egypt', 'مصر', 'Cairo', 'القاهرة', 'Wadi El Nil Medical Complex, Kobry El Qobba', 'مجمع وادي النيل الطبي، كوبري القبة', 'https://spbu.edu.eg', '/img/universities/st-petersburg-university-cairo/logo.png', '/img/universities/st-petersburg-university-cairo/cover.jpg', now(), now())
ON CONFLICT (slug) DO NOTHING;
INSERT INTO "UniversityImage" (id, "universityId", url, alt, "altAr", "sortOrder")
SELECT 'img_2804e3dc4f6a5ce38be7', u.id, '/img/universities/st-petersburg-university-cairo/gallery-1.jpg', 'St Petersburg University in Cairo campus', 'حرم جامعة سان بطرسبرج الروسية - مصر', 0 FROM "University" u WHERE u.slug = 'st-petersburg-university-cairo'
  AND NOT EXISTS (SELECT 1 FROM "UniversityImage" i WHERE i."universityId" = u.id AND i.url = '/img/universities/st-petersburg-university-cairo/gallery-1.jpg');
INSERT INTO "UniversityImage" (id, "universityId", url, alt, "altAr", "sortOrder")
SELECT 'img_489995cf45a841b4be17', u.id, '/img/universities/st-petersburg-university-cairo/gallery-2.jpg', 'St Petersburg University in Cairo campus', 'حرم جامعة سان بطرسبرج الروسية - مصر', 1 FROM "University" u WHERE u.slug = 'st-petersburg-university-cairo'
  AND NOT EXISTS (SELECT 1 FROM "UniversityImage" i WHERE i."universityId" = u.id AND i.url = '/img/universities/st-petersburg-university-cairo/gallery-2.jpg');
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_17e22c83815aba0928d2', u.id, 'Faculty of Medicine', 'كلية الطب البشري', 'faculty-of-medicine', 0, now() FROM "University" u WHERE u.slug = 'st-petersburg-university-cairo'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_5d30be25fa6092bf5aef', u.id, f.id, 'Medicine', 'الطب البشري', 'medicine', 'BACHELOR', 'medicine', 275000, 'YEAR', 'EGP', 'Annual fees: EGP 275,000 plus USD 1,650.', 'المصروفات السنوية: 275,000 جنيه مصري + 1,650 دولار أمريكي.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-medicine' WHERE u.slug = 'st-petersburg-university-cairo'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_4ff548dff5a06441bf65', u.id, 'Faculty of Dentistry', 'كلية طب الأسنان', 'faculty-of-dentistry', 1, now() FROM "University" u WHERE u.slug = 'st-petersburg-university-cairo'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_2dca1e652df1f92873ac', u.id, f.id, 'Dentistry', 'طب الأسنان', 'dentistry', 'BACHELOR', 'dentistry', 250000, 'YEAR', 'EGP', 'Annual fees: EGP 250,000 plus USD 1,650.', 'المصروفات السنوية: 250,000 جنيه مصري + 1,650 دولار أمريكي.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-dentistry' WHERE u.slug = 'st-petersburg-university-cairo'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_ae1b5502c6017620a09d', u.id, 'Faculty of Pharmacy', 'كلية الصيدلة', 'faculty-of-pharmacy', 2, now() FROM "University" u WHERE u.slug = 'st-petersburg-university-cairo'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_c3cd315983a557c21b7a', u.id, f.id, 'Pharmacy', 'الصيدلة', 'pharmacy', 'BACHELOR', 'pharmacy', 220000, 'YEAR', 'EGP', 'Annual fees: EGP 220,000 plus USD 1,650.', 'المصروفات السنوية: 220,000 جنيه مصري + 1,650 دولار أمريكي.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-pharmacy' WHERE u.slug = 'st-petersburg-university-cairo'
ON CONFLICT ("universityId", slug) DO NOTHING;

-- Sohag National University
INSERT INTO "University" (id, name, "nameAr", slug, type, country, "countryAr", city, "cityAr", "addressLine", "addressLineAr", "websiteUrl", "logoUrl", "coverImageUrl", "publishedAt", "updatedAt")
VALUES ('univ_02b033e6cdf1aee83c72', 'Sohag National University', 'جامعة سوهاج الأهلية', 'sohag-national-university', 'NATIONAL', 'Egypt', 'مصر', 'New Sohag', 'سوهاج الجديدة', NULL, NULL, 'https://sonu.edu.eg', '/img/universities/sohag-national-university/logo.png', '/img/universities/sohag-national-university/cover.jpg', now(), now())
ON CONFLICT (slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_5e5e5d9361302943c612', u.id, 'Faculty of Medicine', 'كلية الطب البشري', 'faculty-of-medicine', 0, now() FROM "University" u WHERE u.slug = 'sohag-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_b91f21f633ad6567ff33', u.id, f.id, 'Medicine', 'الطب البشري', 'medicine', 'BACHELOR', 'medicine', 150000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-medicine' WHERE u.slug = 'sohag-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_760e333e09f89d005299', u.id, 'Faculty of Health Sciences Technology', 'كلية تكنولوجيا العلوم الصحية', 'faculty-of-health-sciences-technology', 1, now() FROM "University" u WHERE u.slug = 'sohag-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_808c94c5a59a4cc5fc5f', u.id, f.id, 'Health Sciences Technology', 'تكنولوجيا العلوم الصحية', 'health-sciences-technology', 'BACHELOR', 'health_sciences', 55000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-health-sciences-technology' WHERE u.slug = 'sohag-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_f93991473066669bd6d6', u.id, 'Faculty of Computers, Information and Artificial Intelligence', 'كلية الحاسبات والمعلومات والذكاء الاصطناعي', 'faculty-of-computers-information-and-artificial-intelligence', 2, now() FROM "University" u WHERE u.slug = 'sohag-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_6af5aa8a1627e3df7087', u.id, f.id, 'Computers, Information and Artificial Intelligence', 'الحاسبات والمعلومات والذكاء الاصطناعي', 'computers-information-and-artificial-intelligence', 'BACHELOR', 'computer_science', 66000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-computers-information-and-artificial-intelligence' WHERE u.slug = 'sohag-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_18fc9e01fae3425b5179', u.id, 'Faculty of Engineering', 'كلية الهندسة', 'faculty-of-engineering', 3, now() FROM "University" u WHERE u.slug = 'sohag-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_a0de2687c9aca324dc71', u.id, f.id, 'Engineering', 'الهندسة', 'engineering', 'BACHELOR', 'engineering', 55000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-engineering' WHERE u.slug = 'sohag-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_d2e0d96b5320c57446a7', u.id, 'Faculty of Science', 'كلية العلوم', 'faculty-of-science', 4, now() FROM "University" u WHERE u.slug = 'sohag-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_796706b324428850b680', u.id, f.id, 'Science', 'العلوم', 'science', 'BACHELOR', 'science', 44000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-science' WHERE u.slug = 'sohag-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_d4351f3ba90051cbf1a5', u.id, 'Faculty of Mass Communication', 'كلية الإعلام', 'faculty-of-mass-communication', 5, now() FROM "University" u WHERE u.slug = 'sohag-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_bf20d79016b6655604df', u.id, f.id, 'Mass Communication', 'الإعلام', 'mass-communication', 'BACHELOR', 'mass_communication', 38500, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-mass-communication' WHERE u.slug = 'sohag-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_929ce4f5aace4d9f6fb8', u.id, 'Faculty of Languages and Humanities', 'كلية اللغات والعلوم الإنسانية', 'faculty-of-languages-and-humanities', 6, now() FROM "University" u WHERE u.slug = 'sohag-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_70e45dd4f2da99910f8c', u.id, f.id, 'Languages and Humanities', 'اللغات والعلوم الإنسانية', 'languages-and-humanities', 'BACHELOR', 'languages_translation', 38500, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-languages-and-humanities' WHERE u.slug = 'sohag-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_d59685176c80a46fd920', u.id, 'Faculty of Pharmacy', 'كلية الصيدلة', 'faculty-of-pharmacy', 7, now() FROM "University" u WHERE u.slug = 'sohag-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_e43adbd066b6699a6c87', u.id, f.id, 'Pharm D General', 'الصيدلة (Pharm D General)', 'pharm-d-general', 'BACHELOR', 'pharmacy', 86000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-pharmacy' WHERE u.slug = 'sohag-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_0b0828ce0fc137a178d2', u.id, f.id, 'Pharm D Clinical', 'الصيدلة (Pharm D Clinical)', 'pharm-d-clinical', 'BACHELOR', 'pharmacy', 96000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-pharmacy' WHERE u.slug = 'sohag-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;

-- Tanta National University
INSERT INTO "University" (id, name, "nameAr", slug, type, country, "countryAr", city, "cityAr", "addressLine", "addressLineAr", "websiteUrl", "logoUrl", "coverImageUrl", "publishedAt", "updatedAt")
VALUES ('univ_06e359ea636a66b0068d', 'Tanta National University', 'جامعة طنطا الأهلية', 'tanta-national-university', 'NATIONAL', 'Egypt', 'مصر', 'Tanta', 'طنطا', NULL, NULL, 'https://tnu.edu.eg', '/img/universities/tanta-national-university/logo.png', '/img/universities/tanta-national-university/cover.jpg', now(), now())
ON CONFLICT (slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_1d6f3dce5ce38fb3c2dd', u.id, 'Faculty of Medicine', 'كلية الطب', 'faculty-of-medicine', 0, now() FROM "University" u WHERE u.slug = 'tanta-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_a16939d92c8470688d0a', u.id, f.id, 'Medicine', 'الطب', 'medicine', 'BACHELOR', 'medicine', 155000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-medicine' WHERE u.slug = 'tanta-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_4c8c0d6ccb485db101b0', u.id, 'Faculty of Dentistry', 'كلية طب الأسنان', 'faculty-of-dentistry', 1, now() FROM "University" u WHERE u.slug = 'tanta-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_0ab3c9cea15abf286a14', u.id, f.id, 'Dentistry', 'طب الأسنان', 'dentistry', 'BACHELOR', 'dentistry', 125000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-dentistry' WHERE u.slug = 'tanta-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_0545e2e2e5d7bfb1b564', u.id, 'Faculty of Engineering', 'كلية الهندسة', 'faculty-of-engineering', 2, now() FROM "University" u WHERE u.slug = 'tanta-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_b38dfab759a0b9049ffe', u.id, f.id, 'Engineering', 'الهندسة', 'engineering', 'BACHELOR', 'engineering', 80000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-engineering' WHERE u.slug = 'tanta-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_b48fa9b38d0ca093ccd2', u.id, 'Faculty of Computers, Information and Artificial Intelligence', 'كلية الحاسبات والمعلومات والذكاء الاصطناعي', 'faculty-of-computers-information-and-artificial-intelligence', 3, now() FROM "University" u WHERE u.slug = 'tanta-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_247244d573a06e11cbba', u.id, f.id, 'Computers, Information and Artificial Intelligence', 'الحاسبات والمعلومات والذكاء الاصطناعي', 'computers-information-and-artificial-intelligence', 'BACHELOR', 'computer_science', 80000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-computers-information-and-artificial-intelligence' WHERE u.slug = 'tanta-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_dc22b8678db374d9568d', u.id, 'Faculty of Business', 'كلية الأعمال', 'faculty-of-business', 4, now() FROM "University" u WHERE u.slug = 'tanta-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_6891f5ddc09ab142ffaa', u.id, f.id, 'Business', 'الأعمال', 'business', 'BACHELOR', 'business_administration', 45000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-business' WHERE u.slug = 'tanta-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_4f4b644fe6348c32c36b', u.id, 'Faculty of Humanities and Social Sciences', 'كلية العلوم الإنسانية والاجتماعية', 'faculty-of-humanities-and-social-sciences', 5, now() FROM "University" u WHERE u.slug = 'tanta-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_06c6a96c4afb4deee91d', u.id, f.id, 'Humanities and Social Sciences', 'العلوم الإنسانية والاجتماعية', 'humanities-and-social-sciences', 'BACHELOR', 'arts_humanities', 40000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-humanities-and-social-sciences' WHERE u.slug = 'tanta-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_180faf787d642b4cf437', u.id, 'Faculty of Al-Alsun', 'كلية الألسن', 'faculty-of-al-alsun', 6, now() FROM "University" u WHERE u.slug = 'tanta-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_d5942754c63c5813b9b6', u.id, f.id, 'Al-Alsun (Languages)', 'الألسن', 'al-alsun-languages', 'BACHELOR', 'languages_translation', 50000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-al-alsun' WHERE u.slug = 'tanta-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;

-- Kazan Federal University Cairo Branch
INSERT INTO "University" (id, name, "nameAr", slug, type, country, "countryAr", city, "cityAr", "addressLine", "addressLineAr", "websiteUrl", "logoUrl", "coverImageUrl", "publishedAt", "updatedAt")
VALUES ('univ_d7fa3fa9c35ad09f161c', 'Kazan Federal University Cairo Branch', 'جامعة كازان الفيدرالية الروسية - مصر', 'kazan-federal-university-cairo', 'PRIVATE', 'Egypt', 'مصر', 'Cairo', 'القاهرة', 'Wadi El Nil Medical Complex, Kobry El Qobba', 'مجمع وادي النيل الطبي، كوبري القبة', 'https://kfu.edu.eg', '/img/universities/kazan-federal-university-cairo/logo.png', '/img/universities/kazan-federal-university-cairo/cover.jpg', now(), now())
ON CONFLICT (slug) DO NOTHING;
INSERT INTO "UniversityImage" (id, "universityId", url, alt, "altAr", "sortOrder")
SELECT 'img_11074c489f5fe9fc5ec3', u.id, '/img/universities/kazan-federal-university-cairo/gallery-1.jpg', 'Kazan Federal University Cairo Branch campus', 'حرم جامعة كازان الفيدرالية الروسية - مصر', 0 FROM "University" u WHERE u.slug = 'kazan-federal-university-cairo'
  AND NOT EXISTS (SELECT 1 FROM "UniversityImage" i WHERE i."universityId" = u.id AND i.url = '/img/universities/kazan-federal-university-cairo/gallery-1.jpg');
INSERT INTO "UniversityImage" (id, "universityId", url, alt, "altAr", "sortOrder")
SELECT 'img_b26aa06638d1d7b40001', u.id, '/img/universities/kazan-federal-university-cairo/gallery-2.jpg', 'Kazan Federal University Cairo Branch campus', 'حرم جامعة كازان الفيدرالية الروسية - مصر', 1 FROM "University" u WHERE u.slug = 'kazan-federal-university-cairo'
  AND NOT EXISTS (SELECT 1 FROM "UniversityImage" i WHERE i."universityId" = u.id AND i.url = '/img/universities/kazan-federal-university-cairo/gallery-2.jpg');
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_24fe8b382d25a0f68066', u.id, 'Faculty of Medicine', 'كلية الطب البشري', 'faculty-of-medicine', 0, now() FROM "University" u WHERE u.slug = 'kazan-federal-university-cairo'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_ae4f4045b8bcfe160ca8', u.id, f.id, 'Medicine', 'الطب البشري', 'medicine', 'BACHELOR', 'medicine', 275000, 'YEAR', 'EGP', 'Annual fees: EGP 275,000 plus USD 1,650.', 'المصروفات السنوية: 275,000 جنيه مصري + 1,650 دولار أمريكي.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-medicine' WHERE u.slug = 'kazan-federal-university-cairo'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_94775e6cb28db66d4bb1', u.id, 'Faculty of Dentistry', 'كلية طب الأسنان', 'faculty-of-dentistry', 1, now() FROM "University" u WHERE u.slug = 'kazan-federal-university-cairo'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_d0d78720ea2b56a2560e', u.id, f.id, 'Dentistry', 'طب الأسنان', 'dentistry', 'BACHELOR', 'dentistry', 250000, 'YEAR', 'EGP', 'Annual fees: EGP 250,000 plus USD 1,650.', 'المصروفات السنوية: 250,000 جنيه مصري + 1,650 دولار أمريكي.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-dentistry' WHERE u.slug = 'kazan-federal-university-cairo'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_2668934a7e1bc5bfc4ac', u.id, 'Faculty of Pharmacy', 'كلية الصيدلة', 'faculty-of-pharmacy', 2, now() FROM "University" u WHERE u.slug = 'kazan-federal-university-cairo'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_81fd2f08724478dc81cb', u.id, f.id, 'Pharmacy', 'الصيدلة', 'pharmacy', 'BACHELOR', 'pharmacy', 220000, 'YEAR', 'EGP', 'Annual fees: EGP 220,000 plus USD 1,650.', 'المصروفات السنوية: 220,000 جنيه مصري + 1,650 دولار أمريكي.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-pharmacy' WHERE u.slug = 'kazan-federal-university-cairo'
ON CONFLICT ("universityId", slug) DO NOTHING;

-- Kafrelsheikh National University
INSERT INTO "University" (id, name, "nameAr", slug, type, country, "countryAr", city, "cityAr", "addressLine", "addressLineAr", "websiteUrl", "logoUrl", "coverImageUrl", "publishedAt", "updatedAt")
VALUES ('univ_98f408c477b8ee8821b5', 'Kafrelsheikh National University', 'جامعة كفر الشيخ الأهلية', 'kafr-el-sheikh-national-university', 'NATIONAL', 'Egypt', 'مصر', 'Kafr El Sheikh', 'كفر الشيخ', NULL, NULL, 'https://knu.edu.eg', '/img/universities/kafr-el-sheikh-national-university/logo.png', '/img/universities/kafr-el-sheikh-national-university/cover.jpg', now(), now())
ON CONFLICT (slug) DO NOTHING;
INSERT INTO "UniversityImage" (id, "universityId", url, alt, "altAr", "sortOrder")
SELECT 'img_c021ba1ed4dadd754c4e', u.id, '/img/universities/kafr-el-sheikh-national-university/gallery-1.jpg', 'Kafrelsheikh National University campus', 'حرم جامعة كفر الشيخ الأهلية', 0 FROM "University" u WHERE u.slug = 'kafr-el-sheikh-national-university'
  AND NOT EXISTS (SELECT 1 FROM "UniversityImage" i WHERE i."universityId" = u.id AND i.url = '/img/universities/kafr-el-sheikh-national-university/gallery-1.jpg');
INSERT INTO "UniversityImage" (id, "universityId", url, alt, "altAr", "sortOrder")
SELECT 'img_3b3d8d81f6f15d54cf90', u.id, '/img/universities/kafr-el-sheikh-national-university/gallery-2.jpg', 'Kafrelsheikh National University campus', 'حرم جامعة كفر الشيخ الأهلية', 1 FROM "University" u WHERE u.slug = 'kafr-el-sheikh-national-university'
  AND NOT EXISTS (SELECT 1 FROM "UniversityImage" i WHERE i."universityId" = u.id AND i.url = '/img/universities/kafr-el-sheikh-national-university/gallery-2.jpg');
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_b7c2b90e38c1083619f3', u.id, 'Faculty of Medicine', 'كلية الطب البشري', 'faculty-of-medicine', 0, now() FROM "University" u WHERE u.slug = 'kafr-el-sheikh-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_4059f30e777e6e5be964', u.id, f.id, 'Bachelor of Medicine and Surgery', 'بكالوريوس الطب والجراحة', 'bachelor-of-medicine-and-surgery', 'BACHELOR', 'medicine', 150000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-medicine' WHERE u.slug = 'kafr-el-sheikh-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_3f97c7ce248d7e466a54', u.id, 'Faculty of Oral and Dental Medicine', 'كلية طب الفم والأسنان', 'faculty-of-oral-and-dental-medicine', 1, now() FROM "University" u WHERE u.slug = 'kafr-el-sheikh-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_c3118be8ba266611666a', u.id, f.id, 'Bachelor of Oral and Dental Medicine and Surgery', 'بكالوريوس طب وجراحة الفم والأسنان', 'bachelor-of-oral-and-dental-medicine-and-surgery', 'BACHELOR', 'dentistry', 120000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-oral-and-dental-medicine' WHERE u.slug = 'kafr-el-sheikh-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_b0b08d6288e003b64f22', u.id, 'Faculty of Physical Therapy', 'كلية العلاج الطبيعي', 'faculty-of-physical-therapy', 2, now() FROM "University" u WHERE u.slug = 'kafr-el-sheikh-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_2c3645d5b8447e18824f', u.id, f.id, 'Bachelor of Physical Therapy', 'بكالوريوس العلاج الطبيعي', 'bachelor-of-physical-therapy', 'BACHELOR', 'physical_therapy', 110000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-physical-therapy' WHERE u.slug = 'kafr-el-sheikh-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_3070edf917cfdd41a0c2', u.id, 'Faculty of Pharmacy', 'كلية الصيدلة', 'faculty-of-pharmacy', 3, now() FROM "University" u WHERE u.slug = 'kafr-el-sheikh-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_1c29f70afc07805277df', u.id, f.id, 'Bachelor of Clinical Pharmacy', 'بكالوريوس الصيدلة الإكلينيكية', 'bachelor-of-clinical-pharmacy', 'BACHELOR', 'pharmacy', 110000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-pharmacy' WHERE u.slug = 'kafr-el-sheikh-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_dae16ce1137e5b27a23c', u.id, 'Faculty of Veterinary Medicine', 'كلية الطب البيطري', 'faculty-of-veterinary-medicine', 4, now() FROM "University" u WHERE u.slug = 'kafr-el-sheikh-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_1acd8a528c44a345a5d7', u.id, f.id, 'Bachelor of Veterinary Medicine', 'بكالوريوس الطب البيطري', 'bachelor-of-veterinary-medicine', 'BACHELOR', 'veterinary', 70000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-veterinary-medicine' WHERE u.slug = 'kafr-el-sheikh-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_0c884dac10f973096e20', u.id, 'Faculty of Nursing', 'كلية التمريض', 'faculty-of-nursing', 5, now() FROM "University" u WHERE u.slug = 'kafr-el-sheikh-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_32b46f77632b28f70c7f', u.id, f.id, 'Bachelor of Nursing Science', 'بكالوريوس علوم التمريض', 'bachelor-of-nursing-science', 'BACHELOR', 'nursing', 70000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-nursing' WHERE u.slug = 'kafr-el-sheikh-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_456d38d2a54a2704f015', u.id, 'Computers, Information and Artificial Intelligence', 'الحاسبات والمعلومات والذكاء الاصطناعي', 'computers-information-and-artificial-intelligence', 6, now() FROM "University" u WHERE u.slug = 'kafr-el-sheikh-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_91b7f265f3aec8bf8107', u.id, f.id, 'Computer Science', 'علوم الحاسب', 'computer-science', 'BACHELOR', 'computer_science', 75000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'computers-information-and-artificial-intelligence' WHERE u.slug = 'kafr-el-sheikh-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_c4eca9b140094da2b568', u.id, f.id, 'Cybersecurity', 'الأمن السيبراني', 'cybersecurity', 'BACHELOR', 'computer_science', 75000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'computers-information-and-artificial-intelligence' WHERE u.slug = 'kafr-el-sheikh-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_015ced2f4f10a7bb9d0f', u.id, f.id, 'Virtual Reality', 'الواقع الافتراضي', 'virtual-reality', 'BACHELOR', 'computer_science', 75000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'computers-information-and-artificial-intelligence' WHERE u.slug = 'kafr-el-sheikh-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_5f56dcb09f6a6f39f2bf', u.id, f.id, 'Artificial Intelligence', 'الذكاء الاصطناعي', 'artificial-intelligence', 'BACHELOR', 'artificial_intelligence', 75000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'computers-information-and-artificial-intelligence' WHERE u.slug = 'kafr-el-sheikh-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_4f4d158da3173f3fbf7e', u.id, 'Science', 'العلوم', 'science', 7, now() FROM "University" u WHERE u.slug = 'kafr-el-sheikh-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_f935f2300c2dccc566d2', u.id, f.id, 'Medical Biotechnology', 'التقنية الحيوية الطبية', 'medical-biotechnology', 'BACHELOR', 'biotechnology', 55000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'science' WHERE u.slug = 'kafr-el-sheikh-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_1629bc98ccda409ad604', u.id, f.id, 'Biochemistry', 'الكيمياء الحيوية', 'biochemistry', 'BACHELOR', 'science', 55000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'science' WHERE u.slug = 'kafr-el-sheikh-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_b03c2229c5abca34f016', u.id, f.id, 'Nano and Nanotechnology', 'نانو وتكنولوجيا النانو', 'nano-and-nanotechnology', 'BACHELOR', 'science', 55000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'science' WHERE u.slug = 'kafr-el-sheikh-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_7cb9cafad3de973edcd8', u.id, 'Business', 'الأعمال', 'business', 8, now() FROM "University" u WHERE u.slug = 'kafr-el-sheikh-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_7edce712f06e990b7ee6', u.id, f.id, 'Accounting and Business Analytics', 'المحاسبة وتحليل الأعمال', 'accounting-and-business-analytics', 'BACHELOR', 'business_administration', 45000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'business' WHERE u.slug = 'kafr-el-sheikh-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_4e5f01349622c95d0bbc', u.id, f.id, 'Business Technology', 'تكنولوجيا الأعمال', 'business-technology', 'BACHELOR', 'business_administration', 45000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'business' WHERE u.slug = 'kafr-el-sheikh-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_51b95e20c3c30f2064d7', u.id, f.id, 'Business Information Systems', 'نظم معلومات الأعمال', 'business-information-systems', 'BACHELOR', 'business_administration', 45000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'business' WHERE u.slug = 'kafr-el-sheikh-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_5f5ebf6d46ff961e4ac7', u.id, 'Languages and Humanities', 'اللغات والعلوم الانسانية', 'languages-and-humanities', 9, now() FROM "University" u WHERE u.slug = 'kafr-el-sheikh-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_721b9e6c1956f0b7aa0e', u.id, f.id, 'Specialised Languages: English, Chinese, German, Spanish', 'لغات متخصصة: إنجليزية، صينية، ألمانية، إسبانية', 'specialised-languages-english-chinese-german-spanish', 'BACHELOR', 'languages_translation', 40000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'languages-and-humanities' WHERE u.slug = 'kafr-el-sheikh-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_6ca0143762d98cc31f5b', u.id, f.id, 'Surveying, Cartography and GIS', 'المساحة والخرائط ونظم المعلومات الجغرافية', 'surveying-cartography-and-gis', 'BACHELOR', 'arts_humanities', 40000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'languages-and-humanities' WHERE u.slug = 'kafr-el-sheikh-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_3545dde3880df65e4988', u.id, f.id, 'Clinical Psychology', 'علم النفس الإكلينيكي', 'clinical-psychology', 'BACHELOR', 'arts_humanities', 40000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'languages-and-humanities' WHERE u.slug = 'kafr-el-sheikh-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_9f83e33576fa1b80f037', u.id, 'Engineering', 'الهندسة', 'engineering', 10, now() FROM "University" u WHERE u.slug = 'kafr-el-sheikh-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_60de5ea4ea2822c93526', u.id, f.id, 'Mechatronics Engineering', 'هندسة الميكاترونيات', 'mechatronics-engineering', 'BACHELOR', 'engineering', 75000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'engineering' WHERE u.slug = 'kafr-el-sheikh-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_c7cfdfdf5bcd2839dbd5', u.id, f.id, 'Artificial Intelligence Engineering', 'هندسة الذكاء الاصطناعي', 'artificial-intelligence-engineering', 'BACHELOR', 'engineering', 75000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'engineering' WHERE u.slug = 'kafr-el-sheikh-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_0fba0245fd1d0b2b5238', u.id, f.id, 'Architecture with Digital Technology', 'العمارة بالتكنولوجيا الرقمية', 'architecture-with-digital-technology', 'BACHELOR', 'architecture', 75000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'engineering' WHERE u.slug = 'kafr-el-sheikh-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_2e81127c41ae75478246', u.id, f.id, 'Structural Engineering', 'الهندسة الإنشائية', 'structural-engineering', 'BACHELOR', 'engineering', 75000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'engineering' WHERE u.slug = 'kafr-el-sheikh-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_96d2c22b6b85b57096b7', u.id, 'Agriculture', 'الزراعة', 'agriculture', 11, now() FROM "University" u WHERE u.slug = 'kafr-el-sheikh-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_279f3143982f24d811f3', u.id, f.id, 'Bachelor of Biotechnology', 'بكالوريوس التكنولوجيا الحيوية', 'bachelor-of-biotechnology', 'BACHELOR', 'biotechnology', 40000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'agriculture' WHERE u.slug = 'kafr-el-sheikh-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_492c31d01810e49ae5fe', u.id, 'Arts and Design', 'الفنون والتصميم', 'arts-and-design', 12, now() FROM "University" u WHERE u.slug = 'kafr-el-sheikh-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_2ab8ed24273227df7c51', u.id, f.id, 'Interior Design', 'التصميم الداخلي', 'interior-design', 'BACHELOR', 'applied_arts', 40000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'arts-and-design' WHERE u.slug = 'kafr-el-sheikh-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_66c71bcec97e3531fb9a', u.id, f.id, 'Textiles and Clothing', 'المنسوجات والملابس', 'textiles-and-clothing', 'BACHELOR', 'applied_arts', 40000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'arts-and-design' WHERE u.slug = 'kafr-el-sheikh-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_ac61beafd9e0724899ae', u.id, f.id, 'Graphic Design and Animation', 'التصميم الجرافيكي والرسوم المتحركة', 'graphic-design-and-animation', 'BACHELOR', 'applied_arts', 40000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'arts-and-design' WHERE u.slug = 'kafr-el-sheikh-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;

-- University of Lancashire Egypt
INSERT INTO "University" (id, name, "nameAr", slug, type, country, "countryAr", city, "cityAr", "addressLine", "addressLineAr", "websiteUrl", "logoUrl", "coverImageUrl", "publishedAt", "updatedAt")
VALUES ('univ_a30904eeb2b8c2041bf1', 'University of Lancashire Egypt', 'جامعة لانكشاير - مصر', 'university-of-lancashire-egypt', 'PRIVATE', 'Egypt', 'مصر', 'New Administrative Capital', 'العاصمة الإدارية الجديدة', 'European Universities in Egypt (EUE) campus, R3', 'حرم الجامعات الأوروبية في مصر، الحي R3', 'https://eue.edu.eg', '/img/universities/university-of-lancashire-egypt/logo.png', '/img/universities/university-of-lancashire-egypt/cover.jpg', now(), now())
ON CONFLICT (slug) DO NOTHING;
INSERT INTO "UniversityImage" (id, "universityId", url, alt, "altAr", "sortOrder")
SELECT 'img_21f3477b116a4deddda0', u.id, '/img/universities/university-of-lancashire-egypt/gallery-1.jpg', 'University of Lancashire Egypt campus', 'حرم جامعة لانكشاير - مصر', 0 FROM "University" u WHERE u.slug = 'university-of-lancashire-egypt'
  AND NOT EXISTS (SELECT 1 FROM "UniversityImage" i WHERE i."universityId" = u.id AND i.url = '/img/universities/university-of-lancashire-egypt/gallery-1.jpg');
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_f8446f42712a670f64af', u.id, 'Faculty of Engineering', 'كلية الهندسة', 'faculty-of-engineering', 0, now() FROM "University" u WHERE u.slug = 'university-of-lancashire-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_25f1c8b213e3363a9d64', u.id, f.id, 'Mechatronics and Smart Devices Engineering', 'هندسة الميكاترونكس والأجهزة الذكية', 'mechatronics-and-smart-devices-engineering', 'BACHELOR', 'engineering', 330000, 'YEAR', 'EGP', 'Annual fees by category: A EGP 300,000, B EGP 315,000, C EGP 330,000; conditional admission EGP 330,000.', 'المصروفات السنوية حسب الفئة: فئة A 300,000 جنيه، فئة B 315,000 جنيه، فئة C 330,000 جنيه، القبول المشروط 330,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-engineering' WHERE u.slug = 'university-of-lancashire-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_2709f649cd0610bd7fca', u.id, f.id, 'Mechanical Engineering', 'الهندسة الميكانيكية', 'mechanical-engineering', 'BACHELOR', 'engineering', 330000, 'YEAR', 'EGP', 'Annual fees by category: A EGP 300,000, B EGP 315,000, C EGP 330,000; conditional admission EGP 330,000.', 'المصروفات السنوية حسب الفئة: فئة A 300,000 جنيه، فئة B 315,000 جنيه، فئة C 330,000 جنيه، القبول المشروط 330,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-engineering' WHERE u.slug = 'university-of-lancashire-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_b5870300d419994ce0d0', u.id, f.id, 'Motorsport Engineering', 'هندسة السيارات الرياضية', 'motorsport-engineering', 'BACHELOR', 'engineering', 330000, 'YEAR', 'EGP', 'Annual fees by category: A EGP 300,000, B EGP 315,000, C EGP 330,000; conditional admission EGP 330,000.', 'المصروفات السنوية حسب الفئة: فئة A 300,000 جنيه، فئة B 315,000 جنيه، فئة C 330,000 جنيه، القبول المشروط 330,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-engineering' WHERE u.slug = 'university-of-lancashire-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_ea1483495eb7dac4b5b9', u.id, f.id, 'Architectural Design', 'التصميم المعماري', 'architectural-design', 'BACHELOR', 'architecture', 330000, 'YEAR', 'EGP', 'Annual fees by category: A EGP 300,000, B EGP 315,000, C EGP 330,000; conditional admission EGP 330,000.', 'المصروفات السنوية حسب الفئة: فئة A 300,000 جنيه، فئة B 315,000 جنيه، فئة C 330,000 جنيه، القبول المشروط 330,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-engineering' WHERE u.slug = 'university-of-lancashire-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_2c5889fe3cccc7f5e8ac', u.id, f.id, 'Electrical and Electronic Engineering', 'الهندسة الكهربائية والإلكترونية', 'electrical-and-electronic-engineering', 'BACHELOR', 'engineering', 330000, 'YEAR', 'EGP', 'Annual fees by category: A EGP 300,000, B EGP 315,000, C EGP 330,000; conditional admission EGP 330,000.', 'المصروفات السنوية حسب الفئة: فئة A 300,000 جنيه، فئة B 315,000 جنيه، فئة C 330,000 جنيه، القبول المشروط 330,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-engineering' WHERE u.slug = 'university-of-lancashire-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_1c285b421fc4ee4ea225', u.id, f.id, 'Renewable Energy Engineering', 'هندسة الطاقة المتجددة', 'renewable-energy-engineering', 'BACHELOR', 'engineering', 330000, 'YEAR', 'EGP', 'Annual fees by category: A EGP 300,000, B EGP 315,000, C EGP 330,000; conditional admission EGP 330,000.', 'المصروفات السنوية حسب الفئة: فئة A 300,000 جنيه، فئة B 315,000 جنيه، فئة C 330,000 جنيه، القبول المشروط 330,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-engineering' WHERE u.slug = 'university-of-lancashire-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_ff339e6a60800439d89b', u.id, f.id, 'Civil Engineering', 'الهندسة المدنية', 'civil-engineering', 'BACHELOR', 'engineering', 330000, 'YEAR', 'EGP', 'Annual fees by category: A EGP 300,000, B EGP 315,000, C EGP 330,000; conditional admission EGP 330,000.', 'المصروفات السنوية حسب الفئة: فئة A 300,000 جنيه، فئة B 315,000 جنيه، فئة C 330,000 جنيه، القبول المشروط 330,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-engineering' WHERE u.slug = 'university-of-lancashire-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_32a1d1c14fa90f356fd8', u.id, f.id, 'Aerospace Engineering and Pilot Studies', 'هندسة الفضاء وإعداد الطيارين', 'aerospace-engineering-and-pilot-studies', 'BACHELOR', 'engineering', 330000, 'YEAR', 'EGP', 'Annual fees by category: A EGP 300,000, B EGP 315,000, C EGP 330,000; conditional admission EGP 330,000.', 'المصروفات السنوية حسب الفئة: فئة A 300,000 جنيه، فئة B 315,000 جنيه، فئة C 330,000 جنيه، القبول المشروط 330,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-engineering' WHERE u.slug = 'university-of-lancashire-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_8682abd97c43c8c50e58', u.id, f.id, 'Manufacturing Engineering', 'هندسة التصنيع', 'manufacturing-engineering', 'BACHELOR', 'engineering', 330000, 'YEAR', 'EGP', 'Annual fees by category: A EGP 300,000, B EGP 315,000, C EGP 330,000; conditional admission EGP 330,000.', 'المصروفات السنوية حسب الفئة: فئة A 300,000 جنيه، فئة B 315,000 جنيه، فئة C 330,000 جنيه، القبول المشروط 330,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-engineering' WHERE u.slug = 'university-of-lancashire-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_5d204d7fb804005b036d', u.id, f.id, 'Electronic Engineering', 'هندسة الإلكترونيات', 'electronic-engineering', 'BACHELOR', 'engineering', 330000, 'YEAR', 'EGP', 'Annual fees by category: A EGP 300,000, B EGP 315,000, C EGP 330,000; conditional admission EGP 330,000.', 'المصروفات السنوية حسب الفئة: فئة A 300,000 جنيه، فئة B 315,000 جنيه، فئة C 330,000 جنيه، القبول المشروط 330,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-engineering' WHERE u.slug = 'university-of-lancashire-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_f264b6d8e68c930b7a14', u.id, 'Faculty of Medicine', 'كلية الطب البشري', 'faculty-of-medicine', 1, now() FROM "University" u WHERE u.slug = 'university-of-lancashire-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_edde4f0ef45149cf912a', u.id, f.id, 'Medicine', 'الطب البشري', 'medicine', 'BACHELOR', 'medicine', 460000, 'YEAR', 'EGP', 'Annual fees by category: A EGP 400,000, B EGP 430,000, C EGP 460,000; conditional admission EGP 330,000.', 'المصروفات السنوية حسب الفئة: فئة A 400,000 جنيه، فئة B 430,000 جنيه، فئة C 460,000 جنيه، القبول المشروط 330,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-medicine' WHERE u.slug = 'university-of-lancashire-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_d7173ab210a0df6af424', u.id, 'Faculty of Pharmacy', 'كلية الصيدلة', 'faculty-of-pharmacy', 2, now() FROM "University" u WHERE u.slug = 'university-of-lancashire-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_5e10d836ec876c8da58e', u.id, f.id, 'Pharmacy (MPharm)', 'الصيدلة (MPharm)', 'pharmacy-mpharm', 'BACHELOR', 'pharmacy', 315000, 'YEAR', 'EGP', 'Annual fees by category: A EGP 275,000, B EGP 285,000, C EGP 295,000; conditional admission EGP 315,000.', 'المصروفات السنوية حسب الفئة: فئة A 275,000 جنيه، فئة B 285,000 جنيه، فئة C 295,000 جنيه، القبول المشروط 315,000 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-pharmacy' WHERE u.slug = 'university-of-lancashire-egypt'
ON CONFLICT ("universityId", slug) DO NOTHING;

COMMIT;
