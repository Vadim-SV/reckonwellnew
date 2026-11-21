import { Container } from "@/components/ui/Container";
import { Section as PageSection } from "@/components/ui/Section";
import { Breadcrumbs } from "./Breadcrumbs";

/** Numbered section used by the legal pages (wording carried over unchanged from the original site). */
export function Section({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-hairline pt-8">
      <h2 className="flex items-baseline gap-4 text-2xl sm:text-3xl">
        <span className="tabular font-sans text-xs tracking-[0.2em] text-muted">{number.padStart(2, "0")}</span>
        {title}
      </h2>
      <div className="mt-5 space-y-4 leading-relaxed [&_a]:text-steel [&_a]:underline [&_li]:mt-2 [&_strong]:text-ink [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6">
        {children}
      </div>
    </section>
  );
}

export function SubHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="mt-6 font-sans text-base font-medium text-ink">{children}</h3>;
}

export function LegalPage({
  title,
  href,
  meta,
  intro,
  children,
}: {
  title: string;
  href: string;
  meta?: string[];
  intro?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <PageSection spacing="sm">
      <Container size="narrow">
        <Breadcrumbs items={[{ label: title, href }]} />
        <h1 className="mt-10 text-5xl">{title}</h1>
        {meta && (
          <div className="mt-4 text-sm text-muted">
            {meta.map((m) => (
              <p key={m}>{m}</p>
            ))}
          </div>
        )}
        {intro && <div className="mt-8 text-lg leading-relaxed [&_a]:text-steel [&_a]:underline">{intro}</div>}
        <div className="mt-12 space-y-12 pb-12">{children}</div>
      </Container>
    </PageSection>
  );
}
