"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { EstimateWizard } from "@/components/EstimateWizard";
import {
  ADDON_PROJECT_TYPES,
  CORE_PROJECT_TYPES,
  PROJECT_TYPES,
  formatRange,
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

  const lockedPrimaryType = useMemo(() => {
    const raw = (searchParams.get("type") || "").trim();
    if (!raw || !VALID_TYPES.has(raw)) return undefined;
    return raw as ProjectTypeId;
  }, [searchParams]);

  const initialTypes = useMemo(() => {
    if (lockedPrimaryType) return [lockedPrimaryType];
    const multi = searchParams.get("types") || "";
    return multi
      .split(",")
      .map((t) => t.trim())
      .filter((t): t is ProjectTypeId => VALID_TYPES.has(t));
  }, [lockedPrimaryType, searchParams]);

  const focusService = useMemo(() => {
    if (!lockedPrimaryType) return null;
    return PROJECT_TYPES.find((p) => p.id === lockedPrimaryType) ?? null;
  }, [lockedPrimaryType]);

  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
      <div className="mb-8 flex flex-col items-start gap-4 border-b border-border/60 pb-8">
        <BrandLogo variant="lockup" className="h-10 w-auto sm:h-12" priority />
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan">
            {focusService ? "Service quote" : "Project quote"}
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {focusService ? `${focusService.label} quote` : "Build your Veyra Labs quote"}
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
            {focusService
              ? `This quote is for ${focusService.label} only. You can add optional add-ons and specifications — the price updates live. Then download or print your PDF. Every quote gets a tracked ID.`
              : "Choose services, set scope and timeline, then download or print your quote PDF. Every quote gets a tracked ID on our side."}
          </p>
          {focusService && (
            <p className="mt-3 inline-flex rounded-full border border-violet/40 bg-violet/10 px-3 py-1 text-[11px] font-semibold text-violet">
              Base package: {formatRange(focusService.baseMin, focusService.baseMax)}
            </p>
          )}
        </div>
      </div>

      <EstimateWizard
        pageMode
        source="quote_page"
        initialTypes={initialTypes}
        lockedPrimaryType={lockedPrimaryType}
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
