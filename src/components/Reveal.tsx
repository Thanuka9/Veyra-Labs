"use client";

import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { cn } from "@/lib/cn";

export type RevealVariant = "up" | "left" | "right" | "scale";

type ScrollTriggerOptions = {
  rootMargin?: string;
  threshold?: number;
};

/**
 * Reliable scroll-into-view trigger.
 *
 * Strategy:
 * 1. Wait 300ms for Next.js hydration + layout to fully settle.
 * 2. If the element is already partially visible AND we have some scroll depth, trigger now.
 * 3. Otherwise, attach an IntersectionObserver that only fires AFTER the first scroll event.
 *    This prevents false triggers from hydration-time layout shifts.
 */
export function useScrollTrigger(
  ref: RefObject<Element | null>,
  options: ScrollTriggerOptions = {}
): boolean {
  const {
    rootMargin = "0px 0px -4% 0px",
    threshold = 0.02,
  } = options;

  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Disabled prefers-reduced-motion check to ensure animations always run for presentation purposes.

    let observer: IntersectionObserver | null = null;
    let timerId: number | null = null;

    const start = () => {
      const r = el.getBoundingClientRect();
      const inView = r.top < window.innerHeight * 0.98 && r.bottom > 0;
      if (inView) {
        setTriggered(true);
        return;
      }

      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry) {
            const rect = entry.boundingClientRect;
            const inViewStrict = rect.top < window.innerHeight * 0.98 && rect.bottom > 0;
            if (entry.isIntersecting) {
              if (inViewStrict) {
                setTriggered(true);
                observer?.disconnect();
              }
            }
          }
        },
        { rootMargin, threshold }
      );
      observer.observe(el);
    };

    // 150ms delay ensures Next.js hydration and CSS layout are fully settled
    timerId = window.setTimeout(start, 150);

    return () => {
      if (timerId) window.clearTimeout(timerId);
      observer?.disconnect();
    };
  }, [ref, rootMargin, threshold]);

  return triggered;
}

/** Per-step scroll reveal — stricter threshold so steps appear one-by-one while scrolling. */
export function RevealStep({
  children,
  index,
  variant = "left",
  className,
}: {
  children: ReactNode;
  index: number;
  variant?: RevealVariant;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useScrollTrigger(ref, {
    rootMargin: "0px 0px -5% 0px",
    threshold: 0.02,
  });

  const variantClass =
    variant === "left"
      ? "reveal-on-scroll--left"
      : variant === "right"
        ? "reveal-on-scroll--right"
        : variant === "scale"
          ? "reveal-on-scroll--scale"
          : undefined;

  return (
    <div
      ref={ref}
      className={cn(
        "reveal-on-scroll",
        variantClass,
        visible && "reveal-on-scroll--in",
        className
      )}
      style={{ transitionDelay: visible ? `${index * 80}ms` : undefined }}
    >
      {children}
    </div>
  );
}

/**
 * Scroll reveal — pure CSS transitions, hydration-safe.
 */
export function Reveal({
  children,
  delay = 0,
  variant = "up",
  className,
}: {
  children: ReactNode;
  delay?: number;
  variant?: RevealVariant;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useScrollTrigger(ref);

  const variantClass =
    variant === "left"
      ? "reveal-on-scroll--left"
      : variant === "right"
        ? "reveal-on-scroll--right"
        : variant === "scale"
          ? "reveal-on-scroll--scale"
          : undefined;

  return (
    <div
      ref={ref}
      className={cn(
        "reveal-on-scroll",
        variantClass,
        visible && "reveal-on-scroll--in",
        className
      )}
      style={{ transitionDelay: visible ? `${delay * 100}ms` : undefined }}
    >
      {children}
    </div>
  );
}
