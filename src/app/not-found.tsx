import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <Section spacing="lg">
      <Container size="narrow" className="text-center">
        <Eyebrow>404</Eyebrow>
        <h1 className="mt-4 text-5xl">We couldn&apos;t find that page.</h1>
        <p className="mt-6 text-lg">
          It may have moved. Try one of these instead.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/">Back to the homepage</ButtonLink>
          <ButtonLink href="/services" variant="secondary">
            Our services
          </ButtonLink>
        </div>
      </Container>
    </Section>
  );
}
