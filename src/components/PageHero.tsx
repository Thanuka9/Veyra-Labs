import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

type Breadcrumb = { label: string; href?: string };

export type PageHeroProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
  accent?: "violet" | "cyan" | "emerald" | "indigo";
  cta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
};

const accentStyles = {
  violet: {
    pill: "border-violet/25 bg-violet/8 text-violet",
    dot: "bg-violet",
    glow: "rgba(124,92,255,0.14)",
  },
  cyan: {
    pill: "border-cyan/25 bg-cyan/8 text-cyan",
    dot: "bg-cyan",
    glow: "rgba(34,211,238,0.12)",
  },
  emerald: {
    pill: "border-emerald-500/25 bg-emerald-500/8 text-emerald-400",
    dot: "bg-emerald-400",
    glow: "rgba(52,211,153,0.1)",
  },
  indigo: {
    pill: "border-indigo/25 bg-indigo/8 text-indigo",
    dot: "bg-indigo",
    glow: "rgba(91,109,255,0.12)",
  },
};

export function PageHero({
  eyebrow,
  title,
  subtitle,
  breadcrumbs = [{ label: "Home", href: "/" }],
  accent = "violet",
  cta,
  secondaryCta,
}: PageHeroProps) {
  const accentStyle = accentStyles[accent];

  return (
    <header className="section-tone-base relative overflow-hidden border-b border-border pt-[5.5rem] pb-12 md:pt-28 md:pb-16">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute left-1/2 top-0 h-[480px] w-[min(920px,100%)] -translate-x-1/2 rounded-full blur-3xl"
          style={{ background: `radial-gradient(closest-side, ${accentStyle.glow}, transparent)` }}
        />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet/30 to-transparent" />
      </div>

      <div className="container-page">
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1 text-sm text-muted">
          {breadcrumbs.map((crumb, i) => (
            <span key={`${crumb.label}-${i}`} className="inline-flex items-center gap-1">
              {i > 0 && <ChevronRight size={14} className="text-muted/60" aria-hidden />}
              {crumb.href ? (
                <Link href={crumb.href} className="transition-colors hover:text-cyan">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-foreground/80">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>

        {eyebrow && (
          <span
            className={cn(
              "mb-4 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide",
              accentStyle.pill
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full animate-pulse", accentStyle.dot)} />
            {eyebrow}
          </span>
        )}

        <h1 className="max-w-3xl text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted sm:text-lg">
            {subtitle}
          </p>
        )}

        {(cta || secondaryCta) && (
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            {cta && (
              <Link
                href={cta.href}
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet to-cyan px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_28px_-8px_rgba(124,92,255,0.55)] transition-all hover:scale-[1.02]"
              >
                {cta.label}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            )}
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface/80 px-6 py-3.5 text-sm font-semibold text-muted backdrop-blur transition-colors hover:border-violet/40 hover:text-foreground"
              >
                {secondaryCta.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
