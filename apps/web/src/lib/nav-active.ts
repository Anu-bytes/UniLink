/**
 * Whether a nav item's href should be highlighted as the current page.
 *
 * "/" is a special case: a plain `pathname.startsWith(href)` would make Home
 * active on every single page, since every path starts with "/". Everything
 * else matches the path itself or one of its sub-routes, so e.g. "/app/search"
 * still highlights while looking at "/app/search/somewhere-nested".
 */
export function isNavActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
