/* Shared building blocks for generated PNG images (OG cards, logo, apple icon). */

export function MarkSvg({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366F1" />
          <stop offset="0.55" stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="44" height="44" rx="13" fill="url(#g)" />
      <path d="M9 33.5h30" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      <path d="M11 33.5C14.5 22 19 18.5 24 18.5S33.5 22 37 33.5" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      <path d="M17.5 33.5v-8M24 33.5V22.5M30.5 33.5v-8" stroke="#fff" strokeOpacity="0.65" strokeWidth="2" strokeLinecap="round" />
      <circle cx="24" cy="18.5" r="3.25" fill="#fff" />
    </svg>
  );
}

export const OG_SIZE = { width: 1200, height: 630 };

export function OgCard({ eyebrow, title, subtitle, footer }: { eyebrow: string; title: string; subtitle: string; footer: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "radial-gradient(circle at 15% 0%, #312e81 0%, transparent 55%), radial-gradient(circle at 100% 100%, #155e75 0%, transparent 50%), #07070e",
        color: "#ededf5",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <MarkSvg size={72} />
        <div style={{ display: "flex", fontSize: 40, fontWeight: 700, letterSpacing: -1 }}>
          Wise<span style={{ color: "#a78bfa" }}>Bridge</span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", fontSize: 26, color: "#22d3ee", textTransform: "uppercase", letterSpacing: 4 }}>{eyebrow}</div>
        <div style={{ display: "flex", fontSize: title.length > 32 ? 64 : 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2, maxWidth: 1000 }}>
          {title}
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#9b9bb3", maxWidth: 980, lineHeight: 1.35 }}>{subtitle}</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#9b9bb3" }}>
        <span>wisebridge.tech</span>
        <span style={{ color: "#ededf5", fontWeight: 600 }}>{footer}</span>
      </div>
    </div>
  );
}
