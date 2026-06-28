import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { coreServices } from "@/lib/content";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

export function HomeServicesSummary() {
  return (
    <section id="services-summary" className="section section-tone-b relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet/30 to-transparent" />
      <div className="container-page">
        <SectionHeading
          eyebrow="Services"
          accent="violet"
          title={
            <>
              Six core offerings,{" "}
              <span className="text-gradient">one accountable team</span>
            </>
          }
          subtitle="From SaaS and AI to e-commerce and premium sites — scoped quotes, sprint demos, and production handoff."
          align="left"
          wide
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coreServices.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.id} delay={i % 3} variant="scale">
                <div className="group flex h-full flex-col rounded-2xl border border-border bg-surface/80 p-5 transition-all hover:border-violet/35 hover:shadow-[0_0_40px_-16px_rgba(124,92,255,0.35)]">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-surface-2 text-violet transition-colors group-hover:border-violet/40 group-hover:bg-violet/10">
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-4 text-base font-bold tracking-tight">{s.shortTitle}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{s.description}</p>
                  <p className="mt-3 text-xs font-semibold text-cyan">
                    {s.priceFrom} – {s.priceTo}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-10 flex justify-center">
          <Link
            href="/services"
            className="group inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-6 py-3 text-sm font-semibold transition-all hover:border-violet/40 hover:text-cyan"
          >
            Explore all services
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
