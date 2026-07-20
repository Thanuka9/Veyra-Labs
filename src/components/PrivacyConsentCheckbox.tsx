"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";

export function PrivacyConsentCheckbox({
  checked,
  onChange,
  id = "privacy-consent",
  className,
  compact,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
  className?: string;
  compact?: boolean;
}) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex items-start gap-2.5 text-muted",
        compact ? "text-[10px] leading-snug" : "text-xs",
        className
      )}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        required
        className={cn("mt-0.5 shrink-0 accent-violet", compact && "mt-0")}
      />
      <span>
        I agree to be contacted about my project. See our{" "}
        <Link href="/privacy" className="font-medium text-cyan hover:underline">
          Privacy Policy
        </Link>
        .
      </span>
    </label>
  );
}
