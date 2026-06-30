"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { projects, type ProjectCategory } from "@/lib/projects";
import { ProjectCard } from "./ProjectCard";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

const filters = [
  "Portfolio",
  "SaaS Platform",
  "AI & LLM",
  "Data Science",
  "E-Commerce",
  "Website",
];

import { SubsectionLabel } from "./SubsectionLabel";

export function Work({ showHeading = true, inner = false }: { showHeading?: boolean; inner?: boolean }) {
  const [active, setActive] = useState<(typeof filters)[number]>("Portfolio");

  const visible = useMemo(
    () => (active === "Portfolio" ? projects : projects.filter((p) => p.category === active)),
    [active]
  );

  return (
    <section id="work" className={`relative ${inner ? "section-inner section-tone-b" : "section section-tone-a"}`}>
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="container-page">
        {!showHeading && inner && <SubsectionLabel>Full portfolio</SubsectionLabel>}
        {showHeading && (
        <SectionHeading
          eyebrow="Full portfolio"
          title={
            <>
              Every engagement, <span className="text-gradient">engineered to impress</span>
            </>
          }
          subtitle="Browse our complete portfolio — SaaS platforms, AI products, data systems and premium websites delivered for clients and partners."
          align="left"
          wide
        />
        )}

        <div className={`flex flex-wrap gap-2 ${showHeading ? "mt-10" : "mt-0"}`}>
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                active === f
                  ? "border-violet/60 bg-violet/15 text-foreground shadow-[0_0_24px_-8px_rgba(124,92,255,0.5)]"
                  : "border-border bg-surface text-muted hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <motion.div layout className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) => (
              <motion.div
                key={p.slug}
                layout
                initial={false}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <Reveal delay={i % 3} variant="scale">
                  <ProjectCard project={p} />
                </Reveal>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
