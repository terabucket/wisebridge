import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { ThemeProvider } from "@/components/theme/theme-provider";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://wisebridge.tech";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "WiseBridge — AI-powered design, development & SEO",
    template: "%s · WiseBridge",
  },
  description:
    "WiseBridge bridges your ideas to finished work. Chat with an AI consultant, confirm your requirements, and get Figma designs, websites and SEO strategy delivered — from $100.",
  keywords: ["AI consultant", "Figma design", "website development", "SEO consulting", "AI agency", "WiseBridge"],
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "WiseBridge",
    title: "WiseBridge — AI-powered design, development & SEO",
    description: "Chat with an AI consultant and get expert-reviewed design, development and SEO work delivered fast.",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfbfd" },
    { media: "(prefers-color-scheme: dark)", color: "#07070e" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
