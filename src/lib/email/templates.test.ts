import { describe, expect, it } from "vitest";
import { safeEstimate } from "@/lib/pricing/registry";
import { enquiryAcknowledgementEmail, enquiryInternalEmail, partnerInternalEmail } from "./templates";

const contact = {
  name: "Eve <img src=x onerror=alert(1)>",
  email: "eve@example.com",
  phone: "",
  company: "Acme <b>Ltd</b>",
  message: "Hello <script>alert(1)</script>",
  consent: true as const,
};

describe("email templates", () => {
  it("escapes user input in the internal email", () => {
    const { html } = enquiryInternalEmail({ contact, sourceLabel: "VAT returns" });
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("<img src=x");
    expect(html).toContain("&lt;script&gt;");
  });

  it("includes the server-calculated estimate", () => {
    const r = safeEstimate("vat", { returnsPerYear: 4, registration: true });
    if (!r.ok) throw new Error("estimate failed");
    const { html } = enquiryAcknowledgementEmail({ contact, sourceLabel: "VAT returns", estimate: r.estimate });
    expect(html).toContain("£50");
    expect(html).toContain("VAT registration assistance");
  });

  it("sends no figures to the customer when pricing is manual", () => {
    const r = safeEstimate("rd-fee", { rdSpend: 0, hasPatents: false, firstTime: false, ongoing: true });
    if (!r.ok) throw new Error("estimate failed");
    const { html } = enquiryAcknowledgementEmail({ contact, sourceLabel: "R&D tax relief", estimate: r.estimate });
    expect(html).not.toContain("£400");
    expect(html).toContain("priced individually");
  });

  it("escapes partner enquiries", () => {
    const { html } = partnerInternalEmail({
      firstName: "<b>Ann</b>",
      lastName: "Lee",
      email: "ann@example.com",
      phone: "",
      organisation: "",
      partnerType: "Tax adviser",
      message: "",
      consent: true,
      website: "",
    });
    expect(html).not.toContain("<b>Ann</b>");
  });
});
