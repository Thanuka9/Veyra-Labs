import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle,
  Shield,
  Calendar,
  ShieldCheck,
  UserCheck,
  Layers,
  Award,
  Database,
  Cpu,
  Globe,
  Lock,
  Zap,
  Server,
  FileCheck
} from "lucide-react";
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
  gallery?: { src: string; caption: string }[];
  architecture?: {
    layerName: string;
    icon: any;
    components: string[];
  }[];
  deliverables?: string[];
  liveUrl?: string;
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
      "Local LLM integration (Ollama/Gemma-2b-it) running asynchronously to generate contextual assessments from training PDFs.",
      "Proctoring logs powered by a MongoDB cluster storing mouse movements and window blur events.",
      "Robust RBAC (Role-Based Access Control) with session audit logs for HIPAA compliance.",
      "Cron-based automated backup scripts compiling tenant DBs into AES-256 encrypted blobs."
    ],
    metrics: [
      { value: "40%", label: "Reduction in manual audit overhead" },
      { value: "4", label: "Active AI modules shipped" },
      { value: "10K+", label: "Concurrent active users handled" },
      { value: "99.98%", label: "Uptime across multi-tenant clusters" }
    ],
    image: "/projects/trainiq-hero.png",
    tags: ["Flask", "PostgreSQL", "MongoDB", "Local LLM", "RBAC", "Docker"],
    gallery: [
      { src: "/projects/trainiq-hero.png", caption: "TrainIQ Enterprise Dashboard - Admin Analytics Panel" },
      { src: "/projects/trainiq-login.png", caption: "TrainIQ Secure Multi-Tenant Login Portal with 2FA" },
      { src: "/projects/trainiq-learniq-dashboard.png", caption: "TrainIQ LearnIQ - Contextual Assessment Generator & PDF Parser" },
      { src: "/projects/trainiq-proctoriq-logs.png", caption: "TrainIQ ProctorIQ - Visual Telemetry Logs & Focus Change Timelines" }
    ],
    architecture: [
      { layerName: "Client Layer", icon: Globe, components: ["React SPA Client", "ProctorIQ JS Listener", "2FA Tokens"] },
      { layerName: "API Gateway", icon: Lock, components: ["Nginx Reverse Proxy", "SSL Termination", "IP Whitelisting"] },
      { layerName: "Application Logic", icon: Cpu, components: ["Python / Flask Server", "LearnIQ Local LLM Engine", "RBAC Authorization Router"] },
      { layerName: "Storage & Logs", icon: Database, components: ["PostgreSQL (Isolated tenant DBs)", "MongoDB (Secure audit logs)", "Redis Cache"] }
    ],
    deliverables: [
      "Isolated multi-tenant database migration scripts",
      "Proctoring telemetry listeners & window focus detectors",
      "LearnIQ offline assessment generation prompt schemas",
      "Active Docker orchestration files for Kubernetes deployment"
    ]
  },
  codex: {
    slug: "codex",
    title: "CodeX",
    tagline: "Architecture intelligence for any codebase",
    category: "AI & LLM",
    timeline: "5 Weeks (Internal SaaS)",
    role: "Core Systems Engineer & AI Architect",
    proofLevel: "Live Demo / Internal SaaS",
    liveUrl: "https://codex-705252260340.us-west1.run.app/",
    problem: "Developers onboarding to large, legacy codebases waste weeks trying to map class dependencies, database triggers, and architectural boundaries manually, stalling deployment velocities.",
    solution: "Created CodeX, which scans and maps GitHub repositories into interactive 3D dependency trees, database relationship diagrams, and readable markdown documentation powered by Gemini API.",
    technicalArchitecture: [
      "Tree-sitter AST parsers extracting symbol-level dependencies across 12+ programming languages.",
      "Graph indexing engine mapping repository nodes and file links recursively.",
      "Next.js frontend rendering interactive D3/three.js node-link graphs.",
      "Context-optimized LLM prompts generating READMEs and architectural overviews from code contexts."
    ],
    metrics: [
      { value: "80%", label: "Reduction in developer onboarding time" },
      { value: "15s", label: "Scanner run time per 10k lines of code" },
      { value: "12+", label: "Programming languages supported" }
    ],
    image: "/projects/codex-home.png",
    tags: ["Next.js", "AST Parsers", "D3.js", "LLM", "GCP Cloud Run"],
    gallery: [
      { src: "/projects/codex-home.png", caption: "CodeX - Repository Scanner Dashboard & File Explorer" },
      { src: "/projects/codex-diagram.png", caption: "CodeX - Interactive Repository Symbol Dependency Graph" }
    ],
    architecture: [
      { layerName: "AST Client", icon: Globe, components: ["Next.js UI SPA", "Interactive D3.js Graph Renderer"] },
      { layerName: "Parser Service", icon: Cpu, components: ["Python Scanner Engine", "Tree-Sitter Language Bindings"] },
      { layerName: "LLM Summarizer", icon: Zap, components: ["Gemini 1.5 Flash Prompt Pipeline", "Symbol Context Compactor"] },
      { layerName: "File Storage", icon: Database, components: ["Neo4j Graph Database", "Redis cache logs"] }
    ],
    deliverables: [
      "Multi-language Tree-sitter scanner configurations",
      "Dynamic D3.js force-directed layout script",
      "Context-minimizing prompt compactor logic",
      "GCP Cloud Run deployment configuration manifests"
    ]
  },
  "kapruka-flow": {
    slug: "kapruka-flow",
    title: "Kapruka Flow",
    tagline: "AI-first intent-driven shopping client",
    category: "E-Commerce",
    timeline: "2 Weeks (Challenge Build)",
    role: "AI Agent Engineer & Integrations Developer",
    proofLevel: "Challenge Winner / Working Demo",
    liveUrl: "https://kapruka-flow-ai.vercel.app/",
    problem: "Traditional e-commerce searches require users to navigate hundreds of filters and categories to assemble complex packages (e.g. gift baskets or event hampers), resulting in high cart abandonment rates.",
    solution: "Built an intent-driven agentic search interface integrated with Kapruka MCP. The agent translates high-level prompts (e.g. 'I need a birthday gift for my mom who loves chocolate and lilies') into structured database calls, automatically composes optimized carts, and completes checkout workflows.",
    technicalArchitecture: [
      "Vite/Next.js frontend using smooth visual state updates for agent actions.",
      "FastAPI backend acting as the agent host orchestration layer.",
      "Kapruka MCP integration translating natural language intent into real-time product queries.",
      "Agentic cart compiler optimizing product prices, stock constraints, and shipping methods."
    ],
    metrics: [
      { value: "85%", label: "Reduction in time-to-cart assembly" },
      { value: "92%", label: "Search-to-product mapping accuracy" },
      { value: "150s", label: "Average time saved per order" }
    ],
    image: "/projects/kapruka-home.png",
    tags: ["Next.js", "FastAPI", "AI Agents", "MCP", "Tailwind CSS"],
    gallery: [
      { src: "/projects/kapruka-home.png", caption: "Kapruka Flow - Intent-Driven Search Landing Page" },
      { src: "/projects/kapruka-cart.png", caption: "Kapruka Flow - AI-Composed Shopping Cart & Live MCP Checkout" }
    ],
    architecture: [
      { layerName: "Intent Client", icon: Globe, components: ["Next.js Client", "Streaming Prompt Interface"] },
      { layerName: "Agent Router", icon: Cpu, components: ["FastAPI Agent Orchestrator", "LangChain Intent Router"] },
      { layerName: "MCP Integrations", icon: Zap, components: ["Kapruka MCP Server", "Real-Time Stock Query Engine"] },
      { layerName: "Checkout API", icon: Database, components: ["Kapruka Payment Gateway", "Cart Sync Webhooks"] }
    ],
    deliverables: [
      "Real-time intent-parsing prompt schemas",
      "Kapruka MCP connector module for product sync",
      "Optimized agentic cart compiler pipeline",
      "Vercel Edge-optimized deployment scripts"
    ]
  },
  "techforge-ai": {
    slug: "techforge-ai",
    title: "CareerForge AI",
    tagline: "Multi-agent career intelligence and recruitment suite",
    category: "AI & LLM",
    timeline: "4 Weeks (Internal Product)",
    role: "Lead AI Engineer & Full-Stack Architect",
    proofLevel: "Live Demo / Production Architecture",
    liveUrl: "https://careerforge-ai-3-0-1030331335046.us-west1.run.app/",
    problem: "Job applicants lack realistic feedback on resume parsing (ATS) compliance and mock interviews, while recruitment teams are overwhelmed by low-quality, untargeted applications.",
    solution: "Developed a multi-agent workflow that runs deep audits on candidate resumes, tests candidates with real-time audio/visual AI mock interviews, and matches them to relevant live market roles with salary intelligence.",
    technicalArchitecture: [
      "Next.js web client with real-time canvas visualizations and markdown renderers.",
      "Google Gemini API (1.5 Pro) powering candidate evaluation and grading agents.",
      "LangGraph workflow controlling agent turn-taking and interview phase transitions.",
      "Real-time speech-to-text and text-to-speech feedback loop for mock interviews."
    ],
    metrics: [
      { value: "94%", label: "ATS parser score alignment" },
      { value: "3x", label: "Candidate interview readiness improvement" },
      { value: "15+", label: "Integrated career assessment metrics" }
    ],
    image: "/projects/careerforge-home.png",
    tags: ["Multi-agent", "LLM", "Next.js", "LangGraph", "Gemini API"],
    gallery: [
      { src: "/projects/careerforge-home.png", caption: "CareerForge AI - Main Landing Page & Dashboard" },
      { src: "/projects/careerforge-interview.png", caption: "CareerForge AI - Real-Time AI Mock Interview & Evaluation Interface" }
    ],
    architecture: [
      { layerName: "Candidate Portal", icon: Globe, components: ["Next.js Frontend", "Markdown Report Renderer"] },
      { layerName: "Orchestration", icon: Cpu, components: ["LangGraph Agent Engine", "Gemini 1.5 Pro Evaluator"] },
      { layerName: "Telemetry & Audio", icon: Zap, components: ["WebRTC / Audio Streaming Server", "Real-Time Speech-to-Text Pipeline"] },
      { layerName: "Data Store", icon: Database, components: ["PostgreSQL for profiles", "Vector indexes for roles"] }
    ],
    deliverables: [
      "Multi-agent resume analysis prompt pipelines",
      "LangGraph conversational state controllers",
      "Mock interview evaluation report generators",
      "Dockerized deployment configurations for GCP Cloud Run"
    ]
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
    tags: ["FastAPI", "React", "Scikit-Learn", "Python", "GCP"],
    gallery: [
      { src: "/projects/revops-landing.png", caption: "RevOps AI - Predictive Revenue Cycle Management Dashboard" }
    ],
    architecture: [
      { layerName: "Client Layer", icon: Globe, components: ["React 19 Dashboard", "Recharts Visualizations"] },
      { layerName: "Secure Router", icon: Lock, components: ["OAuth2 Gateway", "HIPAA Local Auditor"] },
      { layerName: "Inference Engine", icon: Cpu, components: ["FastAPI Async Server", "Scikit-Learn Model (Joblib)"] },
      { layerName: "Data Warehouse", icon: Database, components: ["PostgreSQL", "ML Dataset Cache"] }
    ],
    deliverables: [
      "Sanitized billing analytics dataset structure",
      "Payer payment forecasting Scikit-Learn training notebooks",
      "Asynchronous claim audit endpoints",
      "Local HIPAA access logging modules"
    ]
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
    tags: ["Python", "PostgreSQL", "NLP", "Pandas", "NumPy"],
    gallery: [
      { src: "/projects/reviewradar-sentiment.png", caption: "ReviewRadar AI - Ingestion & NLP Sentiment Scoring Engine" },
      { src: "/projects/reviewradar-categories.png", caption: "ReviewRadar AI - Automated Product Category Topic Clustering" },
      { src: "/projects/reviewradar-stars.png", caption: "ReviewRadar AI - Star Rating Ingestion Analytics Panel" }
    ],
    architecture: [
      { layerName: "Ingestion Source", icon: Globe, components: ["Review Web Scrapers", "Marketplace API Webhooks"] },
      { layerName: "Queue & Load", icon: Zap, components: ["Async Ingestion Worker", "CSV Data Parsers"] },
      { layerName: "NLP Analytics", icon: Cpu, components: ["Pandas / NumPy Engine", "TF-IDF Sentiment Classifier"] },
      { layerName: "Data Warehousing", icon: Database, components: ["PostgreSQL Database", "Clustered Geo-indexes"] }
    ],
    deliverables: [
      "Review tokenization and cleaning module",
      "K-Means topic and rating cluster visualizer templates",
      "PostgreSQL structured schema for multi-channel review logs",
      "Asynchronous daily data cron triggers"
    ]
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
    tags: ["RAG", "FAISS", "Playwright", "GPT-4o", "Python"],
    architecture: [
      { layerName: "User Assets", icon: Globe, components: ["Resume PDF Ingestion", "Personal Data Formats"] },
      { layerName: "Semantic Ranker", icon: Cpu, components: ["FAISS Vector Store", "GPT-4o Scoring Logic"] },
      { layerName: "Automation Engine", icon: Zap, components: ["Playwright Scraper Browser", "Forms Field Mapping Module"] }
    ],
    deliverables: [
      "FAISS local indexing & semantic lookup templates",
      "Autonomous application automation scripts",
      "Resume content mapping and formatting module",
      "Evaluation and testing framework logs"
    ]
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
    tags: ["Streamlit", "Pandas", "GraphQL", "Python", "Monday API"],
    architecture: [
      { layerName: "Client UI", icon: Globe, components: ["Streamlit Web Interface", "Excel Downloader Component"] },
      { layerName: "API Integration", icon: Zap, components: ["Monday.com GraphQL Client", "Deep Pagination Handler"] },
      { layerName: "Data Processor", icon: Cpu, components: ["Pandas Audit Engine", "Validation Formula Cache"] },
    ],
    deliverables: [
      "Monday GraphQL query pagination modules",
      "Dynamic data audit rules config engine",
      "CSV & Excel parsing and cleanup scripts",
      "Streamlit local hosting setup dockerfiles"
    ]
  },
  "nimasha-portfolio": {
    slug: "nimasha-portfolio",
    title: "Academic Research Portfolio",
    tagline: "Publication-grade computational chemistry site",
    category: "Website",
    timeline: "4 Weeks (Production Build)",
    role: "Full-Stack Web Engineer",
    proofLevel: "Live Client Portfolio Deployment",
    problem: "Academic research portfolios often struggle to present dense, multi-dimensional computational chemistry datasets, publication logs, and active lecture schedules in a clean, user-friendly mobile experience.",
    solution: "Designed and implemented a premium portfolio utilizing custom molecular canvas animations, responsive academic publication timelines, and print-optimized CV templates.",
    technicalArchitecture: [
      "Custom canvas renderer generating molecular structures on screen load.",
      "Statically optimized database matching publication structures.",
      "Fluid, responsive grids for publication abstracts.",
      "Next.js App Router for dynamic SSR and SEO performance."
    ],
    metrics: [
      { value: "100%", label: "Google Lighthouse SEO Score" },
      { value: "2.4s", label: "Page speed index (Largest Contentful Paint)" },
      { value: "4", label: "Main publication sections mapped" }
    ],
    image: "/projects/nimasha-portfolio-hero.png",
    tags: ["Next.js 16", "Canvas", "Framer Motion", "Tailwind CSS"],
    gallery: [
      { src: "/projects/nimasha-portfolio-hero.png", caption: "Academic Portfolio - Computational Chemistry Publications Page" }
    ],
    architecture: [
      { layerName: "User Client", icon: Globe, components: ["Next.js SPA frontend", "Custom Molecular HTML5 Canvas"] },
      { layerName: "Static Server", icon: Server, components: ["Vercel Edge Network", "Next.js Static ISR Cache"] },
      { layerName: "Data Layer", icon: Database, components: ["Static Publications JSON", "Markdown Abstracts Store"] }
    ],
    deliverables: [
      "HTML5 Canvas Molecular system animation script",
      "Publication filter and search component modules",
      "NextJS server-side static generation templates",
      "SEO schema tags for academic profiles"
    ]
  },
  "azeem-portfolio": {
    slug: "azeem-portfolio",
    title: "Creative Portfolio",
    tagline: "High-conversion branding platform for video editors",
    category: "Website",
    timeline: "3 Weeks (Production Build)",
    role: "Lead Full-Stack Web Developer",
    proofLevel: "Live Client Deployment",
    liveUrl: "https://portfolio-maca-16057652-77e5e.web.app/",
    problem: "Creative professionals struggle to get high-ticket clients because generic, slow portfolio sites do not present high-resolution video reels, client case studies, or lead-capture forms effectively on mobile.",
    solution: "Developed a conversion-focused portfolio for creative editors featuring optimized cinematic video showreels, custom transitions, lead-capture calendars, and a review archive.",
    technicalArchitecture: [
      "Vite and React single page application with lazy-loaded modules.",
      "Highly optimized video loader prioritizing bandwidth-throttled visual clips.",
      "Responsive Tailwind CSS layouts supporting custom video dimensions.",
      "Firebase Hosting and Functions powering contact form integrations and telemetry."
    ],
    metrics: [
      { value: "3x", label: "Increase in high-ticket client lead generation" },
      { value: "99/100", label: "Google Lighthouse Performance Score" },
      { value: "1.2s", label: "Largest Contentful Paint index" }
    ],
    image: "/projects/azeem-portfolio-hero.png",
    tags: ["React", "Firebase", "Video Player Optimization", "Tailwind CSS"],
    gallery: [
      { src: "/projects/azeem-portfolio-hero.png", caption: "Creative Portfolio - Showreel & Editor Portfolio Hero Page" }
    ],
    architecture: [
      { layerName: "Client App", icon: Globe, components: ["React 19 SPA", "Lazy-Loaded Video Component", "Framer Motion Canvas"] },
      { layerName: "Serverless CDN", icon: Server, components: ["Firebase Hosting", "Cloudflare CDN Edge Cache"] },
      { layerName: "Database & Mail", icon: Database, components: ["Firebase Firestore", "Nodemailer Form Functions"] }
    ],
    deliverables: [
      "Custom responsive lazy-loading video wrapper component",
      "Contact form state control & spam protection script",
      "Firebase database structure templates",
      "GitHub Action deployment workflows for Firebase"
    ]
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
            <div className="lg:col-span-3">
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
            <div className="lg:col-span-2 flex items-center justify-center">
              <Reveal delay={2} className="w-full">
                {study.image ? (
                  <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl">
                    <Image
                      src={study.image}
                      alt={study.title}
                      fill
                      unoptimized
                      className="object-contain object-center p-2 bg-surface-2"
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

          {/* Screenshot & Visual Gallery */}
          {study.gallery && study.gallery.length > 0 && (
            <Reveal>
              <section className="mt-16">
                <h2 className="text-xl font-bold tracking-tight text-white border-b border-border pb-3 flex items-center gap-2">
                  <FileCheck className="text-cyan" size={20} />
                  Visual Showcase &amp; Interface Screenshots
                </h2>
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  {study.gallery.map((img, i) => (
                    <div key={i} className="group rounded-2xl border border-border bg-surface overflow-hidden shadow-lg transition-all duration-300 hover:border-violet/30 hover:shadow-2xl">
                      <div className="relative aspect-[16/10] overflow-hidden bg-background/50">
                        <Image
                          src={img.src}
                          alt={img.caption}
                          fill
                          unoptimized
                          className="object-contain object-center p-2 transition-transform duration-500 group-hover:scale-[1.01]"
                        />
                      </div>
                      <div className="p-4 border-t border-border bg-surface-2">
                        <p className="text-xs text-muted leading-relaxed">{img.caption}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </Reveal>
          )}

          {/* System Architecture Flow */}
          {study.architecture && study.architecture.length > 0 && (
            <Reveal>
              <section className="mt-16">
                <h2 className="text-xl font-bold tracking-tight text-white border-b border-border pb-3 flex items-center gap-2">
                  <Layers className="text-cyan" size={20} />
                  System Architecture &amp; Data Flow
                </h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {study.architecture.map((layer, idx) => {
                    const LayerIcon = layer.icon;
                    return (
                      <div key={idx} className="relative rounded-2xl border border-border bg-surface p-5 shadow-sm">
                        {idx < study.architecture!.length - 1 && (
                          <div className="absolute right-[-10px] top-1/2 z-10 hidden -translate-y-1/2 text-muted lg:block">
                            ➔
                          </div>
                        )}
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet/10 text-violet">
                            <LayerIcon size={18} />
                          </div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-white">{layer.layerName}</h4>
                        </div>
                        <ul className="mt-4 space-y-2">
                          {layer.components.map((comp, cidx) => (
                            <li key={cidx} className="rounded-lg bg-surface-2 px-2.5 py-1.5 text-[11px] font-medium text-muted">
                              {comp}
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </section>
            </Reveal>
          )}

          {/* Deep Content */}
          <div className="mt-16 grid gap-10 lg:grid-cols-3 lg:gap-12">
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

              {/* Key Deliverables */}
              {study.deliverables && study.deliverables.length > 0 && (
                <Reveal>
                  <section>
                    <h2 className="text-xl font-bold tracking-tight text-white border-b border-border pb-3">
                      Key Deliverables &amp; Handoff Assets
                    </h2>
                    <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                      {study.deliverables.map((item, i) => (
                        <li key={i} className="flex gap-3 rounded-xl border border-border bg-surface-2 p-3 text-xs text-muted">
                          <CheckCircle size={14} className="mt-0.5 shrink-0 text-cyan" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                </Reveal>
              )}

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
                  {study.liveUrl && (
                    <div className="mb-5">
                      <a
                        href={study.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan to-violet-600 py-3 text-xs font-extrabold uppercase tracking-wider text-white shadow-lg transition-transform hover:scale-[1.02] hover:shadow-cyan/10"
                      >
                        Visit Live Project
                        <ArrowUpRight size={14} />
                      </a>
                    </div>
                  )}
                  <ShieldCheck size={36} className="mx-auto text-violet" />
                  <h3 className="mt-3 text-sm font-bold text-foreground">Need a similar solution?</h3>
                  <p className="mt-1 text-xs text-muted leading-relaxed">
                    We specialize in high-trust custom software engineering with full system auditing.
                  </p>
                  <Link
                    href="/#contact"
                    className="mt-4 inline-block w-full rounded-xl border border-violet/30 bg-violet/10 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-transform hover:scale-[1.02]"
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
