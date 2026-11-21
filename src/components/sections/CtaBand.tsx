import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { site } from "@/lib/site";

export function CtaBand({
  title = "Hand us the books. Keep your focus on the business.",
  text = "Tell us what your finance team is stretched on, and we'll show you how we'd take it on.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <Section tone="navy">
      <Container className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
        <div className="max-w-2xl">
          <h2 className="text-4xl leading-tight sm:text-5xl">{title}</h2>
          <p className="mt-4 text-lg text-cream/75">{text}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/contact" variant="light" size="lg">
            Get in touch
          </ButtonLink>
          <ButtonLink href={site.phoneHref} size="lg" className="border border-cream/30 bg-transparent hover:bg-cream/10">
            Call {site.phone}
          </ButtonLink>
        </div>
      </Container>
    </Section>
  );
}
