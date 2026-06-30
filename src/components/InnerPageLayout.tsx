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
      <Navbar />
      <main id="main-content" className="relative z-[1] flex-1">
        <PageHero {...hero} />
        {children}
        {showCta && <PageCta />}
      </main>
      <Footer showCta={showCta} />
    </>
  );
}
