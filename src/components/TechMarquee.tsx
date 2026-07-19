"use client";

import { useEffect, useRef } from "react";

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
    <span className="marquee-item inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border/80 bg-surface px-3 py-1 text-xs font-medium text-muted">
      <span className="text-[11px] leading-none opacity-80" aria-hidden>
        {emoji}
      </span>
      {name}
    </span>
  );
}

function MarqueeRow({
  items,
  reverse = false,
  duration = 36,
}: {
  items: readonly { name: string; emoji: string }[];
  reverse?: boolean;
  duration?: number;
}) {
  const loop = [...items, ...items];

  return (
    <div className="marquee-row relative overflow-hidden">
      <div
        className={`marquee-track flex w-max gap-2.5 pr-2.5 ${
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        }`}
        style={{ animationDuration: `${duration}s` }}
      >
        {loop.map((item, i) => (
          <TechPill key={`${item.name}-${i}`} name={item.name} emoji={item.emoji} />
        ))}
      </div>
    </div>
  );
}

/**
 * Compact infinite tech strip — always animates (transform-only).
 * Hover pauses. Kept short so it reads as a slim ribbon, not a block.
 */
export function TechMarquee({ embedded = false }: { embedded?: boolean }) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
  }, []);

  const half = Math.ceil(TECH_ITEMS.length / 2);
  const row1 = TECH_ITEMS.slice(0, half);
  const row2 = TECH_ITEMS.slice(half);

  return (
    <div
      ref={sectionRef}
      className={`tech-marquee-section relative overflow-hidden border-y border-border/70 section-tone-a ${
        embedded ? "py-3" : "py-4 sm:py-5"
      }`}
      aria-label="Technologies we use in production"
    >
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[var(--background)] to-transparent md:w-20"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[var(--background)] to-transparent md:w-20"
        aria-hidden
      />

      <div className="flex flex-col gap-2.5">
        <MarqueeRow items={row1} duration={32} />
        <MarqueeRow items={row2} reverse duration={38} />
      </div>
    </div>
  );
}
