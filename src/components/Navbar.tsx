"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { cn } from "@/lib/cn";
import { NAV_SECTION_LINKS, sectionHref } from "@/lib/nav-links";

const SCROLL_SPY_OFFSET = 100;

export function Navbar() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!onHome) {
      setActiveSection("");
      return;
    }

    const updateActive = () => {
      let current = "";
      for (const { href } of NAV_SECTION_LINKS) {
        const id = href.slice(1);
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= SCROLL_SPY_OFFSET) {
          current = href;
        }
      }
      setActiveSection(current);
    };

    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);
    return () => {
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, [onHome]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const navLinks = NAV_SECTION_LINKS.filter((l) => l.href !== "#contact");

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-border/80 bg-background/92 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.65),0_0_0_1px_rgba(124,92,255,0.06)] backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="container-page">
        <div className="grid h-[4.5rem] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 lg:h-[5rem] lg:gap-4">
          <a
            href={onHome ? "#top" : "/"}
            className={cn(
              "group flex shrink-0 items-center rounded-xl px-1 py-1 transition-all",
              scrolled && "bg-surface/40 ring-1 ring-border/60"
            )}
            aria-label="Veyra Labs home"
          >
            <BrandLogo
              variant="lockup"
              className="h-8 transition-transform duration-300 group-hover:scale-[1.02] sm:h-9 lg:h-10"
              priority
            />
          </a>

          <nav className="hidden min-w-0 justify-center lg:flex" aria-label="Primary">
            <ul className="flex max-w-full items-center gap-0.5 overflow-x-auto rounded-2xl border border-border/70 bg-surface/60 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-md hide-scrollbar">
              {navLinks.map((l) => {
                const isActive = activeSection === l.href;
                return (
                  <li key={l.href} className="shrink-0">
                    <a
                      href={sectionHref(l.href, onHome)}
                      className={cn(
                        "relative block whitespace-nowrap rounded-xl px-2 py-1.5 text-[11px] font-medium transition-colors xl:px-2.5 xl:py-2 xl:text-[12px]",
                        isActive ? "text-foreground" : "text-muted hover:text-foreground"
                      )}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="nav-active-pill"
                          className="absolute inset-0 rounded-xl bg-violet/15 ring-1 ring-violet/25"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      <span className="relative">{l.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center justify-end gap-2 xl:gap-3">
            <a
              href={sectionHref("#contact", onHome)}
              className="group hidden items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/8 px-3 py-1.5 text-[11px] font-semibold text-emerald-400 transition-all hover:border-emerald-500/50 hover:bg-emerald-500/15 2xl:flex"
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Available for new projects
            </a>
            <a
              href={sectionHref("#contact", onHome)}
              className="group relative hidden items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-violet to-cyan px-3.5 py-2 text-sm font-semibold text-white shadow-[0_0_28px_-8px_rgba(124,92,255,0.65)] transition-all hover:scale-[1.02] hover:shadow-[0_0_40px_-6px_rgba(124,92,255,0.9)] sm:inline-flex xl:px-5 xl:py-2.5"
            >
              <span className="absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/10 transition-transform duration-700 group-hover:translate-x-[120%]" />
              Book a call
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </a>

            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl border border-border bg-surface/80 p-2.5 text-foreground transition-colors hover:border-violet/40 lg:hidden"
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
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-border bg-background/95 backdrop-blur-xl lg:hidden"
          >
            <div className="container-page py-4">
              <nav className="flex flex-col gap-1">
                {NAV_SECTION_LINKS.map((l, i) => (
                  <motion.a
                    key={l.href}
                    href={sectionHref(l.href, onHome)}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 + 0.08, duration: 0.3 }}
                    className={cn(
                      "rounded-xl px-4 py-3 text-base font-medium transition-colors",
                      activeSection === l.href
                        ? "bg-violet/15 text-foreground"
                        : "text-muted hover:bg-surface hover:text-foreground"
                    )}
                  >
                    {l.label}
                  </motion.a>
                ))}
              </nav>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: NAV_SECTION_LINKS.length * 0.04 + 0.12, duration: 0.3 }}
                className="mt-4 space-y-3 border-t border-border pt-4"
              >
                <a
                  href={sectionHref("#contact", onHome)}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/8 px-4 py-3 text-sm font-semibold text-emerald-400"
                >
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  Available for new projects
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
