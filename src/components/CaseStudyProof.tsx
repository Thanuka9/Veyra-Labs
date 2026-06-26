"use client";

import { CheckCircle2, ExternalLink, ShieldCheck } from "lucide-react";
import Link from "next/link";

export type ProofHighlight = {
  label: string;
  value: string;
  note?: string;
};

type Props = {
  proofLevel: string;
  highlights: ProofHighlight[];
  liveUrl?: string;
  proofNote?: string;
};

export function CaseStudyProof({ proofLevel, highlights, liveUrl, proofNote }: Props) {
  return (
    <section className="mt-12 rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/8 via-surface to-surface p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <ShieldCheck size={16} />
            Proof &amp; verified results
          </div>
          <p className="mt-2 max-w-2xl text-sm text-muted">{proofLevel}</p>
        </div>
        {liveUrl && (
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-cyan/30 bg-cyan/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-cyan transition-colors hover:border-cyan/50"
          >
            View live deployment
            <ExternalLink size={14} />
          </a>
        )}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {highlights.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-border/80 bg-background/50 px-4 py-3.5"
          >
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted">{item.label}</p>
            <p className="mt-1 text-lg font-bold text-foreground">{item.value}</p>
            {item.note && <p className="mt-1 text-xs leading-relaxed text-muted">{item.note}</p>}
          </div>
        ))}
      </div>

      {proofNote && (
        <p className="mt-5 flex gap-2 text-xs leading-relaxed text-muted">
          <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-400" />
          {proofNote}
        </p>
      )}

      <p className="mt-4 text-[11px] text-muted/80">
        Metrics reflect project-specific measurements, staging benchmarks, or anonymized production outcomes as noted
        in each case study. Screenshots are from the actual build unless marked as a prototype.
      </p>
    </section>
  );
}
