"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { fieldErrors, partnerSchema, partnerTypes } from "@/lib/forms/schemas";
import { track } from "@/lib/analytics";
import { Consent, Honeypot, SelectField, TextArea, TextField } from "./inputs";

const empty = { firstName: "", lastName: "", email: "", phone: "", organisation: "", partnerType: "", message: "" };

export function PartnerForm() {
  const [values, setValues] = useState(empty);
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [serverError, setServerError] = useState("");
  const [idempotencyKey] = useState(() => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : undefined));

  const update =
    (key: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setValues((v) => ({ ...v, [key]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { ...values, consent, website, idempotencyKey };
    const parsed = partnerSchema.safeParse(payload);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    setErrors({});
    setStatus("sending");
    try {
      const res = await fetch("/api/partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.fields) setErrors(data.fields);
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      setStatus("sent");
      track("partner_enquiry_submitted", { source: "partners" });
    } catch (err) {
      setStatus("error");
      setServerError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="rounded-panel border border-hairline bg-white p-8 text-center">
        <CheckCircle2 className="mx-auto size-10 text-positive" aria-hidden />
        <h3 className="mt-4 text-2xl">Thank you, {values.firstName}.</h3>
        <p className="mx-auto mt-3 max-w-md">We&apos;ve received your enquiry and will be in touch to arrange a short call.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative grid gap-5 sm:grid-cols-2">
      <TextField label="First name" autoComplete="given-name" value={values.firstName} onChange={update("firstName")} error={errors.firstName} />
      <TextField label="Last name" autoComplete="family-name" value={values.lastName} onChange={update("lastName")} error={errors.lastName} />
      <TextField label="Email address" type="email" autoComplete="email" value={values.email} onChange={update("email")} error={errors.email} />
      <TextField label="Phone" type="tel" autoComplete="tel" optional value={values.phone} onChange={update("phone")} error={errors.phone} />
      <TextField
        label="Firm or organisation"
        autoComplete="organization"
        optional
        value={values.organisation}
        onChange={update("organisation")}
        error={errors.organisation}
      />
      <SelectField
        label="Which best describes you?"
        placeholder="Choose one…"
        options={partnerTypes}
        value={values.partnerType}
        onChange={update("partnerType")}
        error={errors.partnerType}
      />
      <TextArea
        className="sm:col-span-2"
        label="Tell us about the clients you work with"
        optional
        placeholder="For example: the size and type of businesses you advise, and how you'd like to work together."
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
          {status === "sending" ? "Sending…" : "Send partner enquiry"}
        </Button>
      </div>
    </form>
  );
}
