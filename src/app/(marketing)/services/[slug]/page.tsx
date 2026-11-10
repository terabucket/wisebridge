import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ChevronRight, Clock, FileUp, MessagesSquare, RefreshCcw, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/motion";
import { FaqList } from "@/components/faq-list";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbLd, faqLd, graph, serviceFaqs, serviceLd } from "@/lib/seo";
import { ServiceCard, TierBadge } from "@/components/service-card";
import { ServiceIcon } from "@/components/service-icon";
import { StartProjectButton } from "@/components/services/start-project-button";
import { SERVICES, getService, getTier } from "@/lib/services";
import { formatPrice, unsplash } from "@/lib/utils";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return {};
  const path = `/services/${s.slug}`;
  const title = `${s.title} — ${formatPrice(s.price)} Fixed Price`;
  const description = `${s.tagline} ${s.description} Delivered in ${s.turnaround}.`.slice(0, 300);
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", url: path, title, description },
    twitter: { title, description },
  };
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  const tier = getTier(service.tier);
  const faqs = serviceFaqs(service);
  const related = SERVICES.filter((s) => s.slug !== service.slug && (s.category === service.category || s.tier === service.tier)).slice(0, 3);

  return (
    <>
      <JsonLd
        data={graph(
          serviceLd(service),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: service.title, path: `/services/${service.slug}` },
          ]),
          faqLd(faqs),
        )}
      />
      <section className="relative isolate overflow-hidden pt-28">
        <div className="absolute inset-0 -z-10">
          <Image src={unsplash(service.image, 1800, 900)} alt="" fill priority sizes="100vw" className="object-cover opacity-25 blur-sm dark:opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/85 to-background" />
        </div>

        <div className="mx-auto max-w-6xl px-6 pt-8 pb-16">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="transition hover:text-foreground">Home</Link>
              </li>
              <li aria-hidden><ChevronRight className="h-3.5 w-3.5" /></li>
              <li>
                <Link href="/services" className="transition hover:text-foreground">Services</Link>
              </li>
              <li aria-hidden><ChevronRight className="h-3.5 w-3.5" /></li>
              <li aria-current="page" className="text-foreground">{service.title}</li>
            </ol>
          </nav>

          <div className="mt-8 grid gap-12 lg:grid-cols-[1.2fr_1fr]">
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-white shadow-lg shadow-primary/30">
                  <ServiceIcon name={service.icon} className="h-6 w-6" />
                </span>
                <TierBadge tier={service.tier} />
              </div>
              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">{service.title}</h1>
              <p className="mt-3 font-serif text-2xl text-muted-foreground italic">{service.tagline}</p>
              <p className="mt-6 max-w-xl leading-relaxed text-muted-foreground">{service.description}</p>

              {/* Answer-first summary: the one-paragraph answer search & AI engines can quote. */}
              <div className="mt-6 max-w-xl rounded-2xl border bg-card/70 p-4 text-sm leading-relaxed">
                <span className="font-semibold">In short: </span>
                WiseBridge&apos;s {service.title} costs a fixed <strong>{formatPrice(service.price)}</strong>, is delivered in{" "}
                <strong>{service.turnaround}</strong> and includes {service.deliverables.slice(0, 3).join("; ")}
                {service.deliverables.length > 3 ? " and more" : ""}. You scope it with an AI consultant and pay only after approving the requirements.
              </div>

              <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-3xl border shadow-2xl">
                <Image src={unsplash(service.image, 1400, 788)} alt={service.title} fill sizes="(max-width:1024px) 100vw, 60vw" className="object-cover" />
              </div>
            </Reveal>

            <Reveal delay={0.1} className="lg:pt-4">
              <div className="sticky top-28 rounded-3xl border bg-card p-7 shadow-xl shadow-black/5">
                <div className="flex items-baseline justify-between">
                  <p className="text-4xl font-semibold tracking-tight">{formatPrice(service.price)}</p>
                  <span className="text-sm text-muted-foreground">fixed price</span>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-2xl bg-muted p-3">
                    <Clock className="h-4 w-4 text-primary" />
                    <p className="mt-2 font-medium">{service.turnaround}</p>
                    <p className="text-xs text-muted-foreground">Turnaround</p>
                  </div>
                  <div className="rounded-2xl bg-muted p-3">
                    <RefreshCcw className="h-4 w-4 text-primary" />
                    <p className="mt-2 font-medium">{service.revisions}</p>
                    <p className="text-xs text-muted-foreground">Revisions</p>
                  </div>
                </div>

                <h2 className="mt-7 text-sm font-semibold">What you&apos;ll get</h2>
                <ul className="mt-3 space-y-2.5">
                  {service.deliverables.map((d) => (
                    <li key={d} className="flex items-start gap-2.5 text-sm">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Check className="h-3 w-3 text-primary" />
                      </span>
                      {d}
                    </li>
                  ))}
                </ul>

                <StartProjectButton slug={service.slug} className="mt-8 w-full" />

                <ul className="mt-6 space-y-2 border-t pt-5 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2"><MessagesSquare className="h-3.5 w-3.5" /> Scope it with our AI consultant first</li>
                  <li className="flex items-center gap-2"><FileUp className="h-3.5 w-3.5" /> Share docs, images, PDFs & videos</li>
                  <li className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5" /> Pay only after you approve the requirements</li>
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <Reveal className="rounded-3xl border bg-card p-7 sm:p-10">
          <h2 className="text-2xl font-semibold tracking-tight">What Wise will ask you about</h2>
          <p className="mt-2 text-sm text-muted-foreground">Have these handy to speed things up — or just start chatting and figure it out together.</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {service.discovery.map((d) => (
              <span key={d} className="rounded-full border bg-background px-4 py-2 text-sm">{d}</span>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Included with the <span className="font-medium text-foreground">{tier.name}</span> tier: {tier.perks.join(" · ")}.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-12" aria-labelledby="service-faq">
        <h2 id="service-faq" className="text-2xl font-semibold tracking-tight">
          {service.title}: frequently asked questions
        </h2>
        <div className="mt-6">
          <FaqList faqs={faqs} />
        </div>
      </section>

      {related.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-12">
          <h2 className="text-2xl font-semibold tracking-tight">Related services</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((s) => (
              <ServiceCard key={s.slug} service={s} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
