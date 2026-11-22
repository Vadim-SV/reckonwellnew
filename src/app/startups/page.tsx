import type { Metadata } from "next";
import { Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { GrowthJourney } from "@/components/illustrations/GrowthJourney";
import { ScopingSection } from "@/components/scoping/ScopingSection";
import { LinkCard } from "@/components/sections/Cards";
import { CtaBand } from "@/components/sections/CtaBand";
import { FaqSection } from "@/components/sections/FaqSection";
import { JsonLd } from "@/components/sections/JsonLd";
import { PageHero } from "@/components/sections/PageHero";
import { serviceBySlug, type Service } from "@/content/services";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Startup Accounting Services & Founder's Launch Offer",
  description:
    "Accounting for new UK businesses: Xero or QuickBooks set up, bank feeds, invoicing, deadlines and first records — then regular monthly support as you grow.",
  alternates: { canonical: "/startups" },
};

const launchIncludes = [
  { title: "Accounting software", text: "Xero or QuickBooks set up properly for your business from day one." },
  { title: "Bank accounts connected", text: "Bank and card feeds linked, with rules for regular transactions." },
  { title: "Bookkeeping organised", text: "A simple routine for receipts, bills and records that you can keep up with." },
  { title: "Invoicing", text: "Professional invoice templates, payment terms and a way to see who owes you." },
  { title: "Your deadlines explained", text: "A plain-English calendar of the filings and payments that apply to you." },
  { title: "First records prepared", text: "Opening entries and early transactions recorded correctly." },
  { title: "Selected compliance", text: "VAT registration, payroll for first hires or Self Assessment, when you need them." },
  { title: "A path to monthly support", text: "Move onto regular bookkeeping and reporting as the business grows." },
];

const journey = [
  { title: "Startup", text: "Software, bank feeds and invoicing set up properly, so good habits start early." },
  { title: "Growing business", text: "Regular bookkeeping, VAT and payroll as customers and staff arrive." },
  { title: "Established company", text: "Monthly management accounts and a finance team without the hiring." },
  { title: "Group of companies", text: "Consistent books and reporting as you add new companies." },
];

const steps = [
  { title: "A short call", text: "Tell us about your plans, your structure and what you've set up so far." },
  { title: "A tailored launch plan", text: "We agree what's included in your launch offer and confirm the price before we start." },
  { title: "We set everything up", text: "Software, bank feeds, invoicing and your first records — done properly." },
  { title: "Support as you grow", text: "Move onto monthly support when you need it, at your own pace." },
];

const faqs = [
  {
    question: "What is the Founder's Launch Offer?",
    answer:
      "A one-off package to set up your accounting properly at the start — software, bank feeds, invoicing, deadlines and first records — tailored to what your business actually needs. We confirm the price after a short call, before any work starts.",
  },
  {
    question: "Should I be a sole trader or a limited company?",
    answer:
      "It depends on your income, plans and personal circumstances. We'll explain the practical differences in plain English. Where you need tax advice on the decision, we'll say so and work with your adviser.",
  },
  {
    question: "When are my first accounts due?",
    answer:
      "A new limited company's first accounts are usually due at Companies House 21 months after the date of incorporation. You also need to tell HMRC within three months of starting to trade. We'll give you a calendar of your own dates.",
  },
  {
    question: "Do I need to register for VAT?",
    answer:
      "You must register if your VAT-taxable turnover over the previous 12 months goes above £90,000, or you expect it to go above that in the next 30 days. Some businesses register voluntarily. We'll help you decide and handle the registration.",
  },
  {
    question: "What happens after the launch?",
    answer:
      "Nothing is automatic. When the business is ready, you can move onto regular monthly bookkeeping, VAT and reporting — and later a full outsourced finance team.",
  },
];

