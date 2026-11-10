export type TierId = "starter" | "professional" | "premium";
export type Category = "design" | "development" | "seo" | "ai";

export interface Service {
  slug: string;
  title: string;
  tier: TierId;
  price: number;
  category: Category;
  tagline: string;
  description: string;
  deliverables: string[];
  turnaround: string;
  revisions: string;
  image: string; // Unsplash photo id
  icon: IconName;
  /** What the AI agent should make sure it learns from the client. */
  discovery: string[];
}

export type IconName =
  | "search"
  | "layout"
  | "palette"
  | "key"
  | "eye"
  | "pen"
  | "globe"
  | "figma"
  | "trending"
  | "badge"
  | "bot"
  | "calendar"
  | "building"
  | "cart"
  | "layers"
  | "target"
  | "rocket"
  | "workflow";

export interface Tier {
  id: TierId;
  name: string;
  priceLabel: string;
  delivery: string;
  blurb: string;
  perks: string[];
}

export const TIERS: Tier[] = [
  {
    id: "starter",
    name: "Starter",
    priceLabel: "$100",
    delivery: "1–3 days",
    blurb: "Focused, single-deliverable services to get you moving fast.",
    perks: ["1 revision round", "AI-generated, expert-reviewed", "Delivered in your workspace"],
  },
  {
    id: "professional",
    name: "Professional",
    priceLabel: "$500",
    delivery: "1–2 weeks",
    blurb: "Multi-part projects with deeper discovery and refinement.",
    perks: ["2 revision rounds", "Priority AI consultant", "Source files included"],
  },
  {
    id: "premium",
    name: "Premium",
    priceLabel: "$2,000–$3,000",
    delivery: "3–6 weeks",
    blurb: "End-to-end builds and strategy with a dedicated consultant.",
    perks: ["Unlimited minor tweaks", "Dedicated human lead", "30-day post-launch support"],
  },
];

export const CATEGORIES: { id: Category | "all"; label: string }[] = [
  { id: "all", label: "All services" },
  { id: "design", label: "Design" },
  { id: "development", label: "Development" },
  { id: "seo", label: "SEO & Content" },
  { id: "ai", label: "AI & Automation" },
];

