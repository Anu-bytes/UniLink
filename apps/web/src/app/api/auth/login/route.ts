import { NextResponse } from "next/server";
import { loginSchema } from "@/lib/auth/validation";
import { verifyCredentials } from "@/lib/auth/mock-store";
import { setSession } from "@/lib/auth/session";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation" }, { status: 400 });
  }

  const profile = verifyCredentials(parsed.data.email, parsed.data.password);
  if (!profile) {
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }

  await setSession({
    id: profile.id,
    email: profile.email,
    fullName: profile.fullName,
    role: profile.role,
  });
  return NextResponse.json({ user: profile });
}
