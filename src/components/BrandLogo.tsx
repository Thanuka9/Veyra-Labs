import Image from "next/image";
import { cn } from "@/lib/cn";

/** Bump when logo source files change to bust CDN/browser cache. */
const BRAND_V = "3";

type BrandLogoProps = {
  /** lockup = icon + wordmark for dark backgrounds (navbar, footer). wordmark = dark text on white (PDFs). icon = app mark only. */
  variant?: "lockup" | "wordmark" | "icon";
  className?: string;
  priority?: boolean;
};

const assets = {
  /** White “Veyra Labs” + gradient V — use on dark UI (navbar, footer, legal). */
  lockup: { src: `/brand/lockup-dark.png?v=${BRAND_V}`, w: 320, h: 72, alt: "Veyra Labs" },
  /** Dark text wordmark — use on white/light backgrounds only. */
  wordmark: { src: `/brand/wordmark-light.png?v=${BRAND_V}`, w: 240, h: 52, alt: "Veyra Labs" },
  icon: { src: `/brand/app-icon.png?v=${BRAND_V}`, w: 48, h: 48, alt: "Veyra Labs icon" },
} as const;

export function BrandLogo({ variant = "lockup", className, priority }: BrandLogoProps) {
  const asset = assets[variant];
  return (
    <Image
      src={asset.src}
      alt={asset.alt}
      width={asset.w}
      height={asset.h}
      priority={priority}
      unoptimized
      className={cn("block w-auto object-contain object-left", className)}
    />
  );
}
