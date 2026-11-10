import type { MetadataRoute } from "next";
import { SERVICES } from "@/lib/services";
import { abs } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: abs("/"), changeFrequency: "weekly", priority: 1 },
    { url: abs("/services"), changeFrequency: "weekly", priority: 0.9 },
    ...SERVICES.map((s) => ({
      url: abs(`/services/${s.slug}`),
      changeFrequency: "monthly" as const,
      priority: s.tier === "premium" ? 0.8 : 0.7,
      images: [`https://images.unsplash.com/photo-${s.image}?auto=format&q=80&w=1200`],
    })),
  ];
}
