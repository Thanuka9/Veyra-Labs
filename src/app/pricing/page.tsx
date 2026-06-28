import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { Pricing } from "@/components/Pricing";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Veyra Labs project estimates — transparent starting rates for e-commerce, websites, AI, SaaS, ML and data engineering engagements.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="relative z-[1] flex-1">
        <PageHero
          title="Pricing & estimates"
          subtitle="Starting rates by engagement type — every project scoped with a fixed quote, sprint demos and 30-day post-launch support."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Pricing" }]}
          tone="b"
        />
        <Pricing />
      </main>
      <Footer />
    </>
  );
}
