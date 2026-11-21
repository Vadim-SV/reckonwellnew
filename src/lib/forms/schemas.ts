import { z } from "zod";

const trimmed = (max: number) => z.string().trim().max(max);

export const contactSchema = z.object({
  name: trimmed(120).min(2, "Please enter your name"),
  email: z.string().trim().email("Please enter a valid email address").max(200),
  phone: trimmed(40).optional().default(""),
  company: trimmed(160).optional().default(""),
  message: trimmed(4000).optional().default(""),
  consent: z.literal(true, { message: "Please confirm we can contact you" }),
});

export const enquirySchema = z.object({
  /** Page the enquiry came from, e.g. "bookkeeping-services". */
  source: trimmed(80).regex(/^[a-z0-9-/]*$/),
  /** Optional calculator inputs — the server recalculates the estimate. */
  calculator: z
    .object({ key: trimmed(40), inputs: z.record(z.string(), z.unknown()) })
    .optional(),
  contact: contactSchema,
  /** Honeypot: real visitors never fill this in. The route quietly drops filled-in submissions. */
  website: z.string().max(500).optional().default(""),
});

export const partnerTypes = [
  "Accountancy practice",
  "Tax adviser",
  "Business consultant",
  "Professional introducer",
  "Outsourced bookkeeping partnership",
  "Other",
] as const;

export const partnerSchema = z.object({
  firstName: trimmed(80).min(1, "Please enter your first name"),
  lastName: trimmed(80).min(1, "Please enter your last name"),
  email: z.string().trim().email("Please enter a valid email address").max(200),
  phone: trimmed(40).optional().default(""),
  organisation: trimmed(160).optional().default(""),
  partnerType: z.enum(partnerTypes, { message: "Please choose the option that fits best" }),
  message: trimmed(4000).optional().default(""),
  consent: z.literal(true, { message: "Please confirm we can contact you" }),
  website: z.string().max(500).optional().default(""),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type EnquiryInput = z.infer<typeof enquirySchema>;
export type PartnerInput = z.infer<typeof partnerSchema>;

/** Flatten zod issues to { field: message } for form display. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[issue.path.length - 1];
    if (typeof key === "string" && !out[key]) out[key] = issue.message;
  }
  return out;
}
