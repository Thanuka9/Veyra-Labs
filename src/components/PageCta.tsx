import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { Reveal } from "./Reveal";

export function PageCta() {
  return (
    <section className="section-inner section-tone-a relative border-t border-border">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet/35 to-transparent" />
      <div className="container-page">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-violet/25 bg-gradient-to-br from-surface via-surface to-surface-2 p-8 sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-10">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[radial-gradient(closest-side,rgba(124,92,255,0.2),transparent)] blur-2xl" />
            <div className="relative max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-violet">Next step</p>
              <h2 className="mt-2 text-balance text-2xl font-bold tracking-tight sm:text-3xl">
                Ready to ship your next product?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                Book a free discovery call — we&apos;ll scope your project, share a fixed quote, and outline the first sprint.
              </p>
            </div>
            <div className="relative mt-6 flex shrink-0 flex-col gap-3 sm:mt-0">
              <Link
                href="/#contact"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet to-cyan px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_32px_-8px_rgba(124,92,255,0.6)] transition-all hover:scale-[1.02]"
              >
                <Calendar size={16} />
                Book a discovery call
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/work"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface/80 px-6 py-3 text-sm font-semibold text-muted transition-colors hover:border-violet/40 hover:text-foreground"
              >
                View case studies
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
