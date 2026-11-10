import { Hero } from "@/components/home/hero";
import { Cta, Faq, FeaturedServices, HowItWorks, Pricing, Stats, ToolsMarquee, WhyBento } from "@/components/home/sections";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ToolsMarquee />
      <Stats />
      <FeaturedServices />
      <HowItWorks />
      <Pricing />
      <WhyBento />
      <Faq />
      <Cta />
    </>
  );
}
