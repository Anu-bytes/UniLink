// Local-only integration probe. Creates its own users/catalogue and cleans up
// by exact IDs. Never run against production or a shared remote database.
import { readFileSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";
import { createInterface } from "node:readline";
import nextEnv from "@next/env";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const appDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
nextEnv.loadEnvConfig(appDir, true);
const base = process.env.ADMIN_SMOKE_URL || "http://localhost:3000";
if (process.argv.includes("--hold") && !process.stdin.isTTY) {
  throw new Error("--hold needs an interactive terminal so Enter can trigger fixture cleanup. Run without --hold in non-interactive shells.");
}
const local = (value) => ["localhost", "127.0.0.1", "[::1]"].includes(new URL(value).hostname);
if (process.env.ADMIN_SMOKE_LOCAL !== "1" || !local(base) || !local(process.env.DATABASE_URL || "https://invalid")) {
  throw new Error("Set ADMIN_SMOKE_LOCAL=1 with a loopback app URL and DATABASE_URL. Remote targets are refused.");
}
const db = new PrismaClient();
const tag = `admin-smoke-${randomUUID()}`;
const password = randomUUID();
const userIds = [];
let university, lead, testimonial, scholarship;
let assertions = 0;
const failures = [];
function check(label, actual, expected) {
  assertions++;
  if (actual !== expected) {
    failures.push({ label, actual, expected });
    console.error("FAIL", label, actual, "expected", expected);
  }
}
function client() {
  const cookies = new Map();
  return async (path, method = "GET", body, extraHeaders = {}) => {
    let response = await fetch(base + path, {
      method, redirect: "manual",
      headers: { cookie: [...cookies].map(([k, v]) => `${k}=${v}`).join("; "), ...(body === undefined ? {} : { "content-type": "application/json" }), ...extraHeaders },
      body: body === undefined ? undefined : typeof body === "string" ? body : JSON.stringify(body),
    });
    // Next may canonicalize an RSC request's cache-busting query. Follow only
    // same-path redirects, never a login redirect (which must be asserted).
    if (extraHeaders.RSC && response.status === 307 && response.headers.get("location")) {
      const destination = new URL(response.headers.get("location"), base);
      if (destination.origin === new URL(base).origin && destination.pathname === new URL(base + path).pathname) {
        response = await fetch(destination, { redirect: "manual", headers: { cookie: [...cookies].map(([k, v]) => `${k}=${v}`).join("; "), ...extraHeaders } });
      }
    }
    for (const raw of response.headers.getSetCookie()) {
      const part = raw.split(";")[0], at = part.indexOf("=");
      cookies.set(part.slice(0, at), part.slice(at + 1));
    }
    const text = await response.text();
    let data; try { data = JSON.parse(text); } catch { data = text; }
    return { status: response.status, text, data, headers: response.headers };
  };
}
async function login(user) {
  const request = client();
  const csrf = await request("/api/auth/csrf");
  await request("/api/auth/callback/credentials", "POST", new URLSearchParams({ csrfToken: csrf.data.csrfToken, email: user.email, password, callbackUrl: base + "/en/admin" }).toString(), { "content-type": "application/x-www-form-urlencoded" });
  check(`login ${user.role}`, (await request("/api/auth/session")).data.user?.id, user.id);
  return request;
}
function walk(dir, filename) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? walk(resolve(dir, entry.name), filename) : entry.name === filename ? [resolve(dir, entry.name)] : []);
}
try {
  const hash = await bcrypt.hash(password, 10);
  async function makeUser(role, suffix) {
    const row = await db.user.create({ data: { email: `${tag}-${suffix}@example.invalid`, name: `${tag} ${suffix}`, role, passwordHash: hash } });
    userIds.push(row.id); return row;
  }
  const admin = await makeUser("ADMIN", "reviewer");
  const student = await makeUser("STUDENT", "student");
  const other = await makeUser("STUDENT", "other");
  await db.studentProfile.create({ data: { userId: student.id, studyLevel: "BACHELOR", highSchoolSystem: "THANAWEYA_AMMA", graduationYear: 2026, gradeValue: "93", fieldsOfStudy: ["Engineering"], englishTest: "IELTS", englishScore: 7, nationality: "EG", intakeSeason: "FALL", intakeYear: 2026, budgetBand: "B100_200K" } });
  university = await db.university.create({ data: { name: tag, nameAr: "جامعة اختبار الإدارة", slug: tag, type: "PRIVATE", country: "Egypt", city: "Cairo", publishedAt: new Date() } });
  const faculty = await db.faculty.create({ data: { universityId: university.id, name: "Smoke Engineering", slug: "smoke-engineering" } });
  const program = await db.program.create({ data: { universityId: university.id, facultyId: faculty.id, name: "Smoke Engineering Programme", nameAr: "برنامج هندسة تجريبي", slug: "smoke-engineering", studyLevel: "BACHELOR", fieldOfStudy: "Engineering", isPublished: true } });
  lead = await db.partnershipLead.create({ data: { universityName: tag, city: "Cairo", contactFirstName: "Test", contactLastName: "Contact", contactEmail: `${tag}@example.invalid`, contactTitle: "QA fixture", phone: "0000000000", message: "Disposable local test lead" } });
  testimonial = await db.testimonial.create({ data: { studentName: tag, quote: "Disposable local testimonial" } });
  scholarship = await db.scholarship.create({ data: { universityId: university.id, title: tag, slug: tag } });
  const [a, s, o] = await Promise.all([login(admin), login(student), login(other)]);
  const anon = client();
  const created = await s("/api/applications", "POST", { programId: program.id });
  check("student starts draft", created.status, 201);
  const applicationId = created.data.id;
  if (!applicationId) throw new Error("Application fixture could not be created");
  check("start is idempotent", (await s("/api/applications", "POST", { programId: program.id })).data.id, applicationId);
  check("cannot change another student's application", (await o("/api/applications", "PATCH", { applicationId, status: "SUBMITTED" })).status, 404);
  check("student cannot award offer", (await s("/api/applications", "PATCH", { applicationId, status: "OFFER" })).status, 400);
  check("student submits", (await s("/api/applications", "PATCH", { applicationId, status: "SUBMITTED" })).status, 200);
  const submittedAt = (await a(`/api/admin/applications/${applicationId}`)).data.submittedAt;
  check("submission gets timestamp", Boolean(submittedAt), true);
  await s("/api/applications", "PATCH", { applicationId, status: "SUBMITTED" });
  check("repeat submission preserves first timestamp", (await a(`/api/admin/applications/${applicationId}`)).data.submittedAt, submittedAt);
  for (const status of ["IN_REVIEW", "OFFER", "REJECTED", "WITHDRAWN", "DRAFT", "SUBMITTED"]) {
    const response = await a(`/api/admin/applications/${applicationId}`, "PATCH", { status, notes: `Test review: ${status}` });
    check(`admin transition ${status}`, response.status, 200);
    check(`persisted status ${status}`, response.data.status, status);
    check(`stable timestamp ${status}`, response.data.submittedAt, submittedAt);
    check(`no credentials ${status}`, response.text.includes("passwordHash"), false);
    check(`academic profile ${status}`, response.data.user?.studentProfile?.gradeValue, "93");
  }
  const concurrent = await Promise.all([
    a(`/api/admin/applications/${applicationId}`, "PATCH", { status: "IN_REVIEW" }),
    a(`/api/admin/applications/${applicationId}`, "PATCH", { notes: "Local QA review note" }),
  ]);
  check("parallel disjoint edits accepted", concurrent.every((r) => r.status === 200), true);
  const finalApplication = (await a(`/api/admin/applications/${applicationId}`)).data;
  check("parallel status retained", finalApplication.status, "IN_REVIEW");
  check("parallel notes retained", finalApplication.notes, "Local QA review note");
  check("invalid status rejected", (await a(`/api/admin/applications/${applicationId}`, "PATCH", { status: "INVALID" })).status, 400);
  check("long notes rejected", (await a(`/api/admin/applications/${applicationId}`, "PATCH", { notes: "x".repeat(5001) })).status, 400);
  check("self-demotion blocked", (await a(`/api/admin/users/${admin.id}`, "PATCH", { role: "STUDENT" })).status, 409);
  check("self-delete blocked", (await a(`/api/admin/users/${admin.id}?confirm=true`, "DELETE")).status, 409);
  check("account fields update", (await a(`/api/admin/users/${other.id}`, "PATCH", { name: "Updated QA account", phone: "0000000000" })).status, 200);

  const ids = { universities: university.id, faculties: faculty.id, programs: program.id, users: student.id, applications: applicationId, leads: lead.id, testimonials: testimonial.id, scholarships: scholarship.id };
  const apiRoot = resolve(appDir, "src/app/api/admin");
  for (const file of walk(apiRoot, "route.ts")) {
    const relative = file.slice(apiRoot.length).replace(/\/route\.ts$/, "");
    const section = relative.split("/")[1];
    const path = "/api/admin" + relative.replace("[id]", ids[section] || "missing").replace(/\[[^\]]+\]/g, "missing-child");
    const methods = [...readFileSync(file, "utf8").matchAll(/export async function (GET|POST|PATCH|PUT|DELETE)\(/g)].map((m) => m[1]);
    for (const method of methods) {
      const body = method === "GET" ? undefined : {};
      check(`anonymous ${method} ${relative}`, (await anon(path, method, body)).status, 401);
      check(`student ${method} ${relative}`, (await s(path, method, body)).status, 403);
    }
  }
  console.log("API authorization matrix complete");
  const pageRoot = resolve(appDir, "src/app/[locale]/(admin)/admin");
  for (const locale of ["en", "ar"]) {
    // Matches the existing admin layout, exercising page guards independently.
    const tree = ["", { children: [["locale", locale, "d", null], { children: ["(admin)", { children: ["admin", { children: ["__PAGE__", {}, null, "refetch"] }] }] }] }];
    const headers = { RSC: "1", "Next-Router-State-Tree": encodeURIComponent(JSON.stringify(tree)) };
    for (const file of walk(pageRoot, "page.tsx")) {
      const relative = file.slice(pageRoot.length).replace(/\/page\.tsx$/, "");
      const section = relative.split("/")[1];
      const path = `/${locale}/admin${relative.replace("[id]", ids[section] || "missing")}`;
      for (const [kind, extra] of [["HTML", {}], ["RSC", headers]]) {
        const response = await a(path, "GET", undefined, extra);
        check(`admin ${kind} ${path}`, response.status, 200);
        check(`translations ${kind} ${path}`, /MISSING_MESSAGE|FORMATTING_ERROR/.test(response.text), false);
        check(`no secret ${kind} ${path}`, response.text.includes(hash), false);
        const denied = await s(path, "GET", undefined, extra);
        check(`student ${kind} ${path}`, denied.status === 404 || /NEXT_HTTP_ERROR_FALLBACK;404/.test(denied.text), true);
        check(`student no fixture ${kind} ${path}`, denied.text.includes(tag), false);
        const unsigned = await anon(path, "GET", undefined, extra);
        check(`anonymous ${kind} ${path}`, [302, 303, 307, 308, 401].includes(unsigned.status) || /NEXT_REDIRECT/.test(unsigned.text), true);
      }
    }
    check(`public missing university ${locale}`, (await anon(`/${locale}/universities/does-not-exist-${tag}`)).status, 404);
    const studentPage = await s(`/${locale}/app/applications`);
    check(`student sees own applications ${locale}`, studentPage.status, 200);
    check(`internal notes stay private ${locale}`, studentPage.text.includes("Local QA review note"), false);
  }
  console.log("Bilingual HTML and matching-layout RSC matrix complete");
  check("grant disposable reviewer role", (await a(`/api/admin/users/${other.id}`, "PATCH", { role: "ADMIN" })).status, 200);
  check("role grant effective with existing session", (await o("/api/admin/stats")).status, 200);
  check("revoke disposable reviewer role", (await a(`/api/admin/users/${other.id}`, "PATCH", { role: "STUDENT" })).status, 200);
  check("role revoke immediate with old session", (await o("/api/admin/stats")).status, 403);
  check("revoked role page denied", (await o("/en/admin/users")).status, 404);
  check("delete requires cascade confirmation", (await a(`/api/admin/users/${other.id}`, "DELETE")).status, 409);
  check("confirmed disposable account deletion", (await a(`/api/admin/users/${other.id}?confirm=true`, "DELETE")).status, 200);
  check("deleted account old session denied", [401, 403].includes((await o("/api/admin/stats")).status), true);
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    check("unconfigured upload is 503", (await a("/api/admin/media", "POST", {})).status, 503);
    check("unconfigured deletion is 503", (await a("/api/admin/media", "DELETE", { url: "https://example.invalid/test.png" })).status, 503);
    console.log("REMOTE STORAGE: skipped; project URL/service key absent");
  }
  console.log(JSON.stringify({ assertions, failures }, null, 2));
  if (process.argv.includes("--hold")) {
    console.log("Disposable fixtures available for browser QA:");
    for (const [section, id] of Object.entries(ids)) console.log(`${base}/en/admin/${section}/${id}`);
    console.log("Press Enter to clean up these exact fixtures and finish.");
    const input = createInterface({ input: process.stdin, output: process.stdout });
    await new Promise((resolve) => input.once("line", resolve)); input.close();
  }
} finally {
  if (scholarship) await db.scholarship.deleteMany({ where: { id: scholarship.id } });
  if (testimonial) await db.testimonial.deleteMany({ where: { id: testimonial.id } });
  if (lead) await db.partnershipLead.deleteMany({ where: { id: lead.id } });
  if (university) await db.university.deleteMany({ where: { id: university.id } });
  await db.user.deleteMany({ where: { id: { in: userIds } } });
  console.log("Cleaned up only this run's disposable fixtures.");
  await db.$disconnect();
}
if (failures.length) process.exitCode = 1;
