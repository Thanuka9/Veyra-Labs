import type { Metadata } from "next";
import { InnerPageLayout } from "@/components/InnerPageLayout";
import { Contact } from "@/components/Contact";

export const metadata: Metadata = {
  title: "Contact & Discovery Call",
  description:
    "Ready to build something your clients will love? Book a free discovery call or send an inquiry to scope your AI, SaaS or custom software project.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <InnerPageLayout
      showCta={false}
      hero={{
        eyebrow: "Start a project",
        accent: "indigo",
        title: "Ready to build something your clients will love?",
        subtitle:
          "Tell us about your product, timeline and goals. We'll review your inquiry and respond within 24 hours with a clean technical outline and starting quote.",
        breadcrumbs: [{ label: "Home", href: "/" }, { label: "Contact" }],
      }}
    >
      <Contact showHeading={false} inner />
    </InnerPageLayout>
  );
}
