import Image from "next/image";
import { cn } from "@/lib/cn";

/** Bump when logo source files change to bust CDN/browser cache. */
const BRAND_V = "4";

type BrandLogoProps = {
  /** wordmark = official Veyra Labs main logo (V + wordmark). lockup = dark-theme lockup. icon = main wordmark scaled. */
  variant?: "wordmark" | "lockup" | "icon";
  className?: string;
  priority?: boolean;
};

const assets = {
  /** Official main logo  -  veyra_labs_main_logo_wordmark */
  wordmark: { src: `/brand/wordmark-main.png?v=${BRAND_V}`, w: 280, h: 60, alt: "Veyra Labs" },
  icon: { src: `/brand/wordmark-main.png?v=${BRAND_V}`, w: 280, h: 60, alt: "Veyra Labs" },
  /** White text lockup for dark backgrounds without a light badge */
  lockup: { src: `/brand/lockup-dark.png?v=${BRAND_V}`, w: 320, h: 72, alt: "Veyra Labs" },
} as const;

export function BrandLogo({ variant = "wordmark", className, priority }: BrandLogoProps) {
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
