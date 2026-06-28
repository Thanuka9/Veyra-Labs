import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { FeaturedWork } from "@/components/FeaturedWork";
import { Work } from "@/components/Work";

export const metadata: Metadata = {
  title: "Work & Case Studies",
  description:
    "Explore Veyra Labs portfolio — enterprise SaaS, AI systems, e-commerce platforms and premium websites shipped to production.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="relative z-[1] flex-1">
        <PageHero
          title="Work & case studies"
          subtitle="Flagship deliveries and our full portfolio — SaaS, AI, data systems and premium websites engineered for production."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Work" }]}
        />
        <FeaturedWork variant="full" />
        <Work />
      </main>
      <Footer />
    </>
  );
}
