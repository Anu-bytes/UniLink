import { ShieldCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { auth } from "@/auth";
import { Link } from "@/i18n/navigation";
import { ADMIN_SHORTCUT_ICONS as ICONS, adminLevelOf, adminShortcuts } from "@/lib/admin-nav";
import { prisma } from "@/lib/prisma";

/**
 * A slim bar across the top of the public site and the student app, only for
 * admins: who you are signed in as, and one click to every part of the
 * console you can use, with the number of changes waiting for review.
 * Renders nothing for everyone else.
 */
export async function AdminBar() {
  const session = await auth();
  const level = adminLevelOf(session?.user?.role);
  if (!session?.user?.id || !level) return null;

  const t = await getTranslations("AdminAccess");
  const [pending, newRequests] = await Promise.all([
    prisma.changeRequest.count({
      where: { status: "PENDING", ...(level === 1 ? { authorId: session.user.id } : {}) },
    }),
    level === 3 ? prisma.partnerRequest.count({ where: { status: "NEW" } }) : Promise.resolve(0),
  ]);
  const counts = { pending, requests: newRequests };
  const shortcuts = adminShortcuts(level);

  return (
    <div className="bg-[#0B1220] text-white print:hidden">
      <div className="mx-auto flex h-10 max-w-[88rem] items-center gap-3 px-4 text-[12.5px] md:px-6 lg:px-8">
        <Link
          href="/admin"
          className="flex shrink-0 items-center gap-1.5 font-semibold text-white hover:text-white/80"
        >
          <ShieldCheck className="size-4 text-[#7FB0FF]" aria-hidden />
          <span className="hidden sm:inline">{t("bar.title")}</span>
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-semibold text-white/80">
            {t(`roles.${session.user.role}`)}
          </span>
        </Link>
        <nav aria-label={t("bar.title")} className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto [scrollbar-width:none]">
          {shortcuts.map((shortcut) => {
            const Icon = ICONS[shortcut.key];
            const count = shortcut.badge ? counts[shortcut.badge] : 0;
            return (
              <Link
                key={shortcut.key}
                href={shortcut.href}
                className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md px-2.5 text-white/75 transition-colors hover:bg-white/10 hover:text-white"
              >
                <Icon className="size-3.5" aria-hidden />
                {t(`links.${shortcut.key}`)}
                {count > 0 ? (
                  <span className="rounded-full bg-[#F5A524] px-1.5 text-[10.5px] leading-4 font-bold text-[#0B1220]">
                    {count > 99 ? "99+" : count}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
