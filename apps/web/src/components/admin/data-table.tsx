import { cn } from "@/lib/utils";

export type Column<T> = {
  key: string;
  header: React.ReactNode;
  cell: (row: T) => React.ReactNode;
  className?: string;
  align?: "start" | "end";
  /**
   * Pins the column to the inline-end edge while the rest of the table scrolls
   * under it. Use it for the row-actions column: these tables carry seven or
   * more columns, and on a laptop the last ones fall off the right-hand side,
   * which puts Edit and Delete behind a horizontal scroll nobody thinks to
   * perform. `inset-inline-end` rather than `right`, so it pins to the correct
   * edge in Arabic.
   */
  sticky?: "end";
};

const SKELETON_ROWS = 6;

/**
 * Header half of a pinned column: it has to out-stack the ordinary sticky
 * header (z-10) so the two overlap correctly in the top corner.
 */
const STICKY_END_HEADER = "sticky end-0 z-20 bg-[#F8FAFC]";

/**
 * The table is deliberately not a client component: `Column.cell` is a
 * function, and functions cannot cross a server/client boundary. Leaving the
 * module unmarked lets a server page build its columns inline, while a client
 * page that imports it (the only kind that can pass `onRowClick`) pulls it
 * into the client bundle on its own.
 */
export function DataTable<T>({
  columns,
  rows,
  getRowKey,
  empty,
  loading,
  onRowClick,
}: {
  columns: Column<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  empty: React.ReactNode;
  loading?: boolean;
  onRowClick?: (row: T) => void;
}) {
  const clickable = Boolean(onRowClick);

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05)]">
      <table className="w-full min-w-[680px] border-collapse">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={cn(
                  // Vertical sticky pays off when the page wraps the table in a
                  // scroll box; in the ordinary paginated list it is inert.
                  "sticky top-0 z-10 h-10 whitespace-nowrap border-b border-[#E2E8F0] bg-[#F8FAFC] px-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748B]",
                  column.align === "end" ? "text-end" : "text-start",
                  column.sticky === "end" && STICKY_END_HEADER,
                  column.className,
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {loading
            ? Array.from({ length: SKELETON_ROWS }).map((_, rowIndex) => (
                <tr key={`skeleton-${rowIndex}`} className="border-b border-slate-100">
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        "h-11 px-4",
                        column.sticky === "end" && "sticky end-0 bg-white",
                      )}
                    >
                      <div className="h-3 w-[70%] animate-pulse rounded bg-slate-100" />
                    </td>
                  ))}
                </tr>
              ))
            : null}

          {!loading && rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="p-0">
                {empty}
              </td>
            </tr>
          ) : null}

          {!loading
            ? rows.map((row) => (
                <tr
                  key={getRowKey(row)}
                  role={clickable ? "button" : undefined}
                  tabIndex={clickable ? 0 : undefined}
                  onClick={clickable ? () => onRowClick?.(row) : undefined}
                  onKeyDown={
                    clickable
                      ? (event) => {
                          if (event.key !== "Enter" && event.key !== " ") return;
                          // Space scrolls the page otherwise, and Enter would
                          // double-fire on a row holding a link.
                          event.preventDefault();
                          onRowClick?.(row);
                        }
                      : undefined
                  }
                  className={cn(
                    "group/row border-b border-slate-100 transition-colors last:border-b-0 hover:bg-[#F8FAFC]",
                    clickable &&
                      "cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#1E6DEB]",
                  )}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        "h-11 px-4 align-middle text-[13.5px] text-[#334155]",
                        column.align === "end" ? "text-end" : "text-start",
                        // The pinned cell needs its own opaque background or
                        // the scrolling columns show through it. It inherits
                        // the row's hover tint via group-hover for the same
                        // reason.
                        column.sticky === "end" &&
                          "sticky end-0 z-[1] bg-white group-hover/row:bg-[#F8FAFC] before:absolute before:inset-y-0 before:start-0 before:w-px before:bg-slate-100",
                        column.className,
                      )}
                    >
                      {column.cell(row)}
                    </td>
                  ))}
                </tr>
              ))
            : null}
        </tbody>
      </table>
    </div>
  );
}
