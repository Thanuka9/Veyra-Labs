"use client";

import { useEffect, useRef } from "react";

type TiltCardProps = {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  glowColor?: string;
};

/**
 * 3D tilt card — event-driven RAF, runs ONLY while mouse is over the card.
 * Idle cards = zero CPU/GPU cost.
 */
export function TiltCard({
  children,
  className = "",
  intensity = 8,
  glowColor = "124, 92, 255",
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const targetRef = useRef({ rx: 0, ry: 0, mx: 50, my: 50 });
  const currentRef = useRef({ rx: 0, ry: 0 });
  const activeRef = useRef(false);
  const animatingRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    const spotlight = spotlightRef.current;
    if (!el || !spotlight) return;

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (coarse) return;

    const startLoop = () => {
      if (animatingRef.current) return;
      animatingRef.current = true;

      const tick = () => {
        const speed = 0.12;
        currentRef.current.rx += (targetRef.current.rx - currentRef.current.rx) * speed;
        currentRef.current.ry += (targetRef.current.ry - currentRef.current.ry) * speed;

        el.style.transform = `perspective(900px) rotateX(${currentRef.current.rx.toFixed(3)}deg) rotateY(${currentRef.current.ry.toFixed(3)}deg) translateZ(0)`;

        if (activeRef.current) {
          spotlight.style.opacity = "1";
          spotlight.style.background = `radial-gradient(200px circle at ${targetRef.current.mx}% ${targetRef.current.my}%, rgba(${glowColor}, 0.22), transparent 65%)`;
        } else {
          spotlight.style.opacity = "0";
        }

        // Stop the loop once both tilt axes are nearly at rest
        const rx = Math.abs(currentRef.current.rx);
        const ry = Math.abs(currentRef.current.ry);
        if (!activeRef.current && rx < 0.02 && ry < 0.02) {
          el.style.transform = "";
          animatingRef.current = false;
          return; // exit RAF loop
        }

        rafRef.current = requestAnimationFrame(tick);
      };

      rafRef.current = requestAnimationFrame(tick);
    };

    const onEnter = () => {
      activeRef.current = true;
      startLoop();
    };

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);

      targetRef.current.rx = -dy * intensity;
      targetRef.current.ry = dx * intensity;
      targetRef.current.mx = ((e.clientX - rect.left) / rect.width) * 100;
      targetRef.current.my = ((e.clientY - rect.top) / rect.height) * 100;
    };

    const onLeave = () => {
      targetRef.current.rx = 0;
      targetRef.current.ry = 0;
      activeRef.current = false;
      // loop will self-terminate once near zero
    };

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);

    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(rafRef.current);
      animatingRef.current = false;
      el.style.transform = "";
    };
  }, [intensity, glowColor]);

  return (
    <div ref={ref} className={`tilt-card-wrapper ${className}`} style={{ willChange: "transform" }}>
      <div
        ref={spotlightRef}
        className="tilt-card-spotlight pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0"
        style={{ transition: "opacity 0.3s ease" }}
        aria-hidden
      />
      {children}
    </div>
  );
}
