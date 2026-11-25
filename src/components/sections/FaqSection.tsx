import { Plus } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import type { Faq } from "@/content/services";
import { JsonLd } from "./JsonLd";

export function FaqSection({ faqs, title = "Questions we're often asked" }: { faqs: Faq[]; title?: string }) {
  if (!faqs.length) return null;
  return (
    <Section aria-labelledby="faq-title">
      <Container className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-20">
        <div>
          <Eyebrow>FAQ</Eyebrow>
          <h2 id="faq-title" className="mt-4 text-4xl">
            {title}
          </h2>
        </div>
        <div className="divide-y divide-[var(--border)] border-y border-hairline">
          {faqs.map((f) => (
            <details key={f.question} className="group">
              <summary className="flex min-h-11 cursor-pointer list-none items-start justify-between gap-6 py-5 font-display text-xl text-ink [&::-webkit-details-marker]:hidden">
                {f.question}
                <Plus className="mt-1 size-5 shrink-0 text-navy transition-transform group-open:rotate-45" aria-hidden />
              </summary>
              <p className="max-w-3xl pb-6 leading-relaxed">{f.answer}</p>
            </details>
          ))}
        </div>
      </Container>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }}
      />
    </Section>
  );
}
