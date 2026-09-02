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

/**
 * Move one row of a hand-ordered collection up or down by a place.
 *
 * Every row whose stored sortOrder no longer matches its index is rewritten,
 * not only the pair that trades places. Stored positions are not guaranteed to
 * be 0..n-1: deleting the first image and adding another leaves 1, 2, 3 under
 * indices 0, 1, 2, because the API hands a new row `max + 1`. Writing indices
 * into two rows alone would then land one of them on a value a third row still
 * holds, and a tie is broken by id — so the row an admin nudged one place ends
 * up somewhere nobody asked for.
 */
export async function moveRow(
  baseUrl: string,
  rows: readonly { id: string; sortOrder: number }[],
  index: number,
  direction: -1 | 1,
): Promise<WriteResult<null>> {
  const moved = rows[index];
  const target = index + direction;
  if (!moved || !rows[target]) return { ok: true, data: null };

  const ordered = [...rows];
  ordered.splice(index, 1);
  ordered.splice(target, 0, moved);

  for (const [position, row] of ordered.entries()) {
    if (row.sortOrder === position) continue;
    const result = await adminWrite<unknown>(`${baseUrl}/${row.id}`, "PATCH", {
      sortOrder: position,
    });
    if (!result.ok) return result;
  }

  return { ok: true, data: null };
}
