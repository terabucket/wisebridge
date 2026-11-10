import { Hero } from "@/components/home/hero";
import { Cta, Faq, FeaturedServices, HowItWorks, Pricing, Stats, ToolsMarquee, WhyBento } from "@/components/home/sections";
import { JsonLd } from "@/components/json-ld";
import { SITE_FAQS, faqLd, graph } from "@/lib/seo";

export default function HomePage() {
  return (
    <>
      <JsonLd data={graph(faqLd(SITE_FAQS))} />
      <Hero />
      <ToolsMarquee />
      <Stats />
      <FeaturedServices />
      <HowItWorks />
      <Pricing />
      <WhyBento />
      <Faq faqs={SITE_FAQS} />
      <Cta />
    </>
  );
}
