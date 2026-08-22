// Transactional email.
//
// Deliberately dependency-free: it posts to Resend's REST API with the runtime
// `fetch` rather than pulling in an SDK or an SMTP client. Swapping providers
// means rewriting `deliver` below and nothing else — callers only ever see
// `sendEmail`.

type Email = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

export class EmailNotConfiguredError extends Error {
  constructor() {
    super("No email provider is configured (set RESEND_API_KEY and EMAIL_FROM)");
    this.name = "EmailNotConfiguredError";
  }
}

/**
 * Sends one message. Throws on a provider failure so the caller can decide
 * whether that is fatal — password reset, for example, swallows it rather than
 * telling the caller whether the address exists.
 *
 * With no provider configured, development logs the message to the server
 * console instead of sending, so the reset flow is testable without an email
 * account. Production refuses: silently dropping a password-reset mail would
 * look identical to a delivered one.
 */
export async function sendEmail(email: Email): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    if (process.env.NODE_ENV === "production") {
      throw new EmailNotConfiguredError();
    }
    console.info(
      [
        "",
        "──────────── email (dev, not sent) ────────────",
        `to:      ${email.to}`,
        `subject: ${email.subject}`,
        "",
        email.text,
        "───────────────────────────────────────────────",
        "",
      ].join("\n"),
    );
    return;
  }

  await deliver({ apiKey, from, email });
}

async function deliver({
  apiKey,
  from,
  email,
}: {
  apiKey: string;
  from: string;
  email: Email;
}) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [email.to],
      subject: email.subject,
      html: email.html,
      text: email.text,
    }),
    // A hung provider must not hold a request open indefinitely.
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    // The body can echo the recipient address, so keep it out of the message
    // and let the status carry the diagnosis.
    throw new Error(`Email provider rejected the message (${response.status})`);
  }
}
