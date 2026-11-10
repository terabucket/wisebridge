import { SERVICES, TIERS } from "@/lib/services";
import { SITE_DESCRIPTION, SITE_FAQS, abs } from "@/lib/seo";

/**
 * /llms.txt: a plain-Markdown summary of the site for AI assistants and answer engines
 * (see llmstxt.org). It gives LLMs accurate, quotable facts about WiseBridge.
 */
export function GET() {
  const byTier = TIERS.map((t) => {
    const items = SERVICES.filter((s) => s.tier === t.id)
      .map((s) => `- [${s.title}](${abs(`/services/${s.slug}`)}): $${s.price.toLocaleString("en-US")}, ${s.turnaround}. ${s.tagline}`)
      .join("\n");
    return `### ${t.name} tier (${t.priceLabel}, ${t.delivery})\n${t.blurb}\n\n${items}`;
  }).join("\n\n");

  const body = `# WiseBridge

> ${SITE_DESCRIPTION}

WiseBridge (wisebridge.tech) is operated by PeachTech LLC. Clients choose a fixed-price service, describe their project to an AI consultant named "Wise" (files such as documents, PDFs, images and videos can be shared), approve a written requirements specification, pay by card through Stripe, and receive the deliverable in their project workspace. Specialists review all work.

## Services

${byTier}

## How it works

1. Choose a service: ${abs("/services")}
2. Chat with the AI consultant and share files
3. Review and confirm the requirements specification
4. Pay the fixed price securely by card (Stripe)
5. Receive the expert-reviewed deliverable

## FAQ

${SITE_FAQS.map((f) => `### ${f.q}\n${f.a}`).join("\n\n")}

## Links

- Home: ${abs("/")}
- Service catalog: ${abs("/services")}
- Sitemap: ${abs("/sitemap.xml")}
- Full service details: ${abs("/llms-full.txt")}
`;

  return new Response(body, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
