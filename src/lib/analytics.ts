/**
 * Conversion events, prepared for Google Analytics 4 (gtag) or Google Tag Manager.
 *
 * Nothing is sent unless an analytics tag has been loaded on the page — and
 * that should only happen once a visitor has consented (see
 * docs/launch-readiness.md). Events carry ONLY the event name, the page/tool
 * identifier and a reference-free outcome: never names, emails, phone numbers,
 * messages or financial inputs.
 */
export type ConversionEvent =
  | "calculator_completed"
  | "contact_form_submitted"
  | "instant_quote_submitted"
  | "booking_completed"
  | "booking_requested"
  | "partner_enquiry_submitted"
  | "startup_enquiry_submitted";

type SafeParams = { source?: string; tool?: string; mode?: string };

declare global {
  interface Window {
    gtag?: (command: "event", name: string, params?: Record<string, string>) => void;
    dataLayer?: Record<string, unknown>[];
  }
}

export function track(event: ConversionEvent, params: SafeParams = {}) {
  if (typeof window === "undefined") return;
  const clean: Record<string, string> = {};
  for (const [k, v] of Object.entries(params)) if (typeof v === "string" && v.length <= 60) clean[k] = v;
  try {
    if (typeof window.gtag === "function") window.gtag("event", event, clean);
    else if (Array.isArray(window.dataLayer)) window.dataLayer.push({ event, ...clean });
  } catch {
    // Analytics must never break a form.
  }
}
