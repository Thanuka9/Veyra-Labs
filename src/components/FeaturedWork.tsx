"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { spotlightProjects } from "@/lib/projects";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { SubsectionLabel } from "./SubsectionLabel";
import { cn } from "@/lib/cn";

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
  const projects = variant === "summary" ? spotlightProjects.slice(0, 4) : spotlightProjects;
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = () => setActiveIndex((idx) => (idx + 1) % projects.length);
  const prev = () => setActiveIndex((idx) => (idx - 1 + projects.length) % projects.length);

  const restartAutoplay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(next, 6000);
  };

  useEffect(() => {
    restartAutoplay();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects.length]);

  const handleNext = () => {
    next();
    restartAutoplay();
  };

  const handlePrev = () => {
    prev();
    restartAutoplay();
  };

  const handleDot = (idx: number) => {
    setActiveIndex(idx);
    restartAutoplay();
  };

  const activeProject = projects[activeIndex];
  const isLink = Boolean(activeProject.href);
  const isExternal = activeProject.href ? !isInternalHref(activeProject.href) : false;
  const imagePosition = activeProject.imagePosition ?? "center top";
  const imageFit = activeProject.imageFit ?? (activeProject.category === "Website" ? "cover" : "contain");

  return (
    <section
      id="featured"
      className={cn(
        "relative overflow-hidden section",
        inner ? "section-tone-a" : variant === "summary" ? "section-tone-a" : "section-tone-b"
      )}
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
              variant === "summary"
                ? "Live platforms, AI tools, and premium sites — a sample of recent work."
                : "A selection of live platforms, AI tools and premium websites we've designed and engineered — including enterprise SaaS and conversion-focused brand sites."
            }
            align="left"
            wide
          />
        )}

        {/* Carousel Slideshow */}
        <div className={cn("relative group/carousel", showHeading ? "mt-12" : "mt-6")}>
          {/* Main Card */}
          <div className="relative overflow-hidden rounded-2xl border border-border bg-[#090b11] shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-white/[0.04]">
            <div className="grid md:grid-cols-[minmax(0,1.20fr)_minmax(0,0.80fr)] md:items-stretch min-h-[420px]">
              
              {/* Media Section */}
              <div className="relative aspect-[16/9] md:aspect-auto w-full overflow-hidden bg-[#10131f] ring-1 ring-inset ring-white/10 flex flex-col justify-between">
                {/* Images */}
                <div className="absolute inset-0 transition-all duration-700 ease-in-out">
                  {activeProject.image && (
                    <Image
                      src={activeProject.image}
                      alt={activeProject.name}
                      fill
                      unoptimized
                      priority
                      className={cn(
                        "transition-all duration-700",
                        imageFit === "cover" ? "object-cover" : "object-contain p-2 sm:p-4"
                      )}
                      style={{ objectPosition: imagePosition }}
                      sizes="(max-width: 1024px) 100vw, 800px"
                    />
                  )}
                </div>

                {/* Overlays */}
                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/[0.06]" />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#10131f]/90 via-[#10131f]/40 to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#10131f]/60 to-transparent" />

                {/* Badge tags */}
                <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-2 sm:left-4 sm:top-4">
                  <span className="rounded-full border border-border bg-background/80 px-3 py-1 text-[11px] font-semibold backdrop-blur text-foreground">
                    {activeProject.category}
                  </span>
                  {isLink && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-cyan/40 bg-cyan/15 px-3 py-1 text-[11px] font-semibold text-cyan backdrop-blur">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan" />
                      {isExternal ? "Live" : "Case study"}
                    </span>
                  )}
                </div>
              </div>

              {/* Body Section */}
              <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-surface via-surface to-surface-2">
                <div>
                  <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    {activeProject.name}
                  </h3>
                  <p className="mt-2 text-sm font-semibold text-violet sm:text-base">
                    {activeProject.tagline}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-muted line-clamp-4">
                    {activeProject.description}
                  </p>

                  {/* Metrics if available */}
                  {activeProject.metrics && (
                    <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 border-t border-border/60 pt-6">
                      {activeProject.metrics.map((m) => (
                        <div key={m.label} className="min-w-[80px]">
                          <div className="text-xl font-bold text-gradient-soft">{m.value}</div>
                          <div className="text-[10px] uppercase font-semibold tracking-wider text-muted mt-0.5">{m.label}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  {isLink && activeProject.href && (
                    <>
                      {isExternal ? (
                        <a
                          href={activeProject.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/btn inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet to-cyan px-5 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-[0_0_24px_-8px_rgba(124,92,255,0.5)] transition-transform hover:scale-[1.02]"
                        >
                          {activeProject.linkLabel || "Visit Live Site"}
                          <ExternalLink size={14} className="transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                        </a>
                      ) : (
                        <Link
                          href={activeProject.href}
                          className="group/btn inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet to-cyan px-5 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-[0_0_24px_-8px_rgba(124,92,255,0.5)] transition-transform hover:scale-[1.02]"
                        >
                          View Case Study
                          <ArrowUpRight size={14} className="transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                        </Link>
                      )}
                    </>
                  )}
                </div>

              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="absolute inset-y-0 -left-4 sm:-left-6 flex items-center">
            <button
              onClick={handlePrev}
              aria-label="Previous slide"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-[#0a0c14] text-muted shadow-lg transition-all hover:border-violet/40 hover:text-foreground active:scale-95"
            >
              <ChevronLeft size={20} />
            </button>
          </div>
          <div className="absolute inset-y-0 -right-4 sm:-right-6 flex items-center">
            <button
              onClick={handleNext}
              aria-label="Next slide"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-[#0a0c14] text-muted shadow-lg transition-all hover:border-violet/40 hover:text-foreground active:scale-95"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Indicator dots */}
        <div className="mt-8 flex justify-center gap-2">
          {projects.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleDot(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                idx === activeIndex
                  ? "w-6 bg-violet shadow-[0_0_8px_rgba(124,92,255,0.4)]"
                  : "w-2 bg-border hover:bg-muted/50"
              )}
            />
          ))}
        </div>

        {variant === "summary" && (
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
