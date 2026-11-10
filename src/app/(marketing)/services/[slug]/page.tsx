import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Clock, FileUp, MessagesSquare, RefreshCcw, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/motion";
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
  return {
    title: s.title,
    description: `${s.tagline} ${s.description}`,
    openGraph: { images: [unsplash(s.image, 1200, 630)] },
  };
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  const tier = getTier(service.tier);
  const related = SERVICES.filter((s) => s.slug !== service.slug && (s.category === service.category || s.tier === service.tier)).slice(0, 3);

  return (
    <>
      <section className="relative isolate overflow-hidden pt-28">
        <div className="absolute inset-0 -z-10">
          <Image src={unsplash(service.image, 1800, 900)} alt="" fill priority sizes="100vw" className="object-cover opacity-25 blur-sm dark:opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/85 to-background" />
        </div>

        <div className="mx-auto max-w-6xl px-6 pt-8 pb-16">
          <Link href="/services" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> All services
          </Link>

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

      {related.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-12">
          <h2 className="text-2xl font-semibold tracking-tight">You might also need</h2>
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
