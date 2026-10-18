-- Al Salam University was listed in Assiut; its official site (sue.edu.eg)
-- gives "Cairo Alexandria Agricultural road, Tanta, Egypt".
UPDATE "University" SET
  "city" = 'Tanta',
  "cityAr" = 'طنطا',
  "addressLine" = 'Cairo-Alexandria Agricultural Road, Tanta, Gharbia, Egypt',
  "addressLineAr" = 'طريق القاهرة الإسكندرية الزراعي، طنطا، الغربية، مصر',
  "updatedAt" = NOW()
WHERE "slug" = 'al-salam-university' AND "city" = 'Assiut';
