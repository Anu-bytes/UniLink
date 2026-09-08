import assert from "node:assert/strict";
import test from "node:test";
import { admissionCoverage, catalogueChecks } from "./admin-catalogue";

test("faculty checklist treats blank content as missing without inventing publication status", () => {
  const checks = catalogueChecks({nameAr:"  ",description:"English",descriptionAr:null,imageUrl:"\n"});
  assert.deepEqual(checks, [
    {key:"nameAr",present:false},{key:"description",present:true},
    {key:"descriptionAr",present:false},{key:"image",present:false},
  ]);
});

test("university checklist independently checks logo, cover and both descriptions", () => {
  const input={nameAr:"جامعة",description:"Description",descriptionAr:"وصف",logoUrl:"logo.png",coverImageUrl:null};
  assert.deepEqual(catalogueChecks(input).filter(check=>!check.present).map(check=>check.key),["cover"]);
  assert.equal(catalogueChecks({...input,coverImageUrl:"cover.png"}).every(check=>check.present),true);
});

test("admission coverage distinguishes faculty rules from university-wide rules", () => {
  assert.equal(admissionCoverage(2,3),"facultyRules");
  assert.equal(admissionCoverage(0,3),"universityRules");
  assert.equal(admissionCoverage(0,0),"noRules");
});
