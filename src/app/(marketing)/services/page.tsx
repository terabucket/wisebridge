import type { Metadata } from "next";
import { Suspense } from "react";
import { ServiceCatalog } from "@/components/services/service-catalog";
import { SectionHeading } from "@/components/motion";

export const metadata: Metadata = {
  title: "Services",
  description: "18 AI-powered services across design, development, SEO and automation — from $100.",
};

export default function ServicesPage() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 pt-36 pb-12">
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
