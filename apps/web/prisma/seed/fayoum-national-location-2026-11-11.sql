-- Fayoum National University: it currently operates inside the Fayoum University campus
-- (Ministry's national universities council, cnu.mohesr.gov.eg/fayoum); its seat under
-- Presidential Decree No. 263 of 2025 is New Fayoum City on the Western Cairo-Assiut road.
UPDATE "University" SET
  "latitude" = 29.3197797, "longitude" = 30.8356374,
  "addressLine" = 'Fayoum University campus, Fayoum (official seat: New Fayoum City, Western Cairo-Assiut Road)',
  "addressLineAr" = 'داخل الحرم الجامعي لجامعة الفيوم، الفيوم (المقر الرسمي: مدينة الفيوم الجديدة، طريق القاهرة أسيوط الغربي)',
  "description" = replace("description", 'founded in 2025 in New Fayoum City, affiliated with Fayoum University.', 'established by Presidential Decree No. 263 of 2025 and affiliated with Fayoum University. It currently operates inside the Fayoum University campus and extends to its official seat in New Fayoum City.'),
  "descriptionAr" = replace("descriptionAr", 'أُنشئت عام 2025 بمدينة الفيوم الجديدة، تابعة لجامعة الفيوم.', 'أُنشئت بالقرار الجمهوري رقم 263 لسنة 2025، وتتبع جامعة الفيوم. تعمل حاليًا داخل الحرم الجامعي لجامعة الفيوم وتمتد إلى مقرها الرسمي بمدينة الفيوم الجديدة.')
WHERE "slug" = 'fayoum-national-university';
