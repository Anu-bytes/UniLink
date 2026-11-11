-- Luxor National University: campus location supplied by the user (plus code QR93+VJJ, Luxor).
UPDATE "University" SET
  "latitude" = 25.7697125, "longitude" = 32.8040156,
  "addressLine" = 'Luxor University campus, New Tiba (QR93+VJJ), Luxor, Luxor Governorate',
  "addressLineAr" = 'الحرم الجامعي لجامعة الأقصر، طيبة الجديدة (QR93+VJJ)، الأقصر، محافظة الأقصر'
WHERE "slug" = 'luxor-national-university';
