import { Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { CalculatorSection } from "@/components/calculators/CalculatorSection";
import { serviceBySlug, type Service } from "@/content/services";
import { site } from "@/lib/site";
import { LinkCard } from "./Cards";
import { CtaBand } from "./CtaBand";
import { FaqSection } from "./FaqSection";
import { JsonLd } from "./JsonLd";
import { PageHero } from "./PageHero";

export function ServicePage({ service }: { service: Service }) {
  const related = service.related.map(serviceBySlug).filter((s): s is Service => Boolean(s));
  return (
    <>
      <PageHero
        crumbs={[
          { label: "Services", href: "/services" },
          { label: service.name, href: `/${service.slug}` },
        ]}
        eyebrow={service.eyebrow}
        title={service.title}
        lede={service.lede}
        primary={{ label: "Get your price", href: "#calculator" }}
        secondary={{ label: "Talk to us", href: "#get-in-touch" }}
        aside={
          <div className="rounded-panel border border-hairline bg-white/70 p-7 shadow-card">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">A good fit if</p>
            <ul className="mt-5 space-y-4">
              {service.goodFit.map((g) => (
                <li key={g} className="flex gap-3 leading-relaxed text-ink">
                  <Check className="mt-1 size-4 shrink-0 text-positive" aria-hidden />
                  {g}
                </li>
              ))}
            </ul>
          </div>
        }
      />

      <Section tone="cream" className="pt-0 sm:pt-0">
        <Container>
          <Reveal className="max-w-2xl">
            <Eyebrow>What&apos;s included</Eyebrow>
            <h2 className="mt-4 text-4xl sm:text-5xl">What we take care of</h2>
          </Reveal>
          <div className="mt-12 grid gap-px overflow-hidden rounded-panel border border-hairline bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-3">
            {service.includes.map((item, i) => (
              <Reveal key={item.title} delay={(i % 3) * 0.06} className="bg-cream p-7">
                <h3 className="text-2xl">{item.title}</h3>
                <p className="mt-3 leading-relaxed">{item.text}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="mist">
        <Container>
          <Reveal className="max-w-2xl">
            <Eyebrow>How it works</Eyebrow>
            <h2 className="mt-4 text-4xl sm:text-5xl">Getting started is simple</h2>
          </Reveal>
          <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {service.steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.08}>
                <li className="h-full border-t-2 border-navy pt-6">
                  <span className="tabular font-display text-4xl text-navy">{i + 1}</span>
                  <h3 className="mt-3 text-xl">{s.title}</h3>
                  <p className="mt-2 leading-relaxed">{s.text}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </Container>
      </Section>

      <CalculatorSection
        calculator={service.calculator}
        source={service.slug}
        title={service.calculatorTitle}
        intro={service.calculatorIntro}
      />

      <FaqSection faqs={service.faqs} />

      {related.length > 0 && (
        <Section tone="sand">
          <Container>
            <h2 className="text-3xl">Often combined with</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((r) => (
                <LinkCard key={r.slug} href={`/${r.slug}`} title={r.name} text={r.summary} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      <CtaBand />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: service.name,
          serviceType: service.eyebrow,
          description: service.metaDescription,
          url: `${site.url}/${service.slug}`,
          areaServed: { "@type": "Country", name: "United Kingdom" },
          provider: { "@id": `${site.url}/#organisation` },
        }}
      />
    </>
  );
}

export function serviceMetadata(service: Service) {
  return {
    title: service.metaTitle,
    description: service.metaDescription,
    alternates: { canonical: `/${service.slug}` },
    openGraph: { title: service.metaTitle, description: service.metaDescription, url: `/${service.slug}` },
  };
}
