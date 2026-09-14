import { getTranslations } from "next-intl/server";

import { EmptySection } from "@/components/university/prose";
import { GalleryLightbox } from "@/components/university/gallery-lightbox";
import type { UniversityDetailData } from "@/lib/catalog";

export async function TabGallery({
  university,
}: {
  university: UniversityDetailData;
}) {
  const t = await getTranslations("UniversityDetail");

  const images =
    university.images.length > 0
      ? university.images
      : university.coverImageUrl
        ? [{ id: "cover", url: university.coverImageUrl, alt: university.name }]
        : [];

  if (images.length === 0) {
    return <EmptySection message={t("emptySection")} />;
  }

  return <GalleryLightbox images={images} name={university.name} />;
}
