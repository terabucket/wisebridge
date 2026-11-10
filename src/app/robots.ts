import type { MetadataRoute } from "next";
import { SITE_URL, abs } from "@/lib/seo";

const PRIVATE = ["/api/", "/workspace"];

/**
 * Search engines and AI answer engines are explicitly welcome (AEO): being crawlable by
 * ChatGPT, Claude, Perplexity, Gemini & co. is how the site gets cited in AI answers.
 */
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      { userAgent: AI_CRAWLERS, allow: "/", disallow: PRIVATE },
    ],
    sitemap: abs("/sitemap.xml"),
    host: SITE_URL,
  };
}
