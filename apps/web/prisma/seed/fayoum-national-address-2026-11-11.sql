-- Fayoum National University: exact address supplied by the user (Fayoum University campus).
UPDATE "University" SET
  "city" = 'Fayoum', "cityAr" = 'الفيوم',
  "latitude" = 29.3197797, "longitude" = 30.8356374,
  "addressLine" = 'Professor Dr. Mohamed Saeed Suleiman Street, Al-Mashtel, Keman Fares, First Al Faiyum, Fayoum',
  "addressLineAr" = 'شارع الأستاذ الدكتور محمد سعيد سليمان، المشتل، كيمان فارس، أول الفيوم، الفيوم'
WHERE "slug" = 'fayoum-national-university';
