"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/cn";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 400);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollTop}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Back to top"
      className={cn(
        "fixed bottom-24 right-4 z-[2147482900] flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-500",
        "border-violet/40 bg-background/90 text-violet shadow-[0_0_24px_-8px_rgba(124,92,255,0.6)] backdrop-blur-md",
        "hover:border-violet hover:bg-violet/15 hover:shadow-[0_0_40px_-8px_rgba(124,92,255,0.9)]",
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      )}
    >
      {/* Pulse ring */}
      <span
        className={cn(
          "absolute inset-0 rounded-full border border-violet/40 transition-all duration-700",
          hovered ? "scale-125 opacity-0" : "scale-100 opacity-50"
        )}
      />
      <ArrowUp
        size={18}
        className={cn(
          "transition-transform duration-300",
          hovered ? "-translate-y-0.5" : "translate-y-0"
        )}
      />
    </button>
  );
}
