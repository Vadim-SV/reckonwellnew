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
        <h1 className="mt-4 text-5xl">This page isn&apos;t here yet.</h1>
        <p className="mt-6 text-lg">
          The new Reckonwell website is being built in stages, so some links won&apos;t work yet.
        </p>
        <div className="mt-10 flex justify-center gap-3">
          <ButtonLink href="/">Back to the homepage</ButtonLink>
          <ButtonLink href="/design-system" variant="secondary">
            View the design system
          </ButtonLink>
        </div>
      </Container>
    </Section>
  );
}
