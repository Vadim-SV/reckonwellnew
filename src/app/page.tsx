import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { TrustStrip } from "@/components/trust/TrustStrip";
import { BooksDashboard } from "@/components/illustrations/BooksDashboard";
import { CalculatorSection } from "@/components/calculators/CalculatorSection";
import { LinkCard } from "@/components/sections/Cards";
import { FaqSection } from "@/components/sections/FaqSection";
import { CtaBand } from "@/components/sections/CtaBand";
import { industries } from "@/content/industries";
import { services } from "@/content/services";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Outsourced Finance Team & Bookkeeping for Established Companies | Reckonwell" },
  description:
    "Extend your finance team without hiring. Reckonwell manages bookkeeping, accounts payable, credit control, payroll and monthly reporting for established UK companies.",
  alternates: { canonical: "/" },
};

const hiringProblems = [
  {
    title: "Recruiting takes months",
    text: "Finding, interviewing and onboarding an experienced bookkeeper can take a quarter — while the backlog grows.",
  },
  {
    title: "Salary is only the start",
    text: "Employer National Insurance, pension, software, training and management time all add to the true cost of a hire.",
  },
  {
    title: "One person is a single point of failure",
    text: "Holidays, sickness and resignations leave the books stuck. With us, the work carries on regardless.",
  },
  {
    title: "The workload doesn't fit neat roles",
    text: "You may need more than one person can do, but less than two. We scale with the work, month by month.",
  },
];

const handover = [
  { area: "Bookkeeping & bank reconciliations", href: "/bookkeeping-services" },
  { area: "Accounts payable & supplier payment runs", href: "/outsourced-financial-operations" },
  { area: "Invoicing & credit control", href: "/outsourced-financial-operations" },
  { area: "Payroll, RTI & pensions", href: "/payroll-services" },
  { area: "VAT returns", href: "/vat-returns" },
  { area: "Monthly management accounts", href: "/outsourced-financial-operations" },
  { area: "Year-end accounts & Corporation Tax", href: "/annual-accounts-ct600" },
  { area: "Group and multi-entity accounting", href: "/outsourced-financial-operations" },
];

const steps = [
  {
    title: "We map your finance work",
    text: "A short call to understand what your team does today, where it's stretched and what you'd like to hand over.",
  },
  {
    title: "A clear monthly fee",
    text: "A fixed monthly proposal based on your volumes. No hourly billing and no long contract.",
  },
  {
    title: "We take over in two to three weeks",
    text: "We get access to your software and bank feeds, collect what we need and handle the switch from anyone else involved.",
  },
  {
    title: "Your books run every month",
    text: "Transactions coded, accounts reconciled, suppliers paid and a monthly report in your inbox — with a named contact to call.",
  },
];

