import { ShieldCheck } from "lucide-react";
import { productionTechTools, techCategories } from "@/lib/content";
import { getTechToolIcon } from "@/lib/tech-icons";
import { LucideIcon } from "./LucideIcon";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

export function TechStack({ showHeading = true, inner = false }: { showHeading?: boolean; inner?: boolean }) {
  return (
    <section id="tech" className={`relative overflow-hidden ${inner ? "section-inner section-tone-b" : "section section-tone-b"}`}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan/30 to-transparent" />
      <div className="pointer-events-none absolute left-0 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(34,211,238,0.08),transparent)] blur-3xl" />

      <div className="container-page">
        {showHeading && (
        <SectionHeading
          eyebrow="Technology"
          accent="cyan"
          title={
            <>
              Production-grade stack,{" "}
              <span className="text-gradient">battle-tested in live products</span>
            </>
          }
          subtitle="We don't experiment on your budget. Every tool below has shipped in a real client project  -  from enterprise LMS platforms to AI commerce and predictive healthcare analytics."
          align="left"
          wide
        />
        )}

        <Reveal className={showHeading ? "mt-10" : "mt-0"}>
          <div className="flex flex-wrap gap-3">
            {techCategories.map((cat) => (
              <div
                key={cat.name}
                className="group inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-2 text-xs font-medium text-muted transition-all duration-300 hover:border-violet/40 hover:bg-violet/5 hover:text-foreground cursor-default"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet/10 transition-colors duration-300 group-hover:bg-violet/20">
                  <LucideIcon icon={cat.icon} size={14} className="text-violet" />
                </span>
                {cat.name}
              </div>
            ))}
          </div>
        </Reveal>

        {/* Tech category cards */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {techCategories.map((cat, i) => (
            <Reveal key={cat.name} delay={i % 3}>
              <div className="group h-full rounded-2xl border border-border bg-surface p-6 shine-border transition-all duration-400 hover:border-violet/30 hover:shadow-[0_0_40px_-16px_rgba(124,92,255,0.35)]">
                {/* Top glow line */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 rounded-t-2xl" />

                <div className="flex items-center gap-3">
                  <div className="icon-pulse flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-2 transition-all duration-300 group-hover:border-violet/30 group-hover:bg-violet/10 group-hover:shadow-[0_0_20px_-6px_rgba(124,92,255,0.5)]">
                    <LucideIcon icon={cat.icon} size={20} className="text-violet transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-violet">{cat.name}</h3>
                </div>

                <ul className="mt-5 space-y-3">
                  {cat.tools.map((t) => {
                    const ToolIcon = getTechToolIcon(t.name);
                    return (
                      <li
                        key={t.name}
                        className="flex gap-3 border-b border-border/60 pb-3 last:border-0 last:pb-0 group/tool"
                      >
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-2 transition-colors duration-300 group-hover/tool:bg-cyan/10">
                          <LucideIcon icon={ToolIcon} size={14} className="text-cyan/90 transition-transform duration-300 group-hover/tool:scale-110" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <span className="text-sm font-semibold text-foreground">{t.name}</span>
                          <p className="mt-0.5 text-xs leading-relaxed text-muted">{t.desc}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10">
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-surface-2 px-5 py-4 sm:flex-row sm:justify-center sm:gap-3 transition-colors duration-300 hover:border-violet/30">
            <div className="flex items-center gap-2">
              <LucideIcon icon={ShieldCheck} size={14} className="text-emerald-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Shipped in production
              </span>
            </div>
            <span aria-hidden className="hidden text-border sm:inline">
              ·
            </span>
            <p className="text-center text-xs text-muted sm:text-left">
              <span className="font-semibold text-foreground">{productionTechTools.length}</span>{" "}
              technologies across live client deliveries  -  every tool above, no experimental stack on your project.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
