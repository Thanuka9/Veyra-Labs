"use client";

import { Check, ArrowRight, Sparkles } from "lucide-react";
import { addonServices, pricingTiers } from "@/lib/content";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { TiltCard } from "./TiltCard";

export function Pricing({ showHeading = true, inner = false }: { showHeading?: boolean; inner?: boolean }) {
  return (
    <section
      id="pricing"
      className={`relative overflow-hidden ${inner ? "section-inner section-tone-a border-b border-border" : "section section-tone-a border-y border-border"}`}
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
        {showHeading && (
          <SectionHeading
            eyebrow="Transparent estimates"
            accent="cyan"
            title={
              <>
                Standard rates, <span className="text-gradient">no surprise invoices</span>
              </>
            }
            subtitle="Every engagement includes sprint reviews, access to design Figma files, complete source code, and a documented production handoff."
            align="left"
            wide
          />
        )}

        <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${showHeading ? "mt-14" : "mt-0"}`}>
          {pricingTiers.map((tier, i) => (
            <Reveal key={tier.name} delay={i % 3} variant="scale">
              <div className="h-full">
                <TiltCard className="h-full">
                  <div
                    className={`group relative flex h-full flex-col rounded-2xl border bg-surface p-6 shadow-sm transition-all duration-300 ${
                      tier.highlight
                        ? "border-cyan/50 ring-1 ring-cyan/10 shadow-[0_12px_36px_-8px_rgba(34,211,238,0.15)]"
                        : "border-border hover:border-violet/30 hover:shadow-[0_12px_36px_-8px_rgba(124,92,255,0.12)]"
                    }`}
                  >
                    {/* Top glow line on hover */}
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                    {tier.highlight && (
                      <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full border border-cyan/40 bg-cyan/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan">
                        <Sparkles size={10} className="animate-spin" />
                        Best value
                      </span>
                    )}

                    <div className={`pointer-events-none absolute -right-12 -top-12 h-24 w-24 rounded-full blur-2xl transition-opacity duration-500 group-hover:opacity-100 ${
                      tier.highlight ? "bg-cyan/10" : "bg-violet/10"
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
                      href={tier.quoteType ? `/quote?type=${tier.quoteType}` : "/quote"}
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
          All prices in USD · Instant ballpark via{" "}
          <a href="/quote" className="font-semibold text-cyan underline-offset-2 hover:underline">
            Get a quote
          </a>{" "}
          · Fixed scope after you contact us · Payment plans available for projects over $5,000
        </p>

        {/* Add-ons Grid section (Centered, standard card style, big prices, no slideshow) */}
        <div className="mt-24 border-t border-border/40 pt-16">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-violet">Add-ons</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
              Optional enhancements for any project
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-muted">
              Choose standalone or bundle with any core project - Cloud DevOps, security hardening, API integrations, speed optimizations, and analytics.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 justify-center">
            {addonServices.map((s, i) => {
              const Icon = s.icon;
              return (
                <Reveal key={s.id} delay={i % 3} variant="scale">
                  <div className="h-full">
                    <TiltCard className="h-full">
                      <div className="group relative flex h-full flex-col rounded-2xl border border-border bg-surface p-6 shadow-sm transition-all duration-300 hover:border-violet/30 hover:shadow-[0_12px_36px_-8px_rgba(124,92,255,0.12)]">
                        {/* Top glow line on hover */}
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                        {/* Icon */}
                        <div className="icon-pulse inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface-2 text-violet mb-4 transition-all duration-300 group-hover:border-violet/40 group-hover:bg-violet/10">
                          <Icon size={18} className="transition-transform duration-300 group-hover:scale-110" />
                        </div>

                        <p className="text-xs font-semibold uppercase tracking-wider text-violet">
                          {s.priceNote}
                        </p>
                        <h3 className="mt-2 text-lg font-bold">{s.shortTitle}</h3>
                        <p className="mt-3 text-2xl font-bold text-gradient-soft">
                          {s.priceFrom} - {s.priceTo}
                        </p>
                        <p className="mt-3 text-sm leading-relaxed text-muted">{s.description}</p>

                        <ul className="mt-6 flex-1 space-y-2.5 border-t border-border/40 pt-4">
                          {s.deliverables.slice(0, 4).map((d) => (
                            <li key={d} className="flex items-start gap-2 text-xs text-muted">
                              <Check size={13} className="mt-0.5 shrink-0 text-cyan" />
                              <span className="truncate">{d}</span>
                            </li>
                          ))}
                        </ul>

                        <a
                          href={`/quote?type=${s.id}`}
                          className="group/cta mt-6 relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl border border-border bg-surface-2 px-4 py-3 text-sm font-semibold text-foreground transition-all hover:border-violet/40 hover:bg-violet/5 hover:scale-[1.02]"
                        >
                          Get add-on quote
                          <ArrowRight size={14} className="transition-transform group-hover/cta:translate-x-0.5" />
                        </a>
                      </div>
                    </TiltCard>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
