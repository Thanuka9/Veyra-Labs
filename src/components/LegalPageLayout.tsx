import Link from "next/link";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { PageHero } from "./PageHero";
import { PageCta } from "./PageCta";
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
      <main id="main-content" className="relative z-[1] flex-1">
        <PageHero
          eyebrow="Legal"
          accent="indigo"
          title={title}
          subtitle={description}
          breadcrumbs={[{ label: "Home", href: "/" }, { label: title }]}
        />

        <section className="section-inner section-tone-a">
          <div className="container-page max-w-3xl">
            <p className="mb-10 text-xs text-muted">Last updated: {LEGAL_LAST_UPDATED}</p>

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
        </section>

        <PageCta />
      </main>
      <Footer />
    </>
  );
}
