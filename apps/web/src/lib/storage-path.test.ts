import { strict as assert } from "node:assert";
import { test } from "node:test";
import { storageObjectPath } from "./storage-path";

const project = "https://example.supabase.co";
const object = `${project}/storage/v1/object/public/media/universities/test-file.png`;

test("storage deletion accepts only canonical URLs in the configured project and bucket", () => {
  assert.equal(storageObjectPath(object, project, "media"), "universities/test-file.png");
  for (const url of [
    object.replace(project, "https://attacker.example"),
    object.replace("https:", "http:"),
    object.replace("/media/", "/avatars/"),
    object.replace("/universities/", "/universities/../universities/"),
    object.replace("test-file", "%2e%2e%2fsecret"),
    `${object}?download=1`, `${object}#fragment`, `${object}/other.png`,
    "not a URL", `https://user:pass@example.supabase.co${new URL(object).pathname}`,
  ]) assert.equal(storageObjectPath(url, project, "media"), null, url);
  assert.equal(storageObjectPath(object, undefined, "media"), null);
});
