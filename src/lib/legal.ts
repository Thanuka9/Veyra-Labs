import { CONTACT_EMAIL, CONTACT_LOCATION } from "@/lib/content";
import { getSiteUrl } from "@/lib/site-url";

export const LEGAL_LAST_UPDATED = "13 June 2026";
export const COMPANY_NAME = "Veyra Labs";

export const legalMeta = {
  company: COMPANY_NAME,
  email: CONTACT_EMAIL,
  location: CONTACT_LOCATION,
  siteUrl: getSiteUrl(),
};

export type LegalSection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export const privacySections: LegalSection[] = [
  {
    id: "overview",
    title: "Overview",
    paragraphs: [
      `${COMPANY_NAME} (“we”, “us”, “our”) respects your privacy. This policy explains what personal data we collect when you visit our website, use our chat assistant, request a project estimate, or contact us  -  and how we use, store, and protect that information.`,
      "We process data in accordance with applicable privacy laws. By using our website you acknowledge this policy. If you do not agree, please do not use our services.",
    ],
  },
  {
    id: "data-we-collect",
    title: "Information we collect",
    paragraphs: ["We may collect the following categories of information:"],
    bullets: [
      "Contact details you provide  -  name, email address, company name, and project description  -  via our contact form, chatbot, or estimate wizard.",
      "Communications  -  messages you send us and our replies, including estimate references and inquiry content.",
      "Technical data  -  IP address (anonymised where possible), browser type, device information, pages visited, and referral source, collected through analytics when you consent to cookies.",
      "Usage data  -  interactions with our chat assistant and estimate tools to improve our services.",
    ],
  },
  {
    id: "how-we-use",
    title: "How we use your information",
    paragraphs: ["We use personal data to:"],
    bullets: [
      "Respond to inquiries, discovery calls, and project estimate requests.",
      "Send PDF estimates and follow-up communications you have requested.",
      "Operate, secure, and improve our website and chat experience.",
      "Analyse aggregated, anonymised traffic patterns when analytics cookies are enabled.",
      "Comply with legal obligations and protect our legitimate business interests.",
    ],
  },
  {
    id: "legal-bases",
    title: "Legal bases for processing",
    paragraphs: [
      "Where applicable under GDPR and similar laws, we rely on: (a) your consent  -  for marketing contact and non-essential cookies; (b) contract performance  -  to respond to your project inquiries; (c) legitimate interests  -  to operate and improve our website, prevent abuse, and understand aggregate usage; and (d) legal obligation  -  where required by law.",
    ],
  },
  {
    id: "sharing",
    title: "Sharing and processors",
    paragraphs: [
      "We do not sell your personal data. We may share information with trusted service providers who help us operate the website  -  for example email delivery, hosting, and analytics (Google Analytics, when enabled). These providers process data only on our instructions and under appropriate safeguards.",
      "We may disclose information if required by law, court order, or to protect the rights, property, or safety of Veyra Labs, our clients, or others.",
    ],
  },
  {
    id: "retention",
    title: "Data retention",
    paragraphs: [
      "Inquiry and estimate records are kept for as long as needed to fulfil your request, maintain business records, and resolve disputes  -  typically up to 24 months unless a longer period is required by law or an ongoing client relationship.",
      "Analytics data is retained according to our analytics provider’s default retention settings.",
    ],
  },
  {
    id: "rights",
    title: "Your rights",
    paragraphs: [
      "Depending on your location, you may have the right to access, correct, delete, restrict, or object to processing of your personal data, and to withdraw consent where processing is consent-based. You may also have the right to data portability and to lodge a complaint with a supervisory authority.",
      `To exercise these rights, contact us at ${CONTACT_EMAIL}. We will respond within a reasonable timeframe.`,
    ],
  },
  {
    id: "security",
    title: "Security",
    paragraphs: [
      "We implement appropriate technical and organisational measures to protect personal data against unauthorised access, alteration, disclosure, or destruction. No method of transmission over the internet is 100% secure; we cannot guarantee absolute security.",
    ],
  },
  {
    id: "international",
    title: "International transfers",
    paragraphs: [
      "We are based in Sri Lanka and serve clients worldwide. Your data may be processed in countries where our service providers operate. Where required, we ensure appropriate safeguards for cross-border transfers.",
    ],
  },
  {
    id: "children",
    title: "Children",
    paragraphs: [
      "Our services are directed at businesses and professionals. We do not knowingly collect personal data from anyone under 16. If you believe a child has provided us data, please contact us and we will delete it.",
    ],
  },
  {
    id: "changes",
    title: "Changes to this policy",
    paragraphs: [
      "We may update this policy from time to time. The “Last updated” date at the top of this page will reflect the latest version. Continued use of the website after changes constitutes acceptance of the updated policy.",
    ],
  },
  {
    id: "contact",
    title: "Contact & Legal Entity",
    paragraphs: [
      `For privacy questions or requests, email ${CONTACT_EMAIL}.`,
      `Legal Entity: Veyra Labs (Pvt) Ltd`,
      `Business Registration No: PV-00295846`,
      `Official Address: Colombo, Sri Lanka · Remote-first worldwide`,
    ],
  },
];

