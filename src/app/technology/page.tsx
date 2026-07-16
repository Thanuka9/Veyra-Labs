import type { Metadata } from "next";
import { InnerPageLayout } from "@/components/InnerPageLayout";
import { TechMarquee } from "@/components/TechMarquee";
import { TechStack } from "@/components/TechStack";

export const metadata: Metadata = {
  title: "Technology",
  description:
    "Production stack at Veyra Labs  -  Next.js, Python, FastAPI, Google Cloud, OpenAI, PostgreSQL, Stripe and enterprise-grade tooling.",
  alternates: { canonical: "/technology" },
};

export default function TechnologyPage() {
  return (
    <InnerPageLayout
      hero={{
        eyebrow: "Stack",
        accent: "cyan",
        title: "Technology",
        subtitle:
          "Battle-tested tools we use to design, build and deploy intelligent products on Google Cloud  -  every item below has shipped in a live client project.",
        breadcrumbs: [{ label: "Home", href: "/" }, { label: "Technology" }],
        cta: { label: "Contact Us", href: "/contact" },
      }}
    >
      <TechMarquee embedded />
      <TechStack showHeading={false} inner />
    </InnerPageLayout>
  );
}
