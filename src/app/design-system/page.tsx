import type { Metadata } from "next";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { TrustStrip } from "@/components/trust/TrustStrip";

export const metadata: Metadata = {
  title: "Design system",
  robots: { index: false, follow: false },
};

const swatches = [
  { name: "Navy", token: "navy", hex: "#12233f", note: "Primary · verified" },
  { name: "Navy deep", token: "navy-deep", hex: "#0b172b", note: "Hover · verified" },
  { name: "Steel", token: "steel", hex: "#275e86", note: "Secondary · verified" },
  { name: "Cream", token: "cream", hex: "#fff1e0", note: "Background · verified" },
  { name: "Sand", token: "sand", hex: "#f6e9d8", note: "Surface · verified" },
  { name: "Oat", token: "oat", hex: "#e9decf", note: "Card darker · verified" },
  { name: "Mist", token: "mist", hex: "#e3e7ed", note: "Accent tint · verified" },
  { name: "Body", token: "body", hex: "#333333", note: "Body text · verified" },
  { name: "Muted", token: "muted", hex: "#66605c", note: "Secondary text · verified" },
  { name: "Positive", token: "positive", hex: "#2d6a4f", note: "Reconciled / paid · verified" },
  { name: "Negative", token: "negative", hex: "#8c3d2b", note: "Overdue / risk · verified" },
  { name: "Rose", token: "rose", hex: "#d69aab", note: "Link on dark · verified" },
];

export default function DesignSystemPage() {
  return (
    <>
      <Section spacing="sm">
        <Container>
          <Eyebrow>Internal · not indexed</Eyebrow>
          <h1 className="mt-4 text-5xl">Reckonwell design system</h1>
          <p className="mt-4 max-w-2xl text-lg">
            Tokens and components for the new website. Full guidance lives in{" "}
            <code className="rounded-xs bg-sand px-1.5 py-0.5 text-sm">docs/design-system.md</code>.
          </p>
        </Container>
      </Section>

      <Section spacing="sm" tone="sand">
        <Container>
          <h2 className="text-3xl">Colour</h2>
          <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {swatches.map((s) => (
              <li key={s.token} className="overflow-hidden rounded-card bg-white shadow-card">
                <div className="h-20 border-b border-hairline" style={{ background: s.hex }} />
                <div className="p-4">
                  <p className="font-medium text-ink">{s.name}</p>
                  <p className="tabular text-sm text-muted">{s.hex}</p>
                  <p className="mt-1 text-xs text-muted">{s.note}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section spacing="sm">
        <Container className="space-y-6">
          <h2 className="text-3xl">Typography</h2>
          <p className="font-display text-6xl leading-none text-ink">
            Newsreader <em className="text-navy">display</em>
          </p>
          <p className="text-xl">Work Sans for body copy, labels and interface text.</p>
          <p className="tabular font-display text-5xl text-navy">£12,480.00</p>
          <Eyebrow>Eyebrow label</Eyebrow>
        </Container>
      </Section>

      <Section spacing="sm" tone="mist">
        <Container className="space-y-6">
          <h2 className="text-3xl">Buttons</h2>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/design-system">Primary</ButtonLink>
            <ButtonLink href="/design-system" variant="secondary">
              Secondary
            </ButtonLink>
            <Button variant="ghost">Ghost</Button>
            <Button disabled>Disabled</Button>
          </div>
          <div className="flex flex-wrap gap-3 rounded-card bg-navy p-6">
            <ButtonLink href="/design-system" variant="light">
              Light on navy
            </ButtonLink>
          </div>
        </Container>
      </Section>

      <Section spacing="sm" tone="sand">
        <Container>
          <TrustStrip />
        </Container>
      </Section>
    </>
  );
}
