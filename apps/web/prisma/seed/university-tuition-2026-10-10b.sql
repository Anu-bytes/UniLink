-- From the client sheet "مصروفات_الجامعات_المصرية_2026_2027 (5).xlsx" (2026-10-10):
-- adds Benha National University (new) and the faculties and 2026/2027 fees
-- of Galala, New Alamein International and King Salman International, which
-- had none. Campus-specific King Salman fees are programs named after the
-- campus; New Alamein bills per term (tuition stored, administrative fee in
-- the description). Benha details from bnu.edu.eg and the Council of
-- National Universities. Safe to re-run.

BEGIN;

INSERT INTO "University" (id, name, "nameAr", acronym, slug, type, country, "countryAr", city, "cityAr", description, "descriptionAr", "establishedYear", "websiteUrl", "logoUrl", "addressLine", "addressLineAr", "publishedAt", "updatedAt")
VALUES ('univ_43ca0ce261644a42894f', 'Benha National University', 'جامعة بنها الأهلية', 'BNU', 'benha-national-university', 'NATIONAL', 'Egypt', 'مصر', 'Obour City', 'مدينة العبور', 'Benha National University is a national (ahleya) university established by Presidential Decree No. 369 of 2022 and located in Obour City, Qalyubia Governorate, on a 40-feddan campus. Teaching began in the 2022/2023 academic year with four faculties and has since grown to ten: medicine, dentistry, physical therapy, engineering, applied health sciences technology, economics and business administration, computer science, veterinary medicine, visual arts and design, and energy sciences. The faculties of visual arts, veterinary medicine and energy sciences were added by a 2023 presidential decree, and applied health sciences technology opens in the 2026/2027 academic year.', 'جامعة بنها الأهلية جامعة أهلية أُنشئت بقرار رئيس الجمهورية رقم 369 لسنة 2022، وتقع في مدينة العبور بمحافظة القليوبية على مساحة 40 فدانًا. بدأت الدراسة بها في العام الجامعي 2022/2023 بأربع كليات، ثم توسعت لتضم عشر كليات هي الطب البشري وطب الأسنان والعلاج الطبيعي والهندسة وتكنولوجيا العلوم الصحية التطبيقية والاقتصاد وإدارة الأعمال وعلوم الحاسب والطب البيطري والفنون البصرية والتصميم وعلوم الطاقة. وأُضيفت كليات الفنون البصرية والطب البيطري وعلوم الطاقة بقرار جمهوري عام 2023، وتبدأ الدراسة بكلية تكنولوجيا العلوم الصحية التطبيقية في العام الجامعي 2026/2027.', 2022, 'https://bnu.edu.eg', '/img/universities/benha-national-university/logo.png', 'Entertainment District, Obour Main Axis, Obour City, Qalyubia Governorate', 'الحي الترفيهي، محور العبور الرئيسي، مدينة العبور، محافظة القليوبية', now(), now())
ON CONFLICT (slug) DO NOTHING;

