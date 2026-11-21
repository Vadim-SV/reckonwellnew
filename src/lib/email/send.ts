import "server-only";

/**
 * Transactional email. Uses Resend if RESEND_API_KEY is set, otherwise Brevo
 * if BREVO_API_KEY is set (the provider the current site uses). With neither,
 * emails are logged in development and the send fails in production so that
 * enquiries are never silently lost.
 */
export type OutgoingEmail = {
  to: { email: string; name?: string };
  subject: string;
  html: string;
  replyTo?: { email: string; name?: string };
};

export type SendResult = { ok: true; provider: string } | { ok: false; reason: string };

const fromAddress = () => process.env.EMAIL_FROM_ADDRESS || "vadim.s@reckonwell.com";
const fromName = () => process.env.EMAIL_FROM_NAME || "Reckonwell";

export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY || process.env.BREVO_API_KEY);
}

export async function sendEmail(message: OutgoingEmail): Promise<SendResult> {
  if (process.env.RESEND_API_KEY) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: `${fromName()} <${fromAddress()}>`,
        to: [message.to.email],
        subject: message.subject,
        html: message.html,
        reply_to: message.replyTo?.email,
      }),
    });
    return res.ok ? { ok: true, provider: "resend" } : { ok: false, reason: `resend ${res.status}` };
  }

  if (process.env.BREVO_API_KEY) {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": process.env.BREVO_API_KEY, "Content-Type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        sender: { email: fromAddress(), name: fromName() },
        to: [message.to],
        subject: message.subject,
        htmlContent: message.html,
        replyTo: message.replyTo,
      }),
    });
    return res.ok ? { ok: true, provider: "brevo" } : { ok: false, reason: `brevo ${res.status}` };
  }

  if (process.env.NODE_ENV !== "production") {
    console.info(`[email:dev] To: ${message.to.email} | ${message.subject}`);
    return { ok: true, provider: "dev-log" };
  }
  return { ok: false, reason: "no email provider configured" };
}

export const internalRecipient = () => process.env.EMAIL_INTERNAL_TO || "vadim.s@reckonwell.com";
