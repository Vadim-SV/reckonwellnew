import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServicePage, serviceMetadata } from "@/components/sections/ServicePage";
import { serviceBySlug } from "@/content/services";

const service = serviceBySlug("outsourced-financial-operations");

export const metadata: Metadata = service ? serviceMetadata(service) : {};

export default function Page() {
  if (!service) notFound();
  return <ServicePage service={service} />;
}
