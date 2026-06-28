import type { Metadata } from "next";
import { InnerPageLayout } from "@/components/InnerPageLayout";
import { Services } from "@/components/Services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "SaaS engineering, AI & LLM implementation, e-commerce, premium websites, ML analytics and data engineering — scoped quotes from Veyra Labs.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <InnerPageLayout
      hero={{
        eyebrow: "What we build",
        accent: "violet",
        title: "Services",
        subtitle:
          "Six core offerings with fixed-scope quotes, sprint demos and 30-day post-launch support — plus DevOps, security and PWA add-ons.",
        breadcrumbs: [{ label: "Home", href: "/" }, { label: "Services" }],
        cta: { label: "Request a quote", href: "/#contact" },
        secondaryCta: { label: "See pricing", href: "/pricing" },
      }}
    >
      <Services showHeading={false} inner />
    </InnerPageLayout>
  );
}
