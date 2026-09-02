import type { ApplicationStatus } from "@prisma/client";

export type ApplicationPatch = {
  status?: ApplicationStatus;
  notes?: string | null;
};

/**
 * Every write this section makes is the same PATCH, so it lives here once.
 *
 * Only the message is handed back: the admin API answers a rejection with
 * `{ error, field }`, but neither the row select nor the review form has more
 * than one field to highlight, so the field would have nowhere to go.
 */
export type PatchResult = { ok: true } | { ok: false; message: string | null };

export async function patchApplication(
  id: string,
  patch: ApplicationPatch,
): Promise<PatchResult> {
  let response: Response;
  try {
    response = await fetch(`/api/admin/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
  } catch {
    // The request never reached the server, so there is no message to show and
    // the caller falls back to its own "save failed" copy.
    return { ok: false, message: null };
  }

  if (response.ok) return { ok: true };

  const payload: unknown = await response.json().catch(() => null);
  const detail = payload as { error?: unknown } | null;

  return {
    ok: false,
    message: typeof detail?.error === "string" ? detail.error : null,
  };
}
