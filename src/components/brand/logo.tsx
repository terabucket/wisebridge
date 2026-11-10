import { cn } from "@/lib/utils";

/**
 * WiseBridge mark: a bridge arch spanning two pillars, with a glowing
 * "insight" node at its apex — ideas crossing over to finished work.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-9 w-9", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="wb-bg" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366F1" />
          <stop offset="0.55" stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#06B6D4" />
        </linearGradient>
        <radialGradient id="wb-glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(24 19) scale(9)">
          <stop stopColor="#fff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="2" y="2" width="44" height="44" rx="13" fill="url(#wb-bg)" />
      <rect x="2.5" y="2.5" width="43" height="43" rx="12.5" stroke="#fff" strokeOpacity="0.25" />
      <circle cx="24" cy="19" r="9" fill="url(#wb-glow)" />
      {/* deck */}
      <path d="M9 33.5h30" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      {/* arch */}
      <path d="M11 33.5C14.5 22 19 18.5 24 18.5S33.5 22 37 33.5" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      {/* hangers */}
      <path d="M17.5 33.5v-8M24 33.5V22.5M30.5 33.5v-8" stroke="#fff" strokeOpacity="0.65" strokeWidth="2" strokeLinecap="round" />
      {/* insight node */}
      <circle cx="24" cy="18.5" r="3.25" fill="#fff" />
    </svg>
  );
}

export function Logo({ className, showText = true }: { className?: string; showText?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      {showText && (
        <span className="text-[1.15rem] font-semibold tracking-tight text-foreground">
          Wise<span className="text-gradient">Bridge</span>
        </span>
      )}
    </span>
  );
}
