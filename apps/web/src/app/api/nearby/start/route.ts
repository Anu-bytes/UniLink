import { NextResponse, type NextRequest } from "next/server";

import { auth } from "@/auth";
import { NEARBY_LEVELS, NEARBY_RADII } from "@/lib/nearby-filters";
import {
  NEARBY_TRIAL_COOKIE,
  TRIAL_COOKIE_MAX_AGE,
  newTrialCookie,
  readTrial,
} from "@/lib/nearby-trial";

/**
 * Starts a "Find nearest" search. Signed-in visitors go straight to the map.
 * Guests get their one free search here: the first visit stamps the trial
 * cookie (a cookie can't be set while a page renders), later ones are sent on
 * to /nearby, which shows the sign-in prompt once the search is spent.
 *
 * Only known filter values are passed on, and the target is always this
 * site's own /nearby page, so the redirect can't be pointed anywhere else.
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const locale = params.get("locale") === "ar" ? "ar" : "en";

  const forward = new URLSearchParams();
  const field = params.get("field");
  if (field && /^[a-z_]{2,40}$/.test(field)) forward.set("field", field);
  const level = params.get("level");
  if (level && (NEARBY_LEVELS as readonly string[]).includes(level)) forward.set("level", level);
  const type = params.get("type");
  if (type === "NATIONAL" || type === "PRIVATE") forward.set("type", type);
  const radius = Number(params.get("radius"));
  if ((NEARBY_RADII as readonly number[]).includes(radius)) forward.set("radius", String(radius));
  if (params.get("start") === "pick") forward.set("start", "pick");

  const session = await auth();
  const isGuest = !session?.user?.id;
  // Marks the hop back, so a browser that refuses the cookie lands on the
  // sign-in prompt instead of bouncing here forever.
  if (isGuest) forward.set("trial", "1");

  const query = forward.toString();
  const target = new URL(`/${locale}/nearby${query ? `?${query}` : ""}`, request.nextUrl.origin);
  const response = NextResponse.redirect(target, 303);

  if (isGuest && readTrial(request.cookies.get(NEARBY_TRIAL_COOKIE)?.value) === "none") {
    response.cookies.set(NEARBY_TRIAL_COOKIE, newTrialCookie(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: TRIAL_COOKIE_MAX_AGE,
    });
  }
  response.headers.set("Cache-Control", "no-store");
  return response;
}
