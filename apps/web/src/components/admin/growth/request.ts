/**
 * One fetch wrapper for every write these three sections make.
 *
 * The admin API answers a rejection with `{ error, field }`, so a failure has
 * to hand back the status and the field as well as the message — the editors
 * highlight the offending input and nothing is swallowed into a generic
 * "something went wrong".
 */
export type WriteResult<T> =
  | { ok: true; data: T }
  | {
      ok: false;
      status: number;
      message: string | null;
      field: string | null;
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
    return { ok: false, status: 0, message: null, field: null };
  }

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const detail = payload as { error?: unknown; field?: unknown } | null;
    return {
      ok: false,
      status: response.status,
      message: typeof detail?.error === "string" ? detail.error : null,
      field: typeof detail?.field === "string" ? detail.field : null,
    };
  }

  return { ok: true, data: payload as T };
}
