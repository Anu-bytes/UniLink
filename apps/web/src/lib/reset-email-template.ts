// Markup for the reset-code email. Kept apart from the sending code so the
// wording can change without touching delivery.

/** Escapes text that goes into the HTML body. Names come from user input. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function resetCodeEmail({
  code,
  name,
  minutes,
}: {
  code: string;
  name: string | null;
  minutes: number;
}): { html: string; text: string } {
  const greeting = name ? `Hi ${name},` : "Hi,";

  const text = [
    greeting,
    "",
    `Your UniLink password reset code is ${code}.`,
    `It expires in ${minutes} minutes and can be used once.`,
    "",
    "If you did not ask to reset your password, you can ignore this email — your password will not change.",
    "",
    "UniLink",
  ].join("\n");

  // Table layout and inline styles: email clients are not browsers.
  const html = `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#f5f8ff;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f8ff;padding:32px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:16px;padding:32px;">
            <tr>
              <td style="font-size:16px;color:#1f2a44;">
                <p style="margin:0 0 16px;">${escapeHtml(greeting)}</p>
                <p style="margin:0 0 24px;">Use this code to reset your UniLink password.</p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:8px 0 24px;">
                <div style="display:inline-block;background:#eef3ff;border-radius:12px;padding:16px 28px;font-size:32px;font-weight:bold;letter-spacing:8px;color:#1e6deb;">${escapeHtml(code)}</div>
              </td>
            </tr>
            <tr>
              <td style="font-size:14px;color:#5a6072;">
                <p style="margin:0 0 12px;">It expires in ${minutes} minutes and can be used once.</p>
                <p style="margin:0 0 24px;">If you did not ask to reset your password, you can ignore this email — your password will not change.</p>
                <p style="margin:0;color:#98a0b4;">UniLink</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { html, text };
}
