import { Prisma } from "@prisma/client";
import { getTranslations } from "next-intl/server";

import { PageHeader, Pagination, TableToolbar } from "@/components/admin";
import { PAGE_WRAPPER } from "@/components/admin/users/styles";
import { USER_ROLES } from "@/components/admin/users/tones";
import { lockFor, type UserRow } from "@/components/admin/users/types";
import { UserFilters } from "@/components/admin/users/user-filters";
import { UserTable } from "@/components/admin/users/user-table";
import { requireAdminPage } from "@/lib/admin";
import { DEFAULT_PER_PAGE } from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";

/**
 * The columns /api/admin/users will sort by. The value arrives as a raw query
 * string, so anything else falls back to `createdAt` rather than being handed
 * to Prisma's `ORDER BY`.
 */
const SORT_COLUMNS = ["createdAt", "email", "name"] as const;

/** A repeated query key arrives as an array; the first value wins. */
function single(value: string | string[] | undefined): string {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw?.trim() ?? "";
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const t = await getTranslations("Admin.users");
  const sp = await searchParams;

  const q = single(sp.q).slice(0, 120);

  const roleParam = single(sp.role);
  const role = (USER_ROLES as readonly string[]).includes(roleParam)
    ? (roleParam as (typeof USER_ROLES)[number])
    : "";

  const profileParam = single(sp.hasProfile);
  const hasProfile =
    profileParam === "true" ? true : profileParam === "false" ? false : null;

  const requestedPage = Number.parseInt(single(sp.page), 10);
  const page = Number.isFinite(requestedPage) ? Math.max(1, requestedPage) : 1;

  const sortParam = single(sp.sort);
  const sort = (SORT_COLUMNS as readonly string[]).includes(sortParam)
    ? (sortParam as (typeof SORT_COLUMNS)[number])
    : "createdAt";
  const order = single(sp.order) === "asc" ? "asc" : "desc";

  // The same `where` the list endpoint builds, so the table and the API can
  // never disagree about what a search matches.
  const where: Prisma.UserWhereInput = {
    ...(role ? { role } : {}),
    // A student who never finished the onboarding wizard has no profile row,
    // which is exactly the segment the admin wants to be able to isolate.
    ...(hasProfile === null
      ? {}
      : { studentProfile: hasProfile ? { isNot: null } : { is: null } }),
    ...(q
      ? {
          OR: [
            { email: { contains: q, mode: "insensitive" } },
            { name: { contains: q, mode: "insensitive" } },
            { firstName: { contains: q, mode: "insensitive" } },
            { lastName: { contains: q, mode: "insensitive" } },
            { phone: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  // Both the gate and the reader's identity in one call: a client-side
  // navigation skips the layout, so this is where authorization actually
  // happens (see src/lib/admin.ts). The actor's own row is the one that
  // cannot be demoted or deleted from this table.
  const actor = await requireAdminPage();

  const [items, total, adminCount] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      // `id` breaks ties. Neither `name` nor `createdAt` is unique, and
      // Postgres is free to return tied rows in a different order per query,
      // which makes rows jump between pages as the admin pages through.
      orderBy: [{ [sort]: order }, { id: "asc" }],
      skip: (page - 1) * DEFAULT_PER_PAGE,
      take: DEFAULT_PER_PAGE,
      // Never `passwordHash`. It is left out of the select rather than
      // stripped afterwards, so a later edit cannot put it back on the wire.
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        role: true,
        createdAt: true,
        _count: { select: { applications: true, savedFaculties: true } },
      },
    }),
    prisma.user.count({ where }),
    // Feeds the "last admin" lock, so the row that cannot be deleted says so
    // instead of answering a click with a 409.
    prisma.user.count({ where: { role: "ADMIN" } }),
  ]);

  const rows: UserRow[] = items.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    image: user.image,
    role: user.role,
    createdAt: user.createdAt,
    applicationCount: user._count.applications,
    savedCount: user._count.savedFaculties,
    lock: lockFor(user, actor.id, adminCount),
  }));

  const totalPages = Math.max(1, Math.ceil(total / DEFAULT_PER_PAGE));

  return (
    <div className={PAGE_WRAPPER}>
      <PageHeader title={t("title")} description={t("subtitle")} />

      <div className="mt-6 flex flex-col gap-4">
        <TableToolbar placeholder={t("searchPlaceholder")} total={total}>
          <UserFilters />
        </TableToolbar>

        <UserTable
          rows={rows}
          filtered={q !== "" || role !== "" || hasProfile !== null}
        />

        {totalPages > 1 ? (
          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            perPage={DEFAULT_PER_PAGE}
          />
        ) : null}
      </div>
    </div>
  );
}
