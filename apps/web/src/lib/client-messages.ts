// Which translations are sent to the browser.
//
// Server components read messages on the server, so only what client
// components ("use client" and everything they import) look up needs to reach
// the browser. Sending the whole file put about 120 KB of copy, admin text
// included, into every page.
//
// Namespaces are left out by name rather than listed in: a namespace added
// later reaches the browser by default, so a new client component can never
// silently lose its text. When a client component starts using one of the
// namespaces below, take it off the list (or add it to the area that needs it).

import type { AbstractIntlMessages } from "next-intl";
import { getMessages } from "next-intl/server";

/** Only read by server components: never needed in the browser. */
const SERVER_ONLY = [
  "About",
  "Admission",
  "AppHome",
  "Auth",
  "Careers",
  "Footer",
  "Nav",
  "NotFound",
  "Partners",
  "Privacy",
  "Programs",
  "Students",
  "Terms",
  "Universities",
] as const;

/** Only for admins: the console and the on-page university editor. */
const ADMIN_ONLY = ["Admin", "ProfileEditor"] as const;

type Messages = Record<string, AbstractIntlMessages | string>;

function omit(messages: Messages, keys: readonly string[]): Messages {
  const out: Messages = {};
  for (const [key, value] of Object.entries(messages)) {
    if (!keys.includes(key)) out[key] = value;
  }
  return out;
}

async function all() {
  return (await getMessages()) as Messages;
}

/** Every public and student page. */
export async function siteMessages() {
  return omit(await all(), [...SERVER_ONLY, ...ADMIN_ONLY]);
}

/** The admin console (wrapped around it in the admin layout). */
export async function consoleMessages() {
  return omit(await all(), [...SERVER_ONLY, "ProfileEditor"]);
}

/**
 * A university profile opened by someone who can edit it. The editor reuses
 * the console's toast and image field, which read a few Admin strings.
 */
export async function editorMessages() {
  const messages = await all();
  const admin = (messages.Admin ?? {}) as Record<string, Messages>;
  return {
    ...(await siteMessages()),
    ProfileEditor: messages.ProfileEditor,
    Admin: {
      common: admin.common,
      changes: { sentTitle: admin.changes?.sentTitle, sentBody: admin.changes?.sentBody },
    },
  } as Messages;
}
