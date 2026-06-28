"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { spotlightProjects } from "@/lib/projects";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

function isInternalHref(href: string) {
  return href.startsWith("/");
}

export function FeaturedWork({ variant = "full" }: { variant?: "full" | "summary" }) {
  const items = variant === "summary" ? spotlightProjects.slice(0, 4) : spotlightProjects;
  const [hero, ...rest] = items;
  const isSummary = variant === "summary";

  return (
    <section
      id="featured"
      className={`section relative overflow-hidden ${isSummary ? "section-tone-a" : "section-tone-b"}`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet/40 to-transparent" />
      <div className="container-page">
        <SectionHeading
          eyebrow="Flagship deliveries"
          accent="indigo"
          title={
            <>
              Products our clients <span className="text-gradient">trust in production</span>
            </>
          }
          subtitle={
            isSummary
              ? "Live platforms, AI tools, and premium sites — a sample of recent work."
              : "A selection of live platforms, AI tools and premium websites we've designed and engineered — including enterprise SaaS and conversion-focused brand sites."
          }
          align="left"
          wide
        />

        <Reveal className="mt-14" variant="scale">
          <FeaturedTile project={hero} size="hero" />
        </Reveal>

        <div className={`mt-5 grid gap-5 ${isSummary ? "md:grid-cols-3" : "md:grid-cols-2 lg:grid-cols-3"}`}>
          {rest.map((p, i) => (
            <Reveal key={p.slug} delay={i % 3} variant="scale">
              <FeaturedTile project={p} size="card" />
            </Reveal>
          ))}
        </div>

        {isSummary && (
          <Reveal className="mt-10 flex justify-center">
            <Link
              href="/work"
              className="group inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-6 py-3 text-sm font-semibold transition-all hover:border-violet/40 hover:text-cyan"
            >
              View all case studies
              <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>
        )}
      </div>
    </section>
  );
}

function FeaturedTile({
  project,
  size,
}: {
  project: (typeof spotlightProjects)[number];
  size: "hero" | "card";
}) {
  const href = project.href;
  const isLink = Boolean(href);
  const isHero = size === "hero";
  const isExternal = href ? !isInternalHref(href) : false;

  const inner = (
    <>
      <div
        className={`relative overflow-hidden bg-[#0a0c14] ${
          isHero ? "aspect-[16/9] max-h-[420px] sm:max-h-[460px]" : "aspect-[4/3]"
        }`}
      >
        {project.image && (
          <Image
            src={project.image}
            alt={project.name}
            fill
            sizes={isHero ? "100vw" : "(max-width: 768px) 100vw, 33vw"}
            unoptimized
            className="object-contain object-center p-2 transition-transform duration-700 group-hover:scale-[1.03] sm:p-3"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-violet/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className="rounded-full border border-border bg-background/80 px-3 py-1 text-[11px] font-semibold backdrop-blur">
            {project.category}
          </span>
          {isLink && (
            <span className="inline-flex items-center gap-1 rounded-full border border-cyan/40 bg-cyan/15 px-3 py-1 text-[11px] font-semibold text-cyan backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan" />
              {isExternal ? "Live" : "Case study"}
            </span>
          )}
        </div>

        {!isHero && (
          <div className="absolute inset-x-0 bottom-0 translate-y-full transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
            <div className="flex items-center justify-center gap-2 bg-gradient-to-t from-background via-background/90 to-transparent pb-4 pt-8 text-sm font-semibold text-foreground">
              <span>{isExternal ? "View live project" : "View case study"}</span>
              <ArrowUpRight size={16} className="text-cyan" />
            </div>
          </div>
        )}
      </div>

      <div className={`relative ${isHero ? "absolute inset-x-0 bottom-0 p-6 sm:p-8" : "p-5"}`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className={`font-bold tracking-tight ${isHero ? "text-2xl sm:text-3xl" : "text-lg"}`}>
              {project.name}
            </h3>
            <p className={`mt-1 font-medium text-violet/90 ${isHero ? "text-base" : "text-sm"}`}>
              {project.tagline}
            </p>
          </div>
          {isLink && (
            <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface/80 text-cyan transition-colors group-hover:border-cyan/50 group-hover:bg-cyan/10">
              <ArrowUpRight size={18} />
            </span>
          )}
        </div>

        {isHero && !isExternal && (
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
            {project.description}
          </p>
        )}

        {project.metrics && (
          <div className={`flex gap-6 ${isHero ? "mt-5" : "mt-4"}`}>
            {project.metrics.map((m) => (
              <div key={m.label}>
                <div className="text-xl font-bold text-gradient-soft">{m.value}</div>
                <div className="text-[11px] text-muted">{m.label}</div>
              </div>
            ))}
          </div>
        )}

        {isLink && isExternal && (
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan">
            {project.linkLabel}
            <ExternalLink size={14} />
          </span>
        )}
      </div>
    </>
  );

  const className = `group relative block overflow-hidden rounded-2xl border border-border bg-surface transition-all ${
    isHero ? "card-magnetic ring-glow" : "card-hover"
  }`;

  if (isLink && href) {
    if (!isExternal) {
      return (
        <Link href={href} className={className}>
          {inner}
        </Link>
      );
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {inner}
      </a>
    );
  }

  return <div className={className}>{inner}</div>;
}
