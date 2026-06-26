import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { TechMarquee } from "@/components/TechMarquee";
import { OutcomesBanner } from "@/components/OutcomesBanner";
import { FeaturedWork } from "@/components/FeaturedWork";
import { TechStack } from "@/components/TechStack";
import { Services } from "@/components/Services";
import { Pricing } from "@/components/Pricing";
import { Work } from "@/components/Work";
import { Process } from "@/components/Process";
import { WhyVeyra } from "@/components/WhyVeyra";
import { BrandStory } from "@/components/BrandStory";
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
        <OutcomesBanner />
        <FeaturedWork />
        <Work />
        <TechStack />
        <Services />
        <Pricing />
        <Process />
        <WhyVeyra />
        <BrandStory />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
