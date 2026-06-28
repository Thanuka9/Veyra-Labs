"use client";

import { useRef } from "react";
import { ArrowRight, Calendar, CheckCircle2 } from "lucide-react";
import { process } from "@/lib/content";
import { cn } from "@/lib/cn";
import { SectionHeading } from "./SectionHeading";
import { useScrollTrigger } from "./Reveal";
import type { ProcessStep as ProcessStepType } from "@/lib/content";

function ProcessStepItem({
  step,
  index,
  live,
}: {
  step: ProcessStepType;
  index: number;
  live: boolean;
}) {
  return (
    <div
      className={cn("process-step-item", live && "process-step-item--enter")}
      style={{ animationDelay: live ? `${120 + index * 200}ms` : undefined }}
    >
      <div className="relative grid gap-6 lg:grid-cols-[80px_1fr] lg:gap-10">
        <div className="hidden lg:flex lg:flex-col lg:items-center">
          <div
            className={cn(
              "process-step-badge flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-violet/40 bg-violet/10 text-lg font-bold text-violet shadow-[0_0_24px_-8px_rgba(124,92,255,0.5)]",
              live && "process-step-badge--in"
            )}
            style={{ transitionDelay: live ? `${120 + index * 200 + 90}ms` : undefined }}
          >
            {step.no}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-violet/30 hover:shadow-[0_0_40px_-16px_rgba(124,92,255,0.35)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface-2 px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-violet/30 bg-violet/10 text-xs font-bold text-violet lg:hidden">
                {step.no}
              </span>
              <h3 className="text-lg font-bold">{step.title}</h3>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted">
              <Calendar size={12} className="text-cyan" />
              {step.duration}
            </span>
          </div>

          <div className="grid gap-6 p-6 lg:grid-cols-2 lg:gap-8">
            <div>
              <p className="text-sm leading-relaxed text-muted">{step.description}</p>
              <div className="mt-4 rounded-xl border border-cyan/20 bg-cyan/5 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-cyan">
                  What you get
                </p>
                <p className="mt-1 text-sm text-foreground/90">{step.clientGets}</p>
              </div>
            </div>

            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
                Deliverables
              </p>
              <ul className="space-y-2">
                {step.deliverables.map((d) => (
                  <li key={d} className="flex items-center gap-2 text-sm text-muted">
                    <CheckCircle2 size={14} className="shrink-0 text-violet" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Process() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const live = useScrollTrigger(sectionRef, { rootMargin: "0px 0px -5% 0px", threshold: 0.02 });

  return (
    <section id="process" className="section section-tone-a relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 h-px bg-gradient-to-r from-transparent via-violet/30 to-transparent" />
      <div className="container-page" ref={sectionRef}>
        <SectionHeading
          eyebrow="How we work"
          accent="violet"
          title={
            <>
              A clear path from{" "}
              <span className="text-gradient">idea to live product</span>
            </>
          }
          subtitle="Four structured phases with defined deliverables at every step. You always know what's happening, what's next, and what you're getting."
          align="left"
          wide
        />

        <div className="relative mt-16 space-y-6">
          <div
            className={cn(
              "process-timeline-line pointer-events-none absolute bottom-8 left-8 top-8 hidden w-px bg-gradient-to-b from-violet/60 via-cyan/40 to-transparent lg:block",
              live && "process-timeline-line--in"
            )}
            aria-hidden
          />

          {process.map((step, i) => (
            <ProcessStepItem key={step.no} step={step} index={i} live={live} />
          ))}
        </div>

        <div
          className={cn("process-cta mt-12 flex justify-center", live && "process-cta--enter")}
          style={{ animationDelay: live ? `${120 + process.length * 200 + 80}ms` : undefined }}
        >
          <a
            href="/#contact"
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet to-cyan px-7 py-4 text-sm font-semibold text-white shadow-[0_0_32px_-8px_rgba(124,92,255,0.6)] transition-transform hover:scale-[1.03]"
          >
            Start with a free discovery call
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
