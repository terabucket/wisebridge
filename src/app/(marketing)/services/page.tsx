import type { Metadata } from "next";
import { Suspense } from "react";
import { ServiceCatalog } from "@/components/services/service-catalog";
import { SectionHeading } from "@/components/motion";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbLd, graph, serviceListLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "AI Design, Web Development & SEO Services — Fixed Prices",
  description:
    "Browse 18 fixed-price, AI-powered services: Figma design, landing pages, websites, e-commerce, SEO audits, content and AI automation. Starter $100 · Professional $500 · Premium $2,000–$3,000.",
  alternates: { canonical: "/services" },
  openGraph: { url: "/services" },
};

export default function ServicesPage() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 pt-36 pb-12">
      <JsonLd
        data={graph(
          serviceListLd(),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
          ]),
        )}
      />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 bg-grid [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <SectionHeading
        eyebrow="Service catalog"
        title={
          <>
            Pick a service. <span className="font-serif font-normal italic text-gradient">Start chatting.</span>
          </>
        }
        description="Fixed prices, clear deliverables. Choose what you need and our AI consultant will scope it with you in minutes."
      />
      <Suspense fallback={<div className="mt-12 h-96 animate-pulse rounded-3xl bg-muted" />}>
        <ServiceCatalog />
      </Suspense>
    </section>
  );
}
