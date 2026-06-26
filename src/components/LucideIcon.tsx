import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

type IconProps = {
  icon: LucideIcon;
  size?: number;
  className?: string;
};

/** Ensures Lucide icons always render with visible stroke on dark UI */
export function LucideIcon({ icon: Icon, size = 16, className }: IconProps) {
  return (
    <Icon
      size={size}
      width={size}
      height={size}
      strokeWidth={2}
      aria-hidden
      className={cn("inline-block shrink-0", className)}
    />
  );
}
