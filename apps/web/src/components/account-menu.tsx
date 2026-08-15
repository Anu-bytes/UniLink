"use client";

import { ChevronDown, GraduationCap, Heart, LayoutDashboard, LogOut, User } from "lucide-react";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { Link, usePathname } from "@/i18n/navigation";
import { initialsAvatar } from "@/lib/format";
import { cn } from "@/lib/utils";

export type SessionUser = {
  name: string | null;
  email: string | null;
  image: string | null;
};

/** Round avatar: the account's picture, or deterministic initials. */
export function Avatar({
  user,
  className,
}: {
  user: SessionUser;
  className?: string;
}) {
  const label = user.name ?? user.email ?? "";
  const avatar = initialsAvatar(label || "UniLink");

  if (user.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- avatars come from
      // arbitrary OAuth hosts, which next/image would need whitelisted.
      <img
        src={user.image}
        alt=""
        className={cn("size-9 shrink-0 rounded-full object-cover", className)}
      />
    );
  }

  return (
    <span
      aria-hidden
      style={{ background: avatar.background, color: avatar.color }}
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold",
        className,
      )}
    >
      {avatar.initials}
    </span>
  );
}

/**
 * Signed-in account control for the marketing header. Replaces the Log in and
 * Register buttons, which previously showed even to authenticated visitors.
 */
export function AccountMenu({ user }: { user: SessionUser }) {
  const t = useTranslations("Account");
  const tApp = useTranslations("App");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const displayName = user.name ?? user.email ?? t("account");

  const items = [
    { href: "/app", label: t("dashboard"), icon: LayoutDashboard },
    {
      href: "/app/applications",
      label: tApp("sidebar.applications"),
      icon: GraduationCap,
      comingSoon: true,
    },
    { href: "/app/saved", label: tApp("saved"), icon: Heart },
    { href: "/app/profile", label: tApp("sidebar.profile"), icon: User },
  ];

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex min-h-11 items-center gap-2 rounded-full border border-slate-200 bg-white py-1 ps-1 pe-3 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB]"
      >
        <Avatar user={user} />
        <span className="hidden max-w-32 truncate text-sm font-semibold text-[#1F2A44] xl:block">
          {displayName}
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-[#5a6072] transition-transform",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute end-0 top-[calc(100%+0.5rem)] z-50 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-xl"
        >
          <div className="flex items-center gap-3 border-b border-slate-100 px-3 pb-3 pt-2">
            <Avatar user={user} className="size-10" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#1F2A44]">
                {displayName}
              </p>
              {user.email ? (
                <p dir="ltr" className="truncate text-xs text-[#5a6072]">
                  {user.email}
                </p>
              ) : null}
            </div>
          </div>

          {items.map((item) =>
            item.comingSoon ? (
              <span
                key={item.href}
                role="menuitem"
                aria-disabled="true"
                className="mt-1 flex min-h-11 cursor-not-allowed items-center gap-2.5 rounded-lg px-3 text-sm font-semibold text-[#98A0B4]"
              >
                <item.icon className="size-4 shrink-0" aria-hidden />
                {item.label}
                <span className="ms-auto shrink-0 rounded-full bg-[#FFF6E5] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#B77714]">
                  {tApp("comingSoon")}
                </span>
              </span>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="mt-1 flex min-h-11 items-center gap-2.5 rounded-lg px-3 text-sm font-semibold text-[#3F4657] transition-colors hover:bg-[#EEF3FF] hover:text-[#1E6DEB]"
              >
                <item.icon className="size-4 shrink-0" aria-hidden />
                {item.label}
              </Link>
            ),
          )}

          <button
            type="button"
            role="menuitem"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="mt-1 flex min-h-11 w-full items-center gap-2.5 rounded-lg px-3 text-sm font-semibold text-[#C81F15] transition-colors hover:bg-[#FFF0EE]"
          >
            <LogOut className="size-4 shrink-0" aria-hidden />
            {tApp("signOut")}
          </button>
        </div>
      ) : null}
    </div>
  );
}
