import { NextResponse } from "next/server";
import { registerSchema } from "@/lib/auth/validation";
import { createStudent, emailExists } from "@/lib/auth/mock-store";
import { setSession } from "@/lib/auth/session";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fields[key]) fields[key] = issue.code;
    }
    return NextResponse.json({ error: "validation", fields }, { status: 400 });
  }

  if (emailExists(parsed.data.email)) {
    return NextResponse.json({ error: "email_taken", fields: { email: "taken" } }, { status: 409 });
  }

  const profile = createStudent(parsed.data);
  await setSession({
    id: profile.id,
    email: profile.email,
    fullName: profile.fullName,
    role: profile.role,
  });

  return NextResponse.json({ user: profile }, { status: 201 });
}
