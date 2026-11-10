import { SERVICES, getTier } from "@/lib/services";
import { SITE_DESCRIPTION, abs, serviceFaqs } from "@/lib/seo";

/** /llms-full.txt: every service with full details and Q&A, for AI assistants. */
export function GET() {
  const sections = SERVICES.map((s) => {
    const faqs = serviceFaqs(s)
      .map((f) => `**${f.q}**\n${f.a}`)
      .join("\n\n");
    return `## ${s.title}

- URL: ${abs(`/services/${s.slug}`)}
- Tier: ${getTier(s.tier).name}
- Price: $${s.price.toLocaleString("en-US")} (fixed, USD)
- Turnaround: ${s.turnaround}
- Revisions: ${s.revisions}

${s.tagline} ${s.description}

Deliverables:
${s.deliverables.map((d) => `- ${d}`).join("\n")}

${faqs}`;
  }).join("\n\n---\n\n");

  return new Response(`# WiseBridge: full service reference\n\n> ${SITE_DESCRIPTION}\n\n${sections}\n`, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
