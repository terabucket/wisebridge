import { ImageResponse } from "next/og";
import { OG_SIZE, OgCard } from "@/lib/og";

export const alt = "WiseBridge — AI-powered design, development & SEO services";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <OgCard
        eyebrow="AI-powered digital services"
        title="Bridge your ideas to finished work"
        subtitle="Figma design, websites, SEO and AI automation — scoped by an AI consultant, reviewed by experts."
        footer="From $100 · Fixed prices"
      />
    ),
    size,
  );
}
