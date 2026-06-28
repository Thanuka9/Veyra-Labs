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
];

function MarqueeRow({
  items,
  reverse = false,
  speed = 40,
}: {
  items: typeof TECH_ITEMS;
  reverse?: boolean;
  speed?: number;
}) {
  return (
    <div className="marquee-row relative flex overflow-hidden">
      <div
        className={`marquee-track flex gap-6 pr-6 whitespace-nowrap ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}
        style={{ animationDuration: `${speed}s` }}
      >
        {items.map((item, i) => (
          <div
            key={`${item.name}-${i}`}
            className="marquee-item inline-flex shrink-0 items-center gap-2.5 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-muted transition-all duration-300 hover:border-violet/40 hover:bg-violet/8 hover:text-foreground hover:scale-[1.03] hover:shadow-[0_0_16px_-4px_rgba(124,92,255,0.4)]"
          >
            <span className="text-base leading-none" aria-hidden>
              {item.emoji}
            </span>
            {item.name}
          </div>
        ))}
      </div>
      <div
        className={`marquee-track flex gap-6 pr-6 whitespace-nowrap ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}
        style={{ animationDuration: `${speed}s` }}
        aria-hidden
      >
        {items.map((item, i) => (
          <div
            key={`${item.name}-${i}-dup`}
            className="marquee-item inline-flex shrink-0 items-center gap-2.5 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-muted transition-all duration-300 hover:border-violet/40 hover:bg-violet/8 hover:text-foreground hover:scale-[1.03] hover:shadow-[0_0_16px_-4px_rgba(124,92,255,0.4)]"
          >
            <span className="text-base leading-none" aria-hidden>
              {item.emoji}
            </span>
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Infinite auto-scrolling tech marquee strip — signals premium engineering credibility.
 */
export function TechMarquee() {
  const rowRef = useRef<HTMLDivElement>(null);

  // Pause on hover
  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const tracks = el.querySelectorAll<HTMLElement>(".marquee-track");
    const pause = () => tracks.forEach((t) => (t.style.animationPlayState = "paused"));
    const resume = () => tracks.forEach((t) => (t.style.animationPlayState = "running"));
    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resume);
    return () => {
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resume);
    };
  }, []);

  const half = Math.ceil(TECH_ITEMS.length / 2);
  const row1 = TECH_ITEMS.slice(0, half + 2);
  const row2 = TECH_ITEMS.slice(half - 2);

  return (
    <div className="tech-marquee-section section-tone-a relative overflow-hidden border-y border-border py-8">
      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[var(--surface)] to-transparent md:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[var(--surface)] to-transparent md:w-28" />

      <div ref={rowRef} className="flex flex-col gap-4">
        <MarqueeRow items={row1} speed={42} />
        <MarqueeRow items={row2} reverse speed={36} />
      </div>
    </div>
  );
}
