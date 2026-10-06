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
    <nav className="mx-4 hidden min-w-0 flex-1 items-center justify-center gap-7 lg:flex xl:mx-6 xl:gap-10">
      {links.map((link) => {
        const active = isNavActive(pathname, link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative inline-flex h-11 shrink-0 items-center whitespace-nowrap font-semibold transition-colors duration-200 focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]",
              // Underline for the current page, grown from the centre on hover
              // for the others.
              "after:absolute after:inset-x-0 after:bottom-1 after:h-[2.5px] after:origin-center after:rounded-full after:bg-[#1E6DEB] after:transition-transform after:duration-300 after:content-['']",
              active
                ? "text-[#1E6DEB] after:scale-x-100"
                : "text-[#1F2A44] after:scale-x-0 hover:text-[#1E6DEB] hover:after:scale-x-100",
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
