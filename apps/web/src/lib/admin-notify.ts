// Tells the super admins a new demo request or representative application
// arrived. The console always shows it (the bell, the "Requests" badge, the
// admin bar); this adds an email when an email provider is configured.
//
// Best effort by design: it runs after the applicant already got their
// answer, and a mail failure is logged, never surfaced to them.

import { sendEmail } from "@/lib/email";
import type { PartnerRequestKind } from "@/lib/partner-requests";
import { prisma } from "@/lib/prisma";

/** Everything below came from a public form: escape before it goes in HTML. */
function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Keeps a header line to one line: no CR/LF from the form ends up in a subject. */
function oneLine(value: string, max = 120) {
  return value.replace(/[\r\n]+/g, " ").slice(0, max);
}

export async function notifyAdminsOfPartnerRequest(request: {
  id: string;
  type: PartnerRequestKind;
  fullName: string;
  email: string;
  universityName: string;
  jobTitle: string;
}) {
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) return;

  const admins = await prisma.user.findMany({
    where: { role: "ADMIN", status: "ACTIVE" },
    select: { email: true },
    take: 20,
  });
  if (!admins.length) return;

  const kind = request.type === "DEMO" ? "Demo request" : "University representative application";
  // From configuration, never from the request's Host header, which a caller
  // controls: the link must not be steerable to another site.
  const site = process.env.SITE_URL?.replace(/\/+$/, "");
  const link = site ? `${site}/en/admin/requests/${encodeURIComponent(request.id)}` : null;
  const subject = oneLine(`New ${kind.toLowerCase()}: ${request.universityName}`);
  const lines = [
    `${kind} from ${request.fullName} (${request.jobTitle}), ${request.universityName}.`,
    `Reply to: ${request.email}`,
    link ? `Review it: ${link}` : "Review it under Requests in the admin console.",
  ];

  const html = `<p><strong>${escapeHtml(kind)}</strong></p>
<p>${escapeHtml(request.fullName)} (${escapeHtml(request.jobTitle)})<br>${escapeHtml(request.universityName)}<br>${escapeHtml(request.email)}</p>
<p>${link ? `<a href="${escapeHtml(link)}">Review it in the admin console</a>` : "Review it under Requests in the admin console."}</p>`;

  const results = await Promise.allSettled(
    admins.map((admin) => sendEmail({ to: admin.email, subject, html, text: lines.join("\n") })),
  );
  const failed = results.filter((result) => result.status === "rejected").length;
  if (failed) console.error(`Partner request ${request.id}: ${failed} admin notification email(s) failed`);
}
