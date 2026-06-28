import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { Services } from "@/components/Services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "SaaS engineering, AI & LLM implementation, e-commerce, premium websites, ML analytics and data engineering — scoped quotes from Veyra Labs.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="relative z-[1] flex-1">
        <PageHero
          title="Services"
          subtitle="Six core offerings with fixed-scope quotes, sprint demos and 30-day post-launch support — plus DevOps, security and PWA add-ons."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
          tone="b"
        />
        <Services />
      </main>
      <Footer />
    </>
  );
}
