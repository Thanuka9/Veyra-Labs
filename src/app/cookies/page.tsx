import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/LegalPageLayout";
import { cookieSections } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How Veyra Labs uses cookies and how you can manage your preferences.",
  robots: { index: true, follow: true },
};

export default function CookiesPage() {
  return (
    <LegalPageLayout
      title="Cookie Policy"
      description="Learn about the cookies and similar technologies we use on our Veyra Labs website and how to control them."
      sections={cookieSections}
    />
  );
}
