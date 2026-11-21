import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { LinkCard } from "@/components/sections/Cards";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { services } from "@/content/services";

export const metadata: Metadata = {
  title: "Accounting & Financial Operations Services",
  description:
    "Outsourced finance team, bookkeeping, payroll, VAT, annual accounts, Self Assessment, Making Tax Digital and R&D tax relief — each with an instant price calculator.",
  alternates: { canonical: "/services" },
};

const groups = [
  { key: "operations", title: "Financial operations", text: "Ongoing monthly work that keeps your finance function running." },
  { key: "compliance", title: "Accounting & compliance", text: "Returns and filings, available on their own or alongside ongoing support." },
] as const;

export default function ServicesPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Services", href: "/services" }]}
        eyebrow="Services"
        title="Everything your finance function needs."
        lede="Take one service or hand us the whole finance function. Every service has its own instant price calculator, so you can see what it costs before we speak."
        primary={{ label: "Get an instant quote", href: "/instant-quote" }}
        secondary={{ label: "Talk to us", href: "/contact" }}
      />
      {groups.map((g, gi) => (
        <Section key={g.key} tone={gi === 0 ? "sand" : "cream"}>
          <Container>
            <Reveal className="max-w-2xl">
              <h2 className="text-4xl">{g.title}</h2>
              <p className="mt-3 text-lg">{g.text}</p>
            </Reveal>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services
                .filter((s) => s.category === g.key)
                .map((s, i) => (
                  <Reveal key={s.slug} delay={(i % 3) * 0.05}>
                    <LinkCard href={`/${s.slug}`} title={s.name} text={s.summary} meta="Includes a price calculator" />
                  </Reveal>
                ))}
            </div>
          </Container>
        </Section>
      ))}
      <CtaBand />
    </>
  );
}
