import { Reveal } from "./Reveal";
import { cn } from "@/lib/cn";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  wide = false,
  accent = "violet",
  theme = "dark",
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
  align?: "center" | "left";
  wide?: boolean;
  /** Controls the eyebrow dot + pill colour. Defaults to "violet". */
  accent?: "violet" | "cyan" | "emerald" | "indigo";
  /** Light sections use dark text overrides */
  theme?: "dark" | "light";
}) {
  const alignment =
    align === "center"
      ? "items-center text-center mx-auto"
      : "items-start text-left mr-auto";

  const isLight = theme === "light";

  const accentStyles = {
    violet: {
      pill: "border-violet/25 bg-violet/8 text-violet",
      dot: "bg-violet",
    },
    cyan: {
      pill: "border-cyan/25 bg-cyan/8 text-cyan",
      dot: "bg-cyan",
    },
    emerald: {
      pill: "border-emerald-500/25 bg-emerald-500/8 text-emerald-400",
      dot: "bg-emerald-400",
    },
    indigo: {
      pill: "border-indigo/25 bg-indigo/8 text-indigo",
      dot: "bg-indigo",
    },
  }[accent];

  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        alignment,
        wide ? "max-w-4xl" : align === "center" ? "max-w-2xl" : "max-w-3xl"
      )}
    >
      <Reveal>
        <span
          className={cn(
            "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold tracking-wide uppercase transition-colors",
            accentStyles.pill
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full animate-pulse", accentStyles.dot)} />
          {eyebrow}
        </span>
      </Reveal>
      <Reveal delay={1}>
        <h2
          className={cn(
            "text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl",
            isLight && "text-[#12131a]"
          )}
        >
          {title}
        </h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={2}>
          <p
            className={cn(
              "text-pretty text-base leading-relaxed sm:text-lg",
              isLight ? "text-[#5c6478]" : "text-muted"
            )}
          >
            {subtitle}
          </p>
        </Reveal>
      )}
    </div>
  );
}
