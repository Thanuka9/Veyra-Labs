"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Quote, Star, ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { testimonials } from "@/lib/content";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/cn";

export function Testimonials({
  showStats = true,
  showHeading = true,
  inner = false,
}: {
  showStats?: boolean;
  showHeading?: boolean;
  inner?: boolean;
}) {
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
          <Star key={s} size={12} className="fill-amber-500 text-amber-500" />
        ))}
      </div>

      <Quote
        size={16}
        className={cn("mb-3 transition-colors duration-300", isCurrent ? "text-violet" : "text-violet/40")}
      />

      <blockquote className="flex-1 text-sm leading-relaxed text-gray-700 sm:text-[15px]">
        &ldquo;{t.quote}&rdquo;
      </blockquote>

      <figcaption className="mt-5 border-t border-gray-200 pt-4">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
              isCurrent
                ? "bg-violet/15 text-violet ring-1 ring-violet/25"
                : "bg-gray-100 text-gray-500"
            )}
            aria-hidden
          >
            {t.role.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium text-gray-900">{t.role}</div>
            <div className="text-xs text-gray-500">{t.context}</div>
            <div className="mt-1 text-[10px] font-medium uppercase tracking-wider text-gray-400">
              Verified client · identity withheld
            </div>
          </div>
        </div>
        {t.projectSlug && (
          <Link
            href={`/case-studies/${t.projectSlug}`}
            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-violet hover:text-violet/80 hover:underline"
          >
            View related case study
            <ArrowUpRight size={12} />
          </Link>
        )}
      </figcaption>
    </>
  );

  return (
    <section
      id="testimonials"
      className={`relative overflow-hidden ${inner ? "section-inner" : "section"}`}
      style={{ background: "#f8f9fc" }}
    >
      {/* Top divider */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet/20 to-transparent" />
      {/* Subtle ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[320px] w-[640px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(124,92,255,0.06),transparent)] blur-3xl" />

      <div className="container-page relative">
        {showHeading && (
          <SectionHeading
            eyebrow="Client feedback"
            accent="violet"
            title={
              <>
                Trusted to solve{" "}
                <span className="bg-gradient-to-r from-violet to-indigo-500 bg-clip-text text-transparent">real bottlenecks</span>
              </>
            }
            subtitle="Quotes from verified engagements — role and industry only, no names without permission."
            theme="light"
          />
        )}

        {/* Desktop 3-card carousel */}
        <div className={`hidden lg:block ${showHeading ? "mt-14" : "mt-0"}`}>
          <div className="relative flex items-center gap-4">
            <button
              onClick={handlePrev}
              aria-label="Previous testimonial"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:border-violet/40 hover:text-violet"
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
                        ? "flex-[1.3] scale-[1.01] border-violet/20 bg-white shadow-[0_8px_32px_-12px_rgba(124,92,255,0.15),0_4px_16px_-8px_rgba(0,0,0,0.08)] ring-1 ring-violet/10"
                        : "flex-1 cursor-pointer border-gray-200 bg-white/70 opacity-75 hover:border-violet/20 hover:opacity-100"
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
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:border-violet/40 hover:text-violet"
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
                    ? "h-2 w-6 bg-violet shadow-[0_0_8px_rgba(124,92,255,0.3)]"
                    : "h-2 w-2 bg-gray-300 hover:bg-gray-400"
                )}
              />
            ))}
          </div>
        </div>

        {/* Mobile single-card */}
        <div className={`lg:hidden ${showHeading ? "mt-10" : "mt-0"}`}>
          <div className="relative overflow-hidden rounded-2xl border border-violet/15 bg-white p-6 shadow-lg">
            {renderCard(testimonials[active], true)}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={handlePrev}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm hover:border-violet/30"
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
                    i === active ? "h-1.5 w-4 bg-violet" : "h-1.5 w-1.5 bg-gray-300"
                  )}
                />
              ))}
            </div>
            <button
              onClick={handleNext}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm hover:border-violet/30"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {showStats && (
          <Reveal className="mt-12">
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-2xl border border-gray-200 bg-white px-6 py-4 text-center shadow-sm">
              {[
                { v: "7", l: "Verified quotes on this page" },
                { v: "8+", l: "Countries served" },
                { v: "100%", l: "Deployments with documented handoff" },
              ].map((s) => (
                <div key={s.l}>
                  <span className="text-lg font-semibold text-gray-900">{s.v}</span>
                  <span className="ml-2 text-xs text-gray-500">{s.l}</span>
                </div>
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
