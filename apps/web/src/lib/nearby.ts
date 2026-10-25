import { unstable_cache } from "next/cache";

import { CATALOGUE_LISTS_TAG } from "@/lib/cache-tags";
import { localized } from "@/lib/catalog";
import { FIELDS_OF_STUDY } from "@/lib/fields";
import { governorateOf } from "@/lib/program-filters";
import { NEARBY_LEVELS, type NearbyLevel } from "@/lib/nearby-filters";
import { prisma } from "@/lib/prisma";

export type { NearbyFilters, NearbyLevel } from "@/lib/nearby-filters";

export type NearbyProgram = {
  name: string;
  slug: string;
  field: string;
  level: NearbyLevel;
  faculty: string | null;
};

export type NearbyUniversity = {
  slug: string;
  name: string;
  acronym: string | null;
  city: string;
  governorate: string | null;
  type: "NATIONAL" | "PRIVATE";
  logoUrl: string | null;
  /** Null when the campus has no coordinates on file yet. */
  lat: number | null;
  lng: number | null;
  programs: NearbyProgram[];
};

export type NearbyField = { value: string; label: string; count: number };

export type NearbyCatalog = {
  universities: NearbyUniversity[];
  /** Fields that at least one published program teaches, most taught first. */
  fields: NearbyField[];
  levels: NearbyLevel[];
};

// Logos are drawn inside map markers, so only plain https or same-site paths
// get through.
function safeImageUrl(url: string | null) {
  if (!url) return null;
  return /^https:\/\//i.test(url) || url.startsWith("/") ? url : null;
}

/**
 * Everything the "Find nearest" map needs, in one cached read: each published
 * university with its campus point and published programs. Distances are
 * worked out in the browser, so the visitor's location never reaches the
 * server.
 */
export const getNearbyCatalog = unstable_cache(
  async (locale: string): Promise<NearbyCatalog> => {
    const rows = await prisma.university.findMany({
      where: { publishedAt: { not: null } },
      orderBy: { name: "asc" },
      select: {
        slug: true,
        name: true,
        nameAr: true,
        acronym: true,
        city: true,
        cityAr: true,
        type: true,
        logoUrl: true,
        latitude: true,
        longitude: true,
        programs: {
          where: { isPublished: true },
          orderBy: { name: "asc" },
          select: {
            name: true,
            nameAr: true,
            slug: true,
            fieldOfStudy: true,
            studyLevel: true,
            faculty: { select: { name: true, nameAr: true } },
          },
        },
      },
    });

    const fieldCounts = new Map<string, number>();
    const levels = new Set<NearbyLevel>();

    const universities = rows.map((row): NearbyUniversity => {
      const fieldsHere = new Set<string>();
      const programs = row.programs.map((program) => {
        fieldsHere.add(program.fieldOfStudy);
        levels.add(program.studyLevel);
        return {
          name: localized(locale, program.name, program.nameAr),
          slug: program.slug,
          field: program.fieldOfStudy,
          level: program.studyLevel,
          faculty: program.faculty ? localized(locale, program.faculty.name, program.faculty.nameAr) : null,
        };
      });
      for (const field of fieldsHere) fieldCounts.set(field, (fieldCounts.get(field) ?? 0) + 1);

      const hasPoint =
        row.latitude != null &&
        row.longitude != null &&
        Math.abs(row.latitude) <= 90 &&
        Math.abs(row.longitude) <= 180;

      return {
        slug: row.slug,
        name: localized(locale, row.name, row.nameAr),
        acronym: row.acronym,
        city: localized(locale, row.city, row.cityAr),
        governorate: governorateOf(locale, row.city),
        type: row.type,
        logoUrl: safeImageUrl(row.logoUrl),
        lat: hasPoint ? row.latitude : null,
        lng: hasPoint ? row.longitude : null,
        programs,
      };
    });

    const isArabic = locale.startsWith("ar");
    const fields = FIELDS_OF_STUDY.filter((field) => fieldCounts.has(field.value))
      .map((field) => ({
        value: field.value,
        label: isArabic ? field.ar : field.en,
        count: fieldCounts.get(field.value) ?? 0,
      }))
      .sort((a, b) => b.count - a.count);

    return {
      universities,
      fields,
      levels: NEARBY_LEVELS.filter((level) => levels.has(level)),
    };
  },
  ["nearby-catalog"],
  { revalidate: 300, tags: [CATALOGUE_LISTS_TAG] },
);
