import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin";
import { badRequest, readJson } from "@/lib/admin-api";
import {
  MAX_MEDIA_BYTES,
  validateImageUpload,
  type ValidationFailure,
} from "@/lib/image-upload";
import {
  deleteMediaByUrl,
  isStorageConfigured,
  MEDIA_FOLDERS,
  uploadMedia,
} from "@/lib/supabase-storage";

// Multipart bodies must not be cached or statically analysed.
export const dynamic = "force-dynamic";

/**
 * Per-admin cooldown between uploads. Same in-process Map as the avatar route,
 * with the same caveat: one server process, so it does not hold across
 * instances. It is a brake on accidental hammering, not a real rate limiter.
 *
 * Two seconds rather than the avatar route's five: filling a university's
 * gallery means picking half a dozen files and firing them off back to back,
 * and a five-second gate would turn that into a minute of 429s.
 */
const lastUploadAt = new Map<string, number>();
const UPLOAD_COOLDOWN_MS = 2_000;

const FAILURE_STATUS: Record<ValidationFailure, number> = {
  EMPTY: 400,
  TOO_LARGE: 413,
  UNSUPPORTED_FORMAT: 415,
};

// The folder becomes part of the storage path, so it is matched against the
// allowlist rather than passed through — anything else is a 400.
const folderSchema = z.enum(MEDIA_FOLDERS);

const deleteSchema = z.object({ url: z.string().min(1) });

export async function POST(request: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  const actorId = guard.actor.id;

  if (!isStorageConfigured()) {
    return NextResponse.json(
      { error: "Media storage is not configured on this server" },
      { status: 503 },
    );
  }

  const previous = lastUploadAt.get(actorId) ?? 0;
  if (Date.now() - previous < UPLOAD_COOLDOWN_MS) {
    return NextResponse.json({ error: "Please wait a moment" }, { status: 429 });
  }

  // Reject an oversized body from the declared length before parsing it, so a
  // huge upload is not buffered just to be thrown away.
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_MEDIA_BYTES * 1.1) {
    return NextResponse.json({ error: "TOO_LARGE" }, { status: 413 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload" }, { status: 400 });
  }

  const folder = folderSchema.safeParse(form.get("folder"));
  if (!folder.success) {
    return badRequest("Unknown media folder", "folder");
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Invalid upload" }, { status: 400 });
  }

  const result = await validateImageUpload(file, MAX_MEDIA_BYTES);
  if (!result.ok) {
    return NextResponse.json(
      { error: result.reason },
      { status: FAILURE_STATUS[result.reason] },
    );
  }

  let uploaded;
  try {
    uploaded = await uploadMedia({
      folder: folder.data,
      bytes: result.bytes,
      contentType: result.format.mime,
      extension: result.format.extension,
    });
  } catch (error) {
    console.error("Media upload failed", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 502 });
  }

  lastUploadAt.set(actorId, Date.now());

  // Nothing is written to the database here: the caller stitches the URL into
  // whichever record it is editing, so an abandoned form leaves an orphaned
  // object rather than a half-saved row.
  return NextResponse.json(uploaded, { status: 201 });
}

export async function DELETE(request: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const body = await readJson(request, deleteSchema);
  if (!body.ok) return body.response;

  // A URL that is not one of our own media objects — an externally hosted
  // logo, say — is a no-op rather than a 404: mediaPathFromUrl already refuses
  // to resolve it, and the caller only wants the picture gone either way.
  await deleteMediaByUrl(body.data.url);

  return NextResponse.json({ ok: true });
}
