import type { Metadata } from "next";
import { InnerPageLayout } from "@/components/InnerPageLayout";
import { Contact } from "@/components/Contact";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Ready to build something your clients will love? Contact us to scope your AI, SaaS or custom software project — we respond within 24 hours.",
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
