import { NextResponse, type NextRequest } from "next/server";

import { requireAdmin } from "@/lib/admin";
import { buildStudentsWorkbook } from "@/lib/admin-students-export";

export const dynamic = "force-dynamic";

/**
 * Every student and parent account as an Excel workbook, with contact details
 * and onboarding answers. Super admins only, like the users page. ?locale=en|ar.
 */
export async function GET(request: NextRequest) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const locale = request.nextUrl.searchParams.get("locale") === "en" ? "en" : "ar";

  const { file, filename } = await buildStudentsWorkbook(locale);
  return new NextResponse(new Uint8Array(file), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
