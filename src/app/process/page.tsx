import type { Metadata } from "next";
import { InnerPageLayout } from "@/components/InnerPageLayout";
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
    <InnerPageLayout
      hero={{
        eyebrow: "How we work",
        accent: "violet",
        title: "Our process",
        subtitle:
          "A transparent five-step model from discovery to production — fixed milestones, weekly demos and documented handoff.",
        breadcrumbs: [{ label: "Home", href: "/" }, { label: "Process" }],
        cta: { label: "Book a discovery call", href: "/contact" },
      }}
    >
      <Process showHeading={false} inner />
      <WhyVeyra inner />
    </InnerPageLayout>
  );
}
