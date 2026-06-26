"use client";

import { useEffect, useRef } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -200, y: -200 });
  const ring = useRef({ x: -200, y: -200 });
  const rafRef = useRef(0);

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (coarse) return;

    const onMove = (e: PointerEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    const tick = () => {
      const dot = dotRef.current;
      const ringEl = ringRef.current;
      if (dot && ringEl) {
        dot.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
        ring.current.x += (pos.current.x - ring.current.x) * 0.14;
        ring.current.y += (pos.current.y - ring.current.y) * 0.14;
        ringEl.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    rafRef.current = requestAnimationFrame(tick);

    const onEnterLink = () => {
      dotRef.current?.querySelector(".cursor-dot-inner")?.classList.add("hovered");
      ringRef.current?.querySelector(".cursor-dot-ring")?.classList.add("hovered");
    };
    const onLeaveLink = () => {
      dotRef.current?.querySelector(".cursor-dot-inner")?.classList.remove("hovered");
      ringRef.current?.querySelector(".cursor-dot-ring")?.classList.remove("hovered");
    };

    const interactiveSelector = "a, button, input, textarea, select, [role='button'], .cursor-pointer";
    const updateListeners = (add: boolean) => {
      document.querySelectorAll(interactiveSelector).forEach((el) => {
        if (add) {
          el.addEventListener("mouseenter", onEnterLink);
          el.addEventListener("mouseleave", onLeaveLink);
        } else {
          el.removeEventListener("mouseenter", onEnterLink);
          el.removeEventListener("mouseleave", onLeaveLink);
        }
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    rafRef.current = requestAnimationFrame(tick);
    updateListeners(true);

    // Watch for dynamic DOM changes to bind new elements
    const observer = new MutationObserver(() => {
      updateListeners(true);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("pointermove", onMove);
      updateListeners(false);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden>
        <div className="cursor-dot-inner" />
      </div>
      <div ref={ringRef} className="cursor-dot" aria-hidden>
        <div className="cursor-dot-ring" />
      </div>
    </>
  );
}