export const SERVICES: Service[] = [
  // ───────────── Starter · $100 ─────────────
  {
    slug: "seo-audit-report",
    title: "SEO Audit Report",
    tier: "starter",
    price: 100,
    category: "seo",
    tagline: "Know exactly what's holding your site back.",
    description:
      "An AI-driven crawl of your website covering technical health, on-page signals, speed and indexability — distilled into a prioritized fix list anyone can act on.",
    deliverables: [
      "Technical SEO scan (meta, headings, canonicals, sitemap, robots)",
      "Core Web Vitals & speed findings",
      "Broken links and indexability issues",
      "Top-10 prioritized action list (PDF / Markdown)",
    ],
    turnaround: "2 days",
    revisions: "1 round",
    image: "1460925895917-afdab827c52f",
    icon: "search",
    discovery: ["Website URL", "Primary business goal", "Target market / country", "Main competitors (optional)"],
  },
  {
    slug: "landing-page-figma-mockup",
    title: "Landing Page Figma Mockup",
    tier: "starter",
    price: 100,
    category: "design",
    tagline: "A conversion-ready landing page, designed in Figma.",
    description:
      "One beautifully composed landing page for desktop and mobile, built from your brief with modern layout patterns and conversion best practices.",
    deliverables: ["Desktop + mobile layouts", "Copy suggestions for each section", "Color & type tokens", "Editable Figma-ready spec"],
    turnaround: "3 days",
    revisions: "1 round",
    image: "1547658719-da2b51169166",
    icon: "layout",
    discovery: ["Product / offer", "Target audience", "Brand colors & fonts", "Sections needed", "Reference sites they like"],
  },
  {
    slug: "logo-mini-brand-kit",
    title: "Logo & Mini Brand Kit",
    tier: "starter",
    price: 100,
    category: "design",
    tagline: "A memorable mark with the essentials around it.",
    description:
      "Three distinct logo directions plus a compact kit — palette, font pairing and favicon — so your brand looks consistent from day one.",
    deliverables: ["3 logo concepts (SVG)", "Color palette with hex codes", "Font pairing", "Favicon set"],
    turnaround: "3 days",
    revisions: "1 round",
    image: "1561070791-2526d30994b5",
    icon: "palette",
    discovery: ["Brand name", "Industry", "Personality / values", "Colors to use or avoid", "Logos they admire"],
  },
  {
    slug: "keyword-research-pack",
    title: "Keyword Research Pack",
    tier: "starter",
    price: 100,
    category: "seo",
    tagline: "The exact terms your customers are searching.",
    description:
      "50–100 target keywords clustered by intent with volume and difficulty estimates — the foundation for content that actually ranks.",
    deliverables: ["50–100 keywords with volume & difficulty", "Intent clusters", "Quick-win opportunities", "Spreadsheet export"],
    turnaround: "2 days",
    revisions: "1 round",
    image: "1432888498266-38ffec3eaf0a",
    icon: "key",
    discovery: ["Business / niche", "Products or topics", "Target locations & language", "Competitor sites"],
  },
  {
    slug: "website-ux-review",
    title: "Website UX Review",
    tier: "starter",
    price: 100,
    category: "design",
    tagline: "Fresh eyes on every friction point.",
    description:
      "A heuristic review of your site's usability, accessibility and conversion flow, with annotated issues and a ranked improvement plan.",
    deliverables: ["Heuristic UX evaluation", "Accessibility quick-check", "Conversion funnel notes", "Ranked fix list"],
    turnaround: "2 days",
    revisions: "1 round",
    image: "1531403009284-440f080d1e12",
    icon: "eye",
    discovery: ["Website / app URL", "Key user journey", "Known pain points", "Primary conversion goal"],
  },
  {
    slug: "seo-blog-content-pack",
    title: "SEO Blog Content Pack",
    tier: "starter",
    price: 100,
    category: "seo",
    tagline: "Four ready-to-publish, search-optimized articles.",
    description:
      "Four ~1,000-word articles written around your keywords and voice, with meta titles, descriptions and internal-link suggestions.",
    deliverables: ["4 articles (~1,000 words each)", "Meta titles & descriptions", "Internal link suggestions", "Human-edited for quality"],
    turnaround: "3 days",
    revisions: "1 round",
    image: "1573164713714-d95e436ab8d6",
    icon: "pen",
    discovery: ["Topics or keywords", "Audience", "Tone of voice", "Sample content they like", "CTA to include"],
  },

  // ───────────── Professional · $500 ─────────────
  {
    slug: "portfolio-website",
    title: "Personal / Portfolio Website",
    tier: "professional",
    price: 500,
    category: "development",
    tagline: "Your work, presented beautifully — and live.",
    description:
      "A responsive 3–5 page site built with modern tooling, deployed to your custom domain with analytics and basic SEO in place.",
    deliverables: ["3–5 responsive pages", "Custom domain deployment", "Contact form & analytics", "Basic SEO setup"],
    turnaround: "7–10 days",
    revisions: "2 rounds",
    image: "1498050108023-c5249f4df085",
    icon: "globe",
    discovery: ["Pages needed", "Content & projects to showcase", "Style references", "Domain status", "Preferred platform"],
  },
  {
    slug: "figma-ui-design",
    title: "Full Figma UI Design",
    tier: "professional",
    price: 500,
    category: "design",
    tagline: "5–8 polished screens with a clickable prototype.",
    description:
      "App or web screens designed with reusable components and consistent tokens, wired into a prototype you can click through and share.",
    deliverables: ["5–8 high-fidelity screens", "Reusable component set", "Clickable prototype", "Design tokens"],
    turnaround: "7–10 days",
    revisions: "2 rounds",
    image: "1586717791821-3f44a563fa4c",
    icon: "figma",
    discovery: ["Product description", "Screens / flows", "Platform (web, iOS, Android)", "Brand assets", "Competitor apps"],
  },
  {
    slug: "on-page-seo-optimization",
    title: "On-Page SEO Optimization",
    tier: "professional",
    price: 500,
    category: "seo",
    tagline: "Every page tuned to rank and convert.",
    description:
      "Rewritten titles, metas and headings, structured data, internal linking and image optimization across up to 15 pages.",
    deliverables: ["Optimized titles, metas & headings (15 pages)", "Schema markup", "Internal linking map", "Image alt-text & compression"],
    turnaround: "7 days",
    revisions: "2 rounds",
    image: "1519389950473-47ba0277781c",
    icon: "trending",
    discovery: ["Website URL & CMS", "Priority pages", "Target keywords", "Access constraints"],
  },
  {
    slug: "brand-identity-package",
    title: "Brand Identity Package",
    tier: "professional",
    price: 500,
    category: "design",
    tagline: "A complete, cohesive visual identity.",
    description:
      "Logo system, brand guidelines and ready-to-use templates for social and print, so every touchpoint feels unmistakably you.",
    deliverables: ["Primary & secondary logos", "Brand guidelines PDF", "Social media templates", "Business card design"],
    turnaround: "10 days",
    revisions: "2 rounds",
    image: "1626785774573-4b799315345d",
    icon: "badge",
    discovery: ["Brand story & values", "Audience", "Competitors", "Mood / style references", "Required templates"],
  },
  {
    slug: "ai-chatbot-for-website",
    title: "AI Chatbot for Website",
    tier: "professional",
    price: 500,
    category: "ai",
    tagline: "A 24/7 assistant trained on your business.",
    description:
      "A custom FAQ and support chatbot trained on your content, styled to your brand and embedded on your site in minutes.",
    deliverables: ["Custom-trained knowledge base", "Branded chat widget", "Lead capture flow", "Embed instructions"],
    turnaround: "7 days",
    revisions: "2 rounds",
    image: "1620712943543-bcc4688e7485",
    icon: "bot",
    discovery: ["Website & platform", "Knowledge sources (FAQs, docs)", "Tone of voice", "Escalation / handoff rules"],
  },
  {
    slug: "monthly-seo-content-plan",
    title: "Monthly SEO Content Plan",
    tier: "professional",
    price: 500,
    category: "seo",
    tagline: "A month of strategy and content, done for you.",
    description:
      "A 30-day editorial calendar, eight optimized articles and a ranking report — consistent growth without the content treadmill.",
    deliverables: ["30-day content calendar", "8 optimized articles", "Monthly ranking report", "Distribution checklist"],
    turnaround: "30 days",
    revisions: "2 rounds",
    image: "1551434678-e076c223a692",
    icon: "calendar",
    discovery: ["Business goals", "Keywords / topics", "Audience personas", "Publishing platform", "Voice samples"],
  },

  // ───────────── Premium · $2,000–$3,000 ─────────────
  {
    slug: "business-website",
    title: "Full Business Website",
    tier: "premium",
    price: 2500,
    category: "development",
    tagline: "From Figma to launch — a site that works as hard as you.",
    description:
      "A 10–20 page custom website: discovery, Figma design, development, CMS, SEO foundations, analytics and a guided launch.",
    deliverables: ["Custom Figma design", "10–20 page development", "CMS integration", "SEO, analytics & launch support"],
    turnaround: "4–5 weeks",
    revisions: "Unlimited minor",
    image: "1559028012-481c04fa702d",
    icon: "building",
    discovery: ["Business overview", "Sitemap / pages", "Integrations", "Content readiness", "Brand assets", "Launch date"],
  },
  {
    slug: "ecommerce-store-build",
    title: "E-commerce Store Build",
    tier: "premium",
    price: 3000,
    category: "development",
    tagline: "A storefront built to sell from day one.",
    description:
      "A Shopify or WooCommerce store with up to 50 products, payments, shipping and AI-written product descriptions that convert.",
    deliverables: ["Store setup & theme customization", "Up to 50 products", "Payments & shipping", "AI product descriptions"],
    turnaround: "4–6 weeks",
    revisions: "Unlimited minor",
    image: "1556742049-0cfed4f6a45d",
    icon: "cart",
    discovery: ["Products & catalog size", "Platform preference", "Markets & currencies", "Shipping rules", "Brand assets"],
  },
  {
    slug: "saas-ui-ux-system",
    title: "SaaS / Mobile App UI/UX System",
    tier: "premium",
    price: 2500,
    category: "design",
    tagline: "A scalable product design system, end to end.",
    description:
      "User flows, 20–40 screens and a complete Figma design system with documented components, ready for developer handoff.",
    deliverables: ["User flows & IA", "20–40 high-fidelity screens", "Full Figma design system", "Developer handoff docs"],
    turnaround: "4–6 weeks",
    revisions: "Unlimited minor",
    image: "1581291518857-4e27b48ff24e",
    icon: "layers",
    discovery: ["Product vision", "User personas", "Core flows", "Platforms", "Existing design assets", "Tech stack"],
  },
  {
    slug: "seo-growth-strategy",
    title: "6-Month SEO Growth Strategy",
    tier: "premium",
    price: 2000,
    category: "seo",
    tagline: "A roadmap to compounding organic growth.",
    description:
      "A full audit, competitor gap analysis, backlink plan and content roadmap with KPIs — a strategy your team can execute month by month.",
    deliverables: ["Full technical & content audit", "Competitor gap analysis", "Backlink acquisition plan", "6-month roadmap with KPIs"],
    turnaround: "3 weeks",
    revisions: "Unlimited minor",
    image: "1522071820081-009f0129c71c",
    icon: "target",
    discovery: ["Website & analytics access", "Revenue goals", "Competitors", "Team capacity", "Markets"],
  },
  {
    slug: "mvp-web-app",
    title: "MVP Web App Development",
    tier: "premium",
    price: 3000,
    category: "development",
    tagline: "Validate your idea with a working product.",
    description:
      "A functional prototype with authentication, database and your core features — built fast with AI-assisted engineering.",
    deliverables: ["Product scoping & architecture", "Auth, database & core features", "Responsive UI", "Deployment & handoff"],
    turnaround: "4–6 weeks",
    revisions: "Unlimited minor",
    image: "1633356122544-f134324a6cee",
    icon: "rocket",
    discovery: ["Problem & target users", "Must-have features", "Integrations", "Preferred stack", "Success metrics"],
  },
  {
    slug: "ai-automation-workflows",
    title: "AI Automation & Workflow Setup",
    tier: "premium",
    price: 2000,
    category: "ai",
    tagline: "Put your busywork on autopilot.",
    description:
      "Automated pipelines across your CRM, email, lead capture and AI assistants using Zapier, Make or n8n — plus training for your team.",
    deliverables: ["Process audit & automation map", "Up to 8 production workflows", "AI assistant integrations", "Team training session"],
    turnaround: "3–4 weeks",
    revisions: "Unlimited minor",
    image: "1677442136019-21780ecad995",
    icon: "workflow",
    discovery: ["Current tools & stack", "Repetitive processes", "Volume / frequency", "Preferred platform", "Data sensitivity"],
  },
];

export function getService(slug: string) {
  return SERVICES.find((s) => s.slug === slug);
}

export function getTier(id: TierId) {
  return TIERS.find((t) => t.id === id)!;
}
