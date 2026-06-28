import type { Metadata } from "next";
import { InnerPageLayout } from "@/components/InnerPageLayout";
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
    <InnerPageLayout
      hero={{
        eyebrow: "Portfolio",
        accent: "indigo",
        title: "Work & case studies",
        subtitle:
          "Flagship deliveries and our full portfolio — SaaS, AI, data systems and premium websites engineered for production.",
        breadcrumbs: [{ label: "Home", href: "/" }, { label: "Work" }],
        cta: { label: "Start a project", href: "/contact" },
        secondaryCta: { label: "View pricing", href: "/pricing" },
      }}
    >
      <FeaturedWork variant="full" showHeading={false} inner />
      <Work showHeading={false} inner />
    </InnerPageLayout>
  );
}
