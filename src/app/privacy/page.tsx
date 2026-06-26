import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/LegalPageLayout";
import { privacySections } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Veyra Labs collects, uses, and protects your personal data.",
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      description="This policy describes how Veyra Labs handles personal information when you visit our website, use our chat assistant, or submit a project inquiry."
      sections={privacySections}
    />
  );
}
