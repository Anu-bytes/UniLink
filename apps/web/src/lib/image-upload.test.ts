import { strict as assert } from "node:assert";
import { test } from "node:test";
import { MAX_MEDIA_BYTES, sniffImageFormat, validateImageUpload } from "./image-upload";

test("image signature validation does not trust a filename or MIME header", async () => {
  const png = Uint8Array.from([137, 80, 78, 71, 13, 10, 26, 10]);
  assert.equal(sniffImageFormat(png)?.mime, "image/png");
  assert.equal(sniffImageFormat(Uint8Array.from([255, 216, 255]))?.extension, "jpg");
  assert.equal(sniffImageFormat(new TextEncoder().encode("RIFF1234WEBP"))?.extension, "webp");
  assert.deepEqual(await validateImageUpload(new File(["<svg><script/></svg>"], "image.png", { type: "image/png" })), { ok: false, reason: "UNSUPPORTED_FORMAT" });
  assert.deepEqual(await validateImageUpload(new File([], "empty.png")), { ok: false, reason: "EMPTY" });
  const fakeMime = await validateImageUpload(new File([png], "image.txt", { type: "text/plain" }));
  assert.equal(fakeMime.ok && fakeMime.format.mime, "image/png");
});

test("oversized media is rejected before buffering", async () => {
  let read = false;
  const file = { size: MAX_MEDIA_BYTES + 1, arrayBuffer: async () => { read = true; return new ArrayBuffer(0); } } as File;
  assert.deepEqual(await validateImageUpload(file, MAX_MEDIA_BYTES), { ok: false, reason: "TOO_LARGE" });
  assert.equal(read, false);
});
