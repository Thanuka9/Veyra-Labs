import Image from "next/image";
import { cn } from "@/lib/cn";

const SCREENSHOT_BG = "#0a0c14";

type ProjectScreenshotProps = {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  position?: string;
  aspect?: string;
  fit?: "contain" | "cover";
  className?: string;
  imageClassName?: string;
};

export function ProjectScreenshot({
  src,
  alt,
  priority,
  sizes = "(max-width: 768px) 100vw, 33vw",
  position = "center top",
  aspect = "aspect-[16/10]",
  fit = "contain",
  className,
  imageClassName,
}: ProjectScreenshotProps) {
  const isCover = fit === "cover";

  return (
    <div
      className={cn("relative w-full overflow-hidden", className)}
      style={{ backgroundColor: SCREENSHOT_BG }}
    >
      <div className={cn("relative w-full", aspect)}>
        <Image
          src={src}
          alt={alt}
          fill
          unoptimized
          priority={priority}
          sizes={sizes}
          className={cn(
            isCover ? "object-cover" : "object-contain p-2 sm:p-3",
            imageClassName
          )}
          style={{ objectPosition: position }}
        />
      </div>
    </div>
  );
}