-- galala-university
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_bd00707f10514622881a', u.id, 'Faculty of Medicine', 'كلية الطب البشري', 'faculty-of-medicine', 0, now() FROM "University" u WHERE u.slug = 'galala-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_2b93874927e6468b8e49', u.id, f.id, 'Medicine', 'الطب البشري', 'medicine', 'BACHELOR', 'medicine', 197000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-medicine' WHERE u.slug = 'galala-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_c97750153b1f412598f7', u.id, 'Faculty of Dentistry', 'كلية طب الفم والأسنان', 'faculty-of-dentistry', 1, now() FROM "University" u WHERE u.slug = 'galala-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_bf008006636b4cd28f1f', u.id, f.id, 'Dentistry', 'طب الفم والأسنان', 'dentistry', 'BACHELOR', 'dentistry', 175000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-dentistry' WHERE u.slug = 'galala-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_d72ce65dce5b46bb873b', u.id, 'Faculty of Pharmaceutical Sciences', 'كلية العلوم الصيدلية', 'faculty-of-pharmaceutical-sciences', 2, now() FROM "University" u WHERE u.slug = 'galala-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_8afe7b56accc470daae1', u.id, f.id, 'Pharmaceutical Sciences', 'العلوم الصيدلية', 'pharmaceutical-sciences', 'BACHELOR', 'pharmacy', 123000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-pharmaceutical-sciences' WHERE u.slug = 'galala-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_49791b2212674cd499f2', u.id, 'Faculty of Physical Therapy', 'كلية العلاج الطبيعي', 'faculty-of-physical-therapy', 3, now() FROM "University" u WHERE u.slug = 'galala-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_2afe41fa37bb4a62a362', u.id, f.id, 'Physical Therapy', 'العلاج الطبيعي', 'physical-therapy', 'BACHELOR', 'physical_therapy', 122000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-physical-therapy' WHERE u.slug = 'galala-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_771e7517423641a3b2d7', u.id, 'Faculty of Engineering', 'كلية الهندسة', 'faculty-of-engineering', 4, now() FROM "University" u WHERE u.slug = 'galala-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_864c4fe1a95842f68cba', u.id, f.id, 'Engineering', 'الهندسة', 'engineering', 'BACHELOR', 'engineering', 100500, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-engineering' WHERE u.slug = 'galala-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_4a9402da100d432098ba', u.id, f.id, 'Computer Engineering', 'هندسة الحاسبات', 'computer-engineering', 'BACHELOR', 'engineering', 100500, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-engineering' WHERE u.slug = 'galala-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_f945461a65184c92b6ee', u.id, 'Faculty of Computer Science', 'كلية علوم الحاسب', 'faculty-of-computer-science', 5, now() FROM "University" u WHERE u.slug = 'galala-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_81b076a7a793459d8a5d', u.id, f.id, 'Computer Science', 'علوم الحاسب', 'computer-science', 'BACHELOR', 'computer_science', 95380, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-computer-science' WHERE u.slug = 'galala-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_1680475f29d049279947', u.id, 'Faculty of Food & Food Industries', 'كلية الغذاء والصناعات الغذائية', 'faculty-of-food-and-food-industries', 6, now() FROM "University" u WHERE u.slug = 'galala-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_8663d8785c04460f871e', u.id, f.id, 'Food & Food Industries', 'الغذاء والصناعات الغذائية', 'food-and-food-industries', 'BACHELOR', 'agriculture', 61860, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-food-and-food-industries' WHERE u.slug = 'galala-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_978e8fac38884b96bd0e', u.id, 'Faculty of Social & Human Sciences', 'كلية العلوم الاجتماعية والإنسانية', 'faculty-of-social-and-human-sciences', 7, now() FROM "University" u WHERE u.slug = 'galala-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_a9a1e0dcaf2e4369a19b', u.id, f.id, 'Social & Human Sciences', 'العلوم الاجتماعية والإنسانية', 'social-and-human-sciences', 'BACHELOR', 'arts_humanities', 61860, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-social-and-human-sciences' WHERE u.slug = 'galala-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_3fedb4b0207449f2a7f2', u.id, 'Faculty of Basic Sciences', 'كلية العلوم الأساسية', 'faculty-of-basic-sciences', 8, now() FROM "University" u WHERE u.slug = 'galala-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_18876369a6d842a09e6a', u.id, f.id, 'Basic Sciences', 'العلوم الأساسية', 'basic-sciences', 'BACHELOR', 'science', 67960, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-basic-sciences' WHERE u.slug = 'galala-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_bd9f9acd6fa446e4b9fc', u.id, 'Faculty of Administrative Sciences', 'كلية العلوم الإدارية', 'faculty-of-administrative-sciences', 9, now() FROM "University" u WHERE u.slug = 'galala-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_3a1f64889c9f420a9bd2', u.id, f.id, 'Administrative Sciences', 'العلوم الإدارية', 'administrative-sciences', 'BACHELOR', 'business_administration', 64920, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-administrative-sciences' WHERE u.slug = 'galala-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_96bdedb426204adb8e48', u.id, 'Faculty of Applied Health Sciences Technology', 'كلية تكنولوجيا العلوم الصحية التطبيقية', 'faculty-of-applied-health-sciences-technology', 10, now() FROM "University" u WHERE u.slug = 'galala-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_93872981596145f6aa7c', u.id, f.id, 'Applied Health Sciences Technology', 'تكنولوجيا العلوم الصحية التطبيقية', 'applied-health-sciences-technology', 'BACHELOR', 'health_sciences', 61840, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-applied-health-sciences-technology' WHERE u.slug = 'galala-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_c4aa9777a6a04f5ba48f', u.id, 'Faculty of Nursing Sciences', 'كلية علوم التمريض', 'faculty-of-nursing-sciences', 11, now() FROM "University" u WHERE u.slug = 'galala-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_c9e1b8cac84149eca112', u.id, f.id, 'Nursing Sciences', 'علوم التمريض', 'nursing-sciences', 'BACHELOR', 'nursing', 61800, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-nursing-sciences' WHERE u.slug = 'galala-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_445844c6f186428cb404', u.id, 'Faculty of Media Production', 'كلية الإنتاج الإعلامي', 'faculty-of-media-production', 12, now() FROM "University" u WHERE u.slug = 'galala-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_ec1cd55378c549a792dd', u.id, f.id, 'Media Production', 'الإنتاج الإعلامي', 'media-production', 'BACHELOR', 'mass_communication', 69500, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-media-production' WHERE u.slug = 'galala-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_27a93e634e8b4669ac2d', u.id, 'Faculty of Arts & Design', 'كلية الفنون والتصميم', 'faculty-of-arts-and-design', 13, now() FROM "University" u WHERE u.slug = 'galala-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_0982c811d3994682b46b', u.id, f.id, 'Arts & Design', 'الفنون والتصميم', 'arts-and-design', 'BACHELOR', 'applied_arts', 70480, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-arts-and-design' WHERE u.slug = 'galala-university'
ON CONFLICT ("universityId", slug) DO NOTHING;

