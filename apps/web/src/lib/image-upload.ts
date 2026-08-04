// Server-side validation for user-supplied images.
//
// The browser's Content-Type and the filename extension are both attacker
// controlled, so neither is trusted here: the format is decided by sniffing
// the file's own signature bytes.

/** Hard ceiling on an avatar upload. Enforced before the bytes are read. */
export const MAX_AVATAR_BYTES = 2 * 1024 * 1024; // 2 MB

export type ImageFormat = {
  mime: "image/jpeg" | "image/png" | "image/webp";
  extension: "jpg" | "png" | "webp";
};

export type ValidationFailure =
  | "EMPTY"
  | "TOO_LARGE"
  | "UNSUPPORTED_FORMAT";

export type ValidationResult =
  | { ok: true; format: ImageFormat; bytes: Uint8Array }
  | { ok: false; reason: ValidationFailure };

function startsWith(bytes: Uint8Array, signature: number[], offset = 0) {
  if (bytes.length < offset + signature.length) return false;
  return signature.every((byte, index) => bytes[offset + index] === byte);
}

/**
 * Identify the format from the file's magic bytes.
 *
 * SVG is deliberately absent and must never be added: it is an XML document
 * that can carry <script>, so serving user-supplied SVG from our own origin
 * would be a stored XSS vector.
 */
export function sniffImageFormat(bytes: Uint8Array): ImageFormat | null {
  // JPEG: FF D8 FF
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) {
    return { mime: "image/jpeg", extension: "jpg" };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return { mime: "image/png", extension: "png" };
  }

  // WebP: "RIFF" .... "WEBP"
  if (
    startsWith(bytes, [0x52, 0x49, 0x46, 0x46]) &&
    startsWith(bytes, [0x57, 0x45, 0x42, 0x50], 8)
  ) {
    return { mime: "image/webp", extension: "webp" };
  }

  return null;
}

/** Size check, then signature check, on the actual bytes received. */
export async function validateImageUpload(
  file: File,
): Promise<ValidationResult> {
  if (file.size === 0) {
    return { ok: false, reason: "EMPTY" };
  }

  // Checked against the declared size first so an oversized body is rejected
  // before it is buffered into memory.
  if (file.size > MAX_AVATAR_BYTES) {
    return { ok: false, reason: "TOO_LARGE" };
  }

  const bytes = new Uint8Array(await file.arrayBuffer());

  // The declared size can lie; re-check what actually arrived.
  if (bytes.byteLength > MAX_AVATAR_BYTES) {
    return { ok: false, reason: "TOO_LARGE" };
  }

  const format = sniffImageFormat(bytes);
  if (!format) {
    return { ok: false, reason: "UNSUPPORTED_FORMAT" };
  }

  return { ok: true, format, bytes };
}
