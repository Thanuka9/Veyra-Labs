"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { cn } from "@/lib/cn";

export type GalleryImage = { src: string; caption: string };

type Props = {
  images: GalleryImage[];
};

export function CaseStudyGallery({ images }: Props) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const go = useCallback(
    (dir: -1 | 1) => {
      setActive((i) => (i + dir + images.length) % images.length);
    },
    [images.length]
  );

  if (images.length === 0) return null;

  const current = images[active];

  return (
    <>
      <section className="mt-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-violet">Product screens</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Interface gallery</h2>
          </div>
          <p className="hidden text-sm text-muted sm:block">
            {active + 1} / {images.length}
          </p>
        </div>

        {/* Main viewer */}
        <div className="relative mt-6 overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl">
          <div className="relative aspect-[16/9] w-full bg-[#07080f]">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.src}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={current.src}
                  alt={current.caption}
                  fill
                  unoptimized
                  priority={active === 0}
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 1200px"
                />
              </motion.div>
            </AnimatePresence>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border/80 bg-background/80 text-foreground backdrop-blur-md transition-colors hover:border-violet/50 hover:bg-background"
                  aria-label="Previous screenshot"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border/80 bg-background/80 text-foreground backdrop-blur-md transition-colors hover:border-violet/50 hover:bg-background"
                  aria-label="Next screenshot"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => setLightbox(true)}
              className="absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-lg border border-border/80 bg-background/80 px-3 py-1.5 text-xs font-semibold text-muted backdrop-blur-md transition-colors hover:border-violet/50 hover:text-foreground"
              aria-label="Expand screenshot"
            >
              <Expand size={14} />
              Expand
            </button>
          </div>

          <div className="border-t border-border bg-surface-2 px-5 py-4">
            <p className="text-sm leading-relaxed text-muted">{current.caption}</p>
          </div>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="mt-4 flex gap-3 overflow-x-auto pb-1 hide-scrollbar">
            {images.map((img, i) => (
              <button
                key={img.src + i}
                type="button"
                onClick={() => setActive(i)}
                className={cn(
                  "relative h-16 w-28 shrink-0 overflow-hidden rounded-lg border transition-all sm:h-20 sm:w-36",
                  i === active
                    ? "border-violet/60 ring-2 ring-violet/30 shadow-[0_0_20px_-6px_rgba(124,92,255,0.6)]"
                    : "border-border opacity-70 hover:border-violet/30 hover:opacity-100"
                )}
                aria-label={`View screenshot ${i + 1}`}
                aria-current={i === active}
              >
                <Image
                  src={img.src}
                  alt=""
                  fill
                  unoptimized
                  className="object-cover object-top"
                  sizes="144px"
                />
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 p-4 backdrop-blur-xl"
            onClick={() => setLightbox(false)}
          >
            <button
              type="button"
              className="absolute right-4 top-4 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-muted hover:text-foreground"
              onClick={() => setLightbox(false)}
            >
              Close
            </button>
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative max-h-[90vh] w-full max-w-6xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-border">
                <Image
                  src={current.src}
                  alt={current.caption}
                  fill
                  unoptimized
                  className="object-contain"
                  sizes="100vw"
                />
              </div>
              <p className="mt-4 text-center text-sm text-muted">{current.caption}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
