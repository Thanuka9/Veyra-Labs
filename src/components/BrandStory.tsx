import Image from "next/image";
import Link from "next/link";
import { BrandLogo } from "./BrandLogo";
import { Reveal } from "./Reveal";
import {
  ArrowRight,
  CheckCircle2,
  Globe,
  Layers,
  Rocket,
  Shield,
  Sparkles,
  Target,
  Users,
} from "lucide-react";

const highlights = [
  { icon: Layers, label: "Full-stack", detail: "Frontend to cloud infra" },
  { icon: Sparkles, label: "AI-native", detail: "LLMs, ML & predictive analytics" },
  { icon: Globe, label: "Global delivery", detail: "Clients across 8+ countries" },
];

const principles = [
  {
    icon: Target,
    title: "Outcome-first delivery",
    text: "We scope around business results  -  revenue, efficiency, compliance or conversion  -  not feature checklists for their own sake.",
  },
  {
    icon: Shield,
    title: "Production-grade by default",
    text: "Auth, RBAC, audit trails, testing and observability are part of the build, not a phase-two promise after launch.",
  },
  {
    icon: Users,
    title: "One accountable team",
    text: "Strategy, design, engineering and deployment sit with the same studio. No hand-offs between agencies and freelancers.",
  },
  {
    icon: Rocket,
    title: "Ship in tight iterations",
    text: "Weekly demos, fixed milestones and deployable increments  -  so you see progress in production, not slide decks.",
  },
];

const studioFacts = [
  { value: "15+", label: "Projects shipped" },
  { value: "8+", label: "Countries served" },
  { value: "4", label: "AI modules in flagship LMS" },
  { value: "100%", label: "Documented handoff" },
];

const engagementFocus = [
  "Enterprise SaaS & multi-tenant platforms",
  "AI assistants, RAG pipelines & agent workflows",
  "E-commerce, storefronts & AI shopping experiences",
  "Premium brand sites that convert visitors into leads",
  "Predictive analytics & data engineering systems",
  "GCP deployment, CI/CD and production hardening",
];

export function BrandStory({ inner = false }: { inner?: boolean }) {
  return (
    <section
      id="about"
      className={`relative overflow-hidden ${inner ? "section-inner section-tone-a" : "section section-tone-a"}`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet/15 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-violet/10 to-transparent" />

      <div className="container-page space-y-10 lg:space-y-14">
        {/* Intro card */}
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-surface via-surface to-[#080a12] p-8 sm:p-12 lg:p-14 shine-border">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgba(124,92,255,0.08),transparent)] blur-3xl" />

          <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)]">
            <div className="max-w-2xl">
              <Reveal>
                <BrandLogo variant="wordmark" className="h-11" />
              </Reveal>
              <Reveal delay={1}>
                <h2 className="mt-8 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                  Built for businesses that need{" "}
                  <span className="text-gradient">more than a website</span>.
                </h2>
              </Reveal>
              <Reveal delay={2}>
                <p className="mt-5 text-pretty leading-relaxed text-muted">
                  Veyra Labs is a boutique software and AI engineering studio. We partner with
                  founders, operators and enterprise teams to design, build and deploy systems that
                  hold up in production  -  not prototypes that stall after the first demo.
                </p>
              </Reveal>
              <Reveal delay={3}>
                <p className="mt-4 text-pretty leading-relaxed text-muted">
                  Our work spans multi-tenant SaaS, applied AI, e-commerce, premium marketing sites
                  and data platforms. Every engagement is led in-house: architecture, implementation,
                  cloud deployment and handoff documentation  -  so you always know who owns the outcome.
                </p>
              </Reveal>
              <Reveal delay={4}>
                <p className="mt-4 text-pretty leading-relaxed text-muted">
                  From enterprise training platforms like TrainIQ to conversion-focused brand sites
                  like{" "}
                  <a
                    href="https://thanukaellepola.careers/en"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-cyan/80 transition-colors hover:text-cyan hover:underline"
                  >
                    thanukaellepola.careers
                  </a>
                  , we optimise for clarity, performance and long-term maintainability  -  the things
                  clients feel six months after launch, not just on day one.
                </p>
              </Reveal>

              <Reveal delay={5}>
                <div className="mt-8 grid grid-cols-3 gap-4 border-t border-border/80 pt-8">
                  {highlights.map((h) => {
                    const Icon = h.icon;
                    return (
                      <div key={h.label} className="group text-center sm:text-left">
                        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-[#0a0c14] text-violet/90 transition-colors group-hover:border-violet/30 sm:mx-0">
                          <Icon size={18} />
                        </div>
                        <p className="text-sm font-semibold text-foreground/90">{h.label}</p>
                        <p className="text-[11px] text-muted">{h.detail}</p>
                      </div>
                    );
                  })}
                </div>
              </Reveal>
            </div>

            <Reveal delay={2}>
              <div className="relative mx-auto max-w-xs lg:max-w-none">
                <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-violet/15 to-cyan/10 blur-2xl" />
                <Image
                  src="/brand/app-icon.png"
                  alt="Veyra Labs app icon"
                  width={480}
                  height={480}
                  className="relative mx-auto h-auto w-full max-w-[220px] object-contain drop-shadow-[0_20px_50px_rgba(124,92,255,0.2)] lg:max-w-[240px]"
                />
              </div>
            </Reveal>
          </div>
        </div>

        {/* Studio facts */}
        <Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {studioFacts.map((f) => (
              <div
                key={f.label}
                className="rounded-2xl border border-border/80 bg-[#080a12] px-5 py-4 text-center sm:text-left"
              >
                <div className="text-2xl font-bold text-foreground/90">{f.value}</div>
                <div className="mt-1 text-xs text-muted">{f.label}</div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Principles */}
        <div>
          <Reveal>
            <h3 className="text-xl font-bold tracking-tight sm:text-2xl">
              How we work with clients
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
              A small studio model with enterprise discipline  -  fast enough for founders, rigorous
              enough for compliance-heavy teams.
            </p>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {principles.map((p, i) => {
              const Icon = p.icon;
              return (
                <Reveal key={p.title} delay={i % 2}>
                  <div className="h-full rounded-2xl border border-border/80 bg-surface/60 p-5 transition-colors hover:border-violet/25 hover:bg-surface">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-[#0a0c14] text-violet/80">
                      <Icon size={18} />
                    </div>
                    <h4 className="mt-4 font-semibold text-foreground/90">{p.title}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{p.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* What clients hire us for */}
        <Reveal>
          <div className="rounded-2xl border border-border/80 bg-gradient-to-br from-[#080a12] via-surface to-surface p-6 sm:p-8">
            <h3 className="text-xl font-bold tracking-tight sm:text-2xl">What clients hire us for</h3>
            <p className="mt-2 max-w-2xl text-sm text-muted">
              Typical engagements  -  often combined in a single roadmap when a product needs more than
              one layer.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {engagementFocus.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-muted">
                  <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-violet/70" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet/90 to-indigo/90 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_-10px_rgba(124,92,255,0.5)] transition-transform hover:scale-[1.02]"
              >
                Start working with us
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/process"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-[#0a0c14] px-5 py-2.5 text-sm font-semibold text-muted transition-colors hover:border-violet/30 hover:text-foreground"
              >
                See our process
              </Link>
              <Link
                href="/work"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-[#0a0c14] px-5 py-2.5 text-sm font-semibold text-muted transition-colors hover:border-violet/30 hover:text-foreground"
              >
                View case studies
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
