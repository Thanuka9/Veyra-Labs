import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { TechMarquee } from "@/components/TechMarquee";
import { OutcomesBanner } from "@/components/OutcomesBanner";
import { FeaturedWork } from "@/components/FeaturedWork";
import { HomeServicesSummary } from "@/components/HomeServicesSummary";
import { HomeProcessSummary } from "@/components/HomeProcessSummary";
import { Testimonials } from "@/components/Testimonials";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="relative z-[1] flex-1">
        <Hero />
        <TechMarquee />
        <OutcomesBanner condensed />
        <FeaturedWork variant="summary" />
        <HomeServicesSummary theme="dark" />
        <HomeProcessSummary />
        <Testimonials theme="dark" />
        <Contact />
      </main>
      <Footer showCta={false} />
    </>
  );
}