export default function StartupsPage() {
  const related = ["bookkeeping-services", "accounting-systems", "vat-returns", "annual-accounts-ct600"]
    .map(serviceBySlug)
    .filter((s): s is Service => Boolean(s));

  return (
    <>
      <PageHero
        crumbs={[{ label: "Startups", href: "/startups" }]}
        eyebrow="For new businesses"
        title="Start your business with the finances in order."
        lede="Good financial habits are easiest to build at the start. We set up your accounting software, bank feeds and invoicing properly, explain your deadlines and stay with you as the business grows."
        primary={{ label: "Plan your launch", href: "#calculator" }}
        secondary={{ label: "Book a discovery call", href: "/book" }}
        aside={
          <div className="rounded-panel bg-navy p-8 text-cream shadow-float">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-cream/60">Founder&apos;s Launch Offer</p>
            <p className="mt-4 font-display text-4xl leading-tight">Set up properly from day one.</p>
            <ul className="mt-6 space-y-3">
              {launchIncludes.slice(0, 4).map((i) => (
                <li key={i.title} className="flex gap-3">
                  <Check className="mt-1 size-4 shrink-0 text-steel-light" aria-hidden />
                  {i.title}
                </li>
              ))}
            </ul>
            <p className="mt-6 rounded-xs bg-cream/10 px-3 py-2 text-sm text-cream/85">
              Priced for your setup — we confirm the fee before any work starts.
            </p>
          </div>
        }
      />

      <Section tone="sand" id="launch-offer" className="scroll-mt-24">
        <Container>
          <Reveal className="max-w-2xl">
            <Eyebrow>Founder&apos;s Launch Offer</Eyebrow>
            <h2 className="mt-4 text-4xl sm:text-5xl">Everything a new business needs to start well</h2>
            <p className="mt-4 text-lg">
              Choose what applies to you. We&apos;ll put together a launch plan and a fixed price before we begin.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-px overflow-hidden rounded-panel border border-hairline bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-4">
            {launchIncludes.map((item, i) => (
              <Reveal key={item.title} delay={(i % 4) * 0.05} className="bg-sand p-7">
                <h3 className="text-xl">{item.title}</h3>
                <p className="mt-2 leading-relaxed">{item.text}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <Reveal className="max-w-2xl">
            <Eyebrow>Growing with you</Eyebrow>
            <h2 className="mt-4 text-4xl sm:text-5xl">From first invoice to group of companies</h2>
            <p className="mt-4 text-lg">The support changes as the business does. The people you work with don&apos;t.</p>
          </Reveal>
          <GrowthJourney stages={journey} className="mt-14" />
        </Container>
      </Section>

      <Section tone="mist">
        <Container>
          <Reveal className="max-w-2xl">
            <Eyebrow>How it works</Eyebrow>
            <h2 className="mt-4 text-4xl sm:text-5xl">Simple, and agreed up front</h2>
          </Reveal>
          <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
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

      <ScopingSection
        tool="startup-launch"
        source="startups"
        title="Plan your launch"
        intro="Tell us where you are and what you need. We'll summarise your launch plan and send you a tailored quote."
        formTitle="Tell us about your new business"
        formIntro="We'll email you a copy of your launch plan and get in touch to arrange a short call."
        submitLabel="Send my launch plan & get in touch"
      />

      <FaqSection faqs={faqs} title="Questions founders ask us" />

      <Section tone="sand">
        <Container>
          <h2 className="text-3xl">Services new businesses use most</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r) => (
              <LinkCard key={r.slug} href={r.href} title={r.name} text={r.summary} />
            ))}
          </div>
        </Container>
      </Section>

      <CtaBand title="Start well. Grow with confidence." text="Tell us about your plans and we'll show you what a good start looks like." />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Startup accounting — Founder's Launch Offer",
          description: "Accounting setup for new UK businesses, with ongoing support as they grow.",
          url: `${site.url}/startups`,
          areaServed: { "@type": "Country", name: "United Kingdom" },
          provider: { "@id": `${site.url}/#organisation` },
        }}
      />
    </>
  );
}
