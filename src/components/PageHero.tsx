import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

type Breadcrumb = { label: string; href?: string };

export function PageHero({
  title,
  subtitle,
  breadcrumbs = [{ label: "Home", href: "/" }],
  tone = "a",
}: {
  title: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
  tone?: "a" | "b";
}) {
  return (
    <header
      className={cn(
        "relative overflow-hidden border-b border-border pt-[5.5rem] pb-12 md:pt-28 md:pb-16",
        tone === "a" ? "section-tone-a" : "section-tone-b"
      )}
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[420px] w-[min(900px,100%)] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(124,92,255,0.12),transparent)] blur-3xl" />
      </div>
      <div className="container-page">
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1 text-sm text-muted">
          {breadcrumbs.map((crumb, i) => (
            <span key={`${crumb.label}-${i}`} className="inline-flex items-center gap-1">
              {i > 0 && <ChevronRight size={14} className="text-muted/60" aria-hidden />}
              {crumb.href ? (
                <Link href={crumb.href} className="transition-colors hover:text-cyan">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-foreground/80">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
        <h1 className="max-w-3xl text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted sm:text-lg">
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
}
