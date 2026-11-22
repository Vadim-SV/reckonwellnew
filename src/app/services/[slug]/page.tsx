import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServicePage, serviceMetadata } from "@/components/sections/ServicePage";
import { services } from "@/content/services";

/** Services added in Stage 04 live under /services/{slug}; originals keep their root URLs. */
const nested = services.filter((s) => s.href === `/services/${s.slug}`);

export const dynamicParams = false;

export function generateStaticParams() {
  return nested.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = nested.find((s) => s.slug === slug);
  return service ? serviceMetadata(service) : {};
}

export default async function NestedServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = nested.find((s) => s.slug === slug);
  if (!service) notFound();
  return <ServicePage service={service} />;
}
