"use client";

import type { MathChallenge } from "@/lib/math-challenge";
import { mathChallengeLabel } from "@/lib/math-challenge";
import { cn } from "@/lib/cn";

export function MathChallengeField({
  challenge,
  value,
  onChange,
  className,
  inputClassName,
  compact,
}: {
  challenge: MathChallenge;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  inputClassName?: string;
  compact?: boolean;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        htmlFor="human_ver"
        className={cn(
          "font-semibold uppercase tracking-wider text-muted",
          compact ? "text-[10px]" : "text-xs"
        )}
      >
        {mathChallengeLabel(challenge)}
      </label>
      <input
        id="human_ver"
        name="human_ver"
        type="number"
        inputMode="numeric"
        autoComplete="off"
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Your answer"
        className={cn(
          "rounded-xl border border-border bg-background/60 px-4 py-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted/50 focus:border-violet/50 focus:ring-1 focus:ring-violet/30",
          compact && "rounded-lg px-3 py-2 text-xs",
          inputClassName
        )}
      />
    </div>
  );
}
