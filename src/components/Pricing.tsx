"use client";

import { useRef } from "react";
import { Check, ArrowRight, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { addonServices, pricingTiers } from "@/lib/content";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { TiltCard } from "./TiltCard";

export function Pricing() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollAmount = container.clientWidth * 0.8;
    if (direction === "left") {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section
      id="pricing"
      className="section relative overflow-hidden border-y border-border bg-gradient-to-b from-surface/60 via-surface/40 to-background"
    >
      {/* Grid texture */}
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-20" />
      {/* Cyan top glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan/50 to-transparent" />
      {/* Bottom violet glow */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-violet/30 to-transparent" />
      {/* Background orbs */}
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(34,211,238,0.1),transparent)] blur-3xl" />
      <div className="pointer-events-none absolute right-0 bottom-0 -z-10 h-64 w-64 rounded-full bg-[radial-gradient(closest-side,rgba(124,92,255,0.12),transparent)] blur-3xl" />

      <div className="container-page">
        <SectionHeading
          eyebrow="Transparent estimates"
          accent="cyan"

          title={
            <>
              Standard rates,{" "}
              <span className="text-gradient">no surprise invoices</span>
            </>
          }
          subtitle="Every project starts with a free discovery call and a fixed-scope quote. Below are our standard starting ranges — final price depends on features, integrations and timeline."
          align="left"
          wide
        />

        <div className="mx-auto mt-14 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {pricingTiers.map((tier, i) => (
            <Reveal key={tier.name} delay={i % 3}>
              <div className="relative h-full pt-3">
                {tier.highlight && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 z-10 inline-flex items-center gap-1.5 rounded-full border border-cyan/50 bg-cyan px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-background shadow-[0_0_16px_rgba(34,211,238,0.6)]">
                    <Sparkles size={10} />
                    Best value
                  </span>
                )}
                <TiltCard className="h-full" glowColor={tier.highlight ? "34, 211, 238" : "124, 92, 255"}>
                  <div
                    className={`group relative flex h-full flex-col rounded-2xl border p-6 shine-border transition-all duration-500 ${
                      tier.highlight
                        ? "border-cyan/50 bg-gradient-to-b from-cyan/10 via-surface to-surface shadow-[0_0_48px_-12px_rgba(34,211,238,0.3),0_0_80px_-24px_rgba(124,92,255,0.2)] ring-1 ring-cyan/20 hover:shadow-[0_0_64px_-12px_rgba(34,211,238,0.5),0_0_100px_-24px_rgba(124,92,255,0.35)]"
                        : "border-border bg-surface hover:border-violet/30 hover:shadow-[0_0_40px_-16px_rgba(124,92,255,0.3)]"
                    }`}
                  >
                    {/* Top glow line */}
                    <div className={`pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${
                      tier.highlight
                        ? "from-transparent via-cyan/60 to-transparent"
                        : "from-transparent via-violet/50 to-transparent"
                    }`} />

                    <p className="text-xs font-semibold uppercase tracking-wider text-violet">
                      {tier.priceNote}
                    </p>
                    <h3 className="mt-2 text-lg font-bold">{tier.name}</h3>
                    <p className="mt-3 text-2xl font-bold text-gradient-soft">{tier.price}</p>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{tier.description}</p>

                    <ul className="mt-6 flex-1 space-y-2.5">
                      {tier.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-xs text-muted">
                          <Check size={13} className="mt-0.5 shrink-0 text-cyan" />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <a
                      href="#contact"
                      className={`group/cta mt-6 relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl px-4 py-3 text-sm font-semibold transition-all hover:scale-[1.02] ${
                        tier.highlight
                          ? "bg-gradient-to-r from-violet to-cyan text-white shadow-[0_0_24px_-8px_rgba(124,92,255,0.5)] hover:shadow-[0_0_40px_-8px_rgba(124,92,255,0.7)]"
                          : "border border-border bg-surface-2 text-foreground hover:border-violet/40 hover:bg-violet/5"
                      }`}
                    >
                      {tier.highlight && (
                        <span className="absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/10 transition-transform duration-700 group-hover/cta:translate-x-[120%]" />
                      )}
                      {tier.cta}
                      <ArrowRight size={14} className="transition-transform group-hover/cta:translate-x-0.5" />
                    </a>
                  </div>
                </TiltCard>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-3xl text-center text-xs leading-relaxed text-muted">
          All prices in USD · Custom scopes quoted after discovery call · Payment plans available
          for projects over $5,000
        </p>

        <Reveal className="mx-auto mt-10 max-w-6xl">
          <div className="rounded-2xl border border-border bg-surface-2/50 p-6 sm:p-8 shine-border">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-border/40 pb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-violet">Add-ons</p>
                <h3 className="mt-1 text-lg font-bold tracking-tight">
                  Optional enhancements for any project
                </h3>
                <p className="mt-2 max-w-xl text-sm text-muted">
                  Standalone or bundled — choose from infrastructure, security, integrations, analytics and speed optimizations.
                </p>
              </div>
              <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end">
                <a
                  href="#services"
                  className="text-xs font-semibold text-cyan transition-colors hover:text-foreground hover:underline"
                >
                  View all services →
                </a>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleScroll("left")}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-muted transition-all hover:border-violet/40 hover:bg-violet/10 hover:text-foreground active:scale-95"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => handleScroll("right")}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-muted transition-all hover:border-violet/40 hover:bg-violet/10 hover:text-foreground active:scale-95"
                    aria-label="Next slide"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div
              ref={scrollRef}
              className="mt-6 flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory hide-scrollbar pb-3"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {addonServices.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.id}
                    href={`#services-${s.id}`}
                    className="w-[285px] shrink-0 snap-start snap-always group rounded-xl border border-border bg-surface p-5 transition-all duration-300 hover:border-violet/40 hover:shadow-[0_0_24px_-8px_rgba(124,92,255,0.3)] shine-border"
                  >
                    <div className="icon-pulse inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface-2 text-violet transition-all duration-300 group-hover:border-violet/40 group-hover:bg-violet/10">
                      <Icon size={17} className="transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <h4 className="mt-3 font-semibold transition-colors duration-300 group-hover:text-cyan">{s.shortTitle}</h4>
                    <p className="mt-1 text-sm font-bold text-gradient-soft">
                      {s.priceFrom} – {s.priceTo}
                    </p>
                    <p className="mt-1 text-[11px] text-muted">{s.timeline} · {s.priceNote}</p>
                    <ul className="mt-3 space-y-1.5 border-t border-border/40 pt-3">
                      {s.deliverables.slice(0, 4).map((d) => (
                        <li key={d} className="flex items-start gap-2 text-[11px] text-muted">
                          <Check size={11} className="mt-0.5 shrink-0 text-cyan" />
                          <span className="truncate">{d}</span>
                        </li>
                      ))}
                    </ul>
                  </a>
                );
              })}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
