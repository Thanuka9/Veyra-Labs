"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { LucideIcon as LucideIconType } from "lucide-react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Brain,
  Calculator,
  ChartColumn,
  Check,
  Database,
  Cloud,
  Download,
  Gauge,
  Globe,
  Layers,
  Link2,
  Loader2,
  Mail,
  Palette,
  Printer,
  Shield,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Zap,
} from "lucide-react";
import {
  ESTIMATE_DISCLAIMER,
  ADDON_PROJECT_TYPES,
  CORE_PROJECT_TYPES,
  TIMELINE_OPTIONS,
  formatRange,
  getIncludedScopeIds,
  getScopeForTypes,
  getScopeGroupedByType,
  previewEstimateTotals,
  PROJECT_TYPES,
  SCOPE_OPTIONS,
  type ProjectEstimate,
  type ProjectTypeId,
} from "@/lib/estimate";
import { downloadEstimatePdf, printEstimatePdf } from "@/lib/estimate-pdf";
import { sendEstimateEmail, isEmailConfigured } from "@/lib/email";
import {
  createTrackedEstimateClient,
  markEstimateEmailSentClient,
  type EstimateSource,
} from "@/lib/estimate-client";
import { CONTACT_EMAIL } from "@/lib/content";
import { BrandLogo } from "./BrandLogo";
import { LucideIcon } from "./LucideIcon";
import { cn } from "@/lib/cn";

const PROJECT_ICONS: Record<string, LucideIconType> = {
  palette: Palette,
  cart: ShoppingCart,
  globe: Globe,
  layers: Layers,
  brain: Brain,
  chart: ChartColumn,
  database: Database,
  cloud: Cloud,
  shield: Shield,
  smartphone: Smartphone,
  bar: BarChart3,
  link: Link2,
  gauge: Gauge,
  sparkles: Sparkles,
};

type Step = "services" | "scope" | "timeline" | "details" | "result";

type EstimateWizardProps = {
  onComplete: (estimate: ProjectEstimate, emailSent: boolean) => void;
  onCancel: () => void;
  /** Fills the chat estimate pane instead of inline in messages */
  embedded?: boolean;
  /** Full-page quote experience */
  pageMode?: boolean;
  /** Pre-select services (e.g. from /quote?type=ecommerce) */
  initialTypes?: ProjectTypeId[];
  /**
   * When set (pricing deep-link), this service stays locked as the quote primary.
   * User may only add/remove add-ons and adjust scope — not switch to another core package.
   */
  lockedPrimaryType?: ProjectTypeId;
  /** Where this estimate was started — stored with the ID in the database */
  source?: EstimateSource;
};

