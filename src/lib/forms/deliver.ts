import "server-only";
import { sendEmail, type OutgoingEmail } from "@/lib/email/send";
import type { EmailStatus } from "@/lib/store/types";

/** Send one email and turn the outcome into a status record for the store. */
export async function deliver(message: OutgoingEmail): Promise<EmailStatus> {
  const r = await sendEmail(message);
  return r.ok
    ? { tag: message.tag ?? "email", ok: true, provider: r.provider, messageId: r.messageId, at: new Date().toISOString() }
    : { tag: message.tag ?? "email", ok: false, reason: r.reason, at: new Date().toISOString() };
}

export const pdfAttachment = (filename: string, bytes: Uint8Array) => ({
  filename,
  content: Buffer.from(bytes).toString("base64"),
  contentType: "application/pdf",
});
