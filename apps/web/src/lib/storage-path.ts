/** Only canonical public URLs from this configured project can target deletion. */
export function storageObjectPath(url: string, projectUrl: string | undefined, bucket: string): string | null {
  if (!projectUrl) return null;
  try {
    const object = new URL(url);
    const project = new URL(projectUrl);
    if (!/^https?:$/.test(project.protocol) || object.origin !== project.origin) return null;
    // Uploads generate plain canonical URLs: no credentials, query strings,
    // fragments, encoded separators, or dot segments are needed.
    if (object.username || object.password || object.search || object.hash || object.href !== url || url.includes("%")) return null;
    const prefix = `/storage/v1/object/public/${bucket}/`;
    if (!object.pathname.startsWith(prefix)) return null;
    const path = object.pathname.slice(prefix.length);
    return /^[\w-]+\/[\w-]+\.(jpg|png|webp)$/.test(path) ? path : null;
  } catch {
    return null;
  }
}
