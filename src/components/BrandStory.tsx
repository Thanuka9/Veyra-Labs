import Image from "next/image";
import { BrandLogo } from "./BrandLogo";
import { Reveal } from "./Reveal";
import { ArrowRight, Globe, Layers, Sparkles } from "lucide-react";

const highlights = [
  {
    icon: Layers,
    label: "Full-stack",
    detail: "Frontend to cloud infra",
  },
  {
    icon: Sparkles,
    label: "AI-native",
    detail: "LLMs, ML & predictive analytics",
  },
  {
    icon: Globe,
    label: "Global delivery",
    detail: "Clients across 8+ countries",
  },
];

export function BrandStory() {
  return (
    <section id="about" className="section relative overflow-hidden">
      {/* Ambient top & bottom gradients */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet/20 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan/20 to-transparent" />

      <div className="container-page">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-surface via-surface to-surface-2 p-8 sm:p-12 lg:p-16 shine-border">
          {/* Corner glows */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[radial-gradient(closest-side,rgba(34,211,238,0.15),transparent)] blur-3xl" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-[radial-gradient(closest-side,rgba(124,92,255,0.12),transparent)] blur-3xl" />

          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)]">
            <div className="max-w-xl">
              <Reveal>
                <BrandLogo variant="lockup" className="h-11" />
              </Reveal>
              <Reveal delay={1}>
                <h2 className="mt-8 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                  Built for businesses that need{" "}
                  <span className="text-gradient">more than a website</span>.
                </h2>
              </Reveal>
              <Reveal delay={2}>
                <p className="mt-5 text-pretty leading-relaxed text-muted">
                  Veyra Labs was founded on a simple belief: the best software companies don&apos;t
                  just write code — they engineer outcomes. We combine product thinking, full-stack
                  engineering and applied AI to help clients launch faster, operate smarter and
                  look world-class doing it.
                </p>
              </Reveal>
              <Reveal delay={3}>
                <p className="mt-4 text-pretty leading-relaxed text-muted">
                  From enterprise training platforms like TrainIQ to premium brand sites like{" "}
                  <a
                    href="https://thanukaellepola.careers/en"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-cyan transition-colors hover:underline hover:text-cyan/80"
                  >
                    thanukaellepola.careers
                  </a>
                  — every project is architected, built and deployed by our in-house team.
                </p>
              </Reveal>

              {/* Highlights row */}
              <Reveal delay={4}>
                <div className="mt-8 grid grid-cols-3 gap-4 border-t border-border pt-8">
                  {highlights.map((h) => {
                    const Icon = h.icon;
                    return (
                      <div key={h.label} className="group text-center">
                        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface-2 text-violet transition-all duration-300 group-hover:border-violet/40 group-hover:bg-violet/10 group-hover:shadow-[0_0_20px_-6px_rgba(124,92,255,0.5)]">
                          <Icon size={18} className="transition-transform duration-300 group-hover:scale-110" />
                        </div>
                        <p className="text-sm font-semibold">{h.label}</p>
                        <p className="text-[11px] text-muted">{h.detail}</p>
                      </div>
                    );
                  })}
                </div>
              </Reveal>

              <Reveal delay={5}>
                <a
                  href="#contact"
                  className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-cyan transition-all hover:gap-3 hover:text-foreground"
                >
                  Start working with us
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </a>
              </Reveal>
            </div>

            <Reveal delay={2}>
              <div className="relative mx-auto max-w-md">
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-violet/30 to-cyan/20 blur-2xl opacity-60 animate-pulse-glow" />
                <Image
                  src="/brand/app-icon.png"
                  alt="Veyra Labs app icon"
                  width={480}
                  height={480}
                  className="relative mx-auto h-auto w-full max-w-[260px] object-contain drop-shadow-[0_24px_60px_rgba(124,92,255,0.35)] transition-transform duration-700 hover:scale-105 hover:drop-shadow-[0_32px_80px_rgba(124,92,255,0.5)]"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
