import Link from "next/link";
import { ArrowUpRight, Lock } from "lucide-react";
import type { Project } from "@/lib/projects";
import { TiltCard } from "./TiltCard";
import { ProjectScreenshot } from "./ProjectScreenshot";

export function ProjectCard({ project }: { project: Project }) {
  const isLink = Boolean(project.href);
  const isExternal = isLink && project.href?.startsWith("http");
  const Wrapper = isLink ? (isExternal ? "a" : Link) : "div" as any;
  const wrapperProps = isLink
    ? isExternal
      ? { href: project.href, target: "_blank", rel: "noopener noreferrer" }
      : { href: project.href }
    : {};

  return (
    <TiltCard className="h-full">
      <Wrapper
        {...wrapperProps}
        className="group card-hover relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface"
      >
      {/* Media */}
      <div className="relative overflow-hidden border-b border-border">
        {project.image ? (
          <ProjectScreenshot
            src={project.image}
            alt={`${project.name} — ${project.tagline}`}
            position={project.imagePosition ?? "center top"}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div
            className={`flex aspect-[16/10] w-full items-center justify-center bg-gradient-to-br ${
              project.cover ?? "from-violet-600/30 to-cyan-500/20"
            }`}
          >
            <span className="bg-gradient-to-br from-white to-white/40 bg-clip-text px-6 text-center text-3xl font-semibold tracking-tight text-transparent">
              {project.name}
            </span>
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-[#0a0c14]/70 to-transparent" />
        {isLink && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-cyan/40 bg-cyan/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-cyan">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan" />
            Live
          </span>
        )}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5 z-10">
          <span className="rounded-full border border-border bg-background/80 px-2.5 py-1 text-[11px] font-medium text-foreground backdrop-blur">
            {project.category}
          </span>
          {project.labels?.map((label) => {
            const isClient = label.includes("Client");
            const isChallenge = label.includes("Challenge");
            const isSaaS = label.includes("SaaS") || label.includes("Product") || label.includes("Brand");
            const isLive = label.includes("Live") || label.includes("Production");

            let colorClasses = "border-cyan/30 bg-cyan/10 text-cyan";
            if (isClient || isLive) {
              colorClasses = "border-emerald-500/30 bg-emerald-500/15 text-emerald-400";
            } else if (isSaaS) {
              colorClasses = "border-violet/30 bg-violet/15 text-violet";
            } else if (isChallenge) {
              colorClasses = "border-amber-500/30 bg-amber-500/15 text-amber-400";
            }

            return (
              <span
                key={label}
                className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider backdrop-blur-sm ${colorClasses}`}
              >
                {label}
              </span>
            );
          })}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold tracking-tight">{project.name}</h3>
          <span className="mt-1 shrink-0 text-muted transition-colors group-hover:text-violet">
            {isLink ? <ArrowUpRight size={18} /> : <Lock size={14} className="opacity-60" />}
          </span>
        </div>
        <p className="mt-0.5 text-sm font-medium text-violet/90">{project.tagline}</p>
        <p className="mt-2.5 text-sm leading-relaxed text-muted">{project.description}</p>

        {project.metrics && (
          <div className="mt-4 flex gap-5">
            {project.metrics.map((m) => (
              <div key={m.label}>
                <div className="text-lg font-semibold text-gradient-soft">{m.value}</div>
                <div className="text-[11px] text-muted">{m.label}</div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-auto flex flex-wrap gap-1.5 pt-5">
          {project.tags.map((t) => (
            <span
              key={t}
              className="rounded-md border border-border bg-surface-2 px-2 py-1 text-[11px] text-muted"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-muted">
          {isLink ? (
            <span className="font-semibold text-cyan">{project.linkLabel ?? "Visit live site"}</span>
          ) : (
            <span>{project.linkLabel}</span>
          )}
        </div>
      </div>
    </Wrapper>
    </TiltCard>
  );
}