-- new-alamein-international-university
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_3b01d0cf08b64fe2ba8e', u.id, 'Faculty of Advanced Basic Sciences', 'كلية العلوم الأساسية المتقدمة', 'faculty-of-advanced-basic-sciences', 0, now() FROM "University" u WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_3c4d9ddd5b214a80b67b', u.id, f.id, 'Sustainable Energy', 'الطاقة المستدامة', 'sustainable-energy', 'BACHELOR', 'science', 33500, 'TERM', 'EGP', 'Per term: tuition EGP 33,500 plus administrative fees EGP 8,400.', 'للترم الواحد: مصروفات دراسية 33,500 جنيه بالإضافة إلى مصروفات إدارية 8,400 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-advanced-basic-sciences' WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_75c9a1d2ff54434784fa', u.id, f.id, 'Molecular Biotechnology', 'التكنولوجيا الحيوية الجزيئية', 'molecular-biotechnology', 'BACHELOR', 'biotechnology', 33500, 'TERM', 'EGP', 'Per term: tuition EGP 33,500 plus administrative fees EGP 8,400.', 'للترم الواحد: مصروفات دراسية 33,500 جنيه بالإضافة إلى مصروفات إدارية 8,400 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-advanced-basic-sciences' WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_f38fffa1a84148e59912', u.id, f.id, 'Industrial Chemistry', 'الكيمياء الصناعية', 'industrial-chemistry', 'BACHELOR', 'science', 33500, 'TERM', 'EGP', 'Per term: tuition EGP 33,500 plus administrative fees EGP 8,400.', 'للترم الواحد: مصروفات دراسية 33,500 جنيه بالإضافة إلى مصروفات إدارية 8,400 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-advanced-basic-sciences' WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_b80454c0f3d64835b7e9', u.id, 'Faculty of Arts & Design', 'كلية الفنون والتصميم', 'faculty-of-arts-and-design', 1, now() FROM "University" u WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_e4b1831337e6434ca05e', u.id, f.id, 'Interior Design', 'التصميم الداخلي', 'interior-design', 'BACHELOR', 'applied_arts', 33500, 'TERM', 'EGP', 'Per term: tuition EGP 33,500 plus administrative fees EGP 8,400.', 'للترم الواحد: مصروفات دراسية 33,500 جنيه بالإضافة إلى مصروفات إدارية 8,400 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-arts-and-design' WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_8718e6441dcb470eb39a', u.id, f.id, 'Graphic Design', 'التصميم الجرافيكي', 'graphic-design', 'BACHELOR', 'applied_arts', 33500, 'TERM', 'EGP', 'Per term: tuition EGP 33,500 plus administrative fees EGP 8,400.', 'للترم الواحد: مصروفات دراسية 33,500 جنيه بالإضافة إلى مصروفات إدارية 8,400 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-arts-and-design' WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_ed99f036db1d4c448557', u.id, f.id, 'Game Design', 'تصميم الألعاب', 'game-design', 'BACHELOR', 'applied_arts', 33500, 'TERM', 'EGP', 'Per term: tuition EGP 33,500 plus administrative fees EGP 8,400.', 'للترم الواحد: مصروفات دراسية 33,500 جنيه بالإضافة إلى مصروفات إدارية 8,400 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-arts-and-design' WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_3ea4a3da5d884fe79c16', u.id, f.id, 'Visual Arts', 'الفنون البصرية', 'visual-arts', 'BACHELOR', 'fine_arts', 33500, 'TERM', 'EGP', 'Per term: tuition EGP 33,500 plus administrative fees EGP 8,400.', 'للترم الواحد: مصروفات دراسية 33,500 جنيه بالإضافة إلى مصروفات إدارية 8,400 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-arts-and-design' WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_bf987f527a7c4e23b1ac', u.id, f.id, 'Fashion Design', 'تصميم الملابس', 'fashion-design', 'BACHELOR', 'applied_arts', 33500, 'TERM', 'EGP', 'Per term: tuition EGP 33,500 plus administrative fees EGP 8,400.', 'للترم الواحد: مصروفات دراسية 33,500 جنيه بالإضافة إلى مصروفات إدارية 8,400 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-arts-and-design' WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_758c11e077474118a905', u.id, 'Faculty of Business Administration', 'كلية إدارة الأعمال', 'faculty-of-business-administration', 2, now() FROM "University" u WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_41e93e02770e4d0c8a99', u.id, f.id, 'Accounting & Information Systems', 'المحاسبة ونظم المعلومات', 'accounting-and-information-systems', 'BACHELOR', 'business_administration', 32500, 'TERM', 'EGP', 'Per term: tuition EGP 32,500 plus administrative fees EGP 7,600.', 'للترم الواحد: مصروفات دراسية 32,500 جنيه بالإضافة إلى مصروفات إدارية 7,600 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-business-administration' WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_7e82532a4e7249009c5f', u.id, f.id, 'Marketing', 'التسويق', 'marketing', 'BACHELOR', 'business_administration', 32500, 'TERM', 'EGP', 'Per term: tuition EGP 32,500 plus administrative fees EGP 7,600.', 'للترم الواحد: مصروفات دراسية 32,500 جنيه بالإضافة إلى مصروفات إدارية 7,600 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-business-administration' WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_bc8bd0d4371047cebe25', u.id, f.id, 'Logistics & Supply Chain Management', 'اللوجستيات وإدارة سلاسل الإمداد', 'logistics-and-supply-chain-management', 'BACHELOR', 'business_administration', 32500, 'TERM', 'EGP', 'Per term: tuition EGP 32,500 plus administrative fees EGP 7,600.', 'للترم الواحد: مصروفات دراسية 32,500 جنيه بالإضافة إلى مصروفات إدارية 7,600 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-business-administration' WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_2356fd821a58475185b4', u.id, 'Faculty of Computer Science & Engineering', 'كلية علوم وهندسة الحاسبات', 'faculty-of-computer-science-and-engineering', 3, now() FROM "University" u WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_57efba0994a549b19f6b', u.id, f.id, 'Computer Engineering', 'هندسة الحاسبات', 'computer-engineering', 'BACHELOR', 'computer_science', 43500, 'TERM', 'EGP', 'Per term: tuition EGP 43,500 plus administrative fees EGP 8,400.', 'للترم الواحد: مصروفات دراسية 43,500 جنيه بالإضافة إلى مصروفات إدارية 8,400 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-computer-science-and-engineering' WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_8c7690c448d24b2c9624', u.id, f.id, 'Cybersecurity', 'الأمن السيبراني', 'cybersecurity', 'BACHELOR', 'computer_science', 43500, 'TERM', 'EGP', 'Per term: tuition EGP 43,500 plus administrative fees EGP 8,400.', 'للترم الواحد: مصروفات دراسية 43,500 جنيه بالإضافة إلى مصروفات إدارية 8,400 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-computer-science-and-engineering' WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_f26eb51348d74014ac9c', u.id, f.id, 'Artificial Intelligence Engineering', 'هندسة الذكاء الاصطناعي', 'artificial-intelligence-engineering', 'BACHELOR', 'artificial_intelligence', 43500, 'TERM', 'EGP', 'Per term: tuition EGP 43,500 plus administrative fees EGP 8,400.', 'للترم الواحد: مصروفات دراسية 43,500 جنيه بالإضافة إلى مصروفات إدارية 8,400 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-computer-science-and-engineering' WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_80c250ef2de14a568f31', u.id, f.id, 'Computer Science', 'علوم الحاسب', 'computer-science', 'BACHELOR', 'computer_science', 43500, 'TERM', 'EGP', 'Per term: tuition EGP 43,500 plus administrative fees EGP 8,400.', 'للترم الواحد: مصروفات دراسية 43,500 جنيه بالإضافة إلى مصروفات إدارية 8,400 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-computer-science-and-engineering' WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_f9c06c1214ee4046bb22', u.id, f.id, 'Software Engineering', 'هندسة البرمجيات', 'software-engineering', 'BACHELOR', 'computer_science', 43500, 'TERM', 'EGP', 'Per term: tuition EGP 43,500 plus administrative fees EGP 8,400.', 'للترم الواحد: مصروفات دراسية 43,500 جنيه بالإضافة إلى مصروفات إدارية 8,400 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-computer-science-and-engineering' WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_ca552656c2574511b68f', u.id, f.id, 'Artificial Intelligence Science', 'علوم الذكاء الاصطناعي', 'artificial-intelligence-science', 'BACHELOR', 'artificial_intelligence', 43500, 'TERM', 'EGP', 'Per term: tuition EGP 43,500 plus administrative fees EGP 8,400.', 'للترم الواحد: مصروفات دراسية 43,500 جنيه بالإضافة إلى مصروفات إدارية 8,400 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-computer-science-and-engineering' WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_5e2f853fa50d4100ae20', u.id, 'Faculty of Dentistry', 'كلية طب الأسنان', 'faculty-of-dentistry', 4, now() FROM "University" u WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_826352ffc4eb4206a7ed', u.id, f.id, 'Dental Medicine & Surgery', 'طب وجراحة الأسنان', 'dental-medicine-and-surgery', 'BACHELOR', 'dentistry', 69000, 'TERM', 'EGP', 'Per term: tuition EGP 69,000 plus administrative fees EGP 9,900.', 'للترم الواحد: مصروفات دراسية 69,000 جنيه بالإضافة إلى مصروفات إدارية 9,900 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-dentistry' WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_4f8949fd25d04fecb141', u.id, 'Faculty of Engineering', 'كلية الهندسة', 'faculty-of-engineering', 5, now() FROM "University" u WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_6d24b578eca541afbedf', u.id, f.id, 'Construction Management', 'إدارة الإنشاءات', 'construction-management', 'BACHELOR', 'engineering', 43500, 'TERM', 'EGP', 'Per term: tuition EGP 43,500 plus administrative fees EGP 8,400.', 'للترم الواحد: مصروفات دراسية 43,500 جنيه بالإضافة إلى مصروفات إدارية 8,400 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-engineering' WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_efad35987cf84025ab92', u.id, f.id, 'Architectural Design', 'التصميم المعماري', 'architectural-design', 'BACHELOR', 'architecture', 43500, 'TERM', 'EGP', 'Per term: tuition EGP 43,500 plus administrative fees EGP 8,400.', 'للترم الواحد: مصروفات دراسية 43,500 جنيه بالإضافة إلى مصروفات إدارية 8,400 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-engineering' WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_5ffa0483fab84a44b4d4', u.id, f.id, 'Biomedical Engineering', 'الهندسة الطبية الحيوية', 'biomedical-engineering', 'BACHELOR', 'engineering', 43500, 'TERM', 'EGP', 'Per term: tuition EGP 43,500 plus administrative fees EGP 8,400.', 'للترم الواحد: مصروفات دراسية 43,500 جنيه بالإضافة إلى مصروفات إدارية 8,400 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-engineering' WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_6f816f6a6b334871b487', u.id, f.id, 'Petroleum & Gas Engineering', 'هندسة البترول والغاز', 'petroleum-and-gas-engineering', 'BACHELOR', 'engineering', 43500, 'TERM', 'EGP', 'Per term: tuition EGP 43,500 plus administrative fees EGP 8,400.', 'للترم الواحد: مصروفات دراسية 43,500 جنيه بالإضافة إلى مصروفات إدارية 8,400 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-engineering' WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_ca4734fb9c8f47efbbc9', u.id, f.id, 'Mechatronics Engineering', 'هندسة الميكاترونكس', 'mechatronics-engineering', 'BACHELOR', 'engineering', 43500, 'TERM', 'EGP', 'Per term: tuition EGP 43,500 plus administrative fees EGP 8,400.', 'للترم الواحد: مصروفات دراسية 43,500 جنيه بالإضافة إلى مصروفات إدارية 8,400 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-engineering' WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_9f3f920f454b494ab818', u.id, f.id, 'Electronics & Communications Engineering', 'هندسة الإلكترونيات والاتصالات', 'electronics-and-communications-engineering', 'BACHELOR', 'engineering', 43500, 'TERM', 'EGP', 'Per term: tuition EGP 43,500 plus administrative fees EGP 8,400.', 'للترم الواحد: مصروفات دراسية 43,500 جنيه بالإضافة إلى مصروفات إدارية 8,400 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-engineering' WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_963b071fd7cf4cff9584', u.id, 'Faculty of Pharmacy', 'كلية الصيدلة', 'faculty-of-pharmacy', 6, now() FROM "University" u WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_a115665b223b4eb8a389', u.id, f.id, 'Clinical Pharmacy (PharmD)', 'الصيدلة الإكلينيكية (PharmD)', 'clinical-pharmacy-pharmd', 'BACHELOR', 'pharmacy', 59500, 'TERM', 'EGP', 'Per term: tuition EGP 59,500 plus administrative fees EGP 8,900.', 'للترم الواحد: مصروفات دراسية 59,500 جنيه بالإضافة إلى مصروفات إدارية 8,900 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-pharmacy' WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_a0587e31149a4cc18974', u.id, 'Faculty of Physical Therapy', 'كلية العلاج الطبيعي', 'faculty-of-physical-therapy', 7, now() FROM "University" u WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_2b79e78bcc3a437da839', u.id, f.id, 'Physical Therapy', 'العلاج الطبيعي', 'physical-therapy', 'BACHELOR', 'physical_therapy', 54000, 'TERM', 'EGP', 'Per term: tuition EGP 54,000 plus administrative fees EGP 8,900.', 'للترم الواحد: مصروفات دراسية 54,000 جنيه بالإضافة إلى مصروفات إدارية 8,900 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-physical-therapy' WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_19fd8e3b18184d2b808e', u.id, 'Faculty of Public Health', 'كلية الصحة العامة', 'faculty-of-public-health', 8, now() FROM "University" u WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_55a99702d0ae407c9888', u.id, f.id, 'Epidemiology & Biostatistics', 'الوبائيات والإحصاء الحيوي', 'epidemiology-and-biostatistics', 'BACHELOR', 'health_sciences', 32500, 'TERM', 'EGP', 'Per term: tuition EGP 32,500 plus administrative fees EGP 7,600.', 'للترم الواحد: مصروفات دراسية 32,500 جنيه بالإضافة إلى مصروفات إدارية 7,600 جنيه.', '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-public-health' WHERE u.slug = 'new-alamein-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;

