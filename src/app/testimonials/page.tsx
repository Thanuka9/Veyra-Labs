import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { Testimonials } from "@/components/Testimonials";

export const metadata: Metadata = {
  title: "Testimonials",
  description:
    "Client testimonials from Veyra Labs engagements — verified feedback on SaaS, AI, e-commerce and website projects.",
  alternates: { canonical: "/testimonials" },
};

export default function TestimonialsPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="relative z-[1] flex-1">
        <PageHero
          title="Client testimonials"
          subtitle="Verified quotes from production engagements — role and industry only, no client names without written permission."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Testimonials" }]}
        />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}
