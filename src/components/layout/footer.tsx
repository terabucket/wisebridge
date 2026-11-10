import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { SERVICES } from "@/lib/services";

export function Footer() {
  const cols = [
    { title: "Design", items: SERVICES.filter((s) => s.category === "design").slice(0, 4) },
    { title: "Development & AI", items: SERVICES.filter((s) => s.category === "development" || s.category === "ai").slice(0, 4) },
    { title: "SEO & Content", items: SERVICES.filter((s) => s.category === "seo").slice(0, 4) },
  ];

  return (
    <footer className="relative mt-24 border-t">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            AI-powered design, development and SEO — scoped by an AI consultant, reviewed by experts, delivered fast.
          </p>
          <p className="text-xs text-muted-foreground">wisebridge.tech</p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h3 className="mb-3 text-sm font-semibold">{c.title}</h3>
            <ul className="space-y-2">
              {c.items.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="text-sm text-muted-foreground transition hover:text-foreground">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-muted-foreground sm:flex-row">
          <p>© WiseBridge · a PeachTech LLC company. All rights reserved.</p>
          <p>Payments securely processed by Stripe.</p>
        </div>
      </div>
    </footer>
  );
}
