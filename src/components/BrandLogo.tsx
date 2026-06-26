import Image from "next/image";
import { cn } from "@/lib/cn";

/** Bump when logo source files change to bust CDN/browser cache. */
const BRAND_V = "2";

type BrandLogoProps = {
  variant?: "wordmark" | "lockup" | "icon";
  className?: string;
  priority?: boolean;
};

const assets = {
  wordmark: { src: `/brand/wordmark-light.png?v=${BRAND_V}`, w: 240, h: 52, alt: "Veyra Labs" },
  lockup: { src: `/brand/lockup-dark.png?v=${BRAND_V}`, w: 300, h: 80, alt: "Veyra Labs" },
  icon: { src: `/brand/app-icon.png?v=${BRAND_V}`, w: 48, h: 48, alt: "Veyra Labs icon" },
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
