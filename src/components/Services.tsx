import { ArrowRight, Check, Package, Zap } from "lucide-react";
import { addonServices, coreServices } from "@/lib/content";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { TiltCard } from "./TiltCard";

export function Services() {
  return (
    <section id="services" className="section relative overflow-hidden">
      {/* Section ambient */}
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(124,92,255,0.12),transparent)] blur-3xl" />
      <div className="pointer-events-none absolute right-0 bottom-0 -z-10 h-64 w-64 rounded-full bg-[radial-gradient(closest-side,rgba(34,211,238,0.08),transparent)] blur-3xl" />
      {/* Top accent stripe */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet/40 to-transparent" />

      <div className="container-page">
        <SectionHeading
          eyebrow="Services"
          accent="violet"
          title={
            <>
              Full-stack capabilities,{" "}
              <span className="text-gradient">one accountable team</span>
            </>
          }
          subtitle="Six core offerings — each with a fixed-scope quote, sprint demos and 30-day post-launch support. Add-ons available for DevOps, security and PWA."
          align="left"
          wide
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {coreServices.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.id} delay={i % 3} variant="scale">
                <TiltCard className="h-full">
                <div
                  id={`services-${s.id}`}
                  className={`group relative flex h-full scroll-mt-28 flex-col overflow-hidden rounded-2xl border bg-surface p-6 shine-border card-hover transition-all ${
                    s.highlight
                      ? "border-cyan/40 ring-1 ring-cyan/20 shadow-[0_0_40px_-12px_rgba(34,211,238,0.25)]"
                      : "border-border"
                  }`}
                >
                  {/* Top glow line on hover */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  {s.highlight && (
                    <span className="absolute right-4 top-4 rounded-full border border-cyan/40 bg-cyan/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan">
                      Most popular
                    </span>
                  )}

                  {/* Icon */}
                  <div className="icon-pulse inline-flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-surface-2 text-violet transition-all duration-300 group-hover:border-violet/40 group-hover:bg-violet/10 group-hover:shadow-[0_0_20px_-6px_rgba(124,92,255,0.5)]">
                    <Icon size={22} className="transition-transform duration-300 group-hover:scale-110" />
                  </div>

                  <h3 className="mt-5 text-lg font-bold tracking-tight">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{s.description}</p>

                  {/* Deliverables */}
                  <div className="mt-5">
                    <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
                      <Package size={12} />
                      What you get
                    </p>
                    <ul className="space-y-1.5">
                      {s.deliverables.map((d) => (
                        <li key={d} className="flex items-start gap-2 text-xs text-muted">
                          <Check size={12} className="mt-0.5 shrink-0 text-cyan" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <a
                    href="#contact"
                    className="group/cta mt-auto flex items-center gap-1.5 pt-5 text-sm font-semibold text-cyan transition-all hover:gap-2.5 hover:text-foreground"
                  >
                    Request a quote
                    <ArrowRight size={14} className="transition-transform group-hover/cta:translate-x-1" />
                  </a>
                </div>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-16">
          <div className="rounded-2xl border border-border bg-surface-2/50 p-6 sm:p-8 shine-border">
            <div className="flex items-center gap-3">
              <Zap size={18} className="text-violet" />
              <h3 className="text-lg font-bold tracking-tight">Add-ons & enhancements</h3>
            </div>
            <p className="mt-2 max-w-2xl text-sm text-muted">
              Bundle these with any core project or engage standalone — mobile/PWA polish, cloud
              infrastructure, and security hardening.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {addonServices.map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.id}
                    id={`services-${s.id}`}
                    className="group scroll-mt-28 rounded-xl border border-border bg-surface p-5 transition-all duration-300 hover:border-violet/30 hover:shadow-[0_0_24px_-8px_rgba(124,92,255,0.3)]"
                  >
                    <div className="icon-pulse inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface-2 text-violet transition-all duration-300 group-hover:border-violet/40 group-hover:bg-violet/10">
                      <Icon size={18} className="transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <h4 className="mt-3 font-semibold">{s.title}</h4>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted">{s.description}</p>
                    <ul className="mt-3 space-y-1.5">
                      {s.deliverables.map((d) => (
                        <li key={d} className="flex items-start gap-2 text-[11px] text-muted">
                          <Check size={11} className="mt-0.5 shrink-0 text-cyan" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
