import { ImageResponse } from "next/og";
import { MarkSvg } from "@/lib/og";

/** 512×512 raster logo for schema.org `Organization.logo` (Google prefers PNG over SVG). */
export function GET() {
  return new ImageResponse(<MarkSvg size={512} />, {
    width: 512,
    height: 512,
    headers: { "Cache-Control": "public, max-age=31536000, immutable" },
  });
}