export const cookieSections: LegalSection[] = [
  {
    id: "what-are-cookies",
    title: "What are cookies?",
    paragraphs: [
      "Cookies are small text files stored on your device when you visit a website. They help the site remember preferences, keep sessions secure, and  -  with your consent  -  understand how visitors use the site.",
    ],
  },
  {
    id: "how-we-use",
    title: "How we use cookies",
    paragraphs: ["Veyra Labs uses cookies in the following categories:"],
    bullets: [
      "Strictly necessary  -  required for core site functionality, security, and remembering your cookie preference. These cannot be disabled on our site.",
      "Analytics  -  help us understand traffic and usage (e.g. Google Analytics with IP anonymisation). Loaded only if you accept analytics cookies.",
      "Functional  -  remember chat or UI preferences such as quick-actions visibility in our assistant (stored locally in your browser).",
    ],
  },
  {
    id: "third-party",
    title: "Third-party cookies",
    paragraphs: [
      "When you accept analytics cookies, Google Analytics may set cookies to measure visits and events. We configure analytics with IP anonymisation where supported. Review Google’s privacy policy for details on how they process data.",
      "Our contact and estimate flows may use third-party email delivery services; those are triggered by your form submission rather than passive tracking cookies.",
    ],
  },
  {
    id: "managing",
    title: "Managing your preferences",
    paragraphs: [
      "When you first visit, choose Accept all or Essential only in the cookie prompt beside our chat widget.",
      "You can change your choice anytime using Cookie settings in the website footer  -  this clears your saved preference and shows the prompt again.",
      "You can also clear cookies through your browser settings. Disabling essential cookies may affect site functionality.",
    ],
  },
  {
    id: "contact",
    title: "Contact & Entity Details",
    paragraphs: [
      `Questions about cookies? Email ${CONTACT_EMAIL}.`,
      `Entity: Veyra Labs (Pvt) Ltd (Registration No: PV-00295846)`,
    ],
  },
];

