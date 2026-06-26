"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Quote, Star, ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { testimonials } from "@/lib/content";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/cn";

export function Testimonials() {
  const [active, setActive] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const count = testimonials.length;

  const next = () => setActive((a) => (a + 1) % count);
  const prev = () => setActive((a) => (a - 1 + count) % count);

  const restartInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(next, 5000);
  };

  useEffect(() => {
    restartInterval();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePrev = () => {
    prev();
    restartInterval();
  };
  const handleNext = () => {
    next();
    restartInterval();
  };
  const handleDot = (i: number) => {
    setActive(i);
    restartInterval();
  };

  const getVisible = () => {
    const p = (active - 1 + count) % count;
    const n = (active + 1) % count;
    return { prev: p, curr: active, next: n };
  };
  const { prev: prevIdx, curr: currIdx, next: nextIdx } = getVisible();

  const renderCard = (t: (typeof testimonials)[number], isCurrent: boolean) => (
  <>
    <div className="mb-3 flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={13} className="fill-amber-400 text-amber-400" />
      ))}
    </div>

    <Quote
      size={18}
      className={cn("mb-3 transition-colors duration-300", isCurrent ? "text-violet/80" : "text-violet/40")}
    />

    <blockquote className="flex-1 text-sm leading-relaxed text-foreground/90">&ldquo;{t.quote}&rdquo;</blockquote>

    <figcaption className="mt-5 border-t border-border/60 pt-4">
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white",
            isCurrent ? "bg-gradient-to-br from-violet to-cyan" : "bg-surface-2 text-muted"
          )}
          aria-hidden
        >
          {t.role.charAt(0)}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold">{t.role}</div>
          <div className="text-xs text-muted">{t.context}</div>
          <div className="mt-1 text-[10px] font-medium uppercase tracking-wider text-muted/70">
            Verified client · identity withheld
          </div>
        </div>
      </div>
      {t.projectSlug && (
        <Link
          href={`/case-studies/${t.projectSlug}`}
          className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-cyan hover:underline"
        >
          View related case study
          <ArrowUpRight size={12} />
        </Link>
      )}
    </figcaption>
  </>
  );

  return (
    <section id="testimonials" className="section relative overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(124,92,255,0.08),transparent)] blur-3xl" />

      <div className="container-page relative">
        <SectionHeading
          eyebrow="Client feedback"
          accent="emerald"
          title={
            <>
              Trusted to solve <span className="text-gradient">real bottlenecks</span>
            </>
          }
          subtitle="Quotes from verified engagements. We use role and industry only — no client names or logos without written permission."
        />

        <div className="mt-14 hidden lg:block">
          <div className="relative flex items-center gap-4">
            <button
              onClick={handlePrev}
              aria-label="Previous testimonial"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-muted transition-all hover:border-violet/40 hover:text-foreground hover:shadow-[0_0_20px_-6px_rgba(124,92,255,0.4)]"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex flex-1 items-stretch gap-4 overflow-hidden">
              {[prevIdx, currIdx, nextIdx].map((idx, pos) => {
                const t = testimonials[idx];
                const isCurrent = pos === 1;
                return (
                  <div
                    key={`${idx}-${pos}`}
                    onClick={() => !isCurrent && handleDot(idx)}
                    className={cn(
                      "group flex flex-col rounded-2xl border p-6 transition-all duration-500",
                      isCurrent
                        ? "flex-[1.3] scale-[1.02] border-violet/35 bg-surface shadow-[0_0_48px_-16px_rgba(124,92,255,0.45)]"
                        : "flex-1 cursor-pointer border-border bg-surface/60 opacity-55 hover:opacity-75"
                    )}
                  >
                    {renderCard(t, isCurrent)}
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleNext}
              aria-label="Next testimonial"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-muted transition-all hover:border-violet/40 hover:text-foreground hover:shadow-[0_0_20px_-6px_rgba(124,92,255,0.4)]"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="mt-6 flex justify-center gap-1.5">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => handleDot(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                className={cn(
                  "rounded-full transition-all duration-300",
                  i === active
                    ? "h-2 w-6 bg-gradient-to-r from-violet to-cyan shadow-[0_0_8px_rgba(124,92,255,0.6)]"
                    : "h-2 w-2 bg-border hover:bg-muted/60"
                )}
              />
            ))}
          </div>
        </div>

        <div className="mt-10 lg:hidden">
          <div className="relative overflow-hidden rounded-2xl border border-violet/25 bg-surface p-6 shadow-[0_0_40px_-16px_rgba(124,92,255,0.35)]">
            {renderCard(testimonials[active], true)}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={handlePrev}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-muted hover:border-violet/40"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-1.5">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleDot(i)}
                  className={cn(
                    "rounded-full transition-all duration-300",
                    i === active ? "h-1.5 w-4 bg-gradient-to-r from-violet to-cyan" : "h-1.5 w-1.5 bg-border"
                  )}
                />
              ))}
            </div>
            <button
              onClick={handleNext}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-muted hover:border-violet/40"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <Reveal className="mt-12">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-2xl border border-border bg-surface-2/50 px-6 py-4 text-center">
            {[
              { v: "7", l: "Verified quotes on this page" },
              { v: "8+", l: "Countries served" },
              { v: "100%", l: "Deployments with documented handoff" },
            ].map((s) => (
              <div key={s.l}>
                <span className="text-lg font-bold text-gradient-soft">{s.v}</span>
                <span className="ml-2 text-xs text-muted">{s.l}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
