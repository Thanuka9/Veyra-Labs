import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";

export default function NotFound() {
  return (
    <main className="relative z-[1] flex min-h-[70vh] flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <BrandLogo variant="lockup" className="mb-8 h-10 w-auto" />
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">404</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
        That URL doesn&apos;t exist — it may have moved, or the link is out of date.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-xl bg-gradient-to-r from-violet to-cyan px-5 py-2.5 text-sm font-semibold text-white"
        >
          Back to home
        </Link>
        <Link
          href="/quote"
          className="rounded-xl border border-border bg-surface-2 px-5 py-2.5 text-sm font-semibold text-foreground hover:border-violet/40"
        >
          Get a quote
        </Link>
        <Link
          href="/contact"
          className="rounded-xl border border-border bg-surface-2 px-5 py-2.5 text-sm font-semibold text-foreground hover:border-violet/40"
        >
          Contact
        </Link>
      </div>
    </main>
  );
}
