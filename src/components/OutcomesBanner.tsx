"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, TrendingUp } from "lucide-react";
import { outcomes } from "@/lib/content";
import { cn } from "@/lib/cn";
import { useScrollTrigger } from "./Reveal";
import { TiltCard } from "./TiltCard";

/**
 * CountUp  -  uses direct DOM refs for every-frame updates.
 * Only 2 React setState calls total (phase: idle→running→done),
 * not 2 calls × 60fps for the entire duration.
 */
function CountUp({
  target,
  suffix,
  delayMs,
  durationMs,
}: {
  target: number;
  suffix: string;
  delayMs: number;
  durationMs: number;
}) {
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
  const rafRef = useRef(0);
  const digitsRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const shimmerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setPhase("idle");
    cancelAnimationFrame(rafRef.current);
    if (digitsRef.current) digitsRef.current.textContent = "0";
    if (barRef.current) barRef.current.style.width = "0%";

    const timer = window.setTimeout(() => {
      setPhase("running");
      const start = performance.now();

      const tick = (now: number) => {
        const p = Math.min((now - start) / durationMs, 1);
        const eased = 1 - Math.pow(1 - p, 4);
        const val = Math.round(eased * target);
        const pct = Math.round(eased * 100);

        // Direct DOM  -  zero React overhead per frame
        if (digitsRef.current) digitsRef.current.textContent = String(val);
        if (barRef.current) barRef.current.style.width = `${pct}%`;
        if (shimmerRef.current) shimmerRef.current.style.width = `${pct}%`;

        if (p < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          if (digitsRef.current) digitsRef.current.textContent = String(target);
          if (barRef.current) barRef.current.style.width = "100%";
          setPhase("done");
        }
      };

      rafRef.current = requestAnimationFrame(tick);
    }, delayMs);

    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(rafRef.current);
    };
  }, [target, delayMs, durationMs]);

  return (
    <div className="outcome-count-wrap">
      <div className="relative">
        {phase === "running" && (
          <span className="outcome-count-glow pointer-events-none absolute inset-0 -m-3 rounded-2xl" aria-hidden />
        )}
        <div
          className={cn(
            "outcome-count relative text-4xl font-bold tracking-tight sm:text-5xl tabular-nums",
            phase === "idle" && "text-muted/45",
            (phase === "running" || phase === "done") && "outcome-count--done text-gradient"
          )}
        >
          <span ref={digitsRef} className="outcome-count-digits">0</span>
          <span className="outcome-count-suffix">{suffix}</span>
        </div>
      </div>

      <div className="outcome-count-track relative mt-3 h-2 overflow-hidden rounded-full">
        <div
          ref={barRef}
          className="outcome-count-bar h-full rounded-full bg-gradient-to-r from-violet via-indigo to-cyan"
          style={{ width: "0%" }}
        />
        {phase === "running" && (
          <span ref={shimmerRef} className="outcome-count-shimmer pointer-events-none absolute inset-y-0 left-0 rounded-full" style={{ width: "0%" }} aria-hidden />
        )}
      </div>

      {phase === "done" && (
        <p className="outcome-count-done-label mt-2 text-[10px] font-semibold uppercase tracking-wider text-emerald-400/90">
          Verified in production
        </p>
      )}
    </div>
  );
}

function ZeroPlaceholder({ suffix }: { suffix: string }) {
  return (
    <div className="outcome-count-wrap">
      <div className="outcome-count text-4xl font-bold tracking-tight text-muted/40 sm:text-5xl tabular-nums">
        <span className="outcome-count-digits outcome-count-digits--waiting">0</span>
        <span className="outcome-count-suffix">{suffix}</span>
      </div>
      <div className="outcome-count-track mt-3 h-2 overflow-hidden rounded-full">
        <div className="outcome-count-bar h-full w-0 rounded-full bg-gradient-to-r from-violet to-cyan" />
      </div>
    </div>
  );
}

export function OutcomesBanner({ condensed = false }: { condensed?: boolean }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const started = useScrollTrigger(gridRef, { rootMargin: "0px 0px -5% 0px", threshold: 0.02 });
  const [run, setRun] = useState(0);
  const [countDuration, setCountDuration] = useState(2800);

  useEffect(() => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setCountDuration(rm ? 700 : 2800);
  }, []);

  useEffect(() => {
    if (!started) return;
    setRun((n) => n + 1);
  }, [started]);

  return (
    <section
      id="outcomes"
      className={cn(
        "section-tone-b relative overflow-hidden border-y border-border py-12 sm:py-16 transition-colors duration-1000",
        started && "outcomes-section--live"
      )}
    >
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />
      <div
        className={cn(
          "pointer-events-none absolute left-1/2 top-1/2 h-[480px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition-opacity duration-1000",
          started && "outcomes-ambient-glow opacity-100"
        )}
        aria-hidden
      />

      <div className="container-page relative">
        <div
          className={cn(
            "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
            started ? "outcomes-header--in" : "outcomes-header--idle"
          )}
        >
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-400">
              <TrendingUp size={14} />
              Proven client outcomes
            </span>
            <h2 className="mt-4 max-w-xl text-balance text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              Numbers that matter to your business
            </h2>
            <p className="mt-2 max-w-lg text-sm text-muted sm:text-base">
              {condensed
                ? "Production metrics from systems we've shipped."
                : "Real metrics from production systems we've designed, built and deployed."}
            </p>
          </div>
          <a
            href="/pricing"
            className="group hidden shrink-0 items-center gap-2 rounded-xl border border-border bg-surface px-5 py-3 text-sm font-semibold transition-colors hover:border-violet/40 sm:inline-flex"
          >
            See project estimates
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>

        <div className="mt-6 sm:hidden">
          <a
            href="/pricing"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface px-5 py-3 text-sm font-semibold"
          >
            See project estimates
            <ArrowRight size={16} />
          </a>
        </div>

        <div ref={gridRef} className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {outcomes.map((o, i) => {
            const target = parseInt(o.value, 10);
            const suffix = o.suffix ?? "";
            return (
              <TiltCard key={o.label} className="h-full">
                <div
                  className={cn(
                    "outcome-card group relative h-full overflow-hidden rounded-2xl border border-border bg-surface p-6",
                    started && "outcome-card--enter"
                  )}
                  style={{ animationDelay: started ? `${80 + i * 110}ms` : undefined }}
                >
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[radial-gradient(closest-side,rgba(124,92,255,0.14),transparent)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <span className="inline-block rounded-md border border-border bg-surface-2 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-violet">
                    {o.category}
                  </span>

                  <div className="mt-4 min-h-[5.5rem]">
                    {started && run > 0 ? (
                      <CountUp
                        key={`${run}-${o.label}`}
                        target={target}
                        suffix={suffix}
                        delayMs={200 + i * 160}
                        durationMs={countDuration}
                      />
                    ) : (
                      <ZeroPlaceholder suffix={suffix} />
                    )}
                  </div>

                  <p
                    className={cn(
                      "mt-3 text-sm font-semibold leading-snug transition-colors duration-500",
                      started ? "text-foreground" : "text-foreground/70"
                    )}
                  >
                    {o.label}
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted">{condensed ? o.project : o.detail}</p>
                  {!condensed && (
                    <p className="mt-4 border-t border-border pt-3 text-[11px] font-medium text-cyan/80">
                      {o.project}
                    </p>
                  )}
                </div>
              </TiltCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
