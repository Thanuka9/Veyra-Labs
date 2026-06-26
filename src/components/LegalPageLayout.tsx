import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { LEGAL_LAST_UPDATED, type LegalSection } from "@/lib/legal";

type LegalPageLayoutProps = {
  title: string;
  description: string;
  sections: LegalSection[];
};

export function LegalPageLayout({ title, description, sections }: LegalPageLayoutProps) {
  return (
    <>
      <Navbar />
      <main id="main-content" className="relative z-[1] flex-1 pt-24 pb-16">
        <div className="container-page max-w-3xl">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-cyan"
          >
            <ArrowLeft size={16} />
            Back to home
          </Link>

          <div className="mb-10">
            <BrandLogo variant="wordmark" className="h-9" />
            <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted">{description}</p>
            <p className="mt-4 text-xs text-muted">Last updated: {LEGAL_LAST_UPDATED}</p>
          </div>

          <article className="legal-prose space-y-10">
            {sections.map((section) => (
              <section key={section.id} id={section.id}>
                <h2>{section.title}</h2>
                {section.paragraphs.map((p) => (
                  <p key={p.slice(0, 40)}>{p}</p>
                ))}
                {section.bullets && (
                  <ul>
                    {section.bullets.map((b) => (
                      <li key={b.slice(0, 40)}>{b}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </article>

          <nav
            className="mt-12 flex flex-wrap gap-x-4 gap-y-2 border-t border-border pt-8 text-sm text-muted"
            aria-label="Related legal pages"
          >
            <Link href="/privacy" className="hover:text-cyan">
              Privacy Policy
            </Link>
            <span aria-hidden>·</span>
            <Link href="/cookies" className="hover:text-cyan">
              Cookie Policy
            </Link>
            <span aria-hidden>·</span>
            <Link href="/terms" className="hover:text-cyan">
              Terms of Service
            </Link>
            <span aria-hidden>·</span>
            <Link href="/#contact" className="hover:text-cyan">
              Contact
            </Link>
          </nav>
        </div>
      </main>
      <Footer />
    </>
  );
}
