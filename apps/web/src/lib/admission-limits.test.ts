import { strict as assert } from "node:assert";
import { test } from "node:test";

import {
  admissionLimitFor,
  certificateGroupFor,
  limitsForCategory,
  minimumForGroup,
  type AdmissionCategory,
} from "./admission-limits";

const PRIVATE = (slug: string) => ({ slug, type: "PRIVATE" });
const NATIONAL = (slug: string) => ({ slug, type: "NATIONAL" });

const program = (fieldOfStudy: string, programName = "Program", universitySlug = "badr-university-in-cairo") =>
  admissionLimitFor({ universitySlug, universityType: "PRIVATE", fieldOfStudy, programName });

// Every cell of the two published 2026/2027 tables, column by column:
// [category, rest of private universities, Sinai Arish, Sinai Qantara], each
// as [Thanaweya Amma table, equivalent certificates table].
const TABLE: [AdmissionCategory, [number, number], [number | null, number | null], [number | null, number | null]][] = [
  ["MEDICINE", [81, 85], [null, null], [null, null]],
  ["DENTISTRY", [77, 82], [73, 75], [73, 77]],
  ["PHYSICAL_THERAPY", [75, 78], [null, null], [72, 73]],
  ["PHARMACY", [71, 73], [68, 66], [68, 68]],
  ["VETERINARY", [66, 60], [null, null], [null, null]],
  ["ENGINEERING", [67, 70], [64, 63], [64, 65]],
  ["PETROLEUM_ENGINEERING", [67, 70], [null, null], [null, null]],
  ["COMPUTING", [60, 65], [58, 60], [58, 60]],
  ["COMPUTER_SCIENCE_IN_SCIENCE", [60, 65], [null, null], [null, null]],
  ["SCIENCES_HEALTH", [55, 58], [53, 58], [53, 58]],
  ["ARTS_HUMANITIES", [53, 58], [52, 58], [53, 58]],
  ["TECHNOLOGICAL_UNIVERSITIES", [52, 57], [null, null], [null, null]],
];

test("every published cell matches the 2026/2027 tables", () => {
  for (const [category, rest, arish, qantara] of TABLE) {
    assert.deepEqual(Object.values(limitsForCategory(PRIVATE("badr-university-in-cairo"), category)), rest, `${category} rest`);
    assert.deepEqual(Object.values(limitsForCategory(PRIVATE("sinai-university"), category, "ARISH")), arish, `${category} Arish`);
    assert.deepEqual(Object.values(limitsForCategory(PRIVATE("sinai-university"), category, "QANTARA")), qantara, `${category} Qantara`);
  }
});

test("arts and humanities is 55% at the four named universities, Thanaweya table only", () => {
  for (const slug of ["october-6-university", "misr-university-for-science-and-technology", "msa-university", "misr-international-university-miu"]) {
    assert.deepEqual(limitsForCategory(PRIVATE(slug), "ARTS_HUMANITIES"), { EGYPTIAN: 55, EQUIVALENT: 58 });
    assert.deepEqual(limitsForCategory(PRIVATE(slug), "ENGINEERING"), { EGYPTIAN: 67, EQUIVALENT: 70 });
  }
});

test("programs map by field of study, with name rules for petroleum and Sinai campuses", () => {
  assert.equal(program("medicine")?.EGYPTIAN, 81);
  assert.equal(program("architecture")?.category, "ENGINEERING");
  assert.equal(program("engineering", "Petroleum Engineering Program")?.category, "PETROLEUM_ENGINEERING");
  assert.equal(program("artificial_intelligence")?.EQUIVALENT, 65);
  assert.equal(program("nursing")?.EGYPTIAN, 55);
  assert.equal(program("business_administration")?.EGYPTIAN, 53);
  assert.equal(program("mass_communication"), null, "not in the published table");

  const arish = program("pharmacy", "Pharmacy – Arish Campus", "sinai-university");
  assert.deepEqual(arish, { category: "PHARMACY", branch: "ARISH", EGYPTIAN: 68, EQUIVALENT: 66 });
  const qantaraPt = program("physical_therapy", "Physical Therapy – Qantara Campus", "sinai-university");
  assert.deepEqual([qantaraPt?.EGYPTIAN, qantaraPt?.EQUIVALENT], [72, 73]);
  // Not tied to a campus: the lower of the two.
  const dentistry = program("dentistry", "Dentistry", "sinai-university");
  assert.deepEqual([dentistry?.branch, dentistry?.EGYPTIAN, dentistry?.EQUIVALENT], [null, 73, 75]);
  // A category the campus does not offer has no limit.
  assert.equal(program("medicine", "Medicine – Arish Campus", "sinai-university"), null);
});

