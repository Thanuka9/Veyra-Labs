import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle, Shield, Calendar, ShieldCheck, UserCheck, Layers, Award } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { projects } from "@/lib/projects";

// Case Study details
interface CaseStudyDetail {
  slug: string;
  title: string;
  tagline: string;
  category: string;
  timeline: string;
  role: string;
  proofLevel: string;
  problem: string;
  solution: string;
  technicalArchitecture: string[];
  metrics: { value: string; label: string }[];
  hipaaDisclaimer?: string;
  image?: string;
  tags: string[];
}

const caseStudyData: Record<string, CaseStudyDetail> = {
  trainiq: {
    slug: "trainiq",
    title: "TrainIQ",
    tagline: "Enterprise workforce training & AI performance platform",
    category: "SaaS Platform",
    timeline: "12 Weeks (Production Build)",
    role: "Lead Architect & Full-Stack Developer",
    proofLevel: "Live Enterprise Deployment (Collective RCM)",
    problem: "Legacy multi-tenant training platforms lacked proper tenant database isolation, exposing compliance risks for healthcare entities. Administrative audit times for RCM training validations took up to 14 days per cohort, creating business bottlenecks.",
    solution: "Engineered a high-compliance multi-tenant LMS with complete database and tenant isolation. Integrated 'LearnIQ' (a local LLM assistant for real-time validation of training material) and 'ProctorIQ' (session integrity & copy-paste prevention logs). Deployed in production to manage 10,000+ corporate users.",
    technicalArchitecture: [
      "Multi-tenant database schema utilizing isolated PostgreSQL databases per tenant.",
      "Local LLM integration (Ollama/Gemma) running asynchronously to generate contextual assessments from training PDFs.",
      "Proctoring logs powered by a MongoDB cluster storing mouse movements and window blur events.",
      "Robust RBAC (Role-Based Access Control) with session audit logs for HIPAA compliance."
    ],
    metrics: [
      { value: "40%", label: "Reduction in manual audit overhead" },
      { value: "4", label: "Active AI modules shipped" },
      { value: "10K+", label: "Concurrent active users handled" }
    ],
    image: "/projects/trainiq-hero.png",
    tags: ["Flask", "PostgreSQL", "MongoDB", "Local LLM", "RBAC", "Docker"]
  },
  "revops-ai": {
    slug: "revops-ai",
    title: "RevOps AI",
    tagline: "Predictive revenue cycle management",
    category: "SaaS Platform",
    timeline: "8 Weeks (Active Prototype)",
    role: "Full-Stack Machine Learning Engineer",
    proofLevel: "Sanitized B2B Prototype / Concept Validation",
    problem: "Healthcare billing departments suffer from high claim rejection rates due to unpredictable payer timelines, resulting in cash flow bottlenecks. Managing billing datasets manually causes audit issues and delays.",
    solution: "Created a predictive revenue cycle management (RCM) dashboard that forecasts claim payment timelines and pre-flags high-risk rejections using machine learning. Audited under a HIPAA-aware simulation model with sanitized data files.",
    technicalArchitecture: [
      "Machine learning models (Scikit-Learn Random Forests) trained on 5M+ anonymized billing datasets.",
      "FastAPI endpoint supplying inference in under 80ms to a responsive React dashboard.",
      "Structured schema mapping for insurance payers, diagnostic codes, and timeline parameters.",
      "HIPAA-aware audit logging system encrypting access history logs locally."
    ],
    metrics: [
      { value: "94%", label: "ML forecasting R² accuracy score" },
      { value: "0%", label: "Payer rejection rate on pre-audited claims" },
      { value: "5M+", label: "Anonymized data points analyzed" }
    ],
    hipaaDisclaimer: "SECURITY NOTICE: All source codes and mock databases are strictly populated with dummy variables. Live HIPAA data is protected under localized enterprise agreements and never uploaded to public Git repositories.",
    image: "/projects/revops-landing.png",
    tags: ["FastAPI", "React", "Scikit-Learn", "Python", "GCP"]
  },
  "reviewradar-ai": {
    slug: "reviewradar-ai",
    title: "ReviewRadar AI",
    tagline: "Review intelligence at scale",
    category: "Data Science",
    timeline: "6 Weeks (Internal Product)",
    role: "Core Data Scientist & Pipeline Engineer",
    proofLevel: "Internal Product / Pipeline Architecture",
    problem: "E-commerce brands struggle to digest millions of customer reviews across multiple channels, missing key sentiment shifts and geo-specific product quality alerts.",
    solution: "Developed an end-to-end natural language processing (NLP) pipeline that ingests, cleans, feature-engineers, and clusters review data at scale. Visualizes keyword clusters and localized concerns on an interactive dashboard.",
    technicalArchitecture: [
      "Scalable database ingestion pipeline storing structured reviews in PostgreSQL.",
      "NLP text processing using TF-IDF, NLTK, and custom tokenizers for sentiment scoring.",
      "Unsupervised machine learning (K-Means) clustering reviews by geographic origin and rating category.",
      "Asynchronous ingestion workers scheduled via cron scripts."
    ],
    metrics: [
      { value: "7M+", label: "Data points processed daily" },
      { value: "85%", label: "Classification efficiency improvement" },
      { value: "100%", label: "Automated report extraction" }
    ],
    image: "/projects/reviewradar-sentiment.png",
    tags: ["Python", "PostgreSQL", "NLP", "Pandas", "NumPy"]
  },
  "job-hunter-ai": {
    slug: "job-hunter-ai",
    title: "Job Hunter AI",
    tagline: "Autonomous career-application agent",
    category: "AI & LLM",
    timeline: "4 Weeks (Prototype)",
    role: "AI Agent Engineer",
    proofLevel: "Personal Agent Prototype / Code Demo",
    problem: "Job seekers spend hundreds of hours manually searching, ranking, and submitting resumes to irrelevant listings, resulting in low conversion rates.",
    solution: "Built a hybrid Retrieval-Augmented Generation (RAG) autonomous browser agent that ingests candidate resumes, ranks matching roles, and submits applications using Playwright.",
    technicalArchitecture: [
      "RAG architecture searching role databases using semantic vector matching.",
      "Vector index powered by FAISS for rapid candidate-to-listing ranking.",
      "Autonomous browser interaction utilizing Playwright scripts to fill out application forms.",
      "OpenAI API integration for intelligent cover letter generation and field mapping."
    ],
    metrics: [
      { value: "200+", label: "Automated applications submitted" },
      { value: "85%+", label: "Vector matching alignment threshold" },
      { value: "15x", label: "Application filing speed increase" }
    ],
    tags: ["RAG", "FAISS", "Playwright", "GPT-4o", "Python"]
  },
  "monday-auditor": {
    slug: "monday-auditor",
    title: "Monday Data Auditor",
    tagline: "Workspace data-hygiene at scale",
    category: "Data Science",
    timeline: "3 Weeks (Demo Product)",
    role: "Integrations Developer",
    proofLevel: "Internal Tool / Demonstration Build",
    problem: "Enterprise teams suffer from dirty CRM data on Monday.com boards (missing dates, unlinked leads), causing broken reporting flows and board clutter.",
    solution: "Built an interactive Streamlit dashboard that queries Monday.com boards via GraphQL with deep pagination to identify missing fields and export Excel audit lists.",
    technicalArchitecture: [
      "Monday.com GraphQL API integration supporting dynamic column parsing.",
      "Pagination wrappers retrieving thousands of items without API rate limit penalties.",
      "Streamlit UI allowing instant board selection and report downloading.",
      "Pandas engine performing audit comparison checks on the fly."
    ],
    metrics: [
      { value: "50+", label: "Boards audited in under 15 seconds" },
      { value: "12 Hours", label: "Saved weekly in manual administrative checks" },
      { value: "100%", label: "Data field coverage reports" }
    ],
    image: "/projects/monday-auditor.png",
    tags: ["Streamlit", "Pandas", "GraphQL", "Python", "Monday API"]
  }
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const study = caseStudyData[slug];
  if (!study) return { title: "Case Study Not Found" };
  return {
    title: `${study.title} Case Study`,
    description: study.tagline,
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = caseStudyData[slug];

  if (!study) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main id="main-content" className="relative z-[1] flex-1 pt-24 pb-16 md:pt-32 md:pb-24">
        {/* Glow halo */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[min(1000px,100%)] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(124,92,255,0.06),transparent)] blur-3xl" />

        <div className="container-page">
          {/* Back button */}
          <Reveal>
            <Link
              href="/#work"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted transition-colors hover:text-foreground"
            >
              <ArrowLeft size={16} />
              Back to portfolio
            </Link>
          </Reveal>

          {/* Header */}
          <div className="mt-8 grid gap-8 lg:grid-cols-5 lg:gap-12">
            <div className="lg:col-3">
              <Reveal>
                <span className="rounded-full border border-violet/30 bg-violet/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-violet">
                  {study.category}
                </span>
                <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
                  {study.title}
                </h1>
                <p className="mt-3 text-lg font-medium text-gradient-soft">
                  {study.tagline}
                </p>
              </Reveal>

              {/* Quick Details Card */}
              <Reveal delay={1}>
                <div className="mt-8 rounded-2xl border border-border bg-surface p-6 shadow-xl">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted">Project Meta</h3>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-center gap-3">
                      <UserCheck size={16} className="text-cyan" />
                      <div className="text-xs">
                        <span className="font-semibold text-foreground block">My Role</span>
                        <span className="text-muted">{study.role}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar size={16} className="text-cyan" />
                      <div className="text-xs">
                        <span className="font-semibold text-foreground block">Timeline</span>
                        <span className="text-muted">{study.timeline}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Award size={16} className="text-cyan" />
                      <div className="text-xs">
                        <span className="font-semibold text-foreground block">Proof Level</span>
                        <span className="text-muted">{study.proofLevel}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Showcase Image or Mockup */}
            <div className="lg:col-2 flex items-center justify-center">
              <Reveal delay={2} className="w-full">
                {study.image ? (
                  <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
                    <Image
                      src={study.image}
                      alt={study.title}
                      fill
                      unoptimized
                      className="object-cover object-top"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-[16/10] w-full items-center justify-center rounded-2xl border border-border bg-gradient-to-br from-violet-600/20 via-indigo-600/10 to-cyan-500/20 shadow-2xl">
                    <span className="text-2xl font-bold text-muted uppercase tracking-wider">{study.title}</span>
                  </div>
                )}
              </Reveal>
            </div>
          </div>

          {/* Summary Stats */}
          <Reveal>
            <div className="mt-12 grid gap-5 sm:grid-cols-3">
              {study.metrics.map((m, i) => (
                <div key={i} className="rounded-2xl border border-border bg-surface p-6 text-center shadow-md hover:border-violet/30 transition-colors">
                  <div className="text-3xl font-extrabold text-gradient-soft">{m.value}</div>
                  <div className="mt-2 text-xs font-semibold text-muted uppercase tracking-wider">{m.label}</div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Deep Content */}
          <div className="mt-12 grid gap-10 lg:grid-cols-3 lg:gap-12">
            <div className="lg:col-span-2 space-y-10">
              {/* Problem */}
              <Reveal>
                <section>
                  <h2 className="text-xl font-bold tracking-tight text-white border-b border-border pb-3">
                    The Challenge &amp; Problem
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-muted">
                    {study.problem}
                  </p>
                </section>
              </Reveal>

              {/* Solution */}
              <Reveal>
                <section>
                  <h2 className="text-xl font-bold tracking-tight text-white border-b border-border pb-3">
                    Our Solution &amp; Implementation
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-muted">
                    {study.solution}
                  </p>
                </section>
              </Reveal>

              {/* Architecture / Process Details */}
              <Reveal>
                <section>
                  <h2 className="text-xl font-bold tracking-tight text-white border-b border-border pb-3">
                    Technical Specifications
                  </h2>
                  <ul className="mt-4 space-y-3">
                    {study.technicalArchitecture.map((arch, i) => (
                      <li key={i} className="flex gap-3 text-sm text-muted">
                        <CheckCircle size={16} className="mt-0.5 shrink-0 text-emerald-400" />
                        <span>{arch}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </Reveal>

              {/* HIPAA Disclaimer if present */}
              {study.hipaaDisclaimer && (
                <Reveal>
                  <div className="flex gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-amber-500">
                    <Shield size={16} className="shrink-0 mt-0.5" />
                    <p>{study.hipaaDisclaimer}</p>
                  </div>
                </Reveal>
              )}
            </div>

            {/* Sidebar Technologies */}
            <div className="space-y-6">
              <Reveal>
                <div className="rounded-2xl border border-border bg-surface p-6 shadow-md">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted flex items-center gap-2">
                    <Layers size={14} />
                    Technologies Used
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {study.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-border bg-surface-2 px-3 py-1.5 text-xs text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* Call to action */}
              <Reveal>
                <div className="rounded-2xl border border-violet/30 bg-violet/5 p-6 shadow-md text-center">
                  <ShieldCheck size={36} className="mx-auto text-violet" />
                  <h3 className="mt-3 text-sm font-bold text-foreground">Need a similar solution?</h3>
                  <p className="mt-1 text-xs text-muted leading-relaxed">
                    We specialize in high-trust custom software engineering with full system auditing.
                  </p>
                  <Link
                    href="/#contact"
                    className="mt-4 inline-block w-full rounded-xl bg-gradient-to-r from-violet to-cyan py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-transform hover:scale-[1.02]"
                  >
                    Request a consult
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
