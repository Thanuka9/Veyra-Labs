import type { Metadata } from "next";
import { InnerPageLayout } from "@/components/InnerPageLayout";
import { Pricing } from "@/components/Pricing";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Veyra Labs project estimates  -  transparent starting rates for e-commerce, websites, AI, SaaS, ML and data engineering engagements.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <InnerPageLayout
      hero={{
        eyebrow: "Estimates",
        accent: "cyan",
        title: "Pricing & estimates",
        subtitle:
          "Starting rates by engagement type  -  every project scoped with a fixed quote, sprint demos and 30-day post-launch support.",
        breadcrumbs: [{ label: "Home", href: "/" }, { label: "Pricing" }],
        cta: { label: "Get a quote", href: "/quote" },
        secondaryCta: { label: "Contact Us", href: "/contact" },
      }}
    >
      <Pricing showHeading={false} inner />
    </InnerPageLayout>
  );
}
