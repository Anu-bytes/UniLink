import { Camera } from "lucide-react";
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

  return (
    <div>
      <p className="mb-4 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[#98A0B4]">
        <Camera className="size-3.5 text-[#1E6DEB]" aria-hidden />
        {t("galleryPhotoCount", { count: images.length })}
      </p>
      <GalleryLightbox images={images} name={university.name} />
    </div>
  );
}
