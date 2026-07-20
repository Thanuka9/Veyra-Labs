"use client";

import Link from "next/link";
import { useEffect } from "react";
import { BrandLogo } from "@/components/BrandLogo";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <main className="relative z-[1] flex min-h-[70vh] flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <BrandLogo variant="lockup" className="mb-8 h-10 w-auto" />
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-300">Error</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Something went wrong
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
        An unexpected error occurred. You can try again, or head back to the homepage.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-xl bg-gradient-to-r from-violet to-cyan px-5 py-2.5 text-sm font-semibold text-white"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-xl border border-border bg-surface-2 px-5 py-2.5 text-sm font-semibold text-foreground hover:border-violet/40"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
