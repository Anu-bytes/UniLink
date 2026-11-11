import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";

import { routing } from "./i18n/routing";
import { isBlockedCrawler } from "./lib/ai-bots";

const intlMiddleware = createMiddleware(routing);

// Everything under /{locale}/app is the signed-in product surface, and
// everything under /{locale}/admin is the back office. Both need a session
// before the page is worth rendering; only the second also needs a role,
// which is checked where the role is readable (see the admin layout).
const APP_PATH = /^\/(?:ar|en)\/app(?:\/|$)/;
const ADMIN_PATH = /^\/(?:ar|en)\/admin(?:\/|$)/;

/**
 * Locale negotiation first, then the auth gate. The session cookie is checked
 * rather than calling `auth()` so this stays edge-safe and free of the Prisma
 * adapter; the pages themselves re-check with `auth()` before reading data.
 *
 * This gate only asks "is there a session cookie". It cannot tell an admin
 * from a student — the role lives in the database, which is out of reach
 * here — so /admin gets its real check in src/app/[locale]/(admin)/admin/
 * layout.tsx and, independently, in every /api/admin route via requireAdmin().
 */
export default function proxy(request: NextRequest) {
  // AI crawlers and scraping libraries get nothing: not the pages, not the
  // API (the catalogue behind the map and search). robots.txt already asks
  // them to stay out; this enforces it for the ones that ignore it.
  if (isBlockedCrawler(request.headers.get("user-agent"))) {
    return new NextResponse("Automated access for AI training or scraping is not permitted.", {
      status: 403,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  // The API only needed the crawler check above; locale handling and the
  // page gate below are for pages.
  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const response = intlMiddleware(request);

  // A locale redirect has to land first; the gate runs on the next request,
  // once the URL already carries its locale prefix.
  if (response.headers.has("location")) {
    return response;
  }

  const rewrite = response.headers.get("x-middleware-rewrite");
  const path = rewrite ? new URL(rewrite).pathname : request.nextUrl.pathname;

  if (!APP_PATH.test(path) && !ADMIN_PATH.test(path)) {
    return response;
  }

  const hasSession =
    request.cookies.has("authjs.session-token") ||
    request.cookies.has("__Secure-authjs.session-token");

  if (hasSession) {
    return response;
  }

  const locale = path.split("/")[1] ?? routing.defaultLocale;
  const login = new URL(`/${locale}/login`, request.url);
  login.searchParams.set(
    "callbackUrl",
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
  );

  return NextResponse.redirect(login);
}

export const config = {
  // Pages and the API (the API only for the crawler check). Static files,
  // including robots.txt, are left alone so crawlers can still read the rules.
  matcher: ["/api/:path*", "/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
