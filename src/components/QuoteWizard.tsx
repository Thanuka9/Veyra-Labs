"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { EstimateWizard } from "@/components/EstimateWizard";
import {
  ADDON_PROJECT_TYPES,
  CORE_PROJECT_TYPES,
  type ProjectTypeId,
} from "@/lib/estimate";
import { trackEvent } from "@/components/GoogleAnalytics";

const VALID_TYPES = new Set<string>([
  ...CORE_PROJECT_TYPES.map((p) => p.id),
  ...ADDON_PROJECT_TYPES.map((p) => p.id),
]);

export function QuoteWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialTypes = useMemo(() => {
    const raw = searchParams.get("type") || searchParams.get("types") || "";
    return raw
      .split(",")
      .map((t) => t.trim())
      .filter((t): t is ProjectTypeId => VALID_TYPES.has(t));
  }, [searchParams]);

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
      <EstimateWizard
        pageMode
        source="quote_page"
        initialTypes={initialTypes}
        onCancel={() => router.push("/pricing")}
        onComplete={(estimate, emailSent) => {
          trackEvent("submit", "quote_page", estimate.projectLabel);
          if (emailSent) {
            trackEvent("email", "quote_page", estimate.id);
          }
        }}
      />
    </div>
  );
}
