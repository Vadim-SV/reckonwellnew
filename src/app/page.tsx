import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { TrustStrip } from "@/components/trust/TrustStrip";
import { ctaNav } from "@/lib/navigation";

/*
 * Stage 1 foundation homepage: establishes layout, type, colour and the
 * preserved trust strip. The full homepage with animated financial
 * illustrations is Stage 3 (see docs/project-plan.md).
 */

const workWeHandle = [
  "Bookkeeping",
  "Bank reconciliations",
  "Accounts payable",
  "Accounts receivable",
  "Credit control",
  "Monthly management accounts",
  "Financial reporting",
  "Financial controls",
  "Accounting software",
  "Group company accounting",
];

const journey = ["Startup", "Growing business", "Established company", "Group of companies"];

export default function HomePage() {
  return (
    <>
      <Section spacing="lg" className="relative overflow-hidden pt-12 sm:pt-20">
        <Container className="text-center">
          <div className="rise" style={{ animationDelay: "0ms" }}>
            <Eyebrow>Outsourced bookkeeping &amp; financial operations · London</Eyebrow>
          </div>
          <div className="rise" style={{ animationDelay: "60ms" }}>
            <h1 className="mx-auto mt-6 max-w-4xl text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">
              Run your business.
              <br />
              <em className="text-navy">We&apos;ll look after the finances.</em>
            </h1>
          </div>
          <div className="rise" style={{ animationDelay: "120ms" }}>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-body">
              We handle the bookkeeping, reporting and day-to-day financial work for growing UK
              businesses — so you can get on with running yours.
            </p>
          </div>
          <div className="rise" style={{ animationDelay: "180ms" }}>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ButtonLink href={ctaNav.book.href} size="lg">
                {ctaNav.book.label}
              </ButtonLink>
              <ButtonLink href={ctaNav.quote.href} variant="secondary" size="lg">
                Get an instant quote
              </ButtonLink>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="sand" spacing="sm" aria-label="Certifications and partners">
        <Container>
          <TrustStrip />
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <Eyebrow>What we look after</Eyebrow>
            <h2 className="mt-4 text-4xl leading-tight sm:text-5xl">
              The day-to-day finance work, done properly every month.
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-relaxed">
              From the first invoice to a group of companies, we keep your numbers accurate, your
              suppliers paid on time and your reporting ready when you need it.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="grid gap-px overflow-hidden rounded-card border border-hairline bg-[var(--border)] sm:grid-cols-2">
              {workWeHandle.map((item) => (
                <li key={item} className="bg-cream px-5 py-4 text-[15px] text-ink">
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </Section>

      <Section tone="navy">
        <Container>
          <Reveal>
            <Eyebrow className="text-cream/60">Support as you grow</Eyebrow>
            <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {journey.map((stage, i) => (
                <li key={stage} className="border-t border-cream/20 pt-5">
                  <span className="tabular text-sm text-cream/50">0{i + 1}</span>
                  <p className="mt-2 font-display text-2xl text-cream">{stage}</p>
                </li>
              ))}
            </ol>
            <div className="mt-12">
              <ButtonLink href={ctaNav.book.href} variant="light">
                Talk to us about your business <ArrowRight className="size-4" aria-hidden />
              </ButtonLink>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
