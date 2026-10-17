// Tags on the catalogue's cached reads (lib/catalog.ts), so an admin edit can
// refresh them right away instead of waiting out the cache window.

/** A university's public profile. Refreshed immediately after an edit. */
export const UNIVERSITY_DETAIL_TAG = "catalogue:university-detail";

/** The landing page, city list and search index. Refreshed in the background. */
export const CATALOGUE_LISTS_TAG = "catalogue:lists";