export const termsSections: LegalSection[] = [
  {
    id: "agreement",
    title: "Agreement to terms",
    paragraphs: [
      `These Website Terms of Service (“Terms”) govern your use of the ${COMPANY_NAME} website and online tools, including the chat assistant and project estimate wizard. By accessing or using the site, you agree to these Terms. If you do not agree, do not use the website.`,
      "Separate written agreements govern paid software development, consulting, or other professional services we provide to clients.",
    ],
  },
  {
    id: "services",
    title: "Website and tools",
    paragraphs: [
      "Our website provides general information about our services, case studies, pricing guidance, and self-service estimate tools. Content is for informational purposes and does not constitute a binding offer until confirmed in a signed statement of work or contract.",
    ],
  },
  {
    id: "estimates",
    title: "Estimates and pricing",
    paragraphs: [
      "Project estimates generated through our wizard or chatbot are indicative ranges based on the scope you select. Final pricing depends on discovery, technical requirements, integrations, compliance needs, and timeline. All estimates are subject to written confirmation before work begins.",
      "We reserve the right to update pricing, service descriptions, and availability at any time without notice on this website.",
    ],
  },
  {
    id: "paid-projects",
    title: "How Paid Projects Work",
    paragraphs: [
      "While this website provides indicative ballpark estimates, all paid engineering engagements are governed by a separate, signed Master Services Agreement (MSA) and Statement of Work (SOW). Standard engagement parameters include:",
    ],
    bullets: [
      "Milestone Billing  -  Standard engagements are structured as 40% upfront deposit, 40% upon major midpoint delivery/milestone validation, and 20% upon final production handoff and deployment.",
      "IP Ownership  -  100% intellectual property ownership of all custom-developed codebase and digital assets is transferred to the client upon receipt of final milestone payment.",
      "Cancellation & Offboarding  -  Either party may terminate an active engagement with 14 days written notice. Billing is prorated to deliverables completed up to the termination date.",
      "Standard Support & SLAs  -  Every project handoff includes 30 days of post-launch maintenance covering critical bug fixes and deployment support. Optional service level agreements (SLAs) are available for managed hosting, 24/7 uptime monitoring, and monthly feature revisions.",
    ],
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    paragraphs: ["You agree not to:"],
    bullets: [
      "Use the website for unlawful, harmful, or fraudulent purposes.",
      "Attempt to gain unauthorised access to our systems, scrape the site excessively, or disrupt service availability.",
      "Submit false, misleading, or spam inquiries through our forms or chatbot.",
      "Reverse engineer, copy, or misrepresent our brand, content, or proprietary materials without permission.",
    ],
  },
  {
    id: "ip",
    title: "Intellectual property",
    paragraphs: [
      "All content on this website  -  including text, graphics, logos, case study summaries, and software  -  is owned by Veyra Labs or its licensors and protected by applicable intellectual property laws. You may not reproduce or distribute content without prior written consent, except for personal, non-commercial reference.",
    ],
  },
  {
    id: "disclaimer",
    title: "Disclaimer",
    paragraphs: [
      'The website and tools are provided "as is" and "as available" without warranties of any kind, express or implied, including merchantability, fitness for a particular purpose, or non-infringement. We do not warrant uninterrupted or error-free operation.',
      "Outcome metrics and case study results describe past client work and are not guarantees of future performance.",
    ],
  },
  {
    id: "liability",
    title: "Limitation of liability",
    paragraphs: [
      "To the fullest extent permitted by law, Veyra Labs shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the website or reliance on estimate outputs, even if we have been advised of the possibility of such damages.",
      "Our total liability for claims relating to the website shall not exceed the amount you paid us for website-related services in the twelve months preceding the claim, or USD $100 if no such payment was made.",
    ],
  },
  {
    id: "links",
    title: "Third-party links",
    paragraphs: [
      "Our site may link to external websites. We are not responsible for the content, privacy practices, or availability of third-party sites.",
    ],
  },
  {
    id: "governing-law",
    title: "Governing law",
    paragraphs: [
      "These Terms are governed by the laws of Sri Lanka, without regard to conflict-of-law principles. Disputes shall be subject to the exclusive jurisdiction of the courts of Colombo, Sri Lanka, unless mandatory consumer protection laws in your country require otherwise.",
    ],
  },
  {
    id: "changes",
    title: "Changes",
    paragraphs: [
      "We may revise these Terms at any time. The updated version will be posted on this page with a revised “Last updated” date. Your continued use constitutes acceptance of the changes.",
    ],
  },
  {
    id: "contact",
    title: "Contact & Legal Details",
    paragraphs: [
      `Questions about these Terms? Email ${CONTACT_EMAIL}.`,
      `Governing Entity: Veyra Labs (Pvt) Ltd`,
      `Registration Number: PV-00295846`,
      `Address: Colombo, Sri Lanka`,
    ],
  },
];
