import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { JsonLd } from "@/components/json-ld";
import { graph, organizationLd, websiteLd } from "@/lib/seo";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={graph(organizationLd(), websiteLd())} />
      <Navbar />
      <main id="main" className="relative overflow-x-clip">
        {children}
      </main>
      <Footer />
    </>
  );
}
