import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { PageHero, type PageHeroProps } from "./PageHero";
import { PageCta } from "./PageCta";

export function InnerPageLayout({
  hero,
  children,
  showCta = true,
}: {
  hero: PageHeroProps;
  children: React.ReactNode;
  showCta?: boolean;
}) {
  return (
    <>
      <div className="print:hidden">
        <Navbar />
      </div>
      <main id="main-content" className="relative z-[1] flex-1">
        <div className="print:hidden">
          <PageHero {...hero} />
        </div>
        {children}
        {showCta && (
          <div className="print:hidden">
            <PageCta />
          </div>
        )}
      </main>
      <div className="print:hidden">
        <Footer showCta={showCta} />
      </div>
    </>
  );
}
