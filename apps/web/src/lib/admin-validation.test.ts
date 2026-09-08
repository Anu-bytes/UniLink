import { strict as assert } from "node:assert";
import { test } from "node:test";
import { adminPage, MAX_ADMIN_PAGE, validEnglishScore, validMinimumScore } from "./admin-validation";
import { adminErrorCode, adminErrorMessage } from "./admin-errors";

test("pagination always produces a bounded, safe offset", () => {
  for (const value of [undefined, null, "", "NaN", "Infinity", "1e100", "999999999999999999999", "-1", "2.5", "2bad"]) {
    assert.equal(adminPage(value), 1);
  }
  assert.equal(adminPage("2"), 2);
  assert.equal(adminPage("2000000"), MAX_ADMIN_PAGE);
  assert.ok(adminPage("2000000") * 100 < 2 ** 31);
});

test("percentages are bounded without imposing a percentage scale on points", () => {
  assert.equal(validMinimumScore("PERCENT", 100), true);
  assert.equal(validMinimumScore("PERCENT", 100.01), false);
  assert.equal(validMinimumScore("POINTS", 150), true);
  assert.equal(validMinimumScore("PERCENT", -1), false);
  assert.equal(validMinimumScore("POINTS", Infinity), false);
});

test("English requirements use the selected test scale", () => {
  for (const [test, max] of [["IELTS", 9], ["TOEFL", 120], ["PTE", 90], ["DUOLINGO", 160]] as const) {
    assert.equal(validEnglishScore(test, max), true);
    assert.equal(validEnglishScore(test, max + 0.1), false);
    assert.equal(validEnglishScore(test, 0), false);
    assert.equal(validEnglishScore(test, NaN), false);
  }
  assert.equal(validEnglishScore("NONE", 1), false);
});

test("errors expose stable classifications and safe fallback text", () => {
  assert.equal(adminErrorCode("Slug cannot be empty"), "EMPTY_SLUG");
  assert.equal(adminErrorCode("That faculty does not belong to this university"), "WRONG_FACULTY");
  assert.equal(adminErrorMessage({ error: "private server details" }, 500), "The change could not be saved. Please try again.");
  assert.equal(adminErrorMessage({ code: "toString" }, 500), "The change could not be saved. Please try again.");
  assert.equal(adminErrorMessage({ error: {} }, 400), "Check the value in this field.");
});
