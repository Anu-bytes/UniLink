import { NextResponse, type NextRequest } from "next/server";

import { requireAdmin } from "@/lib/admin";
import { EXPORT_UNITS, buildStatisticsWorkbook } from "@/lib/admin-stats-export";

export const dynamic = "force-dynamic";

/**
 * The statistics page as an Excel workbook. Same audience as the page:
 * reviewers and super admins. ?unit=day|week|month|year, ?locale=en|ar.
 */
export async function GET(request: NextRequest) {
  const guard = await requireAdmin({ minLevel: 2 });
  if (!guard.ok) return guard.response;

  const params = request.nextUrl.searchParams;
  const unit = EXPORT_UNITS.find((value) => value === params.get("unit"));
  if (!unit) return NextResponse.json({ error: "Choose day, week, month or year" }, { status: 400 });
  const locale = params.get("locale") === "en" ? "en" : "ar";

  const { file, filename } = await buildStatisticsWorkbook(unit, locale);
  return new NextResponse(new Uint8Array(file), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
