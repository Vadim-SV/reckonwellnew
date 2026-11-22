import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { PartnerForm } from "@/components/forms/PartnerForm";
import { GrowthJourney } from "@/components/illustrations/GrowthJourney";
import { FaqSection } from "@/components/sections/FaqSection";
import { PageHero } from "@/components/sections/PageHero";

export const metadata: Metadata = {
  title: "Partner Programme for Accountants & Advisers",
  description:
    "Refer clients who need ongoing bookkeeping and finance support, or work with us on outsourced bookkeeping. 10% of the monthly fee while the client stays.",
  alternates: { canonical: "/partners" },
};

const audiences = [
  {
    title: "Accountancy practices",
    text: "Pass us the monthly bookkeeping, payables and reporting your clients need, while you keep the advisory and year-end relationship.",
  },
  {
    title: "Tax advisers",
    text: "Clients with messy records make tax work harder. We keep their books clean all year, so the numbers reach you ready to use.",
  },
  {
    title: "Business consultants",
    text: "When you see a client's finance team struggling, introduce us to fix the day-to-day while you focus on the bigger picture.",
  },
  {
    title: "Professional introducers",
    text: "Solicitors, finance brokers, IFAs and others who are trusted by business owners and want a reliable name to recommend.",
  },
  {
    title: "Outsourced bookkeeping partnerships",
    text: "Firms that want extra bookkeeping capacity or a white-label arrangement. Tell us what you have in mind and we'll design it together.",
  },
];

const journey = [
  { title: "Professional partner", text: "You send us an enquiry and we agree a simple way of working together." },
  { title: "Client introduction", text: "A warm email is all it takes. We handle the call, proposal and onboarding." },
  { title: "Reckonwell support", text: "Your client gets reliable monthly finance support, and you're kept informed as agreed." },
  { title: "Ongoing relationship", text: "For referrals, 10% of the net monthly fee is paid to you each month while the client stays." },
];

const faqs = [
  {
    question: "How does the referral commission work?",
    answer:
      "For client introductions, our current programme pays 10% of the net monthly fee we invoice the client, for as long as they remain a client. Commission is paid monthly with a statement.",
  },
  {
    question: "Will you approach my clients for other work?",
    answer:
      "We agree the scope with you at the start. If you're an accountant or tax adviser who wants to keep the advisory or year-end relationship, we stick to the work you've referred.",
  },
  {
    question: "Do I need to sell anything?",
    answer: "No. Make the introduction and we'll take it from there, including the discovery call and onboarding.",
  },
  {
    question: "Which clients are the best fit?",
    answer:
      "Established, owner-managed businesses that need ongoing bookkeeping, payables, receivables, payroll or monthly reporting — typically companies whose finance workload has outgrown their current team.",
  },
];

export default function PartnersPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Partner with us", href: "/partners" }]}
        eyebrow="Partner programme"
        title="Partner with Reckonwell."
        lede="We work with accountants, advisers and introducers whose clients need dependable, ongoing finance support. Refer a client, share the work or add capacity to your own firm."
        primary={{ label: "Become a partner", href: "#partner-form" }}
        aside={
          <div className="rounded-panel bg-navy p-8 text-cream shadow-float">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-cream/60">Referral commission</p>
            <p className="mt-4 font-display text-7xl leading-none">10%</p>
            <p className="mt-4 text-lg text-cream/80">
              of the net monthly fee, for as long as the client stays with us. Paid monthly.
            </p>
          </div>
        }
      />

      <Section tone="sand">
        <Container>
          <Reveal className="max-w-2xl">
            <Eyebrow>Who we partner with</Eyebrow>
            <h2 className="mt-4 text-4xl sm:text-5xl">Built for the people business owners already trust</h2>
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {audiences.map((a, i) => (
              <Reveal key={a.title} delay={(i % 3) * 0.05} className="rounded-card border border-hairline bg-cream p-7">
                <h3 className="text-2xl">{a.title}</h3>
                <p className="mt-3 leading-relaxed">{a.text}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <Reveal className="max-w-2xl">
            <Eyebrow>How it works</Eyebrow>
            <h2 className="mt-4 text-4xl sm:text-5xl">From introduction to a lasting relationship</h2>
          </Reveal>
          <GrowthJourney stages={journey} className="mt-14" />
        </Container>
      </Section>

      <Section tone="mist" id="partner-form" className="scroll-mt-24">
        <Container className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-16">
          <div>
            <Eyebrow>Partner enquiry</Eyebrow>
            <h2 className="mt-4 text-4xl sm:text-5xl">Let&apos;s work together</h2>
            <p className="mt-4 text-lg">
              Tell us a little about you and your clients. We&apos;ll be in touch to arrange a short call.
            </p>
          </div>
          <div className="rounded-panel border border-hairline bg-cream p-6 shadow-card sm:p-10">
            <PartnerForm />
          </div>
        </Container>
      </Section>

      <FaqSection faqs={faqs} />
    </>
  );
}
