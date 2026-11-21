import type { Metadata } from "next";
import { CalculatorSection } from "@/components/calculators/CalculatorSection";
import { PageHero } from "@/components/sections/PageHero";

export const metadata: Metadata = {
  title: "Instant Quote",
  description:
    "Get an instant indicative quote for bookkeeping, payroll, year-end accounts and other services. Your price updates as you go.",
  alternates: { canonical: "/instant-quote" },
};

export default function InstantQuotePage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Instant quote", href: "/instant-quote" }]}
        eyebrow="Instant quote"
        title="Your price, in about two minutes."
        lede="Answer a few questions and your price updates as you go. When you're ready, send it to yourself and we'll be in touch."
        primary={{ label: "Start your quote", href: "#calculator" }}
      />
      <CalculatorSection
        calculator="instant-quote"
        source="instant-quote"
        title="Build your quote"
        intro="Choose the services you need. Monthly and one-off fees are shown separately."
        formTitle="Send me this quote"
        formIntro="We'll email you a copy of your quote and get in touch to confirm the details."
      />
    </>
  );
}
