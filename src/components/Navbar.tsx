"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { cn } from "@/lib/cn";

const links = [
  { href: "#services", label: "Services" },
  { href: "#pricing", label: "Pricing" },
  { href: "#work", label: "Case Studies" },
  { href: "#process", label: "Process" },
  { href: "#about", label: "About" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-border/80 bg-background/85 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.65),0_0_0_1px_rgba(124,92,255,0.04)] backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="container-page">
        <div className="grid h-[4.5rem] grid-cols-[1fr_auto] items-center lg:h-[5rem] lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
          {/* Logo */}
          <a
            href="#top"
            className="flex shrink-0 items-center justify-self-start transition-opacity hover:opacity-80"
            aria-label="Veyra Labs home"
          >
            <BrandLogo variant="wordmark" className="h-10 sm:h-11 lg:h-12" priority />
          </a>

          {/* Center nav — desktop */}
          <nav className="hidden lg:flex lg:justify-self-center" aria-label="Primary">
            <ul className="flex items-center gap-0.5">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onMouseEnter={() => setActiveLink(l.href)}
                    onMouseLeave={() => setActiveLink("")}
                    className="relative rounded-lg px-3.5 py-2 text-sm font-medium text-muted transition-colors hover:text-foreground xl:px-4 group"
                  >
                    {/* Hover bg pill */}
                    <span
                      className={cn(
                        "absolute inset-0 rounded-lg bg-surface transition-opacity duration-200",
                        activeLink === l.href ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      )}
                    />
                    <span className="relative">{l.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right actions */}
          <div className="hidden items-center gap-3 justify-self-end lg:flex xl:gap-4">
            {/* Live availability badge */}
            <a
              href="#contact"
              className="group hidden items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/8 px-3.5 py-1.5 text-[11px] font-semibold text-emerald-400 transition-all hover:border-emerald-500/50 hover:bg-emerald-500/15 xl:flex"
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Available for new projects
            </a>
            <a
              href="#contact"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-violet to-cyan px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_28px_-8px_rgba(124,92,255,0.65)] transition-all hover:scale-[1.03] hover:shadow-[0_0_40px_-6px_rgba(124,92,255,0.9)]"
            >
              <span className="absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/10 transition-transform duration-700 group-hover:translate-x-[120%]" />
              Book a call
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>


          {/* Mobile toggle */}
          <button
            className="inline-flex items-center justify-center justify-self-end rounded-lg border border-border bg-surface/80 p-2.5 text-foreground transition-colors hover:border-violet/40 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <AnimatePresence mode="wait" initial={false}>
              {open ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={20} />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={20} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile drawer — animated */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-border bg-background/95 backdrop-blur-xl lg:hidden"
          >
            <div className="container-page py-4">
              <nav className="flex flex-col gap-1">
                {links.map((l, i) => (
                  <motion.a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.1, duration: 0.3 }}
                    className="rounded-xl px-4 py-3.5 text-base font-medium text-muted transition-colors hover:bg-surface hover:text-foreground"
                  >
                    {l.label}
                  </motion.a>
                ))}
              </nav>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: links.length * 0.05 + 0.15, duration: 0.3 }}
                className="mt-4 border-t border-border pt-4"
              >
                <a
                  href="#contact"
                  onClick={() => setOpen(false)}
                  className="block rounded-xl bg-gradient-to-r from-violet to-cyan px-4 py-3.5 text-center text-sm font-semibold text-white shadow-[0_0_24px_-8px_rgba(124,92,255,0.6)]"
                >
                  Book a discovery call
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
