import { ArrowRight, Mail, MapPin } from "lucide-react";
import Link from "next/link";
import { BrandLogo } from "./BrandLogo";
import { CookieSettingsButton } from "./CookieSettingsButton";
import { Reveal } from "./Reveal";
import { CONTACT_EMAIL, CONTACT_LINKEDIN, CONTACT_LOCATION, footerServiceLinks } from "@/lib/content";
import { FOOTER_COMPANY_LINKS, contactHref } from "@/lib/nav-links";

const company = FOOTER_COMPANY_LINKS;

const legal = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Cookie Policy", href: "/cookies" },
  { label: "Terms of Service", href: "/terms" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="border-b border-border bg-gradient-to-r from-violet/10 via-surface to-cyan/10">
        <Reveal className="container-page flex flex-col items-start justify-between gap-6 py-10 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-violet">Ready to start?</p>
            <p className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
              Let&apos;s build your next product together.
            </p>
          </div>
          <Link
            href={contactHref(false)}
            className="group inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-violet to-cyan px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_32px_-8px_rgba(124,92,255,0.55)] transition-transform hover:scale-[1.03]"
          >
            Book a free discovery call
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
      </div>

      <div className="container-page py-14 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <Reveal className="max-w-sm lg:col-span-4">
            <BrandLogo variant="wordmark" className="h-10" />
            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted">
              Veyra Labs is a boutique software & AI engineering studio. We design, build and deploy
              intelligent products — SaaS platforms, AI systems, e-commerce and premium brand websites.
            </p>
            <div className="mt-6 space-y-3">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="flex items-center gap-2.5 text-sm font-medium text-foreground transition-colors hover:text-cyan"
              >
                <Mail size={16} className="text-cyan" />
                {CONTACT_EMAIL}
              </a>
              <p className="flex items-center gap-2.5 text-sm text-muted">
                <MapPin size={16} className="text-violet" />
                {CONTACT_LOCATION}
              </p>
              <a
                href={CONTACT_LINKEDIN}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-muted transition-colors hover:text-cyan"
              >
                LinkedIn
              </a>
            </div>
          </Reveal>

          <Reveal delay={1} className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Services</h4>
              <ul className="mt-4 space-y-2.5">
                {footerServiceLinks.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-muted transition-colors hover:text-cyan">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Company</h4>
              <ul className="mt-4 grid grid-cols-1 gap-x-4 gap-y-2.5 sm:grid-cols-2">
                {company.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-muted transition-colors hover:text-cyan">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Legal</h4>
              <ul className="mt-4 space-y-2.5">
                {legal.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-muted transition-colors hover:text-cyan">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Starting rates</h4>
              <ul className="mt-4 space-y-3">
                {[
                  { tier: "E-Commerce", price: "$1,500 – $2,000" },
                  { tier: "Website", price: "$1,200 – $3,500" },
                  { tier: "AI & LLM", price: "$2,500 – $12,000" },
                  { tier: "SaaS Platform", price: "$8,000 – $25,000+" },
                  { tier: "ML & Analytics", price: "$4,000 – $15,000+" },
                  { tier: "Data Engineering", price: "$3,000 – $10,000+" },
                ].map((p) => (
                  <li key={p.tier}>
                    <p className="text-xs text-muted">{p.tier}</p>
                    <p className="text-sm font-semibold text-foreground">{p.price}</p>
                  </li>
                ))}
              </ul>
              <Link href="/pricing" className="mt-4 inline-block text-xs font-semibold text-cyan hover:underline">
                Full pricing details →
              </Link>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="border-t border-border bg-background/60">
        <div className="container-page flex flex-col items-center justify-between gap-4 py-5 sm:flex-row">
          <p className="text-xs text-muted">© {new Date().getFullYear()} Veyra Labs. All rights reserved.</p>
          <nav className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-muted" aria-label="Legal">
            <Link href="/privacy" className="transition-colors hover:text-cyan">
              Privacy
            </Link>
            <span aria-hidden>·</span>
            <Link href="/cookies" className="transition-colors hover:text-cyan">
              Cookies
            </Link>
            <span aria-hidden>·</span>
            <Link href="/terms" className="transition-colors hover:text-cyan">
              Terms
            </Link>
            <span aria-hidden>·</span>
            <CookieSettingsButton />
          </nav>
        </div>
      </div>
    </footer>
  );
}
