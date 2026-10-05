"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { isNavActive } from "@/lib/nav-active";
import { cn } from "@/lib/utils";

/**
 * The marketing header's desktop link row. Split out from SiteHeader (a
 * server component, so it can't call usePathname) just to know which link is
 * the current page and underline it — same active-state convention as the
 * app and admin sidebars.
 */
export function TopNavLinks({
  links,
  sizeClassName,
}: {
  links: readonly { href: string; label: string }[];
  sizeClassName: string;
}) {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-8 lg:flex xl:gap-9">
      {links.map((link) => {
        const active = isNavActive(pathname, link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative inline-flex min-h-11 items-center whitespace-nowrap font-semibold leading-8 transition-colors hover:text-[#1E6DEB] focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]",
              "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-center after:rounded-full after:bg-[#1E6DEB] after:transition-transform after:duration-300 after:content-['']",
              active
                ? "text-[#1E6DEB] after:scale-x-100"
                : "text-[#1F2A44] after:scale-x-0 after:bg-[#1E6DEB]/45 hover:after:scale-x-100",
              sizeClassName,
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
