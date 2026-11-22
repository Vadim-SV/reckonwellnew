import "server-only";

/**
 * Transactional email.
 *
 * Provider order: Brevo (BREVO_API_KEY — the provider the current site
 * already uses), then Resend (RESEND_API_KEY). With neither, emails are
 * logged in development and the send fails in production, so an enquiry is
 * never silently lost.
 *
 * A successful result means the provider ACCEPTED the message for delivery —
 * not that it reached the inbox. Each attempt is logged with the provider's
 * message ID so delivery can be traced in the provider's dashboard.
 */
export type EmailAttachment = {
  filename: string;
  /** Base64-encoded file content. */
  content: string;
  contentType: string;
};

export type OutgoingEmail = {
  to: { email: string; name?: string };
  subject: string;
  html: string;
  replyTo?: { email: string; name?: string };
  attachments?: EmailAttachment[];
  /** Short label for logs, e.g. "enquiry.internal". Never includes personal data. */
  tag?: string;
};

export type SendResult =
  | { ok: true; provider: "brevo" | "resend" | "dev-log"; messageId?: string }
  | { ok: false; reason: string };

const fromAddress = () => process.env.EMAIL_FROM_ADDRESS || "vadim.s@reckonwell.com";
const fromName = () => process.env.EMAIL_FROM_NAME || "Reckonwell";
export const internalRecipient = () => process.env.EMAIL_INTERNAL_TO || "vadim.s@reckonwell.com";

export function emailProvider(): "brevo" | "resend" | "none" {
  if (process.env.BREVO_API_KEY) return "brevo";
  if (process.env.RESEND_API_KEY) return "resend";
  return "none";
}

export const emailConfigured = () => emailProvider() !== "none";

function log(result: SendResult, message: OutgoingEmail) {
  // Recipient domain only — no full addresses or content in logs.
  const domain = message.to.email.split("@")[1] ?? "?";
  const tag = message.tag ?? "email";
  if (result.ok) console.info(`[email] ${tag} accepted by ${result.provider} (to @${domain}) id=${result.messageId ?? "-"}`);
  else console.error(`[email] ${tag} FAILED (to @${domain}): ${result.reason}`);
}

async function sendBrevo(message: OutgoingEmail): Promise<SendResult> {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": process.env.BREVO_API_KEY as string, "Content-Type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: { email: fromAddress(), name: fromName() },
      to: [message.to],
      subject: message.subject,
      htmlContent: message.html,
      replyTo: message.replyTo,
      attachment: message.attachments?.map((a) => ({ name: a.filename, content: a.content })),
      tags: message.tag ? [message.tag] : undefined,
    }),
  });
  if (!res.ok) return { ok: false, reason: `brevo ${res.status} ${(await res.text().catch(() => "")).slice(0, 200)}` };
  const data = (await res.json().catch(() => ({}))) as { messageId?: string };
  return { ok: true, provider: "brevo", messageId: data.messageId };
}

async function sendResend(message: OutgoingEmail): Promise<SendResult> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: `${fromName()} <${fromAddress()}>`,
      to: [message.to.email],
      subject: message.subject,
      html: message.html,
      reply_to: message.replyTo?.email,
      attachments: message.attachments?.map((a) => ({ filename: a.filename, content: a.content, content_type: a.contentType })),
    }),
  });
  if (!res.ok) return { ok: false, reason: `resend ${res.status} ${(await res.text().catch(() => "")).slice(0, 200)}` };
  const data = (await res.json().catch(() => ({}))) as { id?: string };
  return { ok: true, provider: "resend", messageId: data.id };
}

export async function sendEmail(message: OutgoingEmail): Promise<SendResult> {
  let result: SendResult;
  try {
    const provider = emailProvider();
    if (provider === "brevo") result = await sendBrevo(message);
    else if (provider === "resend") result = await sendResend(message);
    else if (process.env.NODE_ENV !== "production") {
      const files = message.attachments?.map((a) => a.filename).join(", ");
      console.info(`[email:dev] To: ${message.to.email} | ${message.subject}${files ? ` | attachments: ${files}` : ""}`);
      result = { ok: true, provider: "dev-log" };
    } else result = { ok: false, reason: "no email provider configured" };
  } catch (err) {
    result = { ok: false, reason: err instanceof Error ? err.message : "network error" };
  }
  if (result.ok && result.provider !== "dev-log") log(result, message);
  if (!result.ok) log(result, message);
  return result;
}
