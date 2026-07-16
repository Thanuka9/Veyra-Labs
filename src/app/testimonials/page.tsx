import type { Metadata } from "next";
import { InnerPageLayout } from "@/components/InnerPageLayout";
import { Testimonials } from "@/components/Testimonials";

export const metadata: Metadata = {
  title: "Testimonials",
  description:
    "Client testimonials from Veyra Labs engagements  -  verified feedback on SaaS, AI, e-commerce and website projects.",
  alternates: { canonical: "/testimonials" },
};

export default function TestimonialsPage() {
  return (
    <InnerPageLayout
      hero={{
        eyebrow: "Client feedback",
        accent: "emerald",
        title: "Client testimonials",
        subtitle:
          "Verified feedback from production engagements across the US, UK and Sri Lanka.",
        breadcrumbs: [{ label: "Home", href: "/" }, { label: "Testimonials" }],
        cta: { label: "Contact Us", href: "/contact" },
      }}
    >
      <Testimonials showHeading={false} inner theme="dark" />
    </InnerPageLayout>
  );
}
