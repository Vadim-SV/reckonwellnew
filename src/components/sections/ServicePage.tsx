import { Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { CalculatorSection } from "@/components/calculators/CalculatorSection";
import { ServiceIllustration } from "@/components/illustrations";
import { ScopingSection } from "@/components/scoping/ScopingSection";
import { serviceBySlug, type Service } from "@/content/services";
import { site } from "@/lib/site";
import { LinkCard } from "./Cards";
import { CtaBand } from "./CtaBand";
import { FaqSection } from "./FaqSection";
import { JsonLd } from "./JsonLd";
import { PageHero } from "./PageHero";

function GoodFitCard({ items }: { items: string[] }) {
  return (
    <div className="rounded-panel border border-hairline bg-white/70 p-7 shadow-card">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">A good fit if</p>
      <ul className="mt-5 space-y-4">
        {items.map((g) => (
          <li key={g} className="flex gap-3 leading-relaxed text-ink">
            <Check className="mt-1 size-4 shrink-0 text-positive" aria-hidden />
            {g}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ServicePage({ service }: { service: Service }) {
  const related = service.related.map(serviceBySlug).filter((s): s is Service => Boolean(s));
  const isScoping = service.tool.kind === "scoping";
  const heroIllustration = service.illustration && service.illustrationPlacement !== "section";
  const sectionIllustration = service.illustration && service.illustrationPlacement === "section";
  return (
    <>
      <PageHero
        crumbs={[
          { label: "Services", href: "/services" },
          { label: service.name, href: service.href },
        ]}
        eyebrow={service.eyebrow}
        title={service.title}
        lede={service.lede}
        primary={{ label: isScoping ? "Scope your requirements" : "Get your price", href: "#calculator" }}
        secondary={{ label: "Book a discovery call", href: "/book" }}
        aside={heroIllustration && service.illustration ? <ServiceIllustration name={service.illustration} depth /> : <GoodFitCard items={service.goodFit} />}
      />

      {service.explanation && (
        <Section tone="cream" className="pt-0 sm:pt-0">
          <Container className="grid gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-20">
            <Reveal className="space-y-5 text-lg leading-relaxed">
              <Eyebrow>How we help</Eyebrow>
              {service.explanation.map((para) => (
                <p key={para.slice(0, 32)}>{para}</p>
              ))}
            </Reveal>
            {heroIllustration && (
              <Reveal delay={0.1}>
                <GoodFitCard items={service.goodFit} />
              </Reveal>
            )}
          </Container>
        </Section>
      )}

      {!service.explanation && heroIllustration && (
        <Section tone="cream" className="pt-0 sm:pt-0">
          <Container>
            <Reveal className="rounded-panel border border-hairline bg-white/70 p-7 shadow-card sm:p-9">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">A good fit if</p>
              <ul className="mt-5 grid gap-x-10 gap-y-4 sm:grid-cols-2">
                {service.goodFit.map((g) => (
                  <li key={g} className="flex gap-3 leading-relaxed text-ink">
                    <Check className="mt-1 size-4 shrink-0 text-positive" aria-hidden />
                    {g}
                  </li>
                ))}
              </ul>
            </Reveal>
          </Container>
        </Section>
      )}

      {sectionIllustration && service.illustration && (
        <Section tone="sand">
          <Container className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-16">
            <Reveal>
              <Eyebrow>Group overview</Eyebrow>
              <h2 className="mt-4 text-4xl sm:text-5xl">{service.illustrationTitle}</h2>
              <p className="mt-5 text-lg leading-relaxed">
                Each company keeps its own reconciled books. Their figures then flow into one overview of the whole group.
              </p>
            </Reveal>
            <ServiceIllustration name={service.illustration} />
          </Container>
        </Section>
      )}

      <Section tone="cream" className={sectionIllustration ? undefined : "pt-0 sm:pt-0"}>
        <Container>
          <Reveal className="max-w-2xl">
            <Eyebrow>What&apos;s included</Eyebrow>
            <h2 className="mt-4 text-4xl sm:text-5xl">What we take care of</h2>
          </Reveal>
          <div
            className={`mt-12 grid gap-px overflow-hidden rounded-panel border border-hairline bg-[var(--border)] sm:grid-cols-2 ${
              service.includes.length % 3 === 0 ? "lg:grid-cols-3" : "lg:grid-cols-4"
            }`}
          >
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

      {service.benefits && (
        <Section tone="navy">
          <Container>
            <Reveal className="max-w-2xl">
              <Eyebrow className="text-cream/60">Why it helps</Eyebrow>
              <h2 className="mt-4 text-4xl sm:text-5xl">What changes for your business</h2>
            </Reveal>
            <div className="mt-12 grid gap-8 sm:grid-cols-3">
              {service.benefits.map((b, i) => (
                <Reveal key={b.title} delay={i * 0.08} className="border-t border-cream/20 pt-6">
                  <h3 className="text-2xl">{b.title}</h3>
                  <p className="mt-3 leading-relaxed text-cream/75">{b.text}</p>
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {service.tool.kind === "calculator" ? (
        <CalculatorSection
          calculator={service.tool.key}
          source={service.slug}
          title={service.calculatorTitle}
          intro={service.calculatorIntro}
        />
      ) : (
        <ScopingSection
          tool={service.tool.key}
          source={service.slug}
          title={service.calculatorTitle}
          intro={service.calculatorIntro}
        />
      )}

      <FaqSection faqs={service.faqs} />

      {related.length > 0 && (
        <Section tone="sand">
          <Container>
            <h2 className="text-3xl">Often combined with</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((r) => (
                <LinkCard key={r.slug} href={r.href} title={r.name} text={r.summary} />
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
          url: `${site.url}${service.href}`,
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
    alternates: { canonical: service.href },
    openGraph: { title: service.metaTitle, description: service.metaDescription, url: service.href },
  };
}
