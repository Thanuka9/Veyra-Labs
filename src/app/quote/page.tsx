import type { Metadata } from "next";
import { Suspense } from "react";
import { InnerPageLayout } from "@/components/InnerPageLayout";
import { QuoteWizard } from "@/components/QuoteWizard";

export const metadata: Metadata = {
  title: "Get a Quote",
  description:
    "Generate a tracked Veyra Labs project estimate — choose a service from Pricing, complete your quote, then download or print the PDF.",
  alternates: { canonical: "/quote" },
};

export default function QuotePage() {
  return (
    <InnerPageLayout
      showCta={false}
      hero={{
        eyebrow: "Instant ballpark",
        accent: "cyan",
        title: "Your project quote",
        subtitle:
          "Picked from Pricing? We’ll start with that service. Finish the short form, get a tracked quote ID, then download or print your PDF.",
        breadcrumbs: [
          { label: "Home", href: "/" },
          { label: "Pricing", href: "/pricing" },
          { label: "Quote" },
        ],
        cta: { label: "Back to pricing", href: "/pricing" },
        secondaryCta: { label: "Contact Us", href: "/contact" },
      }}
    >
      <Suspense
        fallback={
          <div className="mx-auto max-w-3xl px-4 pb-16 text-center text-sm text-muted">
            Loading quote wizard…
          </div>
        }
      >
        <QuoteWizard />
      </Suspense>
    </InnerPageLayout>
  );
}