const faqs = [
  {
    question: "Do we have to replace our current finance team?",
    answer:
      "No. Most of our clients keep their finance manager or finance director and hand us the volume work. Others ask us to act as their whole finance function. We work alongside whoever you already have.",
  },
  {
    question: "How long does it take to hand over?",
    answer:
      "Usually two to three weeks. We arrange access to your accounting software and bank feeds, review where the books are today and handle the switch from your previous bookkeeper or accountant.",
  },
  {
    question: "Which software do you use?",
    answer:
      "We work mainly in Xero and QuickBooks. If you use something else, we'll advise whether to stay or move, and can set up and train your team.",
  },
  {
    question: "Is there a contract?",
    answer: "No. We work on a rolling monthly basis and you can cancel at any time.",
  },
  {
    question: "Who will we actually deal with?",
    answer:
      "A named contact who knows your business. You can reach us by email or phone, and you won't be passed around a call centre.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-24">
        <Container className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <div className="rise">
              <Eyebrow>Outsourced finance team · London, UK-wide</Eyebrow>
            </div>
            <h1 className="rise mt-6 text-5xl leading-[1.04] sm:text-6xl xl:text-7xl" style={{ animationDelay: "60ms" }}>
              Grow your finance team.
              <br />
              <em className="text-navy">Skip the hiring.</em>
            </h1>
            <p className="rise mt-7 max-w-xl text-lg leading-relaxed" style={{ animationDelay: "120ms" }}>
              When the finance workload outgrows your team, hand us the books. We run your bookkeeping, payables,
              receivables, payroll and monthly reporting — for a fixed monthly fee, with no recruitment and no
              long contract.
            </p>
            <div className="rise mt-10 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "180ms" }}>
              <ButtonLink href="#calculator" size="lg">
                Compare the cost of hiring
              </ButtonLink>
              <ButtonLink href="/contact" variant="secondary" size="lg">
                Talk to us
              </ButtonLink>
            </div>
          </div>
          <div className="rise" style={{ animationDelay: "220ms" }}>
            <BooksDashboard />
          </div>
        </Container>
      </section>

      <Section tone="sand" spacing="sm" aria-label="Certifications and partners">
        <Container>
          <TrustStrip />
        </Container>
      </Section>

      {/* Why not hire */}
      <Section>
        <Container>
          <Reveal className="max-w-3xl">
            <Eyebrow>Why companies outsource instead of hiring</Eyebrow>
            <h2 className="mt-4 text-4xl leading-tight sm:text-5xl">
              Your business has grown. Your finance team hasn&apos;t.
            </h2>
            <p className="mt-6 text-lg leading-relaxed">
              Invoices pile up, reconciliations slip and month-end takes longer every month. Hiring looks like the
              answer — until you weigh up what it really involves.
            </p>
          </Reveal>
          <div className="mt-14 grid gap-px overflow-hidden rounded-panel border border-hairline bg-[var(--border)] sm:grid-cols-2">
            {hiringProblems.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.06} className="bg-cream p-8">
                <span className="tabular text-sm text-muted">0{i + 1}</span>
                <h3 className="mt-3 text-2xl">{p.title}</h3>
                <p className="mt-3 leading-relaxed">{p.text}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* What we take over */}
      <Section tone="navy">
        <Container className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <Eyebrow className="text-cream/60">What we take over</Eyebrow>
            <h2 className="mt-4 text-4xl leading-tight sm:text-5xl">Give us the books. Keep the control.</h2>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-cream/75">
              We work in your accounting software, follow your approval rules and report to whoever you choose. You
              decide what to hand over — one task or the whole finance function.
            </p>
            <div className="mt-10">
              <ButtonLink href="/outsourced-financial-operations" variant="light">
                How the outsourced finance team works <ArrowRight className="size-4" aria-hidden />
              </ButtonLink>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="divide-y divide-cream/10 border-y border-cream/10">
              {handover.map((h) => (
                <li key={h.area}>
                  <a href={h.href} className="group flex items-center justify-between gap-4 py-4 text-lg text-cream">
                    {h.area}
                    <ArrowRight
                      className="size-4 shrink-0 text-cream/40 transition-transform group-hover:translate-x-1 group-hover:text-cream"
                      aria-hidden
                    />
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </Section>

      {/* Alongside your team */}
      <Section>
        <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <Eyebrow>Working alongside your team</Eyebrow>
            <h2 className="mt-4 text-4xl leading-tight sm:text-5xl">
              Your finance director keeps the strategy. We take the volume.
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="space-y-5 text-lg leading-relaxed">
            <p>
              Many of our clients already have a finance manager or finance director. What they lack is capacity for
              the daily work that keeps the numbers right.
            </p>
            <p>
              We take on the coding, reconciliations, payment runs and chasing, so your senior people can spend their
              time on forecasting, funding and decisions — not data entry.
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* How it works */}
      <Section tone="mist">
        <Container>
          <Reveal className="max-w-2xl">
            <Eyebrow>How it works</Eyebrow>
            <h2 className="mt-4 text-4xl sm:text-5xl">From first call to running books in weeks.</h2>
          </Reveal>
          <ol className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.08}>
                <li className="h-full border-t-2 border-navy pt-6">
                  <span className="tabular font-display text-4xl text-navy">{i + 1}</span>
                  <h3 className="mt-3 text-2xl">{s.title}</h3>
                  <p className="mt-3 leading-relaxed">{s.text}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </Container>
      </Section>

      {/* Calculator + form */}
      <CalculatorSection
        calculator="finance-team"
        source="home"
        title="Outsource or hire? See the difference."
        intro="Choose the work you'd like covered. We'll show our indicative monthly fee next to the cost of employing people to do it."
      />

      {/* Services */}
      <Section>
        <Container>
          <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <Eyebrow>Services</Eyebrow>
              <h2 className="mt-4 text-4xl sm:text-5xl">Everything your finance function needs.</h2>
            </div>
            <ButtonLink href="/services" variant="secondary">
              All services
            </ButtonLink>
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s, i) => (
              <Reveal key={s.slug} delay={(i % 4) * 0.05}>
                <LinkCard
                  href={`/${s.slug}`}
                  title={s.name}
                  text={s.summary}
                  meta={s.category === "operations" ? "Financial operations" : "Compliance"}
                />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Industries */}
      <Section tone="sand">
        <Container>
          <Reveal className="max-w-2xl">
            <Eyebrow>Industries</Eyebrow>
            <h2 className="mt-4 text-4xl sm:text-5xl">Built around how your business works.</h2>
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {industries.map((ind, i) => (
              <Reveal key={ind.slug} delay={i * 0.05}>
                <LinkCard href={`/industries/${ind.slug}`} title={ind.name} text={ind.summary} />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Founder */}
      <Section>
        <Container size="narrow" className="text-center">
          <Reveal>
            <Eyebrow>A word from our founder</Eyebrow>
            <blockquote className="mt-8">
              <p className="font-display text-3xl leading-snug text-ink sm:text-4xl">
                &ldquo;You should make decisions with a clear picture of your finances, not wait for the year-end
                accounts to find out what happened.&rdquo;
              </p>
              <footer className="mt-6 text-muted">{site.founder}, Founder</footer>
            </blockquote>
          </Reveal>
        </Container>
      </Section>

      <FaqSection faqs={faqs} />
      <CtaBand />
    </>
  );
}
