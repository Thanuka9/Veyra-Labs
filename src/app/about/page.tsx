import type { Metadata } from "next";
import { InnerPageLayout } from "@/components/InnerPageLayout";
import { BrandStory } from "@/components/BrandStory";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Veyra Labs — boutique software and AI engineering studio. Outcome-first SaaS, AI systems, e-commerce and premium websites with production-grade delivery worldwide.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <InnerPageLayout
      hero={{
        eyebrow: "Studio",
        accent: "emerald",
        title: "About Veyra Labs",
        subtitle:
          "A boutique software & AI engineering studio — outcome-driven delivery from first prototype to production on Google Cloud, with documented handoff and post-launch support.",
        breadcrumbs: [{ label: "Home", href: "/" }, { label: "About" }],
        cta: { label: "Work with us", href: "/#contact" },
        secondaryCta: { label: "View our work", href: "/work" },
      }}
    >
      <BrandStory inner />
    </InnerPageLayout>
  );
}
