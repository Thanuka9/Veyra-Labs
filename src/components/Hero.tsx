"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Calendar, Sparkles, Star, Zap } from "lucide-react";

const slides = [
  { src: "/projects/thanuka-careers-hero.png", label: "thanukaellepola.careers — Live" },
  { src: "/projects/trainiq-hero.png", label: "TrainIQ — Enterprise LMS" },
  { src: "/projects/kapruka-home.png", label: "Kapruka Flow — AI Commerce" },
  { src: "/projects/codex-home.png", label: "CodeX — Architecture AI" },
];

const stats = [
  { v: "15+", l: "Projects delivered" },
  { v: "$1,500", l: "E-commerce from" },
  { v: "90%+", l: "Predictive accuracy" },
];

/** Words that cycle in the headline — each describes a service vertical */
const cycleWords = [
  "SaaS platforms",
  "AI systems",
  "e-commerce stores",
  "premium websites",
  "data pipelines",
];

/** Simple CSS-transition based slide — no Framer Motion scale on images */
function Slide({ src, alt, active }: { src: string; alt: string; active: boolean }) {
  return (
    <div
      className="absolute inset-0 transition-opacity duration-500"
      style={{ opacity: active ? 1 : 0, pointerEvents: active ? "auto" : "none" }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={src === slides[0].src}
        sizes="(max-width: 1280px) 100vw, 680px"
        unoptimized
        className="object-cover object-top"
        style={{ objectPosition: "center top" }}
      />
    </div>
  );
}

/** CSS-only cycling word — no Framer Motion blur/filter on headline */
function CyclingWord({ word, visible }: { word: string; visible: boolean }) {
  return (
    <span
      className="block text-gradient animate-gradient-shift bg-[length:200%_200%]"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
        transition: "opacity 0.4s ease, transform 0.4s ease",
        position: "absolute",
        inset: 0,
        whiteSpace: "nowrap",
      }}
    >
      {word}
    </span>
  );
}