// National (ahleya) tables, every cell: [category, rest, Galala group, King
// Salman group], each as [Thanaweya Amma table, equivalent certificates].
const NATIONAL_TABLE: [AdmissionCategory, [number, number], [number, number | null], [number, number]][] = [
  ["MEDICINE", [85, 90], [82, 88], [80, 85]],
  ["DENTISTRY", [79, 82], [75, 77], [73, 75]],
  ["PHYSICAL_THERAPY", [77, 78], [74, 73], [72, 71]],
  ["PHARMACY", [72, 73], [70, 68], [68, 66]],
  ["ENGINEERING", [68, 70], [65, 65], [64, 63]],
  ["VETERINARY", [67, 65], [65, null], [64, 65]],
  ["COMPUTING", [61, 65], [59, 60], [58, 60]],
  ["SCIENCES_HEALTH", [56, 58], [54, 58], [53, 58]],
  ["ARTS_HUMANITIES", [53, 58], [53, 58], [52, 58]],
];

test("every national cell matches the 2026/2027 ahleya tables", () => {
  for (const [category, rest, galala, kingSalman] of NATIONAL_TABLE) {
    for (const slug of ["nile-university", "new-mansoura-university", "rashid-university"]) {
      assert.deepEqual(Object.values(limitsForCategory(NATIONAL(slug), category)), rest, `${category} ${slug}`);
    }
    for (const slug of ["galala-university", "new-alamein-international-university", "east-port-said-national-university"]) {
      assert.deepEqual(Object.values(limitsForCategory(NATIONAL(slug), category)), galala, `${category} ${slug}`);
    }
    for (const slug of ["king-salman-international-university", "new-valley-national-university"]) {
      assert.deepEqual(Object.values(limitsForCategory(NATIONAL(slug), category)), kingSalman, `${category} ${slug}`);
    }
  }
});

test("national programs: petroleum and science computing use the general rows; Zewail is not covered", () => {
  const nile = (fieldOfStudy: string, programName = "Program") =>
    admissionLimitFor({ universitySlug: "nile-university", universityType: "NATIONAL", fieldOfStudy, programName });
  assert.deepEqual([nile("engineering")?.EGYPTIAN, nile("engineering")?.EQUIVALENT], [68, 70]);
  assert.equal(nile("engineering", "Petroleum Engineering")?.EGYPTIAN, 68);
  assert.equal(nile("science", "Computer Science")?.EGYPTIAN, 61);
  assert.equal(nile("mass_communication"), null);
  assert.equal(
    admissionLimitFor({ universitySlug: "zewail-city-of-science-technology-and-innovation", universityType: "NATIONAL", fieldOfStudy: "engineering", programName: "Engineering" }),
    null,
  );
  // The private-only technological row never applies to a national university.
  assert.equal(
    admissionLimitFor({ universitySlug: "saxony-national", universityType: "NATIONAL", fieldOfStudy: "engineering", programName: "Engineering" })?.category,
    "ENGINEERING",
  );
});

test("certificate groups pick the right table; unknown uses the stricter value", () => {
  assert.equal(certificateGroupFor("STEM"), "EGYPTIAN");
  assert.equal(certificateGroupFor("AL_AZHAR"), "EGYPTIAN");
  assert.equal(certificateGroupFor("IGCSE"), "EQUIVALENT");
  assert.equal(certificateGroupFor("ARAB_CERTIFICATE"), "EQUIVALENT");
  assert.equal(certificateGroupFor("OTHER"), null);
  assert.equal(minimumForGroup({ EGYPTIAN: 66, EQUIVALENT: 60 }, "EQUIVALENT"), 60);
  assert.equal(minimumForGroup({ EGYPTIAN: 66, EQUIVALENT: 60 }, null), 66);
  assert.equal(minimumForGroup({ EGYPTIAN: 71, EQUIVALENT: 73 }, null), 73);
});
