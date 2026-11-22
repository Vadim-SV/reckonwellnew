import type { Metadata } from "next";
import { ContactSection } from "@/components/sections/ContactSection";
import { PageHero } from "@/components/sections/PageHero";

export const metadata: Metadata = {
  title: "Contact Our London Finance Team",
  description: "Get in touch with Reckonwell about outsourced bookkeeping, finance operations and compliance. 124 City Road, London EC1V 2NX.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Contact", href: "/contact" }]}
        eyebrow="Contact"
        title="Let's talk about your finance team."
        lede="Tell us where your finance team is stretched and what you'd like to hand over. We'll come back to you to arrange a short call."
      />
      <ContactSection source="contact" tone="sand" />
    </>
  );
}
