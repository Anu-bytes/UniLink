import { NextResponse } from "next/server";

import { auth } from "@/auth";
import {
  MAX_AVATAR_BYTES,
  validateImageUpload,
  type ValidationFailure,
} from "@/lib/image-upload";
import { prisma } from "@/lib/prisma";
import {
  deleteAvatarByUrl,
  isStorageConfigured,
  uploadAvatar,
} from "@/lib/supabase-storage";

// Multipart bodies must not be cached or statically analysed.
export const dynamic = "force-dynamic";

/**
 * Per-user cooldown between uploads.
 *
 * NOTE: this map lives in one server process, so it does not hold across
 * instances on a horizontally scaled or serverless deployment. It is a cheap
 * brake on accidental hammering, not a real rate limiter. Move this to the
 * database or a shared cache before relying on it.
 */
const lastUploadAt = new Map<string, number>();
const UPLOAD_COOLDOWN_MS = 5_000;

const FAILURE_STATUS: Record<ValidationFailure, number> = {
  EMPTY: 400,
  TOO_LARGE: 413,
  UNSUPPORTED_FORMAT: 415,
};

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }
  const userId = session.user.id;

  if (!isStorageConfigured()) {
    return NextResponse.json(
      { error: "Avatar storage is not configured on this server" },
      { status: 503 },
    );
  }

  const previous = lastUploadAt.get(userId) ?? 0;
  if (Date.now() - previous < UPLOAD_COOLDOWN_MS) {
    return NextResponse.json({ error: "Please wait a moment" }, { status: 429 });
  }

  // Reject an oversized body from the declared length before parsing it, so a
  // huge upload is not buffered just to be thrown away.
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_AVATAR_BYTES * 1.1) {
    return NextResponse.json({ error: "TOO_LARGE" }, { status: 413 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Invalid upload" }, { status: 400 });
  }

  const result = await validateImageUpload(file);
  if (!result.ok) {
    return NextResponse.json(
      { error: result.reason },
      { status: FAILURE_STATUS[result.reason] },
    );
  }

  // Read the current avatar before overwriting, so the old object can be
  // removed once the new one is safely stored.
  const current = await prisma.user.findUnique({
    where: { id: userId },
    select: { image: true },
  });

  let uploaded;
  try {
    uploaded = await uploadAvatar({
      userId,
      bytes: result.bytes,
      contentType: result.format.mime,
      extension: result.format.extension,
    });
  } catch (error) {
    console.error("Avatar upload failed", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 502 });
  }

  await prisma.user.update({
    where: { id: userId },
    data: { image: uploaded.url },
  });

  lastUploadAt.set(userId, Date.now());
  await deleteAvatarByUrl(current?.image);

  return NextResponse.json({ image: uploaded.url }, { status: 201 });
}

export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const current = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { image: true },
  });

  await prisma.user.update({
    where: { id: session.user.id },
    data: { image: null },
  });

  // Only removes objects in our own avatar bucket; an OAuth provider's URL is
  // left alone by avatarPathFromUrl.
  await deleteAvatarByUrl(current?.image);

  return NextResponse.json({ image: null });
}