-- king-salman-international-university
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_a112a5c96d1e42dc94f0', u.id, 'Faculty of Medicine', 'كلية الطب البشري', 'faculty-of-medicine', 0, now() FROM "University" u WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_9fd9821ade6c4a09a475', u.id, f.id, 'Medicine – El Tor Campus', 'الطب البشري – فرع الطور', 'medicine-el-tor-campus', 'BACHELOR', 'medicine', 152460, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-medicine' WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_ee9de76c95834145af4d', u.id, 'Faculty of Dentistry', 'كلية طب الأسنان', 'faculty-of-dentistry', 1, now() FROM "University" u WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_b9432b1cdc564072a2a9', u.id, f.id, 'Dentistry – El Tor Campus', 'طب الأسنان – فرع الطور', 'dentistry-el-tor-campus', 'BACHELOR', 'dentistry', 125000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-dentistry' WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_97aae0e89f304ff8ba59', u.id, 'Faculty of Nursing', 'كلية التمريض', 'faculty-of-nursing', 2, now() FROM "University" u WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_94426a2928f746648bd9', u.id, f.id, 'Nursing – El Tor Campus', 'التمريض – فرع الطور', 'nursing-el-tor-campus', 'BACHELOR', 'nursing', 44640, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-nursing' WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_9965e4144c2943dda5cc', u.id, 'Faculty of Technological Industries', 'كلية الصناعات التكنولوجية', 'faculty-of-technological-industries', 3, now() FROM "University" u WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_2c069cb9161d457abe95', u.id, f.id, 'Technological Industries – El Tor Campus', 'الصناعات التكنولوجية – فرع الطور', 'technological-industries-el-tor-campus', 'BACHELOR', 'engineering', 42900, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-technological-industries' WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_5f761e3affd54f549678', u.id, 'Faculty of Engineering', 'كلية الهندسة', 'faculty-of-engineering', 4, now() FROM "University" u WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_bc6484dee0a4437896e9', u.id, f.id, 'Engineering – El Tor Campus', 'الهندسة – فرع الطور', 'engineering-el-tor-campus', 'BACHELOR', 'engineering', 75900, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-engineering' WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_dcd9f88bdba24fcca7f7', u.id, f.id, 'Computer Engineering – El Tor Campus', 'هندسة الحاسب – فرع الطور', 'computer-engineering-el-tor-campus', 'BACHELOR', 'engineering', 75900, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-engineering' WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_a05809a9df994f7e813f', u.id, 'Faculty of Computer Science', 'كلية علوم الحاسب', 'faculty-of-computer-science', 5, now() FROM "University" u WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_20b52621ddd4487e8cf2', u.id, f.id, 'Computer Science – El Tor Campus', 'علوم الحاسب – فرع الطور', 'computer-science-el-tor-campus', 'BACHELOR', 'computer_science', 75900, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-computer-science' WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_2114d03b1de942d5ab8a', u.id, 'Faculty of Physical Therapy', 'كلية العلاج الطبيعي', 'faculty-of-physical-therapy', 6, now() FROM "University" u WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_f68412ba4e0f41399129', u.id, f.id, 'Physical Therapy – Sharm El Sheikh Campus', 'العلاج الطبيعي – فرع شرم الشيخ', 'physical-therapy-sharm-el-sheikh-campus', 'BACHELOR', 'physical_therapy', 93500, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-physical-therapy' WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_a4141ff8d18f4c8d8322', u.id, 'Faculty of Al-Alsun & Applied Languages', 'كلية الألسن واللغات التطبيقية', 'faculty-of-al-alsun-and-applied-languages', 7, now() FROM "University" u WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_367b888f6d2b44aea7b5', u.id, f.id, 'Al-Alsun & Applied Languages – Sharm El Sheikh Campus', 'الألسن واللغات التطبيقية – فرع شرم الشيخ', 'al-alsun-and-applied-languages-sharm-el-sheikh-campus', 'BACHELOR', 'languages_translation', 47300, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-al-alsun-and-applied-languages' WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_095150c8b03b42febb49', u.id, 'Faculty of Tourism & Hospitality', 'كلية السياحة والضيافة', 'faculty-of-tourism-and-hospitality', 8, now() FROM "University" u WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_dee51d20546840c6ae83', u.id, f.id, 'Tourism & Hospitality – Sharm El Sheikh Campus', 'السياحة والضيافة – فرع شرم الشيخ', 'tourism-and-hospitality-sharm-el-sheikh-campus', 'BACHELOR', 'tourism_hotels', 40000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-tourism-and-hospitality' WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_9499280522cd4ee0b34a', u.id, 'Faculty of Arts & Design', 'كلية الفنون والتصميم', 'faculty-of-arts-and-design', 9, now() FROM "University" u WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_99e5ea939dbe495d976e', u.id, f.id, 'Arts & Design – Sharm El Sheikh Campus', 'الفنون والتصميم – فرع شرم الشيخ', 'arts-and-design-sharm-el-sheikh-campus', 'BACHELOR', 'applied_arts', 53900, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-arts-and-design' WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_71d8aec4428542598bdb', u.id, 'Faculty of Architectural Engineering', 'كلية هندسة العمارة', 'faculty-of-architectural-engineering', 10, now() FROM "University" u WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_ad66dcdb3e744e60bd0c', u.id, f.id, 'Architectural Engineering – Sharm El Sheikh Campus', 'هندسة العمارة – فرع شرم الشيخ', 'architectural-engineering-sharm-el-sheikh-campus', 'BACHELOR', 'architecture', 75900, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-architectural-engineering' WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_59d46e4effea412d9482', u.id, 'Faculty of Administrative Sciences', 'كلية العلوم الإدارية', 'faculty-of-administrative-sciences', 11, now() FROM "University" u WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_4d4fe2940ffe4709b513', u.id, f.id, 'Administrative Sciences – Sharm El Sheikh Campus', 'العلوم الإدارية – فرع شرم الشيخ', 'administrative-sciences-sharm-el-sheikh-campus', 'BACHELOR', 'business_administration', 50600, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-administrative-sciences' WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_a581f14e70f74f40aca4', u.id, 'Faculty of Veterinary Medicine', 'كلية الطب البيطري', 'faculty-of-veterinary-medicine', 12, now() FROM "University" u WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_a8f217c182e24ec9837d', u.id, f.id, 'Veterinary Medicine – Ras Sedr Campus', 'الطب البيطري – فرع رأس سدر', 'veterinary-medicine-ras-sedr-campus', 'BACHELOR', 'veterinary', 87120, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-veterinary-medicine' WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_c88dcadc3a914620910a', u.id, 'Faculty of Pharmacy', 'كلية الصيدلة', 'faculty-of-pharmacy', 13, now() FROM "University" u WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_77afa64254fa4c87bf93', u.id, f.id, 'Clinical Pharmacy – Ras Sedr Campus', 'الصيدلة الإكلينيكية – فرع رأس سدر', 'clinical-pharmacy-ras-sedr-campus', 'BACHELOR', 'pharmacy', 110000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-pharmacy' WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_b4ef5ef1eb484dc3bf2b', u.id, 'Faculty of Basic Sciences', 'كلية العلوم الأساسية', 'faculty-of-basic-sciences', 14, now() FROM "University" u WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_9a93cb050bf94d1ea478', u.id, f.id, 'Basic Sciences – Ras Sedr Campus', 'العلوم الأساسية – فرع رأس سدر', 'basic-sciences-ras-sedr-campus', 'BACHELOR', 'science', 52800, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-basic-sciences' WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_2925b044b39f4c519107', u.id, 'Faculty of Desert Agriculture', 'كلية الزراعات الصحراوية', 'faculty-of-desert-agriculture', 15, now() FROM "University" u WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_4fa2851d730340a8ba66', u.id, f.id, 'Desert Agriculture – Ras Sedr Campus', 'الزراعات الصحراوية – فرع رأس سدر', 'desert-agriculture-ras-sedr-campus', 'BACHELOR', 'agriculture', 47300, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-desert-agriculture' WHERE u.slug = 'king-salman-international-university'
ON CONFLICT ("universityId", slug) DO NOTHING;