export function EstimateWizard({
  onComplete,
  onCancel,
  embedded,
  pageMode,
  initialTypes,
  lockedPrimaryType,
  source = "chat",
}: EstimateWizardProps) {
  const seededTypes = (() => {
    const fromUrl = initialTypes?.filter(Boolean) ?? [];
    if (lockedPrimaryType && !fromUrl.includes(lockedPrimaryType)) {
      return [lockedPrimaryType, ...fromUrl];
    }
    if (lockedPrimaryType && fromUrl.length === 0) return [lockedPrimaryType];
    return fromUrl;
  })();

  const [selectedTypes, setSelectedTypes] = useState<ProjectTypeId[]>(() => seededTypes);
  const [selectedScope, setSelectedScope] = useState<string[]>(() =>
    seededTypes.length ? getIncludedScopeIds(seededTypes) : []
  );
  const [timelineId, setTimelineId] = useState<"standard" | "rush">("standard");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientCompany, setClientCompany] = useState("");
  const [notes, setNotes] = useState("");
  const [estimate, setEstimate] = useState<ProjectEstimate | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [step, setStep] = useState<Step>(() => {
    if (seededTypes.length === 0) return "services";
    // Focused quote from Pricing: start on optional add-ons, then scope/specs
    if (lockedPrimaryType) return "services";
    const hasScope = getScopeGroupedByType(seededTypes).some((g) => g.options.length > 0);
    return hasScope ? "scope" : "timeline";
  });

  const wizardTopRef = useRef<HTMLDivElement>(null);

  // Keep each step starting at the top of the form (not scrolled to Continue)
  useEffect(() => {
    const el = wizardTopRef.current;
    if (!el) return;
    // Prefer scrolling the wizard into view near the top of the viewport
    const rect = el.getBoundingClientRect();
    const absoluteTop = window.scrollY + rect.top;
    window.scrollTo({ top: Math.max(0, absoluteTop - 88), behavior: "smooth" });
  }, [step]);

  const lockedPrimary = lockedPrimaryType;
  const lockedProject = lockedPrimary
    ? PROJECT_TYPES.find((p) => p.id === lockedPrimary) ?? null
    : null;

  useEffect(() => {
    const next = (() => {
      const fromUrl = initialTypes?.filter(Boolean) ?? [];
      if (lockedPrimaryType && !fromUrl.includes(lockedPrimaryType)) {
        return [lockedPrimaryType, ...fromUrl];
      }
      if (lockedPrimaryType && fromUrl.length === 0) return [lockedPrimaryType];
      return fromUrl;
    })();
    if (next.length === 0) return;
    setSelectedTypes(next);
    setSelectedScope(getIncludedScopeIds(next));
    if (lockedPrimaryType) {
      setStep((current) => (current === "result" ? current : "services"));
    } else {
      const hasScope = getScopeGroupedByType(next).some((g) => g.options.length > 0);
      setStep((current) => (current === "result" ? current : hasScope ? "scope" : "timeline"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync when URL type / lock changes
  }, [lockedPrimaryType, initialTypes?.join(",")]);

  const scopeGroups = useMemo(() => getScopeGroupedByType(selectedTypes), [selectedTypes]);
  const hasScopeStep = scopeGroups.some((g) => g.options.length > 0);
  const steps: Step[] = hasScopeStep
    ? ["services", "scope", "timeline", "details", "result"]
    : ["services", "timeline", "details", "result"];
  const stepIndex = steps.indexOf(step);

  const liveTotal = previewEstimateTotals({
    projectTypeIds: selectedTypes,
    selectedScopeIds: selectedScope,
    timelineId,
  });

  function toggleType(id: ProjectTypeId) {
    // Locked primary from Pricing cannot be removed or swapped for another core package
    if (lockedPrimary && id === lockedPrimary) return;
    if (lockedPrimary) {
      const target = PROJECT_TYPES.find((p) => p.id === id);
      // In focused quote mode, only add-ons can be toggled alongside the primary
      if (target?.category === "core") return;
    }

    setSelectedTypes((prev) => {
      const next = prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id];
      if (lockedPrimary && !next.includes(lockedPrimary)) {
        next.unshift(lockedPrimary);
      }
      const validIds = new Set(getScopeForTypes(next).map((o) => o.id));
      const included = getIncludedScopeIds(next);
      setSelectedScope((scope) => {
        const kept = scope.filter((sid) => validIds.has(sid));
        const merged = new Set([...kept, ...included]);
        return Array.from(merged);
      });
      return next;
    });
  }

  function toggleScope(id: string) {
    const opt = SCOPE_OPTIONS.find((o) => o.id === id);
    setSelectedScope((prev) => {
      if (prev.includes(id)) return prev.filter((s) => s !== id);
      let next = [...prev, id];
      if (opt?.exclusiveGroup) {
        const rivals = new Set(
          SCOPE_OPTIONS.filter(
            (o) => o.exclusiveGroup === opt.exclusiveGroup && o.id !== id
          ).map((o) => o.id)
        );
        next = next.filter((s) => !rivals.has(s));
      }
      return next;
    });
  }

  function goNext(from: Step) {
    const idx = steps.indexOf(from);
    if (idx < steps.length - 1) setStep(steps[idx + 1]);
  }

  function goBack(from: Step) {
    const idx = steps.indexOf(from);
    if (idx > 0) setStep(steps[idx - 1]);
  }

  async function handleGenerate() {
    if (selectedTypes.length === 0 || generating) return;
    if (!clientName.trim() || !clientEmail.trim()) {
      setEmailError("Name and email are required so we can save and track your quote ID.");
      return;
    }

    setGenerating(true);
    setEmailError(null);

    try {
      // Server assigns & persists the estimate ID (source of truth)
      const result = await createTrackedEstimateClient({
        projectTypeIds: selectedTypes,
        selectedScopeIds: selectedScope,
        timelineId,
        clientName: clientName.trim(),
        clientEmail: clientEmail.trim(),
        clientCompany: clientCompany.trim() || undefined,
        notes: notes.trim() || undefined,
        source,
      });

      let sent = false;
      if (isEmailConfigured()) {
        try {
          await sendEstimateEmail(result);
          sent = true;
          setEmailSent(true);
          await markEstimateEmailSentClient(result.id, true);
        } catch {
          setEmailError("We couldn't email the team  -  download the PDF or try again below.");
          setEmailSent(false);
        }
      } else {
        setEmailError("Email isn't configured on this environment  -  download your PDF below.");
      }

      setEstimate(result);
      setStep("result");
      onComplete(result, sent);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Could not save your estimate. Please try again.";
      setEmailError(message);
    } finally {
      setGenerating(false);
    }
  }

  async function handleDownload() {
    if (!estimate) return;
    setDownloading(true);
    try {
      await downloadEstimatePdf(estimate);
    } finally {
      setDownloading(false);
    }
  }

  async function handlePrint() {
    if (!estimate) return;
    setDownloading(true);
    try {
      await printEstimatePdf(estimate);
    } finally {
      setDownloading(false);
    }
  }

  async function handleResendEmail() {
    if (!estimate || resending) return;
    setResending(true);
    setEmailError(null);
    try {
      await sendEstimateEmail(estimate);
      setEmailSent(true);
      await markEstimateEmailSentClient(estimate.id, true);
    } catch {
      setEmailError(`Send failed  -  please email ${CONTACT_EMAIL} with your estimate ID.`);
    } finally {
      setResending(false);
    }
  }

  return (
    <motion.div
      ref={wizardTopRef}
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "overflow-hidden rounded-xl border border-violet/30 bg-gradient-to-b from-violet/10 to-surface shadow-[0_0_32px_-12px_rgba(124,92,255,0.35)]",
        embedded && "flex h-full min-h-0 flex-col rounded-none border-0 shadow-none",
        pageMode && "rounded-2xl border-border shadow-[0_24px_60px_-28px_rgba(15,23,42,0.45)]"
      )}
    >
      {/* Header  -  compact when embedded in chat (panel header already shows brand) */}
      <div className={cn("border-b border-violet/20 bg-surface-2/50", embedded ? "px-3 py-2.5" : "px-4 py-3", pageMode && "px-5 py-4")}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-3">
            {pageMode ? (
              <BrandLogo variant="lockup" className="h-8 w-auto shrink-0 sm:h-9" />
            ) : !embedded ? (
              <BrandLogo variant="wordmark" className="h-7 w-auto shrink-0" />
            ) : null}
            {!pageMode && (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet/20">
                <LucideIcon icon={Calculator} size={14} className="text-violet" />
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-foreground">
                {pageMode ? "Quote builder" : embedded ? "Build your estimate" : "Veyra Labs"}
              </p>
              <p className="text-[10px] text-muted">
                Step {stepIndex + 1} of {steps.length}
                {selectedTypes.length > 0 && step !== "services"
                  ? ` · ${selectedTypes.length} service${selectedTypes.length > 1 ? "s" : ""} selected`
                  : ""}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {liveTotal && step !== "result" && (
              <span className="rounded-full border border-cyan/30 bg-cyan/10 px-2 py-0.5 text-[10px] font-bold text-cyan">
                ~{formatRange(liveTotal.min, liveTotal.max)}
              </span>
            )}
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg px-2 py-1 text-[11px] font-medium text-muted transition-colors hover:bg-surface hover:text-foreground"
            >
              {pageMode ? "Back to pricing" : "Cancel"}
            </button>
          </div>
        </div>
      </div>

      <div className="h-1 bg-surface-2">
        <motion.div
          className="h-full bg-gradient-to-r from-violet to-cyan"
          initial={false}
          animate={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      <div
        className={cn(
          "overflow-y-auto p-4",
          embedded ? "min-h-0 flex-1" : pageMode ? "max-h-none p-5 sm:p-6" : "max-h-[min(52vh,420px)]"
        )}
      >
        <AnimatePresence mode="wait">
          {step === "services" && (
            <motion.div
              key="services"
              initial={false}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
            >
              {lockedProject ? (
                <>
                  <p className="text-xs font-semibold text-foreground">
                    Quoting: {lockedProject.label}
                  </p>
                  <p className="mb-3 mt-1 text-[10px] leading-relaxed text-muted">
                    This quote is locked to {lockedProject.label}. Add optional add-ons below —
                    specs on the next step adjust the price live.
                  </p>
                  <div className="mb-4 rounded-xl border border-violet/50 bg-violet/15 p-3">
                    <div className="flex items-start gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet/25">
                        <LucideIcon
                          icon={PROJECT_ICONS[lockedProject.icon] ?? Sparkles}
                          size={16}
                          className="text-violet"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[11px] font-bold leading-tight">{lockedProject.label}</span>
                        <p className="mt-0.5 text-[10px] leading-snug text-muted">
                          {lockedProject.description}
                        </p>
                        <p className="mt-1 text-[10px] font-semibold text-cyan">
                          Base {formatRange(lockedProject.baseMin, lockedProject.baseMax)}
                        </p>
                      </div>
                      <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-300">
                        Locked
                      </span>
                    </div>
                  </div>
                  <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-violet">
                    Optional add-ons
                  </p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {ADDON_PROJECT_TYPES.filter((pt) => pt.id !== lockedPrimary).map((pt) => {
                      const Icon = PROJECT_ICONS[pt.icon] ?? Sparkles;
                      const selected = selectedTypes.includes(pt.id);
                      return (
                        <button
                          key={pt.id}
                          type="button"
                          onClick={() => toggleType(pt.id)}
                          className={cn(
                            "relative flex items-start gap-2.5 rounded-xl border p-3 text-left transition-all",
                            selected
                              ? "border-violet/60 bg-violet/15 shadow-[0_0_20px_-8px_rgba(124,92,255,0.5)]"
                              : "border-border bg-surface-2/80 hover:border-violet/30"
                          )}
                        >
                          <div
                            className={cn(
                              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                              selected ? "bg-violet/25" : "bg-violet/10"
                            )}
                          >
                            <LucideIcon
                              icon={Icon}
                              size={16}
                              className={selected ? "text-violet" : "text-cyan/80"}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-[11px] font-bold leading-tight">{pt.label}</span>
                            <p className="mt-0.5 text-[10px] leading-snug text-muted">{pt.description}</p>
                            <p className="mt-1 text-[10px] font-semibold text-cyan">
                              +{formatRange(pt.baseMin, pt.baseMax)}
                            </p>
                          </div>
                          {selected && (
                            <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-violet text-white">
                              <Check size={10} strokeWidth={3} />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : (
                <>
                  <p className="text-xs font-semibold text-foreground">Select all services you need</p>
                  <p className="mb-3 mt-1 text-[10px] leading-relaxed text-muted">
                    Pick one or more  -  we&apos;ll combine scope and pricing for mixed projects.
                  </p>
                  {[
                    { title: "Core packages", types: CORE_PROJECT_TYPES },
                    { title: "Add-on services", types: ADDON_PROJECT_TYPES },
                  ].map((group, gi) => (
                    <div key={group.title} className={gi > 0 ? "mt-4" : undefined}>
                      <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-violet">
                        {group.title}
                      </p>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {group.types.map((pt) => {
                          const Icon = PROJECT_ICONS[pt.icon] ?? Sparkles;
                          const selected = selectedTypes.includes(pt.id);
                          return (
                            <button
                              key={pt.id}
                              type="button"
                              onClick={() => toggleType(pt.id)}
                              className={cn(
                                "relative flex items-start gap-2.5 rounded-xl border p-3 text-left transition-all",
                                selected
                                  ? "border-violet/60 bg-violet/15 shadow-[0_0_20px_-8px_rgba(124,92,255,0.5)]"
                                  : "border-border bg-surface-2/80 hover:border-violet/30"
                              )}
                            >
                              <div
                                className={cn(
                                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                                  selected ? "bg-violet/25" : "bg-violet/10"
                                )}
                              >
                                <LucideIcon
                                  icon={Icon}
                                  size={16}
                                  className={selected ? "text-violet" : "text-cyan/80"}
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <span className="text-[11px] font-bold leading-tight">{pt.label}</span>
                                <p className="mt-0.5 text-[10px] leading-snug text-muted">
                                  {pt.description}
                                </p>
                                <p className="mt-1 text-[10px] font-semibold text-cyan">
                                  {formatRange(pt.baseMin, pt.baseMax)}
                                </p>
                              </div>
                              {selected && (
                                <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-violet text-white">
                                  <Check size={10} strokeWidth={3} />
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </>
              )}
              {selectedTypes.length > 0 && (
                <p className="mt-3 text-[10px] font-medium text-emerald-400">
                  {selectedTypes.length} service{selectedTypes.length > 1 ? "s" : ""} selected
                  {liveTotal ? ` · live total ~${formatRange(liveTotal.min, liveTotal.max)}` : ""}
                </p>
              )}
              <WizardNav
                nextDisabled={selectedTypes.length === 0}
                onNext={() => goNext("services")}
                nextLabel={hasScopeStep ? "Continue to specifications" : "Continue"}
              />
            </motion.div>
          )}

          {step === "scope" && (
            <motion.div
              key="scope"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-xs font-semibold text-foreground">Specifications & scope</p>
              <p className="mb-3 mt-1 text-[10px] text-muted">
                Choose options for your service
                {lockedProject ? ` (${lockedProject.label})` : ""}. Included items are pre-selected —
                paid options raise the live total in the header.
              </p>
              <div className="space-y-4">
                {scopeGroups.map((group) => (
                  <div key={group.typeId}>
                    <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-violet">{group.label}</p>
                    <div className="space-y-1.5">
                      {group.options.map((opt) => {
                        const checked = selectedScope.includes(opt.id);
                        return (
                          <label
                            key={opt.id}
                            className={cn(
                              "flex cursor-pointer items-center justify-between gap-2 rounded-lg border px-3 py-2 transition-all",
                              checked
                                ? "border-cyan/40 bg-cyan/10"
                                : "border-border bg-surface-2/60 hover:border-violet/30"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleScope(opt.id)}
                                className="accent-violet"
                              />
                              <span className="text-[11px] font-medium">{opt.label}</span>
                            </div>
                            {(opt.min > 0 || opt.max > 0) ? (
                              <span className="shrink-0 text-[10px] font-semibold text-cyan">
                                +{formatRange(opt.min, opt.max)}
                              </span>
                            ) : (
                              <span className="shrink-0 text-[10px] font-medium text-emerald-400">
                                Included
                              </span>
                            )}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <WizardNav onBack={() => goBack("scope")} onNext={() => goNext("scope")} />
            </motion.div>
          )}

          {step === "timeline" && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
            >
              <p className="mb-3 text-xs font-semibold text-foreground">Delivery timeline</p>
              <div className="space-y-2">
                {TIMELINE_OPTIONS.map((t) => {
                  const selected = timelineId === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTimelineId(t.id)}
                      className={cn(
                        "flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-all",
                        selected
                          ? "border-violet/60 bg-violet/15"
                          : "border-border bg-surface-2/80 hover:border-violet/30"
                      )}
                    >
                      <LucideIcon icon={Zap} size={16} className={selected ? "text-violet" : "text-cyan/80"} />
                      <div>
                        <p className="text-[11px] font-bold">{t.label}</p>
                        <p className="text-[10px] text-muted">{t.note}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
              <WizardNav onBack={() => goBack("timeline")} onNext={() => goNext("timeline")} />
            </motion.div>
          )}

          {step === "details" && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-xs font-semibold text-foreground">Your details</p>
              <p className="mb-3 mt-1 text-[10px] text-muted">
                We&apos;ll email this quote to our team and send you a confirmation. Required to deliver your quote.
              </p>
              <div className="space-y-2">
                <input
                  required
                  placeholder="Your name *"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background/80 px-3 py-2.5 text-sm outline-none focus:border-violet/50"
                />
                <input
                  required
                  type="email"
                  placeholder="Email address *"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background/80 px-3 py-2.5 text-sm outline-none focus:border-violet/50"
                />
                <input
                  placeholder="Company name (optional)"
                  value={clientCompany}
                  onChange={(e) => setClientCompany(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background/80 px-3 py-2.5 text-sm outline-none focus:border-violet/50"
                />
                <textarea
                  placeholder="Brief project notes (optional)"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full resize-none rounded-lg border border-border bg-background/80 px-3 py-2.5 text-sm outline-none focus:border-violet/50"
                />
              </div>
              <DisclaimerBanner className="mt-3" />
              {emailError && (
                <div className="mt-3 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-[11px] leading-relaxed text-rose-200">
                  {emailError}
                </div>
              )}
              <WizardNav
                onBack={() => goBack("details")}
                onNext={handleGenerate}
                nextDisabled={!clientName.trim() || !clientEmail.trim() || generating}
                nextLabel={generating ? "Sending…" : "Generate & send quote"}
                nextLoading={generating}
              />
            </motion.div>
          )}

          {step === "result" && estimate && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <EstimateResultCard
                estimate={estimate}
                downloading={downloading}
                emailSent={emailSent}
                emailError={emailError}
                resending={resending}
                pageMode={pageMode}
                onDownload={handleDownload}
                onPrint={handlePrint}
                onResendEmail={handleResendEmail}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function EstimateResultCard({
  estimate,
  downloading,
  emailSent,
  emailError,
  resending,
  onDownload,
  onPrint,
  onResendEmail,
  compact,
  pageMode,
}: {
  estimate: ProjectEstimate;
  downloading?: boolean;
  emailSent?: boolean;
  emailError?: string | null;
  resending?: boolean;
  onDownload: () => void;
  onPrint?: () => void;
  onResendEmail?: () => void;
  compact?: boolean;
  pageMode?: boolean;
}) {
  return (
    <div className="space-y-3 print:space-y-4" id="veyra-quote-result">
      <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-2">
        <div className="flex items-center gap-2">
          <BrandLogo variant={pageMode ? "lockup" : "icon"} className={pageMode ? "h-8 w-auto" : "h-6 w-auto"} />
          {!pageMode && <span className="text-[11px] font-bold text-foreground">Veyra Labs</span>}
        </div>
        <span className="font-mono text-[10px] text-muted">{estimate.id}</span>
      </div>

      {emailSent && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 print:hidden">
          <Check size={14} className="shrink-0 text-emerald-400" />
          <p className="text-[10px] font-medium text-emerald-300">
            Quote emailed
            {estimate.clientEmail ? ` — confirmation sent to ${estimate.clientEmail}` : ""}.
            Download or print the PDF below for your records. We&apos;ll respond within 24 hours.
          </p>
        </div>
      )}

      {emailError && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-[10px] text-amber-200 print:hidden">
          {emailError}
        </div>
      )}

      <div className="rounded-xl border border-cyan/30 bg-cyan/5 p-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-cyan">Quote ready</p>
        <p className="mt-1 text-lg font-bold text-gradient-soft">
          {formatRange(estimate.totalMin, estimate.totalMax)}
        </p>
        <p className="mt-0.5 text-[11px] font-medium text-foreground">{estimate.projectLabel}</p>
        <p className="mt-0.5 text-[10px] text-muted">{estimate.timeline} · {estimate.timelineNote}</p>
      </div>

      {!compact && (
        <ul className="max-h-36 space-y-1 overflow-y-auto rounded-lg border border-border bg-surface-2/50 p-2.5 print:max-h-none">
          {estimate.lineItems.map((item) => (
            <li key={item.label} className="flex justify-between gap-2 text-[10px]">
              <span className="text-muted">{item.label}</span>
              <span className="shrink-0 font-semibold text-foreground">
                {item.min === 0 && item.max === 0 ? "Included" : formatRange(item.min, item.max)}
              </span>
            </li>
          ))}
        </ul>
      )}

      <DisclaimerBanner />

      <div className="grid gap-2 print:hidden sm:grid-cols-2">
        <button
          type="button"
          onClick={onDownload}
          disabled={downloading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet to-cyan py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_-8px_rgba(124,92,255,0.5)] transition-transform hover:scale-[1.01] disabled:opacity-60 sm:col-span-2"
        >
          {downloading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <LucideIcon icon={Download} size={16} className="text-white" />
          )}
          Download PDF quote
        </button>

        {onPrint && (
          <button
            type="button"
            onClick={onPrint}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface-2 py-2.5 text-xs font-semibold text-foreground transition-colors hover:border-violet/40"
          >
            <Printer size={14} />
            Print quote
          </button>
        )}

        {!emailSent && onResendEmail && (
          <button
            type="button"
            onClick={onResendEmail}
            disabled={resending}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface-2 py-2.5 text-xs font-semibold text-foreground transition-colors hover:border-violet/40 disabled:opacity-60",
              !onPrint && "sm:col-span-2"
            )}
          >
            {resending ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
            {resending ? "Sending…" : "Email this quote"}
          </button>
        )}
      </div>
    </div>
  );
}

function DisclaimerBanner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-2",
        className
      )}
    >
      <AlertTriangle size={14} className="mt-0.5 shrink-0 text-amber-400" />
      <p className="text-[10px] leading-relaxed text-amber-200/90">{ESTIMATE_DISCLAIMER}</p>
    </div>
  );
}

function WizardNav({
  onBack,
  onNext,
  nextDisabled,
  nextLabel = "Continue",
  nextLoading,
}: {
  onBack?: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  nextLoading?: boolean;
}) {
  return (
    <div className="mt-4 flex gap-2">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-[11px] font-medium text-muted hover:text-foreground"
        >
          <ArrowLeft size={12} />
          Back
        </button>
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled || nextLoading}
        className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet/80 to-violet px-4 py-2 text-[11px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        {nextLoading && <Loader2 size={12} className="animate-spin" />}
        {nextLabel}
        {!nextLoading && <ArrowRight size={12} />}
      </button>
    </div>
  );
}
