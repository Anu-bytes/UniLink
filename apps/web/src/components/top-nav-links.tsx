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
    <nav className="mx-4 hidden min-w-0 flex-1 justify-center lg:flex xl:mx-6">
      {/* One soft pill holds the links, so they read as a single group with
          clear separation from the logo and the actions on either side. */}
      <div className="flex shrink-0 items-center gap-0.5 rounded-full bg-[#F3F6FB] p-1 ring-1 ring-inset ring-[#E3EAF4] xl:gap-1">
        {links.map((link) => {
          const active = isNavActive(pathname, link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "inline-flex h-9 items-center whitespace-nowrap rounded-full px-3.5 font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB] xl:px-4",
                active
                  ? "bg-white text-[#1E6DEB] shadow-[0_2px_8px_-2px_rgba(15,23,42,0.15)] ring-1 ring-[#E3EAF4]"
                  : "text-[#3F4A63] hover:bg-white/70 hover:text-[#1E6DEB]",
                sizeClassName,
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
