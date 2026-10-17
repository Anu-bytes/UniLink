// The admin shortcuts shown outside the console (the admin bar on every page,
// the account menu, the mobile menu). Client-safe: no database access. The
// role comes from the session, which is enough to decide what to show; every
// page behind these links re-checks the account itself (see lib/admin.ts).

import {
  BarChart3,
  Building2,
  ClipboardCheck,
  Globe,
  GraduationCap,
  Handshake,
  History,
  LayoutDashboard,
  Library,
  PencilLine,
  ShieldCheck,
  Table2,
  UserPlus,
  type LucideIcon,
} from "lucide-react";

export type AdminLevel = 1 | 2 | 3;

const LEVELS: Record<string, AdminLevel> = { ADMIN: 3, REVIEWER: 2, UNIVERSITY_ADMIN: 1 };

export function adminLevelOf(role: string | null | undefined): AdminLevel | null {
  return role ? (LEVELS[role] ?? null) : null;
}

export type AdminShortcutKey =
  | "dashboard"
  | "approvals"
  | "myChanges"
  | "statistics"
  | "universities"
  | "myUniversities"
  | "bulkEdit"
  | "admins"
  | "requests";

export const ADMIN_SHORTCUT_ICONS: Record<AdminShortcutKey, LucideIcon> = {
  dashboard: LayoutDashboard,
  approvals: ClipboardCheck,
  myChanges: History,
  statistics: BarChart3,
  universities: Building2,
  myUniversities: Building2,
  bulkEdit: Table2,
  admins: ShieldCheck,
  requests: Handshake,
};

/** The shortcuts an admin of this level can use, most useful first. */
/** `badge` names the count shown next to the link: changes waiting for review, or new requests. */
export function adminShortcuts(level: AdminLevel): { key: AdminShortcutKey; href: string; badge?: "pending" | "requests" }[] {
  if (level === 1) {
    return [
      { key: "dashboard", href: "/admin" },
      { key: "myUniversities", href: "/admin/universities" },
      { key: "myChanges", href: "/admin/approvals", badge: "pending" },
    ];
  }
  if (level === 2) {
    return [
      { key: "dashboard", href: "/admin" },
      { key: "approvals", href: "/admin/approvals", badge: "pending" },
      { key: "statistics", href: "/admin/statistics" },
    ];
  }
  return [
    { key: "dashboard", href: "/admin" },
    { key: "approvals", href: "/admin/approvals", badge: "pending" },
    { key: "requests", href: "/admin/requests", badge: "requests" },
    { key: "statistics", href: "/admin/statistics" },
    { key: "universities", href: "/admin/universities" },
    { key: "bulkEdit", href: "/admin/bulk-edit" },
    { key: "admins", href: "/admin/admins" },
  ];
}

export type QuickActionKey =
  | "addUniversity"
  | "addFaculty"
  | "addProgram"
  | "reviewChanges"
  | "bulkEdit"
  | "addAdmin"
  | "statistics"
  | "editMyUniversity"
  | "trackChanges"
  | "browseSite";

export const QUICK_ACTION_ICONS: Record<QuickActionKey, LucideIcon> = {
  addUniversity: Building2,
  addFaculty: Library,
  addProgram: GraduationCap,
  reviewChanges: ClipboardCheck,
  bulkEdit: Table2,
  addAdmin: UserPlus,
  statistics: BarChart3,
  editMyUniversity: PencilLine,
  trackChanges: History,
  browseSite: Globe,
};

/**
 * The common jobs for each level, one click away from the console header and
 * the overview. A university admin's additions still go to the approval
 * queue; the pages behind these links enforce that.
 */
export function adminQuickActions(level: AdminLevel): { key: QuickActionKey; href: string }[] {
  if (level === 1) {
    return [
      { key: "editMyUniversity", href: "/admin/universities" },
      { key: "addFaculty", href: "/admin/faculties/new" },
      { key: "addProgram", href: "/admin/programs/new" },
      { key: "trackChanges", href: "/admin/approvals?status=all" },
      { key: "browseSite", href: "/universities" },
    ];
  }
  if (level === 2) {
    return [
      { key: "reviewChanges", href: "/admin/approvals" },
      { key: "statistics", href: "/admin/statistics" },
      { key: "browseSite", href: "/universities" },
    ];
  }
  return [
    { key: "reviewChanges", href: "/admin/approvals" },
    { key: "addUniversity", href: "/admin/universities/new" },
    { key: "addFaculty", href: "/admin/faculties/new" },
    { key: "addProgram", href: "/admin/programs/new" },
    { key: "bulkEdit", href: "/admin/bulk-edit" },
    { key: "addAdmin", href: "/admin/admins?add=1" },
    { key: "statistics", href: "/admin/statistics" },
    { key: "browseSite", href: "/universities" },
  ];
}
