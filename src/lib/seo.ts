import { SERVICES, getTier, type Service } from "./services";
import { unsplash } from "./utils";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://wisebridge.tech").replace(/\/$/, "");
export const SITE_NAME = "WiseBridge";
export const SITE_TAGLINE = "AI-powered design, development & SEO services";
export const SITE_DESCRIPTION =
  "WiseBridge is an AI-powered digital services studio. Chat with an AI consultant, approve a written requirements spec, and get expert-reviewed Figma designs, websites, SEO and AI automation delivered — fixed prices from $100.";

export const abs = (path = "/") => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

/* ───────────────────────── FAQ content (shared by UI + schema) ───────────────────────── */

export interface Faq {
  q: string;
  a: string;
}

export const SITE_FAQS: Faq[] = [
  {
    q: "What is WiseBridge?",
    a: "WiseBridge is an AI-powered digital services studio by PeachTech LLC. It offers 18 fixed-price services across Figma design, website development, SEO and AI automation, priced from $100 to $3,000. An AI consultant scopes each project and specialists review every deliverable.",
  },
  {
    q: "How does the AI consultant work?",
    a: "After you choose a service, you chat with Wise, our AI consultant. It asks targeted questions, reads any files you share and turns the conversation into a requirements spec. You approve the spec before you pay.",
  },
  {
    q: "How much do WiseBridge services cost?",
    a: "Prices are fixed and set by tier. Starter services cost $100 and are delivered in 1–3 days. Professional services cost $500 and take 1–2 weeks. Premium services cost $2,000–$3,000 and take 3–6 weeks.",
  },
  {
    q: "What kinds of files can I upload?",
    a: "Anything relevant: Word documents, PDFs, text files and spreadsheets, images and screenshots, and videos. Documents and images are read directly, and videos are summarized from key frames. Other file types are attached for our team to review.",
  },
  {
    q: "When do I pay?",
    a: "Only after you've confirmed the requirements. You pay by card through Stripe Checkout, and production starts right after payment.",
  },
  {
    q: "Is the work reviewed by humans?",
    a: "Yes. AI does the heavy lifting and specialists review quality, accuracy and brand fit. Premium projects get a dedicated human lead.",
  },
  {
    q: "What if I need changes?",
    a: "Every tier includes revisions: Starter includes 1 round, Professional 2 rounds, and Premium unlimited minor tweaks.",
  },
  {
    q: "Do I own the deliverables?",
    a: "Yes. Once paid, all deliverables and source files are yours to use commercially.",
  },
];

/** Answer-first Q&A generated for each service page (visible on the page and in FAQPage schema). */
export function serviceFaqs(s: Service): Faq[] {
  const tier = getTier(s.tier);
  return [
    {
      q: `How much does the ${s.title} service cost?`,
      a: `${s.title} costs a fixed $${s.price.toLocaleString("en-US")} (${tier.name} tier). You only pay after you approve the written requirements spec, and there are no hidden fees.`,
    },
    {
      q: `How long does ${s.title} take?`,
      a: `Typical turnaround is ${s.turnaround} after payment, with ${s.revisions.toLowerCase()} of revisions included.`,
    },
    {
      q: `What's included in ${s.title}?`,
      a: `${s.description} Deliverables: ${s.deliverables.join("; ")}.`,
    },
    {
      q: `What do I need to get started with ${s.title}?`,
      a: `Nothing up front. Start a chat and our AI consultant will ask about: ${s.discovery.join(", ").toLowerCase()}. You can also upload briefs, documents, screenshots or videos.`,
    },
  ];
}

/* ───────────────────────── JSON-LD builders ───────────────────────── */

const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;

export function organizationLd() {
  return {
    "@type": ["Organization", "ProfessionalService"],
    "@id": ORG_ID,
    name: SITE_NAME,
    legalName: "PeachTech LLC",
    url: SITE_URL,
    logo: { "@type": "ImageObject", url: abs("/logo.png"), width: 512, height: 512 },
    image: abs("/opengraph-image"),
    description: SITE_DESCRIPTION,
    slogan: "Bridge your ideas to finished work.",
    priceRange: "$100–$3,000",
    areaServed: "Worldwide",
    knowsAbout: ["Figma design", "UI/UX design", "Web development", "Next.js", "Search engine optimization", "Answer engine optimization", "AI automation", "Branding"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "WiseBridge services",
      itemListElement: SERVICES.map((s) => ({
        "@type": "Offer",
        price: s.price,
        priceCurrency: "USD",
        url: abs(`/services/${s.slug}`),
        itemOffered: { "@type": "Service", name: s.title },
      })),
    },
  };
}

export function websiteLd() {
  return {
    "@type": "WebSite",
    "@id": SITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    publisher: { "@id": ORG_ID },
    inLanguage: "en-US",
  };
}

export function faqLd(faqs: Faq[]) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: abs(it.path),
    })),
  };
}

export function serviceLd(s: Service) {
  const url = abs(`/services/${s.slug}`);
  return {
    "@type": "Service",
    "@id": `${url}#service`,
    name: s.title,
    description: `${s.tagline} ${s.description}`,
    url,
    image: unsplash(s.image, 1200, 630),
    serviceType: s.title,
    category: s.category,
    provider: { "@id": ORG_ID },
    areaServed: "Worldwide",
    offers: {
      "@type": "Offer",
      price: s.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url,
      description: `Fixed price · ${s.turnaround} · ${s.revisions} revisions`,
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${s.title} deliverables`,
      itemListElement: s.deliverables.map((d) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: d } })),
    },
  };
}

export function serviceListLd() {
  return {
    "@type": "ItemList",
    name: "WiseBridge service catalog",
    numberOfItems: SERVICES.length,
    itemListElement: SERVICES.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: abs(`/services/${s.slug}`),
      name: s.title,
    })),
  };
}

export function graph(...nodes: object[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}
