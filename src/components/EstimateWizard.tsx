"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { LucideIcon as LucideIconType } from "lucide-react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Brain,
  Calculator,
  ChartColumn,
  Check,
  Database,
  Cloud,
  Download,
  Globe,
  Layers,
  Loader2,
  Mail,
  Shield,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Zap,
} from "lucide-react";
import {
  ESTIMATE_DISCLAIMER,
  PROJECT_TYPES,
  TIMELINE_OPTIONS,
  buildEstimate,
  formatRange,
  getScopeForTypes,
  getScopeGroupedByType,
  previewEstimateTotals,
  type ProjectEstimate,
  type ProjectTypeId,
} from "@/lib/estimate";
import { downloadEstimatePdf } from "@/lib/estimate-pdf";
import { sendEstimateEmail, isEmailConfigured } from "@/lib/email";
import { CONTACT_EMAIL } from "@/lib/content";
import { BrandLogo } from "./BrandLogo";
import { LucideIcon } from "./LucideIcon";
import { cn } from "@/lib/cn";

const PROJECT_ICONS: Record<string, LucideIconType> = {
  cart: ShoppingCart,
  globe: Globe,
  layers: Layers,
  brain: Brain,
  chart: ChartColumn,
  database: Database,
  cloud: Cloud,
  shield: Shield,
  smartphone: Smartphone,
  sparkles: Sparkles,
};

type Step = "services" | "scope" | "timeline" | "details" | "result";

type EstimateWizardProps = {
  onComplete: (estimate: ProjectEstimate, emailSent: boolean) => void;
  onCancel: () => void;
  /** Fills the chat estimate pane instead of inline in messages */
  embedded?: boolean;
};

