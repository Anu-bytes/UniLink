// Supabase Storage access for avatar uploads.
//
// SECURITY: this module uses the service-role key, which bypasses row level
// security entirely. It must only ever be imported from server-side code
// (route handlers, server components). Never import it from a file carrying
// "use client", and never expose SUPABASE_SERVICE_ROLE_KEY through
// NEXT_PUBLIC_*, or anyone could read and write every bucket.

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const AVATAR_BUCKET = "avatars";

/**
 * Catalogue media uploaded from the admin dashboard: university logos, cover
 * photos, gallery shots, faculty images, testimonial portraits. Kept apart
 * from `avatars` so a bucket-wide policy change on one does not touch the
 * other, and so avatarPathFromUrl below can never be talked into deleting a
 * university's cover image.
 */
export const MEDIA_BUCKET = "media";

/** Folders allowed inside MEDIA_BUCKET. Anything else is rejected. */
export const MEDIA_FOLDERS = [
  "universities",
  "faculties",
  "programs",
  "testimonials",
  "scholarships",
] as const;

export type MediaFolder = (typeof MEDIA_FOLDERS)[number];

let client: SupabaseClient | null = null;

/**
 * Lazily construct the admin client so a missing environment variable fails
 * on the upload request rather than at import time, which would take down
 * every page that transitively imports this module.
 */
function getClient(): SupabaseClient {
  if (client) return client;

  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Avatar uploads need SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in apps/web/.env",
    );
  }

  client = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}

export function isStorageConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/**
 * Upload avatar bytes and return the public URL.
 *
 * The object path is namespaced by user id and given a random name, so one
 * user cannot overwrite another's file and the URL of a deleted avatar is not
 * guessable. `upsert: false` means a name collision fails rather than
 * silently replacing something.
 */
export async function uploadAvatar({
  userId,
  bytes,
  contentType,
  extension,
}: {
  userId: string;
  bytes: Uint8Array;
  contentType: string;
  extension: string;
}): Promise<{ url: string; path: string }> {
  const supabase = getClient();
  const path = `${userId}/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(path, bytes, {
      // Taken from the sniffed signature, never from the client's header.
      contentType,
      cacheControl: "31536000",
      upsert: false,
    });

  if (error) {
    throw new Error(`Avatar upload failed: ${error.message}`);
  }

  const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, path };
}

/**
 * Remove a previously uploaded avatar. Best effort: a failure here leaves an
 * orphaned object but must not fail the request that replaced it.
 */
export async function deleteAvatarByUrl(url: string | null | undefined) {
  if (!url) return;

  const path = avatarPathFromUrl(url);
  if (!path) return;

  try {
    await getClient().storage.from(AVATAR_BUCKET).remove([path]);
  } catch (error) {
    console.error("Unable to delete the previous avatar", error);
  }
}

/**
 * Extract the storage path from a public URL, returning null for anything that
 * is not one of our own avatar objects. This is what stops a crafted
 * `User.image` value from making us delete an arbitrary path.
 */
export function avatarPathFromUrl(url: string): string | null {
  const marker = `/storage/v1/object/public/${AVATAR_BUCKET}/`;
  const index = url.indexOf(marker);
  if (index === -1) return null;

  const path = url.slice(index + marker.length);
  // Expect exactly "<userId>/<uuid>.<ext>" with no traversal.
  return /^[\w-]+\/[\w-]+\.(jpg|png|webp)$/.test(path) ? path : null;
}

/**
 * Upload catalogue media and return its public URL.
 *
 * Same shape as uploadAvatar: the folder is an allowlisted constant rather
 * than anything the caller typed, and the filename is a random UUID, so one
 * upload can never overwrite another and a deleted object's URL is not
 * guessable.
 */
export async function uploadMedia({
  folder,
  bytes,
  contentType,
  extension,
}: {
  folder: MediaFolder;
  bytes: Uint8Array;
  contentType: string;
  extension: string;
}): Promise<{ url: string; path: string }> {
  const supabase = getClient();
  const path = `${folder}/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, bytes, {
    // Taken from the sniffed signature, never from the client's header.
    contentType,
    cacheControl: "31536000",
    upsert: false,
  });

  if (error) {
    throw new Error(`Media upload failed: ${error.message}`);
  }

  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, path };
}

/**
 * Extract the storage path from a media URL, returning null for anything that
 * is not one of our own media objects — an externally hosted logo entered by
 * hand, say. This is what stops a crafted `logoUrl` making us delete an
 * arbitrary object.
 */
export function mediaPathFromUrl(url: string): string | null {
  const marker = `/storage/v1/object/public/${MEDIA_BUCKET}/`;
  const index = url.indexOf(marker);
  if (index === -1) return null;

  const path = url.slice(index + marker.length);
  const pattern = new RegExp(
    `^(?:${MEDIA_FOLDERS.join("|")})/[\\w-]+\\.(jpg|png|webp)$`,
  );
  return pattern.test(path) ? path : null;
}

/**
 * Remove a previously uploaded media object. Best effort, like
 * deleteAvatarByUrl: an orphaned object must never fail the request that
 * replaced or unset it.
 */
export async function deleteMediaByUrl(url: string | null | undefined) {
  if (!url) return;

  const path = mediaPathFromUrl(url);
  if (!path) return;

  try {
    await getClient().storage.from(MEDIA_BUCKET).remove([path]);
  } catch (error) {
    console.error("Unable to delete the media object", error);
  }
}
