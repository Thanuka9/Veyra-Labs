"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { coreServices } from "@/lib/content";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

export function HomeServicesSummary() {
  return (
    <section
      id="services-summary"
      className="relative overflow-hidden section"
      style={{ background: "#f9fafb" }}
    >
      {/* Top divider */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet/20 to-transparent" />
      {/* Subtle background blur orb */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[320px] w-[640px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(124,92,255,0.05),transparent)] blur-3xl" />

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
          subtitle="From SaaS and AI to e-commerce and premium sites — scoped quotes, sprint demos, and production handoff."
          align="left"
          wide
          theme="light"
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {coreServices.map((s, i) => {
            return (
              <Reveal key={s.id} delay={i % 3} variant="scale">
                <div className="group flex h-full flex-col rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:border-violet/30 hover:shadow-[0_12px_36px_-8px_rgba(124,92,255,0.12)]">
                  {/* Illustration Image Container */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center p-2 mb-4">
                    <Image
                      src={`/illustrations/${s.id}.png`}
                      alt={s.shortTitle}
                      fill
                      unoptimized
                      className="object-contain transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>

                  <h3 className="text-base font-bold tracking-tight text-gray-900">{s.shortTitle}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">{s.description}</p>
                  <p className="mt-3 text-xs font-bold text-violet">
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
            className="group inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-violet/30 hover:text-violet hover:shadow-md"
          >
            Explore all services
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
