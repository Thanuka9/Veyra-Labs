import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/LegalPageLayout";
import { termsSections } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms governing use of the Veyra Labs website, chat assistant, and estimate tools.",
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <LegalPageLayout
      title="Terms of Service"
      description="These terms apply to your use of our website and online tools. Paid development work is governed by separate client agreements."
      sections={termsSections}
    />
  );
}
