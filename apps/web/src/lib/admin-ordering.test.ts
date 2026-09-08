import { strict as assert } from "node:assert";
import { test } from "node:test";
import { moveRow } from "../components/admin/universities/request";

test("reordering handles tied and sparse positions without mutating the rendered list", async (t) => {
  const writes: { url: string; order: number }[] = [];
  t.mock.method(globalThis, "fetch", async (url: string, options: RequestInit) => {
    writes.push({ url, order: JSON.parse(String(options.body)).sortOrder });
    return Response.json({ ok: true });
  });
  const rows = [{ id: "a", sortOrder: 5 }, { id: "b", sortOrder: 5 }, { id: "c", sortOrder: 12 }];
  assert.equal((await moveRow("/features", rows, 2, -1)).ok, true);
  assert.deepEqual(writes, [{ url: "/features/a", order: 0 }, { url: "/features/c", order: 1 }, { url: "/features/b", order: 2 }]);
  assert.deepEqual(rows.map((row) => row.id), ["a", "b", "c"]);
});

test("partial reorder failures stop further writes and remain visible to callers", async (t) => {
  let calls = 0;
  t.mock.method(globalThis, "fetch", async () => {
    calls++;
    if (calls === 2) return Response.json({ error: "private server details" }, { status: 500 });
    return Response.json({ ok: true });
  });
  const result = await moveRow("/features", [{ id: "a", sortOrder: 5 }, { id: "b", sortOrder: 5 }, { id: "c", sortOrder: 5 }], 0, 1);
  assert.equal(result.ok, false);
  assert.equal(calls, 2);
  if (!result.ok) {
    assert.equal(result.status, 500);
    assert.equal(result.message, "The change could not be saved. Please try again.");
  }
});
