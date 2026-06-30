"use client";

import Image from "next/image";
import { ArrowRight, Check, Package } from "lucide-react";
import { addonServices, coreServices } from "@/lib/content";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { TiltCard } from "./TiltCard";

export function Services({ showHeading = true, inner = false }: { showHeading?: boolean; inner?: boolean }) {
  return (
    <section
      id="services"
      className={`relative overflow-hidden ${inner ? "section-inner" : "section"}`}
      style={{ background: "#f9fafb" }}
    >
      {/* Top accent line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet/20 to-transparent" />
      {/* Background orbs */}
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(34,211,238,0.05),transparent)] blur-3xl" />
      <div className="pointer-events-none absolute right-0 bottom-0 -z-10 h-64 w-64 rounded-full bg-[radial-gradient(closest-side,rgba(124,92,255,0.06),transparent)] blur-3xl" />

      <div className="container-page relative">
        {showHeading && (
          <SectionHeading
            eyebrow="Services"
            accent="violet"
            title={
              <>
                Full-stack capabilities,{" "}
                <span className="bg-gradient-to-r from-violet to-indigo-500 bg-clip-text text-transparent">one accountable team</span>
              </>
            }
            subtitle="Six core offerings  -  each with a fixed-scope quote, sprint demos and 30-day post-launch support. Add-ons available for DevOps, security and PWA."
            align="left"
            wide
            theme="light"
          />
        )}

        {/* Core Services Grid */}
        <div className={showHeading ? "mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3" : "grid gap-6 md:grid-cols-2 xl:grid-cols-3"}>
          {coreServices.map((s, i) => {
            return (
              <Reveal key={s.id} delay={i % 3} variant="scale">
                <TiltCard className="h-full">
                  <div
                    id={`services-${s.id}`}
                    className={`group relative flex h-full scroll-mt-28 flex-col overflow-hidden rounded-2xl border bg-white p-6 shadow-sm transition-all duration-300 ${
                      s.highlight
                        ? "border-cyan/50 ring-1 ring-cyan/10 shadow-[0_12px_36px_-8px_rgba(34,211,238,0.15)]"
                        : "border-gray-200/85 hover:border-violet/30 hover:shadow-[0_12px_36px_-8px_rgba(124,92,255,0.12)]"
                    }`}
                  >
                    {/* Top glow line on hover */}
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                    {s.highlight && (
                      <span className="absolute right-4 top-4 rounded-full border border-cyan/40 bg-cyan/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan">
                        Most popular
                      </span>
                    )}

                    {/* Illustration Container */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center p-2 mb-4">
                      <Image
                        src={`/illustrations/${s.id}.png`}
                        alt={s.title}
                        fill
                        unoptimized
                        className="object-contain transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>

                    <h3 className="text-lg font-bold tracking-tight text-gray-900">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">{s.description}</p>

                    {/* Deliverables */}
                    <div className="mt-5">
                      <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        <Package size={12} />
                        What you get
                      </p>
                      <ul className="space-y-1.5">
                        {s.deliverables.map((d) => (
                          <li key={d} className="flex items-start gap-2 text-xs text-gray-600">
                            <Check size={12} className="mt-0.5 shrink-0 text-cyan" />
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <a
                      href="/contact"
                      className="group/cta mt-auto flex items-center gap-1.5 pt-5 text-sm font-semibold text-cyan transition-all hover:gap-2.5 hover:text-violet"
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

        {/* Add-ons Heading Section */}
        <div className="mt-24">
          <SectionHeading
            eyebrow="Enhancements"
            accent="cyan"
            title={
              <>
                Add-on services & <span className="bg-gradient-to-r from-cyan to-blue-500 bg-clip-text text-transparent">deploy enhancements</span>
              </>
            }
            subtitle="Bundle these with any core project or engage standalone  -  optimized performance, cloud DevOps, security hardening, and database integrations."
            align="left"
            wide
            theme="light"
          />
        </div>

        {/* Add-ons Grid (Styled as Main Services) */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {addonServices.map((s, i) => {
            return (
              <Reveal key={s.id} delay={i % 3} variant="scale">
                <TiltCard className="h-full">
                  <div
                    id={`services-${s.id}`}
                    className="group relative flex h-full scroll-mt-28 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-violet/30 hover:shadow-[0_12px_36px_-8px_rgba(124,92,255,0.12)]"
                  >
                    {/* Top glow line on hover */}
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                    {/* Illustration Container */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center p-2 mb-4">
                      <Image
                        src={`/illustrations/${s.id}.png`}
                        alt={s.title}
                        fill
                        unoptimized
                        className="object-contain transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>

                    <h3 className="text-lg font-bold tracking-tight text-gray-900">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">{s.description}</p>

                    {/* Deliverables */}
                    <div className="mt-5">
                      <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        <Package size={12} />
                        What you get
                      </p>
                      <ul className="space-y-1.5">
                        {s.deliverables.map((d) => (
                          <li key={d} className="flex items-start gap-2 text-xs text-gray-600">
                            <Check size={12} className="mt-0.5 shrink-0 text-cyan" />
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <a
                      href="/contact"
                      className="group/cta mt-auto flex items-center gap-1.5 pt-5 text-sm font-semibold text-cyan transition-all hover:gap-2.5 hover:text-violet"
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
      </div>
    </section>
  );
}
