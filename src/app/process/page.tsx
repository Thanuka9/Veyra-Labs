import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { Process } from "@/components/Process";
import { WhyVeyra } from "@/components/WhyVeyra";

export const metadata: Metadata = {
  title: "Process",
  description:
    "Veyra Labs delivery process — discovery, design, build sprints, launch and handoff with transparent milestones and weekly demos.",
  alternates: { canonical: "/process" },
};

export default function ProcessPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="relative z-[1] flex-1">
        <PageHero
          title="Our process"
          subtitle="A transparent five-step model from discovery to production — fixed milestones, weekly demos and documented handoff."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Process" }]}
          tone="b"
        />
        <Process />
        <WhyVeyra />
      </main>
      <Footer />
    </>
  );
}