export function EstimateWizard({ onComplete, onCancel, embedded }: EstimateWizardProps) {
  const [step, setStep] = useState<Step>("services");
  const [selectedTypes, setSelectedTypes] = useState<ProjectTypeId[]>([]);
  const [selectedScope, setSelectedScope] = useState<string[]>([]);
  const [timelineId, setTimelineId] = useState<"standard" | "rush">("standard");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [estimate, setEstimate] = useState<ProjectEstimate | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [resending, setResending] = useState(false);

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
    setSelectedTypes((prev) => {
      const next = prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id];
      if (!next.includes(id)) {
        const validIds = new Set(getScopeForTypes(next).map((o) => o.id));
        setSelectedScope((scope) => scope.filter((sid) => validIds.has(sid)));
      }
      return next;
    });
  }

  function toggleScope(id: string) {
    setSelectedScope((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
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
    setGenerating(true);
    setEmailError(null);

    const result = buildEstimate({
      projectTypeIds: selectedTypes,
      selectedScopeIds: selectedScope,
      timelineId,
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim(),
      notes: notes.trim() || undefined,
    });

    let sent = false;
    if (isEmailConfigured() && clientName.trim() && clientEmail.trim()) {
      try {
        await sendEstimateEmail(result);
        sent = true;
        setEmailSent(true);
      } catch {
        setEmailError("We couldn't email the team — download the PDF or try again below.");
        setEmailSent(false);
      }
    } else if (!isEmailConfigured()) {
      setEmailError("Email isn't configured on this environment — download your PDF below.");
    }

    setEstimate(result);
    setStep("result");
    onComplete(result, sent);
    setGenerating(false);
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

  async function handleResendEmail() {
    if (!estimate || resending) return;
    setResending(true);
    setEmailError(null);
    try {
      await sendEstimateEmail(estimate);
      setEmailSent(true);
    } catch {
      setEmailError(`Send failed — please email ${CONTACT_EMAIL} with your estimate ID.`);
    } finally {
      setResending(false);
    }
  }

  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "overflow-hidden rounded-xl border border-violet/30 bg-gradient-to-b from-violet/10 to-surface shadow-[0_0_32px_-12px_rgba(124,92,255,0.35)]",
        embedded && "flex h-full min-h-0 flex-col rounded-none border-0 shadow-none"
      )}
    >
      {/* Header — compact when embedded in chat (panel header already shows brand) */}
      <div className={cn("border-b border-violet/20 bg-surface-2/50", embedded ? "px-3 py-2.5" : "px-4 py-3")}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            {!embedded && <BrandLogo variant="icon" className="h-8 w-8 shrink-0 rounded-lg" />}
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet/20">
              <LucideIcon icon={Calculator} size={14} className="text-violet" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-foreground">
                {embedded ? "Build your estimate" : "Veyra Labs"}
              </p>
              <p className="text-[10px] text-muted">
                Step {stepIndex + 1} of {steps.length}
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
              Cancel
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
          embedded ? "min-h-0 flex-1" : "max-h-[min(52vh,420px)]"
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
              <p className="text-xs font-semibold text-foreground">Select all services you need</p>
              <p className="mb-3 mt-1 text-[10px] leading-relaxed text-muted">
                Pick one or more — we&apos;ll combine scope and pricing for mixed projects.
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {PROJECT_TYPES.map((pt) => {
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
                        <LucideIcon icon={Icon} size={16} className={selected ? "text-violet" : "text-cyan/80"} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[11px] font-bold leading-tight">{pt.label}</span>
                        <p className="mt-0.5 text-[10px] leading-snug text-muted">{pt.description}</p>
                        <p className="mt-1 text-[10px] font-semibold text-cyan">{formatRange(pt.baseMin, pt.baseMax)}</p>
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
              {selectedTypes.length > 0 && (
                <p className="mt-3 text-[10px] font-medium text-emerald-400">
                  {selectedTypes.length} service{selectedTypes.length > 1 ? "s" : ""} selected
                </p>
              )}
              <WizardNav
                nextDisabled={selectedTypes.length === 0}
                onNext={() => goNext("services")}
                nextLabel={hasScopeStep ? "Continue to scope" : "Continue"}
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
              <p className="text-xs font-semibold text-foreground">Add scope options</p>
              <p className="mb-3 mt-1 text-[10px] text-muted">Select all that apply — skip anything you&apos;re unsure about.</p>
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
                            {(opt.min > 0 || opt.max > 0) && (
                              <span className="shrink-0 text-[10px] font-semibold text-cyan">
                                +{formatRange(opt.min, opt.max)}
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
                We&apos;ll email this estimate to our team and send you a confirmation. Required to deliver your quote.
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
                <textarea
                  placeholder="Brief project notes (optional)"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full resize-none rounded-lg border border-border bg-background/80 px-3 py-2.5 text-sm outline-none focus:border-violet/50"
                />
              </div>
              <DisclaimerBanner className="mt-3" />
              <WizardNav
                onBack={() => goBack("details")}
                onNext={handleGenerate}
                nextDisabled={!clientName.trim() || !clientEmail.trim() || generating}
                nextLabel={generating ? "Sending…" : "Generate & send estimate"}
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
                onDownload={handleDownload}
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
  onResendEmail,
  compact,
}: {
  estimate: ProjectEstimate;
  downloading?: boolean;
  emailSent?: boolean;
  emailError?: string | null;
  resending?: boolean;
  onDownload: () => void;
  onResendEmail?: () => void;
  compact?: boolean;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-2">
        <div className="flex items-center gap-2">
          <BrandLogo variant="icon" className="h-6 w-6" />
          <span className="text-[11px] font-bold text-foreground">Veyra Labs</span>
        </div>
        <span className="font-mono text-[10px] text-muted">{estimate.id}</span>
      </div>

      {emailSent && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2">
          <Check size={14} className="shrink-0 text-emerald-400" />
          <p className="text-[10px] font-medium text-emerald-300">
            Estimate sent to our team — we&apos;ll respond within 24 hours
            {estimate.clientEmail ? ` at ${estimate.clientEmail}` : ""}.
          </p>
        </div>
      )}

      {emailError && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-[10px] text-amber-200">
          {emailError}
        </div>
      )}

      <div className="rounded-xl border border-cyan/30 bg-cyan/5 p-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-cyan">Estimate ready</p>
        <p className="mt-1 text-lg font-bold text-gradient-soft">
          {formatRange(estimate.totalMin, estimate.totalMax)}
        </p>
        <p className="mt-0.5 text-[11px] font-medium text-foreground">{estimate.projectLabel}</p>
        <p className="mt-0.5 text-[10px] text-muted">{estimate.timeline} · {estimate.timelineNote}</p>
      </div>

      {!compact && (
        <ul className="max-h-36 space-y-1 overflow-y-auto rounded-lg border border-border bg-surface-2/50 p-2.5">
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

      <div className="grid gap-2">
        <button
          type="button"
          onClick={onDownload}
          disabled={downloading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet to-cyan py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_-8px_rgba(124,92,255,0.5)] transition-transform hover:scale-[1.01] disabled:opacity-60"
        >
          {downloading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <LucideIcon icon={Download} size={16} className="text-white" />
          )}
          Download PDF estimate
        </button>

        {!emailSent && onResendEmail && (
          <button
            type="button"
            onClick={onResendEmail}
            disabled={resending}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface-2 py-2.5 text-xs font-semibold text-foreground transition-colors hover:border-violet/40 disabled:opacity-60"
          >
            {resending ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
            {resending ? "Sending…" : "Send estimate to Veyra Labs"}
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
