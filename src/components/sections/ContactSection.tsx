import { Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { site } from "@/lib/site";

export function ContactSection({
  source,
  title = "Tell us what you need",
  intro = "Send us a few details and we'll come back to you to arrange a short call.",
  tone = "sand",
}: {
  source: string;
  title?: string;
  intro?: string;
  tone?: "sand" | "cream";
}) {
  return (
    <Section tone={tone} id="get-in-touch" className="scroll-mt-24">
      <Container className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-16">
        <div>
          <Eyebrow>Get in touch</Eyebrow>
          <h2 className="mt-4 text-4xl sm:text-5xl">{title}</h2>
          <p className="mt-4 text-lg">{intro}</p>
          <ul className="mt-10 space-y-4 text-[15px]">
            <li className="flex items-center gap-3">
              <Phone className="size-4 text-navy" aria-hidden />
              <a href={site.phoneHref} className="inline-flex min-h-10 items-center hover:underline">
                {site.phone}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="size-4 text-navy" aria-hidden />
              <a href={`mailto:${site.email}`} className="inline-flex min-h-10 items-center break-all hover:underline">
                {site.email}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="size-4 text-navy" aria-hidden />
              {site.address.street}, {site.address.locality} {site.address.postcode}
            </li>
          </ul>
        </div>
        <div className="rounded-panel border border-hairline bg-cream p-6 shadow-card sm:p-10">
          <EnquiryForm source={source} />
        </div>
      </Container>
    </Section>
  );
}
