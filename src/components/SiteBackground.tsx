"use client";

import { useCallback, useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  hue: "violet" | "cyan";
};

const VIOLET = "124, 92, 255";
const CYAN = "34, 211, 238";

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef(0);
  const sizeRef = useRef({ w: 0, h: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isCoarse = window.matchMedia("(pointer: coarse)").matches;

    // Reduced particle counts for better performance
    const particleCount = () => {
      const area = sizeRef.current.w * sizeRef.current.h;
      const base = area > 1_200_000 ? 32 : area > 700_000 ? 22 : 16;
      return isCoarse ? Math.floor(base * 0.4) : base;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      sizeRef.current.w = window.innerWidth;
      sizeRef.current.h = window.innerHeight;
      canvas.width = sizeRef.current.w * dpr;
      canvas.height = sizeRef.current.h * dpr;
      canvas.style.width = `${sizeRef.current.w}px`;
      canvas.style.height = `${sizeRef.current.h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particlesRef.current = Array.from({ length: particleCount() }, () => ({
        x: Math.random() * sizeRef.current.w,
        y: Math.random() * sizeRef.current.h,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.2 + 0.5,
        hue: Math.random() > 0.35 ? "violet" : "cyan",
      }));
    };

    const onMove = (e: PointerEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
    };
    const onLeave = () => {
      mouseRef.current.active = false;
    };

    let frameCount = 0;

    const draw = () => {
      frameCount++;
      const { w, h } = sizeRef.current;
      ctx.clearRect(0, 0, w, h);
      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      const linkDist = 110;
      const mouseRadius = 150;

      // Move particles
      for (const p of particles) {
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouseRadius && dist > 0) {
            const force = (1 - dist / mouseRadius) * 0.014;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.993;
        p.vy *= 0.993;

        if (p.x < 0 || p.x > w) { p.vx *= -1; p.x = Math.max(0, Math.min(w, p.x)); }
        if (p.y < 0 || p.y > h) { p.vy *= -1; p.y = Math.max(0, Math.min(h, p.y)); }
      }

      // Draw connections — only every other frame to halve draw calls
      if (frameCount % 2 === 0) {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const a = particles[i];
            const b = particles[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dist = Math.hypot(dx, dy);
            if (dist > linkDist) continue;
            const alpha = (1 - dist / linkDist) * 0.18;
            ctx.strokeStyle = `rgba(${VIOLET}, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }

        // Mouse connections
        if (mouse.active) {
          for (const p of particles) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.hypot(dx, dy);
            if (dist > linkDist * 1.3) continue;
            const alpha = (1 - dist / (linkDist * 1.3)) * 0.28;
            ctx.strokeStyle = `rgba(${CYAN}, ${alpha})`;
            ctx.lineWidth = 0.45;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }

      // Draw dots
      for (const p of particles) {
        const rgb = p.hue === "violet" ? VIOLET : CYAN;
        ctx.fillStyle = `rgba(${rgb}, ${p.hue === "violet" ? 0.5 : 0.4})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);

    const onVis = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafRef.current);
      } else {
        rafRef.current = requestAnimationFrame(draw);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full opacity-[0.75]"
      aria-hidden
    />
  );
}

function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const rafRef = useRef(0);
  const activeRef = useRef(false);

  const tick = useCallback(() => {
    const el = glowRef.current;
    if (!el) return;

    current.current.x += (target.current.x - current.current.x) * 0.07;
    current.current.y += (target.current.y - current.current.y) * 0.07;

    el.style.transform = `translate3d(${current.current.x - 280}px, ${current.current.y - 280}px, 0)`;
    el.style.opacity = activeRef.current ? "1" : "0";

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (coarse) return;

    let initialized = false;

    const onMove = (e: PointerEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
      if (!initialized) {
        current.current = { x: e.clientX, y: e.clientY };
        initialized = true;
      }
      activeRef.current = true;
    };
    const onLeave = () => {
      activeRef.current = false;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [tick]);

  return (
    <div
      ref={glowRef}
      className="site-cursor-glow pointer-events-none absolute left-0 top-0 h-[560px] w-[560px] opacity-0 transition-opacity duration-500"
      aria-hidden
    />
  );
}

/**
 * Fixed site-wide ambient background — aurora mesh, particle network, cursor glow.
 */
export function SiteBackground() {
  return (
    <div className="site-bg" aria-hidden>
      <div className="site-bg-base absolute inset-0" />

      {/* Rotating conic mesh */}
      <div className="site-mesh animate-mesh-rotate absolute left-1/2 top-1/2 h-[140vmax] w-[140vmax] -translate-x-1/2 -translate-y-1/2" />

      {/* Aurora orbs */}
      <div className="site-orb site-orb-violet animate-aurora-1 absolute -left-[15%] top-[8%] h-[55vh] w-[55vh] rounded-full opacity-70" />
      <div className="site-orb site-orb-cyan animate-aurora-2 absolute -right-[10%] top-[22%] h-[45vh] w-[45vh] rounded-full opacity-60" />
      <div className="site-orb site-orb-indigo animate-aurora-3 absolute bottom-[5%] left-[20%] h-[40vh] w-[40vh] rounded-full opacity-50" />
      <div className="site-orb site-orb-violet animate-aurora-4 absolute bottom-[18%] right-[15%] h-[35vh] w-[35vh] rounded-full opacity-40" />

      {/* Neural particle field + cursor connections */}
      <ParticleField />

      {/* Perspective grid */}
      <div className="site-grid absolute inset-0 opacity-[0.38]" />

      {/* Diagonal light sweep */}
      <div className="site-beam animate-beam-sweep absolute inset-0" />

      {/* Cursor-reactive spotlight */}
      <CursorGlow />

      {/* Hero spotlight */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-15%,rgba(124,92,255,0.16),transparent_55%)]" />

      <div className="site-noise absolute inset-0 opacity-[0.04]" />
      <div className="site-vignette absolute inset-0" />
    </div>
  );
}
