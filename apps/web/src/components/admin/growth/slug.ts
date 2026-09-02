/**
 * Preview-only slug. It has to mirror `slugify` in lib/admin-api (Arabic
 * letters kept, everything else collapsed to hyphens) so the hint under the
 * field matches the slug the server actually stores — but that module pulls in
 * next/server and Prisma, neither of which belongs in a client bundle.
 */
export function previewSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