export function Hero() {
  const [index, setIndex] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [entered, setEntered] = useState(false);
  const showcaseRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Slide rotation
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 4500);
    return () => clearInterval(id);
  }, []);

  // Word cycle
  useEffect(() => {
    const id = setInterval(() => setWordIndex((i) => (i + 1) % cycleWords.length), 2800);
    return () => clearInterval(id);
  }, []);

  // Entry animation — single rAF
  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Parallax on scroll — pure DOM, no React state
  useEffect(() => {
    const section = sectionRef.current;
    const showcase = showcaseRef.current;
    if (!section || !showcase) return;

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      if (rect.bottom < 0) return; // off screen — skip
      const progress = Math.max(0, Math.min(1, -rect.top / rect.height));
      showcase.style.transform = `translateY(${progress * 36}px)`;
      showcase.style.opacity = `${1 - progress * 0.55}`;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const shownStyle: React.CSSProperties = { opacity: 1, transform: "translateY(0)" };
  const hiddenStyle: React.CSSProperties = { opacity: 0, transform: "translateY(24px)" };
  const transBase = "opacity 0.65s cubic-bezier(0.16,1,0.3,1), transform 0.65s cubic-bezier(0.16,1,0.3,1)";

  return (
    <section ref={sectionRef} id="top" className="relative overflow-hidden pt-[5.5rem] pb-12 md:pt-28 md:pb-20">
      {/* Local hero accent */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[560px] w-[min(1000px,100%)] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(124,92,255,0.15),transparent)] blur-3xl" />
        <div className="absolute left-1/2 top-0 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/3 rounded-full border border-violet/5 animate-spin-slow" />
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/4 rounded-full border border-cyan/5 animate-spin-slow [animation-direction:reverse] [animation-duration:20s]" />
      </div>

      <div className="container-page">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-14">
          {/* Copy */}
          <div className="max-w-xl lg:max-w-none">
            {/* Badge */}
            <div
              className="animate-float-badge inline-flex items-center gap-2 rounded-full border border-violet/30 bg-violet/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-violet sm:text-[13px] shadow-[0_0_24px_-8px_rgba(124,92,255,0.4)]"
              style={{ ...(entered ? shownStyle : hiddenStyle), transition: `${transBase}` }}
            >
              <Sparkles size={14} className="text-cyan animate-pulse" />
              Software &amp; AI engineering studio
              <span className="ml-1 inline-flex h-2 w-2 rounded-full bg-cyan animate-pulse" />
            </div>

            {/* H1 with word cycle */}
            <h1
              className="mt-6 max-w-2xl text-balance text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.25rem] xl:text-6xl"
              style={{ ...(entered ? shownStyle : hiddenStyle), transition: `${transBase} 0.08s` }}
            >
              We build{" "}
              <span className="relative inline-block" style={{ minWidth: "17ch", height: "1.15em", verticalAlign: "bottom" }}>
                {cycleWords.map((w, i) => (
                  <CyclingWord key={w} word={w} visible={i === wordIndex} />
                ))}
              </span>
              {" "}that win clients &amp; scale revenue.
            </h1>

            {/* Sub */}
            <p
              className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted sm:text-lg"
              style={{ ...(entered ? shownStyle : hiddenStyle), transition: `${transBase} 0.16s` }}
            >
              Veyra Labs partners with founders and enterprises to design, engineer and ship
              SaaS platforms, AI systems, e-commerce experiences and premium websites — from
              first prototype to production deployment on Google Cloud.
            </p>

            {/* CTAs */}
            <div
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
              style={{ ...(entered ? shownStyle : hiddenStyle), transition: `${transBase} 0.24s` }}
            >
              <a
                href="#contact"
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-violet via-indigo to-cyan px-7 py-4 text-sm font-semibold text-white shadow-[0_0_40px_-10px_rgba(124,92,255,0.7)] transition-all hover:scale-[1.03] hover:shadow-[0_0_60px_-8px_rgba(124,92,255,0.9)]"
              >
                <span className="absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/10 transition-transform duration-700 group-hover:translate-x-[120%]" />
                <Calendar size={16} />
                Book a discovery call
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#work"
                className="group inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface/80 px-7 py-4 text-sm font-semibold backdrop-blur transition-all hover:border-violet/40 hover:bg-surface hover:shadow-[0_0_24px_-8px_rgba(124,92,255,0.3)]"
              >
                <Zap size={15} className="text-cyan transition-transform group-hover:scale-110" />
                Explore case studies
              </a>
            </div>

            {/* Social proof row */}
            <div
              className="mt-8 flex items-center gap-3"
              style={{ ...(entered ? shownStyle : hiddenStyle), transition: `${transBase} 0.32s` }}
            >
              <div className="flex -space-x-2">
                {[
                  { bg: "bg-violet", l: "T" },
                  { bg: "bg-cyan", l: "R" },
                  { bg: "bg-indigo", l: "K" },
                  { bg: "bg-emerald-500", l: "C" },
                ].map((a, i) => (
                  <div
                    key={i}
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-background text-[11px] font-bold text-white ${a.bg}`}
                  >
                    {a.l}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={12} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-[11px] text-muted">Trusted by 10+ enterprise clients</p>
              </div>
            </div>

            {/* Stats */}
            <div
              className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t border-border pt-8"
              style={{ ...(entered ? shownStyle : hiddenStyle), transition: `${transBase} 0.4s` }}
            >
              {stats.map((s) => (
                <div key={s.l} className="group">
                  <div className="text-2xl font-bold text-gradient-soft transition-all group-hover:scale-105">{s.v}</div>
                  <div className="text-xs text-muted">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Showcase browser — plain div, parallax via direct DOM style */}
          <div
            ref={showcaseRef}
            className="relative w-full max-w-[600px] lg:max-w-none lg:justify-self-end xl:max-w-[580px]"
            style={{
              opacity: entered ? 1 : 0,
              transform: entered ? "translateY(0)" : "translateY(28px)",
              transition: "opacity 0.85s cubic-bezier(0.16,1,0.3,1) 0.12s, transform 0.85s cubic-bezier(0.16,1,0.3,1) 0.12s",
              willChange: "transform, opacity",
            }}
          >
            {/* Glow halo */}
            <div className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-violet/25 via-transparent to-cyan/25 blur-2xl animate-pulse-glow" />
            <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-violet/10 via-transparent to-cyan/10 blur-xl" />

            <div className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_32px_80px_-24px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.05)] ring-1 ring-white/5">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 border-b border-border bg-surface-2 px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                <span className="h-3 w-3 rounded-full bg-amber-400/80 shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                <span className="h-3 w-3 rounded-full bg-emerald-400/80 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                <div className="mx-auto flex-1 rounded-md border border-border bg-background/60 px-3 py-1 text-center text-[11px] text-muted transition-all duration-300">
                  {slides[index].label}
                </div>
              </div>

              {/* Slides — pure CSS opacity crossfade, no scale transform */}
              <div className="relative aspect-[16/10] overflow-hidden bg-background">
                {slides.map((slide, i) => (
                  <Slide key={slide.src} src={slide.src} alt={slide.label} active={i === index} />
                ))}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-surface to-transparent" />
              </div>
            </div>

            {/* Slide dots */}
            <div className="mt-4 flex justify-center gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Show slide ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === index
                      ? "w-8 bg-gradient-to-r from-violet to-cyan shadow-[0_0_8px_rgba(124,92,255,0.6)]"
                      : "w-1.5 bg-border hover:bg-muted/60"
                  }`}
                />
              ))}
            </div>

            {/* Floating live badge */}
            <div
              className="absolute -bottom-4 -left-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-background/95 px-3 py-2 text-xs font-semibold text-emerald-400 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.6)] backdrop-blur-sm"
              style={{
                opacity: entered ? 1 : 0,
                transform: entered ? "scale(1)" : "scale(0.85)",
                transition: "opacity 0.5s ease 0.7s, transform 0.5s ease 0.7s",
              }}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              All projects in production
            </div>

            {/* Floating tech badge */}
            <div
              className="absolute -right-4 -top-4 flex items-center gap-2 rounded-xl border border-violet/30 bg-background/95 px-3 py-2 text-xs font-semibold text-violet shadow-[0_8px_32px_-8px_rgba(0,0,0,0.6)] backdrop-blur-sm"
              style={{
                opacity: entered ? 1 : 0,
                transform: entered ? "scale(1)" : "scale(0.85)",
                transition: "opacity 0.5s ease 0.9s, transform 0.5s ease 0.9s",
              }}
            >
              <Sparkles size={12} className="text-cyan" />
              Google Cloud powered
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
