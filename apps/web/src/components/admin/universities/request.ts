/**
 * One fetch wrapper for every write this section makes.
 *
 * The admin API answers a rejection with `{ error, field }` and the university
 * DELETE answers a 409 with a `counts` object, so a failure has to hand back
 * the status and the raw body as well as the message — a form highlights the
 * field, the delete dialog reads the counts, and nothing is swallowed.
 */
export type WriteResult<T> =
  | { ok: true; data: T }
  | {
      ok: false;
      status: number;
      message: string | null;
      field: string | null;
      body: unknown;
    };

export async function adminWrite<T>(
  url: string,
  method: "POST" | "PATCH" | "DELETE",
  body?: unknown,
): Promise<WriteResult<T>> {
  let response: Response;
  try {
    response = await fetch(url, {
      method,
      ...(body === undefined
        ? {}
        : {
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }),
    });
  } catch {
    // Status 0 means the request never reached the server; callers fall back
    // to their own "save failed" copy rather than showing an empty message.
    return { ok: false, status: 0, message: null, field: null, body: null };
  }

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const detail = payload as { error?: unknown; field?: unknown } | null;
    return {
      ok: false,
      status: response.status,
      message: typeof detail?.error === "string" ? detail.error : null,
      field: typeof detail?.field === "string" ? detail.field : null,
      body: payload,
    };
  }

  return { ok: true, data: payload as T };
}
