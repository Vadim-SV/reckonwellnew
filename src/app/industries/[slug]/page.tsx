import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { LinkCard } from "@/components/sections/Cards";
import { ContactSection } from "@/components/sections/ContactSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { JsonLd } from "@/components/sections/JsonLd";
import { PageHero } from "@/components/sections/PageHero";
import { industries, industryBySlug } from "@/content/industries";
import { serviceBySlug, type Service } from "@/content/services";
import { site } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const ind = industryBySlug((await params).slug);
  if (!ind) return {};
  return {
    title: ind.metaTitle,
    description: ind.metaDescription,
    alternates: { canonical: `/industries/${ind.slug}` },
    openGraph: { title: ind.metaTitle, description: ind.metaDescription, url: `/industries/${ind.slug}` },
  };
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const ind = industryBySlug((await params).slug);
  if (!ind) notFound();
  const related = ind.services.map(serviceBySlug).filter((s): s is Service => Boolean(s));

  return (
    <>
      <PageHero
        crumbs={[
          { label: "Industries", href: "/industries" },
          { label: ind.name, href: `/industries/${ind.slug}` },
        ]}
        eyebrow={`${ind.name} · Industries`}
        title={ind.title}
        lede={ind.lede}
        primary={{ label: "Talk to us", href: "#get-in-touch" }}
        secondary={{ label: "See our services", href: "#services" }}
        aside={
          <div className="rounded-panel bg-navy p-7 text-cream shadow-float">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-cream/60">What we handle for you</p>
            <ul className="mt-5 space-y-3.5">
              {ind.weHandle.map((w) => (
                <li key={w} className="flex gap-3 leading-relaxed">
                  <Check className="mt-1 size-4 shrink-0 text-steel-light" aria-hidden />
                  {w}
                </li>
              ))}
            </ul>
          </div>
        }
      />

      <Section tone="cream" className="pt-0 sm:pt-0">
        <Container>
          <Reveal className="max-w-2xl">
            <Eyebrow>The finance challenges</Eyebrow>
            <h2 className="mt-4 text-4xl sm:text-5xl">What makes {ind.name.toLowerCase()} finance different</h2>
          </Reveal>
          <div className="mt-12 grid gap-px overflow-hidden rounded-panel border border-hairline bg-[var(--border)] sm:grid-cols-2">
            {ind.challenges.map((c, i) => (
              <Reveal key={c.title} delay={(i % 2) * 0.06} className="bg-cream p-8">
                <h3 className="text-2xl">{c.title}</h3>
                <p className="mt-3 leading-relaxed">{c.text}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="mist" id="services" className="scroll-mt-24">
        <Container>
          <Reveal className="max-w-2xl">
            <Eyebrow>Services</Eyebrow>
            <h2 className="mt-4 text-4xl sm:text-5xl">Most useful for {ind.name.toLowerCase()} businesses</h2>
            <p className="mt-4 text-lg">Each service page has an instant price calculator.</p>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((s) => (
              <LinkCard key={s.slug} href={`/${s.slug}#calculator`} title={s.name} text={s.summary} meta="Get a price" />
            ))}
          </div>
        </Container>
      </Section>

      <FaqSection faqs={ind.faqs} title={`${ind.name}: common questions`} />

      <ContactSection
        source={`industries/${ind.slug}`}
        title={`Let's talk about your ${ind.name.toLowerCase()} business`}
      />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: ind.metaTitle,
          description: ind.metaDescription,
          url: `${site.url}/industries/${ind.slug}`,
          areaServed: { "@type": "Country", name: "United Kingdom" },
          provider: { "@id": `${site.url}/#organisation` },
        }}
      />
    </>
  );
}
