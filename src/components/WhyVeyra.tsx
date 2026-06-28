import { CheckCircle2, Rocket, Shield, Users, ArrowRight } from "lucide-react";
import { coreServices } from "@/lib/content";
import { Reveal } from "./Reveal";
import Image from "next/image";

const reasons = [
  {
    icon: Rocket,
    title: "Ship fast, ship right",
    text: "We deliver production-ready code in tight iterations — not endless prototypes. Every sprint ends with something deployable.",
    gradient: "from-violet/20 to-violet/5",
    iconColor: "text-violet",
    iconBg: "bg-violet/10 border-violet/30",
  },
  {
    icon: Shield,
    title: "Enterprise-grade from day one",
    text: "Auth, RBAC, audit logging, testing and observability are built in — not bolted on after launch.",
    gradient: "from-cyan/20 to-cyan/5",
    iconColor: "text-cyan",
    iconBg: "bg-cyan/10 border-cyan/30",
  },
  {
    icon: Users,
    title: "One team, full stack",
    text: "Frontend, backend, AI, data and cloud infra under one roof. No hand-offs, no gaps, no agency overhead.",
    gradient: "from-indigo/20 to-indigo/5",
    iconColor: "text-indigo",
    iconBg: "bg-indigo/10 border-indigo/30",
  },
];

const deliverables = coreServices.map((s) => s.shortTitle);

export function WhyVeyra({ inner = false }: { inner?: boolean }) {
  return (
    <section id="why" className={`relative overflow-hidden ${inner ? "section-inner section-tone-b" : "section section-tone-b"}`}>
      <div className="pointer-events-none absolute right-0 top-1/2 -z-10 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(124,92,255,0.12),transparent)] blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-violet/20 to-transparent" />

      <div className="container-page grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)]">
        <div className="max-w-xl">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-violet/30 bg-violet/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-violet shadow-[0_0_20px_-8px_rgba(124,92,255,0.4)]">
              Why Veyra Labs
            </span>
          </Reveal>
          <Reveal delay={1}>
            <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              The studio that turns{" "}
              <span className="text-gradient">ambition into shipped software</span>.
            </h2>
          </Reveal>
          <Reveal delay={2}>
            <p className="mt-5 text-pretty leading-relaxed text-muted">
              We&apos;re not a generic dev shop. Veyra Labs is a boutique engineering studio
              specialising in intelligent products — the kind that combine beautiful UX with
              serious backend, AI and data engineering. When you hire us, you get a partner
              invested in your outcome.
            </p>
          </Reveal>

          <div className="mt-8 space-y-4">
            {reasons.map((r, i) => {
              const Icon = r.icon;
              return (
                <Reveal key={r.title} delay={i}>
                  <div className={`group flex gap-4 rounded-2xl border border-border bg-gradient-to-r ${r.gradient} p-5 transition-all duration-400 hover:border-violet/30 hover:shadow-[0_0_32px_-12px_rgba(124,92,255,0.35)]`}>
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${r.iconBg} transition-transform duration-300 group-hover:scale-110`}>
                      <Icon size={20} className={r.iconColor} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{r.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted">{r.text}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={3}>
            <a
              href="/#contact"
              className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet to-cyan px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_32px_-8px_rgba(124,92,255,0.6)] transition-all hover:scale-[1.03] hover:shadow-[0_0_48px_-6px_rgba(124,92,255,0.8)] relative overflow-hidden"
            >
              <span className="absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/10 transition-transform duration-700 group-hover:translate-x-[120%]" />
              Start a project
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </a>
          </Reveal>
        </div>

        <Reveal delay={2}>
          <div className="relative">
            <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-violet/25 to-cyan/15 blur-xl animate-pulse-glow" />
            <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-8 shine-border">
              <Image
                src="/brand/paper-mockup.png"
                alt="Veyra Labs brand identity"
                width={600}
                height={400}
                className="mx-auto h-auto w-full max-w-[280px] object-contain transition-transform duration-700 hover:scale-105"
              />
              <div className="mt-8 border-t border-border pt-6">
                <p className="text-sm font-semibold text-foreground">What we deliver</p>
                <ul className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {deliverables.map((d) => (
                    <li key={d} className="flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground">
                      <CheckCircle2 size={15} className="shrink-0 text-cyan" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
