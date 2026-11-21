import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { LinkCard } from "@/components/sections/Cards";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { industries } from "@/content/industries";

export const metadata: Metadata = {
  title: "Industries We Support",
  description:
    "Outsourced bookkeeping and finance support built around technology, e-commerce, property, manufacturing and hospitality businesses.",
  alternates: { canonical: "/industries" },
};

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Industries", href: "/industries" }]}
        eyebrow="Industries"
        title="Built around how your business works."
        lede="Every sector has its own finance pressure points — from marketplace payouts to stock valuation and tips. We set up your books and reporting around yours."
      />
      <Section tone="sand">
        <Container className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((ind, i) => (
            <Reveal key={ind.slug} delay={(i % 3) * 0.05}>
              <LinkCard href={`/industries/${ind.slug}`} title={ind.name} text={ind.summary} />
            </Reveal>
          ))}
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
