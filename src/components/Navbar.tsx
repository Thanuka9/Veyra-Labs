"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { cn } from "@/lib/cn";

/** Matches homepage scroll order (see app/page.tsx). */
const links = [
  { href: "#work", label: "Case Studies" },
  { href: "#services", label: "Services" },
  { href: "#pricing", label: "Pricing" },
  { href: "#process", label: "Process" },
  { href: "#about", label: "About" },
];

function sectionHref(hash: string, onHome: boolean) {
  return onHome ? hash : `/${hash}`;
}

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
    const sectionIds = links.map((l) => l.href.slice(1));
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActiveSection(`#${visible[0].target.id}`);
        }
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
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
          ? "border-b border-border/80 bg-background/90 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.65),0_0_0_1px_rgba(124,92,255,0.06)] backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="container-page">
        <div className="flex h-[4.5rem] items-center justify-between gap-4 lg:h-[5rem]">
          {/* Logo */}
          <a
            href={onHome ? "#top" : "/"}
            className={cn(
              "group flex shrink-0 items-center rounded-xl px-1 py-1 transition-all",
              scrolled && "rounded-xl bg-surface/40 ring-1 ring-border/60"
            )}
            aria-label="Veyra Labs home"
          >
            <BrandLogo
              variant="wordmark"
              className="h-9 transition-transform duration-300 group-hover:scale-[1.02] sm:h-10 lg:h-11"
              priority
            />
          </a>

          {/* Center nav — desktop */}
          <nav
            className="absolute left-1/2 hidden -translate-x-1/2 lg:block"
            aria-label="Primary"
          >
            <ul className="flex items-center gap-1 rounded-2xl border border-border/70 bg-surface/60 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-md">
              {links.map((l) => {
                const isActive = activeSection === l.href;
                return (
                  <li key={l.href}>
                    <a
                      href={sectionHref(l.href, onHome)}
                      className={cn(
                        "relative block rounded-xl px-3.5 py-2 text-[13px] font-medium transition-colors xl:px-4",
                        isActive
                          ? "text-foreground"
                          : "text-muted hover:text-foreground"
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

          {/* Right actions */}
          <div className="hidden items-center gap-2.5 lg:flex xl:gap-3">
            <a
              href={sectionHref("#contact", onHome)}
              className="group hidden items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/8 px-3 py-1.5 text-[11px] font-semibold text-emerald-400 transition-all hover:border-emerald-500/50 hover:bg-emerald-500/15 xl:flex"
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Available for new projects
            </a>
            <a
              href={sectionHref("#contact", onHome)}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-violet to-cyan px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_28px_-8px_rgba(124,92,255,0.65)] transition-all hover:scale-[1.02] hover:shadow-[0_0_40px_-6px_rgba(124,92,255,0.9)] xl:px-5"
            >
              <span className="absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/10 transition-transform duration-700 group-hover:translate-x-[120%]" />
              Book a call
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>

          {/* Mobile toggle */}
          <button
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

      {/* Mobile drawer */}
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
                    href={sectionHref(l.href, onHome)}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.1, duration: 0.3 }}
                    className={cn(
                      "rounded-xl px-4 py-3.5 text-base font-medium transition-colors",
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
                transition={{ delay: links.length * 0.05 + 0.15, duration: 0.3 }}
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
                <a
                  href={sectionHref("#contact", onHome)}
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
