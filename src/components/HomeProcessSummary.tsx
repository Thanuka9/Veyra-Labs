import Link from "next/link";
import { ArrowRight, Calendar, Search, Rocket, PenTool, Code2, CheckCircle2 } from "lucide-react";
import { process } from "@/lib/content";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import type { LucideIcon } from "lucide-react";

const stepIcons: Record<string, LucideIcon> = {
  "01": Search,
  "02": PenTool,
  "03": Code2,
  "04": Rocket,
  "05": CheckCircle2,
};

export function HomeProcessSummary() {
  const steps = process.slice(0, 4);

  return (
    <section id="process-summary" className="section section-tone-a relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan/30 to-transparent" />
      <div className="container-page">
        <SectionHeading
          eyebrow="Process"
          accent="cyan"
          title={
            <>
              From discovery to{" "}
              <span className="text-gradient">production in clear sprints</span>
            </>
          }
          subtitle="A transparent five-step delivery model — fixed milestones, weekly demos, and documented handoff."
          align="left"
          wide
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => {
            const Icon = stepIcons[step.no] ?? Calendar;
            return (
              <Reveal key={step.no} delay={i} variant="scale">
                <div className="relative flex h-full flex-col rounded-2xl border border-border bg-surface/80 p-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-violet/80">
                    Step {step.no}
                  </span>
                  <div className="mt-3 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-violet/30 bg-violet/10 text-violet">
                    <Icon size={18} />
                  </div>
                  <h3 className="mt-4 text-base font-bold">{step.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{step.description}</p>
                  <p className="mt-3 text-xs font-medium text-muted">{step.duration}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-10 flex justify-center">
          <Link
            href="/process"
            className="group inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-6 py-3 text-sm font-semibold transition-all hover:border-cyan/40 hover:text-cyan"
          >
            See full process
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
