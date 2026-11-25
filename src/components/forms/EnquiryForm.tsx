"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { contactSchema, fieldErrors } from "@/lib/forms/schemas";
import { track } from "@/lib/analytics";
import type { CalculatorKey } from "@/lib/pricing/registry";
import type { ScopingKey } from "@/lib/scoping/registry";
import { Consent, Honeypot, TextArea, TextField } from "./inputs";

type Props = {
  source: string;
  calculator?: { key: CalculatorKey | ScopingKey; inputs: Record<string, unknown> };
  submitLabel?: string;
  messagePlaceholder?: string;
};

const empty = { name: "", email: "", phone: "", company: "", message: "" };

export function EnquiryForm({ source, calculator, submitLabel = "Send enquiry", messagePlaceholder }: Props) {
  const [values, setValues] = useState(empty);
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [serverError, setServerError] = useState("");
  const [reference, setReference] = useState("");
  // One key per form: if the request is retried or double-submitted, the server recognises it.
  const [idempotencyKey] = useState(() => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : undefined));

  const update = (key: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const contact = { ...values, consent };
    const parsed = contactSchema.safeParse(contact);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    setErrors({});
    setStatus("sending");
    setServerError("");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source, calculator, contact, website, idempotencyKey }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.fields) setErrors(data.fields);
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      setReference(typeof data.reference === "string" ? data.reference : "");
      setStatus("sent");
      if (calculator) track("calculator_completed", { source, tool: calculator.key });
      track(
        source === "instant-quote" ? "instant_quote_submitted" : source === "startups" ? "startup_enquiry_submitted" : "contact_form_submitted",
        { source },
      );
    } catch (err) {
      setStatus("error");
      setServerError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="rounded-panel border border-hairline bg-white p-8 text-center">
        <CheckCircle2 className="mx-auto size-10 text-positive" aria-hidden />
        <h3 className="mt-4 text-2xl">Thank you — we&apos;ve got your details.</h3>
        <p className="mx-auto mt-3 max-w-md text-body">
          We&apos;ll email a confirmation to {values.email}
          {calculator ? ", with a PDF copy of your details" : ""}. We&apos;ll be in touch shortly.
        </p>
        {reference && <p className="mt-3 text-sm text-muted">Your reference: <strong className="text-ink">{reference}</strong></p>}
        <a href="/book" className="mt-6 inline-flex min-h-11 items-center bg-navy px-5 text-sm font-medium text-cream hover:bg-navy-deep">
          Book a discovery call
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative grid grid-cols-1 gap-5 sm:grid-cols-2">
      <TextField label="Your name" name="name" autoComplete="name" value={values.name} onChange={update("name")} error={errors.name} />
      <TextField
        label="Email address"
        name="email"
        type="email"
        autoComplete="email"
        value={values.email}
        onChange={update("email")}
        error={errors.email}
      />
      <TextField
        label="Phone"
        name="phone"
        type="tel"
        autoComplete="tel"
        optional
        value={values.phone}
        onChange={update("phone")}
        error={errors.phone}
      />
      <TextField
        label="Company"
        name="company"
        autoComplete="organization"
        optional
        value={values.company}
        onChange={update("company")}
        error={errors.company}
      />
      <TextArea
        className="sm:col-span-2"
        label="How can we help?"
        name="message"
        optional
        placeholder={messagePlaceholder ?? "Tell us a little about your business and what you need."}
        value={values.message}
        onChange={update("message")}
        error={errors.message}
      />
      <div className="sm:col-span-2">
        <Consent checked={consent} onChange={setConsent} error={errors.consent} />
      </div>
      <Honeypot value={website} onChange={setWebsite} />
      {status === "error" && (
        <p role="alert" className="text-sm text-negative sm:col-span-2">
          {serverError}
        </p>
      )}
      <div className="sm:col-span-2">
        <Button type="submit" size="lg" disabled={status === "sending"} className="w-full sm:w-auto">
          {status === "sending" ? "Sending…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
