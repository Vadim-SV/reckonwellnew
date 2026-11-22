import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { LinkCard } from "@/components/sections/Cards";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { serviceGroups, services } from "@/content/services";

export const metadata: Metadata = {
  title: "Accounting & Financial Operations Services",
  description:
    "Finance outsourcing for SMEs: bookkeeping, accounts payable, credit control, management accounts, payroll, VAT and year-end — each with its own calculator.",
  alternates: { canonical: "/services" },
};


export default function ServicesPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Services", href: "/services" }]}
        eyebrow="Services"
        title="Everything your finance team needs."
        lede="Take one service or hand us all of your day-to-day finance work. Every service has its own calculator or requirements tool, so you can see what's involved before we speak."
        primary={{ label: "Get an instant quote", href: "/instant-quote" }}
        secondary={{ label: "Talk to us", href: "/contact" }}
      />
      {serviceGroups.map((g, gi) => (
        <Section key={g.key} tone={gi % 2 === 0 ? "sand" : "cream"}>
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
                    <LinkCard
                      href={s.href}
                      title={s.name}
                      text={s.summary}
                      meta={s.tool.kind === "calculator" ? "Includes a price calculator" : "Includes a requirements tool"}
                    />
                  </Reveal>
                ))}
              {g.key === "support" && (
                <Reveal delay={0.1}>
                  <LinkCard href="/startups" title="Startups" text="Founder's Launch Offer: start with the finances in order." meta="For new businesses" />
                </Reveal>
              )}
            </div>
          </Container>
        </Section>
      ))}
      <CtaBand />
    </>
  );
}