-- benha-national-university
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_424f0abf8faa44d08f1a', u.id, 'Faculty of Medicine', 'كلية الطب البشري', 'faculty-of-medicine', 0, now() FROM "University" u WHERE u.slug = 'benha-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_d525c3ae6e184daba50d', u.id, f.id, 'Medicine', 'الطب البشري', 'medicine', 'BACHELOR', 'medicine', 170000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-medicine' WHERE u.slug = 'benha-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_59ace896bb2342f696b7', u.id, 'Faculty of Dentistry', 'كلية طب الأسنان', 'faculty-of-dentistry', 1, now() FROM "University" u WHERE u.slug = 'benha-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_e32c55bc7e3f4c13ae33', u.id, f.id, 'Dentistry', 'طب الأسنان', 'dentistry', 'BACHELOR', 'dentistry', 130000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-dentistry' WHERE u.slug = 'benha-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_9cf06be8119d4a01b2c0', u.id, 'Faculty of Physical Therapy', 'كلية العلاج الطبيعي', 'faculty-of-physical-therapy', 2, now() FROM "University" u WHERE u.slug = 'benha-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_58ec9a9dc4a04dc9a1aa', u.id, f.id, 'Physical Therapy', 'العلاج الطبيعي', 'physical-therapy', 'BACHELOR', 'physical_therapy', 110000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-physical-therapy' WHERE u.slug = 'benha-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_951c25ec46ff4a34b622', u.id, 'Faculty of Veterinary Medicine', 'كلية الطب البيطري', 'faculty-of-veterinary-medicine', 3, now() FROM "University" u WHERE u.slug = 'benha-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_c5345014173e48eba3c3', u.id, f.id, 'Veterinary Medicine', 'الطب البيطري', 'veterinary-medicine', 'BACHELOR', 'veterinary', 80000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-veterinary-medicine' WHERE u.slug = 'benha-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_d9ff608cf9cd46a5bfbc', u.id, 'Faculty of Engineering', 'كلية الهندسة', 'faculty-of-engineering', 4, now() FROM "University" u WHERE u.slug = 'benha-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_9d8f49411fef452eba10', u.id, f.id, 'Engineering', 'الهندسة', 'engineering', 'BACHELOR', 'engineering', 80000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-engineering' WHERE u.slug = 'benha-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_fa0d47d87ffa49708a4e', u.id, 'Faculty of Computer Science', 'كلية علوم الحاسب', 'faculty-of-computer-science', 5, now() FROM "University" u WHERE u.slug = 'benha-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_6fd8760c1c604e079da7', u.id, f.id, 'Computer Science', 'علوم الحاسب', 'computer-science', 'BACHELOR', 'computer_science', 80000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-computer-science' WHERE u.slug = 'benha-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_db60156e092247ca9fa1', u.id, 'Faculty of Economics & Business Administration', 'كلية الاقتصاد وإدارة الأعمال', 'faculty-of-economics-and-business-administration', 6, now() FROM "University" u WHERE u.slug = 'benha-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_d25d3cd4bc6f4d668e8a', u.id, f.id, 'Economics & Business Administration', 'الاقتصاد وإدارة الأعمال', 'economics-and-business-administration', 'BACHELOR', 'business_administration', 52000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-economics-and-business-administration' WHERE u.slug = 'benha-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_3602330b784c42858adc', u.id, 'Faculty of Visual Arts & Design', 'كلية الفنون البصرية والتصميم', 'faculty-of-visual-arts-and-design', 7, now() FROM "University" u WHERE u.slug = 'benha-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_6f248f196a15485bbc28', u.id, f.id, 'Visual Arts & Design', 'الفنون البصرية والتصميم', 'visual-arts-and-design', 'BACHELOR', 'applied_arts', 60000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-visual-arts-and-design' WHERE u.slug = 'benha-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_573e14af1a1a495b91df', u.id, 'Faculty of Energy Sciences', 'كلية علوم الطاقة', 'faculty-of-energy-sciences', 8, now() FROM "University" u WHERE u.slug = 'benha-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_c399b96f443a4bd38e09', u.id, f.id, 'Energy Sciences', 'علوم الطاقة', 'energy-sciences', 'BACHELOR', 'science', 50000, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-energy-sciences' WHERE u.slug = 'benha-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Faculty" (id, "universityId", name, "nameAr", slug, "sortOrder", "updatedAt")
SELECT 'fac_12d54cc47ae6446795b5', u.id, 'Faculty of Applied Health Sciences Technology', 'كلية تكنولوجيا العلوم الصحية التطبيقية', 'faculty-of-applied-health-sciences-technology', 9, now() FROM "University" u WHERE u.slug = 'benha-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;
INSERT INTO "Program" (id, "universityId", "facultyId", name, "nameAr", slug, "studyLevel", "fieldOfStudy", "tuitionFee", "tuitionPeriod", currency, description, "descriptionAr", tags, "isPublished", "updatedAt")
SELECT 'prog_5fdfb193300a4f1a97bc', u.id, f.id, 'Applied Health Sciences Technology', 'تكنولوجيا العلوم الصحية التطبيقية', 'applied-health-sciences-technology', 'BACHELOR', 'health_sciences', NULL, 'YEAR', 'EGP', NULL, NULL, '{}', true, now()
FROM "University" u JOIN "Faculty" f ON f."universityId" = u.id AND f.slug = 'faculty-of-applied-health-sciences-technology' WHERE u.slug = 'benha-national-university'
ON CONFLICT ("universityId", slug) DO NOTHING;

COMMIT;
