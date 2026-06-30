"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { coreServices } from "@/lib/content";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

export function HomeServicesSummary({
  theme = "dark",
}: {
  theme?: "light" | "dark";
} = {}) {
  const isDark = theme === "dark";

  return (
    <section
      id="services-summary"
      className="relative overflow-hidden section"
      style={{ background: isDark ? "#080910" : "#f9fafb" }}
    >
      {/* Top divider */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet/20 to-transparent" />
      {/* Subtle background blur orb */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[320px] w-[640px] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background: isDark
            ? "radial-gradient(closest-side,rgba(124,92,255,0.08),transparent)"
            : "radial-gradient(closest-side,rgba(124,92,255,0.05),transparent)",
        }}
      />

      <div className="container-page relative">
        <SectionHeading
          eyebrow="Services"
          accent="violet"
          title={
            <>
              Six core offerings,{" "}
              <span className="bg-gradient-to-r from-violet to-indigo-500 bg-clip-text text-transparent">one accountable team</span>
            </>
          }
          subtitle="From SaaS and AI to e-commerce and premium sites  -  scoped quotes, sprint demos, and production handoff."
          align="left"
          wide
          theme={theme}
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {coreServices.map((s, i) => {
            return (
              <Reveal key={s.id} delay={i % 3} variant="scale">
                <div
                  className={`group flex h-full flex-col rounded-2xl border p-5 shadow-sm transition-all duration-300 ${
                    isDark
                      ? "border-border bg-surface/80 hover:border-violet/35 hover:shadow-[0_12px_36px_-8px_rgba(124,92,255,0.25)]"
                      : "border-gray-200/80 bg-white hover:border-violet/30 hover:shadow-[0_12px_36px_-8px_rgba(124,92,255,0.12)]"
                  }`}
                >
                  {/* Illustration Image Container */}
                  <div
                    className={`relative aspect-[16/10] w-full overflow-hidden rounded-xl border flex items-center justify-center p-2 mb-4 ${
                      isDark ? "bg-gray-950/20 border-white/[0.04]" : "bg-gray-50 border-gray-100"
                    }`}
                  >
                    <Image
                      src={`/illustrations/${s.id}.png`}
                      alt={s.shortTitle}
                      fill
                      unoptimized
                      className="object-contain transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>

                  <h3
                    className={`text-base font-bold tracking-tight ${
                      isDark ? "text-foreground" : "text-gray-900"
                    }`}
                  >
                    {s.shortTitle}
                  </h3>
                  <p
                    className={`mt-2 flex-1 text-sm leading-relaxed ${
                      isDark ? "text-muted" : "text-gray-600"
                    }`}
                  >
                    {s.description}
                  </p>
                  <p className={`mt-3 text-xs font-bold ${isDark ? "text-cyan" : "text-violet"}`}>
                    Starting from {s.priceFrom}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-10 flex justify-center">
          <Link
            href="/services"
            className={`group inline-flex items-center gap-2 rounded-xl border px-6 py-3 text-sm font-semibold shadow-sm transition-all hover:shadow-md ${
              isDark
                ? "border-border bg-surface text-muted hover:border-violet/40 hover:text-foreground"
                : "border-gray-200 bg-white text-gray-700 hover:border-violet/30 hover:text-violet"
            }`}
          >
            Explore all services
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
