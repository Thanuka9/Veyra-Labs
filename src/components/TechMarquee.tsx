"use client";

import { useEffect, useRef, useState } from "react";

const TECH_ITEMS = [
  { name: "Next.js", emoji: "▲" },
  { name: "React", emoji: "⚛" },
  { name: "TypeScript", emoji: "TS" },
  { name: "Python", emoji: "🐍" },
  { name: "FastAPI", emoji: "⚡" },
  { name: "Google Cloud", emoji: "☁" },
  { name: "OpenAI", emoji: "✦" },
  { name: "LangChain", emoji: "🔗" },
  { name: "PostgreSQL", emoji: "🐘" },
  { name: "Stripe", emoji: "💳" },
  { name: "TailwindCSS", emoji: "🎨" },
  { name: "Docker", emoji: "🐳" },
  { name: "Vercel", emoji: "▲" },
  { name: "Redis", emoji: "🔴" },
  { name: "GraphQL", emoji: "◆" },
  { name: "Supabase", emoji: "⚡" },
  { name: "Prisma", emoji: "◈" },
  { name: "Framer Motion", emoji: "✦" },
] as const;

function TechPill({ name, emoji }: { name: string; emoji: string }) {
  return (
    <span className="marquee-item inline-flex shrink-0 items-center gap-2.5 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-muted transition-colors duration-200 hover:border-violet/40 hover:bg-violet/8 hover:text-foreground">
      <span className="text-base leading-none" aria-hidden>
        {emoji}
      </span>
      {name}
    </span>
  );
}

function MarqueeRow({
  items,
  reverse = false,
  duration = 40,
}: {
  items: readonly { name: string; emoji: string }[];
  reverse?: boolean;
  duration?: number;
}) {
  // Duplicate once for a seamless loop (translate -50% of the combined track)
  const loop = [...items, ...items];

  return (
    <div className="marquee-row group/row relative overflow-hidden">
      <div
        className={`marquee-track flex w-max gap-4 pr-4 ${
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        }`}
        style={{ animationDuration: `${duration}s` }}
      >
        {loop.map((item, i) => (
          <TechPill
            key={`${item.name}-${i}`}
            name={item.name}
            emoji={item.emoji}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Infinite auto-scrolling tech strip.
 * Uses transform-only animation (cheap). Falls back to a wrapped chip cloud
 * when the OS requests reduced motion.
 */
export function TechMarquee({ embedded = false }: { embedded?: boolean }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Pause while hovering the section (not reduced-motion path)
  useEffect(() => {
    if (reducedMotion) return;
    const el = sectionRef.current;
    if (!el) return;
    const tracks = () => el.querySelectorAll<HTMLElement>(".marquee-track");
    const pause = () => tracks().forEach((t) => (t.style.animationPlayState = "paused"));
    const resume = () => tracks().forEach((t) => (t.style.animationPlayState = "running"));
    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resume);
    return () => {
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resume);
    };
  }, [reducedMotion]);

  const half = Math.ceil(TECH_ITEMS.length / 2);
  const row1 = TECH_ITEMS.slice(0, half);
  const row2 = TECH_ITEMS.slice(half);

  return (
    <div
      ref={sectionRef}
      className={`tech-marquee-section relative overflow-hidden section-tone-a ${
        embedded
          ? "section-inner-tight border-b border-border py-6"
          : "border-y border-border py-8 section"
      }`}
      aria-label="Technologies we use in production"
    >
      {/* Soft edge fades */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[var(--background)] to-transparent md:w-32"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[var(--background)] to-transparent md:w-32"
        aria-hidden
      />

      {reducedMotion ? (
        <div className="container-page flex flex-wrap items-center justify-center gap-3">
          {TECH_ITEMS.map((item) => (
            <TechPill key={item.name} name={item.name} emoji={item.emoji} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <MarqueeRow items={row1} duration={38} />
          <MarqueeRow items={row2} reverse duration={44} />
        </div>
      )}
    </div>
  );
}
