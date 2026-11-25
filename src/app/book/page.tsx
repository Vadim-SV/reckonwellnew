import type { Metadata } from "next";
import { Check, Clock, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { BookingWidget } from "@/components/booking/BookingWidget";
import { PageHero } from "@/components/sections/PageHero";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Book a Discovery Call",
  description:
    "Book a free 30-minute discovery call with Reckonwell to talk about outsourced bookkeeping, financial operations or compliance for your business.",
  alternates: { canonical: "/book" },
};

const expect = [
  "A relaxed conversation about your business and your current setup",
  "Which work you'd like to hand over — one task or the whole finance workload",
  "How we'd work with your existing team and software",
  "A clear next step, with a fixed-fee proposal if it's a good fit",
];

export default function BookPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Book a discovery call", href: "/book" }]}
        eyebrow="Discovery call"
        title="Let's talk about your business."
        lede="Tell us what support you need and we'll discuss how Reckonwell can help."
      />
      <Section tone="sand" className="pt-10 sm:pt-12">
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:gap-14">
          <div className="min-w-0">
            <BookingWidget />
          </div>
          <aside className="space-y-6">
            <div className="rounded-panel bg-navy p-7 text-cream">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-cream/60">What to expect</p>
              <ul className="mt-5 space-y-3.5">
                {expect.map((e) => (
                  <li key={e} className="flex gap-3 leading-relaxed">
                    <Check className="mt-1 size-4 shrink-0 text-steel-light" aria-hidden />
                    {e}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-3 rounded-panel border border-hairline bg-cream p-6 text-[15px]">
              <p className="flex items-center gap-3">
                <Clock className="size-4 text-navy" aria-hidden /> 30 minutes · free · no obligation
              </p>
              <p className="flex items-center gap-3">
                <Phone className="size-4 text-navy" aria-hidden /> Prefer to call?{" "}
                <a href={site.phoneHref} className="text-steel underline underline-offset-4">
                  {site.phone}
                </a>
              </p>
            </div>
          </aside>
        </Container>
      </Section>
    </>
  );
}
