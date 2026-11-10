import { ImageResponse } from "next/og";
import { OG_SIZE, OgCard } from "@/lib/og";
import { SERVICES, getService, getTier } from "@/lib/services";

export const alt = "WiseBridge service";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getService(slug) ?? SERVICES[0];
  return new ImageResponse(
    (
      <OgCard
        eyebrow={`${getTier(s.tier).name} service`}
        title={s.title}
        subtitle={s.tagline}
        footer={`$${s.price.toLocaleString("en-US")} · ${s.turnaround}`}
      />
    ),
    size,
  );
}
