"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { spotlightProjects } from "@/lib/projects";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { ProjectScreenshot } from "./ProjectScreenshot";
import { SubsectionLabel } from "./SubsectionLabel";

function isInternalHref(href: string) {
  return href.startsWith("/");
}

export function FeaturedWork({
  variant = "full",
  showHeading = true,
  inner = false,
}: {
  variant?: "full" | "summary";
  showHeading?: boolean;
  inner?: boolean;
}) {
  const items = variant === "summary" ? spotlightProjects.slice(0, 4) : spotlightProjects;
  const [hero, ...rest] = items;
  const isSummary = variant === "summary";

  return (
    <section
      id="featured"
      className={`relative overflow-hidden ${inner ? "section-inner section-tone-a" : `section ${isSummary ? "section-tone-a" : "section-tone-b"}`}`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet/40 to-transparent" />
      <div className="container-page">
        {!showHeading && inner && <SubsectionLabel>Flagship deliveries</SubsectionLabel>}
        {showHeading && (
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
        )}

        <Reveal className={showHeading ? "mt-14" : "mt-0"} variant="scale">
          <div className="flex justify-start">
            <FeaturedTile project={hero} size="hero" />
          </div>
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
  const imagePosition = project.imagePosition ?? "center top";
  const imageFit = project.imageFit ?? (isHero && project.category === "Website" ? "cover" : "contain");

  const badges = (
    <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-2 sm:left-4 sm:top-4">
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
  );

  const body = (
    <div className={isHero ? "flex flex-col justify-center p-5 sm:p-6 lg:p-7" : "relative p-5"}>
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <h3 className={`font-bold tracking-tight ${isHero ? "text-xl sm:text-2xl" : "text-lg"}`}>
            {project.name}
          </h3>
          <p className={`mt-1 font-medium text-violet/90 ${isHero ? "text-sm sm:text-base" : "text-sm"}`}>
            {project.tagline}
          </p>
        </div>
        {isLink && (
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-surface/80 text-cyan transition-colors group-hover:border-cyan/50 group-hover:bg-cyan/10">
            <ArrowUpRight size={16} />
          </span>
        )}
      </div>

      {isHero && !isExternal && (
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted">
          {project.description}
        </p>
      )}

      {project.metrics && (
        <div className={`flex flex-wrap gap-x-6 gap-y-2 ${isHero ? "mt-4" : "mt-4"}`}>
          {project.metrics.map((m) => (
            <div key={m.label}>
              <div className={`font-bold text-gradient-soft ${isHero ? "text-lg" : "text-xl"}`}>{m.value}</div>
              <div className="text-[11px] text-muted">{m.label}</div>
            </div>
          ))}
        </div>
      )}

      {isLink && isExternal && (
        <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-cyan sm:text-sm">
          {project.linkLabel}
          <ExternalLink size={13} />
        </span>
      )}
    </div>
  );

  const media = (
    <div
      className={`relative w-full overflow-hidden bg-[#0a0c14] ${
        isHero ? "aspect-[16/9] w-full" : ""
      }`}
    >
      {project.image &&
        (isHero ? (
          <Image
            src={project.image}
            alt={project.name}
            fill
            unoptimized
            sizes="(max-width: 1024px) 100vw, 600px"
            className="object-contain p-1.5 sm:p-2"
            style={{ objectPosition: imagePosition }}
          />
        ) : (
          <ProjectScreenshot
            src={project.image}
            alt={project.name}
            position={imagePosition}
            fit={imageFit}
            aspect="aspect-[4/3]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ))}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-[#0a0c14]/70 to-transparent" />
      {badges}

      {!isHero && (
        <div className="absolute inset-x-0 bottom-0 translate-y-full transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
          <div className="flex items-center justify-center gap-2 bg-gradient-to-t from-surface via-surface/95 to-transparent pb-4 pt-8 text-sm font-semibold text-foreground">
            <span>{isExternal ? "View live project" : "View case study"}</span>
            <ArrowUpRight size={16} className="text-cyan" />
          </div>
        </div>
      )}
    </div>
  );

  const inner = isHero ? (
    <div className="grid md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] md:items-stretch">
      {media}
      {body}
    </div>
  ) : (
    <>
      {media}
      {body}
    </>
  );

  const className = `group relative block overflow-hidden rounded-2xl border border-border bg-surface transition-all ${
    isHero ? "max-w-4xl card-magnetic ring-glow" : "card-hover"
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
