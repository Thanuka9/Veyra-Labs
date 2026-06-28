import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { BrandStory } from "@/components/BrandStory";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Veyra Labs — a boutique software and AI engineering studio building SaaS, AI systems, e-commerce and premium websites worldwide.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="relative z-[1] flex-1">
        <PageHero
          title="About Veyra Labs"
          subtitle="A boutique software & AI engineering studio — full-stack delivery from first prototype to production on Google Cloud."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        />
        <BrandStory />
      </main>
      <Footer />
    </>
  );
}
