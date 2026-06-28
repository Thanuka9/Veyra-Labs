import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { TechMarquee } from "@/components/TechMarquee";
import { TechStack } from "@/components/TechStack";

export const metadata: Metadata = {
  title: "Technology",
  description:
    "Production stack at Veyra Labs — Next.js, Python, FastAPI, Google Cloud, OpenAI, PostgreSQL, Stripe and enterprise-grade tooling.",
  alternates: { canonical: "/technology" },
};

export default function TechnologyPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="relative z-[1] flex-1">
        <PageHero
          title="Technology"
          subtitle="Battle-tested tools we use to design, build and deploy intelligent products on Google Cloud."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Technology" }]}
        />
        <TechMarquee />
        <TechStack />
      </main>
      <Footer />
    </>
  );
}
