import { cn } from "@/lib/cn";

export function SubsectionLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-10 flex items-center gap-4", className)}>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-violet/35 to-transparent" aria-hidden />
      <p className="shrink-0 text-xs font-semibold uppercase tracking-[0.14em] text-violet">{children}</p>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-violet/35 to-transparent" aria-hidden />
    </div>
  );
}
