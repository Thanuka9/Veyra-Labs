import type { Metadata } from "next";
import { Suspense } from "react";
import { InnerPageLayout } from "@/components/InnerPageLayout";
import { QuoteWizard } from "@/components/QuoteWizard";

export const metadata: Metadata = {
  title: "Get a Quote",
  description:
    "Generate a tracked Veyra Labs project estimate — choose services, scope and timeline for an instant ballpark quote with a unique estimate ID.",
  alternates: { canonical: "/quote" },
};

export default function QuotePage() {
  return (
    <InnerPageLayout
      showCta={false}
      hero={{
        eyebrow: "Project estimate",
        accent: "cyan",
        title: "Get a quote",
        subtitle:
          "Build a ballpark estimate in about a minute. Every quote gets a unique ID we track on our side — then download your PDF or wait for our follow-up within 24 hours.",
        breadcrumbs: [
          { label: "Home", href: "/" },
          { label: "Pricing", href: "/pricing" },
          { label: "Quote" },
        ],
        cta: { label: "Prefer to talk first?", href: "/contact" },
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
