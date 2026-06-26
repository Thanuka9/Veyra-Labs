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
  Target,
  Lightbulb,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { CaseStudyGallery } from "@/components/CaseStudyGallery";
import { CaseStudyProof, type ProofHighlight } from "@/components/CaseStudyProof";
import { uniqueGalleryImages } from "@/lib/nav-links";

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
  proofHighlights?: ProofHighlight[];
  proofNote?: string;
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
    ],
    proofHighlights: [
      { label: "Deployment", value: "Live production", note: "Collective RCM enterprise tenant" },
      { label: "Audit overhead", value: "40% lower", note: "Vs. legacy manual validation workflow" },
      { label: "Screenshots", value: "4 surfaces", note: "Admin, login, LearnIQ, ProctorIQ" },
      { label: "Capacity", value: "10K+ users", note: "Multi-tenant cluster load tested" },
    ],
    proofNote: "Screenshots and metrics captured from the production TrainIQ deployment.",
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
    ],
    proofHighlights: [
      { label: "Live demo", value: "Cloud Run URL", note: "Public scanner deployment" },
      { label: "Onboarding time", value: "80% faster", note: "Vs. manual repo mapping baseline" },
      { label: "Scan speed", value: "15s / 10K LOC", note: "Measured on representative repos" },
      { label: "Screenshots", value: "2 views", note: "Dashboard + dependency graph" },
    ],
    proofNote: "Visit the live demo to run a repository scan against your own public GitHub URL.",
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
    ],
    proofHighlights: [
      { label: "Live demo", value: "Vercel deploy", note: "Kapruka Agent Challenge 2026 build" },
      { label: "Time to cart", value: "85% faster", note: "Intent vs. manual filter workflow" },
      { label: "Mapping accuracy", value: "92%", note: "Search-to-product match rate in tests" },
      { label: "Screenshots", value: "2 flows", note: "Landing search + composed cart" },
    ],
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
    ],
    proofHighlights: [
      { label: "Live demo", value: "Cloud Run", note: "Public CareerForge deployment" },
      { label: "ATS alignment", value: "94%", note: "Parser score vs. recruiter rubric" },
      { label: "Interview readiness", value: "3× improvement", note: "Mock interview cohort average" },
      { label: "Screenshots", value: "2 modules", note: "Dashboard + mock interview UI" },
    ],
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
      { src: "/projects/revops-landing.png", caption: "RevOps AI — Predictive revenue cycle dashboard with forecasting, risk scoring, and HIPAA-aware audit workflows" },
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
    ],
    proofHighlights: [
      { label: "Build type", value: "B2B prototype", note: "Sanitized datasets only" },
      { label: "Forecast R²", value: "0.94", note: "On anonymized billing training set" },
      { label: "Inference", value: "<80ms", note: "FastAPI prediction endpoint" },
      { label: "Screenshots", value: "1 dashboard", note: "Revenue cycle overview UI" },
    ],
    proofNote: "All data shown uses dummy variables. No live HIPAA data appears in this repository or demo.",
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
    ],
    proofHighlights: [
      { label: "Throughput", value: "7M+ / day", note: "Ingestion pipeline benchmark" },
      { label: "Classification", value: "85% gain", note: "Vs. manual review sampling" },
      { label: "Automation", value: "100%", note: "Report extraction without manual exports" },
      { label: "Screenshots", value: "3 panels", note: "Sentiment, categories, star analytics" },
    ],
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
    ],
    proofHighlights: [
      { label: "Build type", value: "Agent prototype", note: "Internal demo — no public UI" },
      { label: "Applications", value: "200+", note: "Submitted in controlled test cohort" },
      { label: "Match threshold", value: "85%+", note: "Vector alignment before filing" },
      { label: "Filing speed", value: "15× faster", note: "Vs. manual application workflow" },
    ],
    proofNote: "Architecture and agent flows verified in staging. UI captures available on request for qualified prospects.",
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
    gallery: [
      { src: "/projects/monday-auditor.png", caption: "Monday Data Auditor — Board audit panel with missing-field detection and Excel export" },
    ],
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
    ],
    proofHighlights: [
      { label: "Boards audited", value: "50+ in 15s", note: "Deep pagination GraphQL runs" },
      { label: "Time saved", value: "12 hrs / week", note: "Manual admin checks replaced" },
      { label: "Coverage", value: "100%", note: "Field coverage reports per board" },
      { label: "Screenshots", value: "1 dashboard", note: "Streamlit audit interface" },
    ],
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
      { src: "/projects/nimasha-portfolio-hero.png", caption: "Academic portfolio — Computational chemistry publications with molecular canvas hero" },
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
    ],
    proofHighlights: [
      { label: "Deployment", value: "Live client site", note: "Academic portfolio in production" },
      { label: "Lighthouse SEO", value: "100", note: "Production audit score" },
      { label: "LCP", value: "2.4s", note: "Largest Contentful Paint index" },
      { label: "Screenshots", value: "1 hero", note: "Publications hub with canvas hero" },
    ],
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
      { src: "/projects/azeem-portfolio-hero.png", caption: "Creative portfolio — Cinematic showreel hero, project archive, and lead-capture flow" },
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
    ],
    proofHighlights: [
      { label: "Deployment", value: "Live client site", note: "Firebase-hosted production portfolio" },
      { label: "Lead uplift", value: "3×", note: "High-ticket inquiry rate post-launch" },
      { label: "Performance", value: "99 / 100", note: "Google Lighthouse score" },
      { label: "Screenshots", value: "1 hero", note: "Showreel + lead-capture flow" },
    ],
  },
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

  const heroImage = study.gallery?.[0]?.src ?? study.image;
  const galleryImages = uniqueGalleryImages(
    study.gallery && study.gallery.length > 0
      ? study.gallery
      : study.image
        ? [{ src: study.image, caption: `${study.title} — product interface` }]
        : []
  );

  return (
    <>
      <Navbar />
      <main id="main-content" className="relative z-[1] flex-1 pb-20 pt-24 md:pb-28 md:pt-28">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(ellipse_at_top,rgba(124,92,255,0.12),transparent_65%)]" />

        <div className="container-page relative">
          <Reveal>
            <Link
              href="/#work"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted transition-colors hover:text-foreground"
            >
              <ArrowLeft size={16} />
              Back to portfolio
            </Link>
          </Reveal>

          {/* Hero */}
          <div className="mt-8 max-w-4xl">
            <Reveal>
              <span className="rounded-full border border-violet/30 bg-violet/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-violet">
                {study.category}
              </span>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                {study.title}
              </h1>
              <p className="mt-4 text-lg font-medium leading-relaxed text-gradient-soft sm:text-xl">
                {study.tagline}
              </p>
            </Reveal>

            <Reveal delay={1}>
              <div className="mt-8 flex flex-wrap gap-3">
                {[
                  { icon: UserCheck, label: "Role", value: study.role },
                  { icon: Calendar, label: "Timeline", value: study.timeline },
                  { icon: Award, label: "Proof", value: study.proofLevel },
                ].map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="flex min-w-[200px] flex-1 items-start gap-3 rounded-2xl border border-border bg-surface/80 px-4 py-3.5 backdrop-blur-sm"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan/10 text-cyan">
                      <Icon size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted">{label}</p>
                      <p className="mt-0.5 text-sm font-medium text-foreground">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Hero screenshot */}
          <Reveal delay={2} className="mt-10">
            {heroImage ? (
              <div className="relative overflow-hidden rounded-2xl border border-border bg-[#07080f] shadow-[0_24px_80px_-24px_rgba(0,0,0,0.8)]">
                <div className="absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-violet/40 to-transparent" />
                <div className="relative aspect-[16/9] w-full">
                  <Image
                    src={heroImage}
                    alt={`${study.title} hero screenshot`}
                    fill
                    unoptimized
                    priority
                    className="object-cover object-top"
                    sizes="(max-width: 1280px) 100vw, 1280px"
                  />
                </div>
              </div>
            ) : (
              <div className="flex aspect-[16/9] w-full items-center justify-center rounded-2xl border border-border bg-gradient-to-br from-violet-600/20 via-indigo-600/10 to-cyan-500/20">
                <span className="text-2xl font-bold uppercase tracking-wider text-muted">{study.title}</span>
              </div>
            )}
          </Reveal>

          {/* Stats */}
          <Reveal>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {study.metrics.map((m, i) => (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-violet/35"
                >
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="relative text-3xl font-extrabold tracking-tight text-gradient-soft sm:text-4xl">
                    {m.value}
                  </div>
                  <div className="relative mt-2 text-xs font-semibold uppercase tracking-wider text-muted">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          {study.proofHighlights && study.proofHighlights.length > 0 && (
            <Reveal>
              <CaseStudyProof
                proofLevel={study.proofLevel}
                highlights={study.proofHighlights}
                liveUrl={study.liveUrl}
                proofNote={study.proofNote}
              />
            </Reveal>
          )}

          {/* Gallery */}
          {galleryImages.length > 0 && (
            <Reveal>
              <CaseStudyGallery images={galleryImages} />
            </Reveal>
          )}

          {/* Challenge + Solution */}
          <div className="mt-16 grid gap-6 lg:grid-cols-2">
            <Reveal>
              <section className="h-full rounded-2xl border border-border bg-surface p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
                    <Target size={18} />
                  </div>
                  <h2 className="text-lg font-bold tracking-tight">The challenge</h2>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-muted sm:text-base">{study.problem}</p>
              </section>
            </Reveal>
            <Reveal delay={1}>
              <section className="h-full rounded-2xl border border-violet/25 bg-gradient-to-br from-violet/10 via-surface to-surface p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet/15 text-violet">
                    <Lightbulb size={18} />
                  </div>
                  <h2 className="text-lg font-bold tracking-tight">Our solution</h2>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-muted sm:text-base">{study.solution}</p>
              </section>
            </Reveal>
          </div>

          {/* Main content grid */}
          <div className="mt-16 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-14">
            <div className="space-y-12">
              {/* Architecture flow */}
              {study.architecture && study.architecture.length > 0 && (
                <Reveal>
                  <section>
                    <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight">
                      <Layers className="text-cyan" size={20} />
                      System architecture
                    </h2>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      {study.architecture.map((layer, idx) => {
                        const LayerIcon = layer.icon;
                        return (
                          <div
                            key={idx}
                            className="rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-violet/25"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet/10 text-violet">
                                <LayerIcon size={18} />
                              </div>
                              <h4 className="text-xs font-bold uppercase tracking-wider">{layer.layerName}</h4>
                            </div>
                            <ul className="mt-4 space-y-2">
                              {layer.components.map((comp, cidx) => (
                                <li
                                  key={cidx}
                                  className="rounded-lg bg-surface-2 px-3 py-2 text-xs font-medium text-muted"
                                >
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

              {/* Technical specs */}
              <Reveal>
                <section className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
                  <h2 className="text-xl font-bold tracking-tight">Technical specifications</h2>
                  <ul className="mt-6 space-y-4">
                    {study.technicalArchitecture.map((arch, i) => (
                      <li key={i} className="flex gap-3 text-sm leading-relaxed text-muted">
                        <CheckCircle size={16} className="mt-0.5 shrink-0 text-emerald-400" />
                        <span>{arch}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </Reveal>

              {/* Deliverables */}
              {study.deliverables && study.deliverables.length > 0 && (
                <Reveal>
                  <section>
                    <h2 className="text-xl font-bold tracking-tight">Key deliverables</h2>
                    <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                      {study.deliverables.map((item, i) => (
                        <li
                          key={i}
                          className="flex gap-3 rounded-xl border border-border bg-surface-2 p-4 text-sm text-muted"
                        >
                          <CheckCircle size={14} className="mt-0.5 shrink-0 text-cyan" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                </Reveal>
              )}

              {study.hipaaDisclaimer && (
                <Reveal>
                  <div className="flex gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 text-sm text-amber-500">
                    <Shield size={16} className="mt-0.5 shrink-0" />
                    <p>{study.hipaaDisclaimer}</p>
                  </div>
                </Reveal>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
              <Reveal>
                <div className="rounded-2xl border border-border bg-surface p-6">
                  <h3 className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-muted">
                    <Layers size={14} />
                    Tech stack
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {study.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-xs font-medium text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal delay={1}>
                <div className="rounded-2xl border border-violet/30 bg-violet/5 p-6 text-center">
                  {study.liveUrl && (
                    <a
                      href={study.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mb-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan to-violet-600 py-3 text-xs font-extrabold uppercase tracking-wider text-white shadow-lg transition-transform hover:scale-[1.02]"
                    >
                      Visit live project
                      <ArrowUpRight size={14} />
                    </a>
                  )}
                  <ShieldCheck size={32} className="mx-auto text-violet" />
                  <h3 className="mt-3 text-sm font-bold">Need a similar solution?</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted">
                    We build high-trust custom software with full system auditing.
                  </p>
                  <Link
                    href="/#contact"
                    className="mt-4 inline-block w-full rounded-xl border border-violet/30 bg-violet/10 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-transform hover:scale-[1.02]"
                  >
                    Request a consult
                  </Link>
                </div>
              </Reveal>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
