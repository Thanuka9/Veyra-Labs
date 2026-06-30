import {
  Boxes,
  ShoppingCart,
  Globe,
  BrainCircuit,
  LineChart,
  Database,
  Cloud,
  Shield,
  Smartphone,
  Layout,
  Server,
  Plug,
  BarChart3,
  Link2,
  Gauge,
  type LucideIcon,
} from "lucide-react";

export type Service = {
  id: string;
  category: "core" | "addon";
  title: string;
  /** Short label for footer / contact */
  shortTitle: string;
  description: string;
  longDescription: string;
  icon: LucideIcon;
  points: string[];
  deliverables: string[];
  timeline: string;
  priceFrom: string;
  priceTo: string;
  priceNote?: string;
  highlight?: boolean;
};

export const services: Service[] = [
  {
    id: "saas",
    category: "core",
    shortTitle: "SaaS Engineering",
    title: "SaaS Product Engineering",
    description:
      "Multi-tenant platforms with auth, billing, admin dashboards and APIs  -  from MVP to enterprise.",
    longDescription:
      "We architect and ship production SaaS: tenant isolation, role-based access, Stripe billing, user and admin dashboards, and GCP deployment. Ideal for B2B tools, internal platforms and vertical SaaS.",
    icon: Boxes,
    points: ["Multi-tenant architecture", "Auth, 2FA & RBAC", "Stripe billing", "Admin dashboards"],
    deliverables: [
      "Technical architecture document",
      "Auth & user management",
      "Admin panel + analytics",
      "REST/GraphQL API + database layer",
      "GCP deployment + CI/CD",
      "30-day post-launch support",
    ],
    timeline: "8-16 weeks",
    priceFrom: "$8,000",
    priceTo: "$25,000+",
    priceNote: "Scoped to feature set & user tiers",
  },
  {
    id: "ecommerce",
    category: "core",
    shortTitle: "E-Commerce",
    title: "E-Commerce & Storefronts",
    description:
      "Online stores with product catalog, cart, secure checkout and admin  -  mobile-first and SEO-ready.",
    longDescription:
      "Conversion-focused storefronts from starter catalogs to AI shopping experiences. Includes product pages, cart and checkout, payment gateways (Stripe/PayPal), order admin and performance tuning.",
    icon: ShoppingCart,
    points: ["Product catalog", "Cart & checkout", "Payment integration", "Admin order dashboard"],
    deliverables: [
      "Responsive storefront UI",
      "Product & category pages",
      "Cart + secure checkout flow",
      "Payment gateway setup (Stripe/PayPal)",
      "Admin order dashboard",
      "SEO setup, SSL & deployment",
    ],
    timeline: "3-6 weeks",
    priceFrom: "$1,500",
    priceTo: "$2,000",
    priceNote: "Starter store · scales with catalog & features",
    highlight: true,
  },
  {
    id: "website",
    category: "core",
    shortTitle: "Premium Websites",
    title: "Premium Websites & Portfolios",
    description:
      "Brand and marketing sites with custom design, motion, lead capture and Core Web Vitals optimisation.",
    longDescription:
      "High-end company sites, personal brands and portfolio platforms. Custom UI/UX, up to 8+ sections, contact flows, Google Analytics, and deployment with SSL  -  built to convert visitors into leads.",
    icon: Globe,
    points: ["Custom UI/UX design", "Framer-grade motion", "Lead capture forms", "SEO & analytics"],
    deliverables: [
      "Custom UI/UX design",
      "Up to 8 sections/pages (more scoped add-on)",
      "Contact & lead capture",
      "Mobile-first responsive build",
      "Google Analytics setup",
      "Deployment + SSL",
    ],
    timeline: "2-4 weeks",
    priceFrom: "$1,200",
    priceTo: "$3,500",
    priceNote: "Brand & portfolio sites",
  },
  {
    id: "ai",
    category: "core",
    shortTitle: "AI & LLM",
    title: "AI & LLM Implementation",
    description:
      "Production AI wired into your product  -  chatbots, RAG search, agents, copilots and local LLM options.",
    longDescription:
      "We integrate LLMs that work in production: grounded RAG over your documents, autonomous agent workflows, chat UIs (like this assistant), prompt engineering, and cloud or local model deployment.",
    icon: BrainCircuit,
    points: ["RAG & vector search", "Custom chatbots", "Autonomous agents", "Cloud & local LLMs"],
    deliverables: [
      "AI feature architecture",
      "Vector DB + document ingestion",
      "Chat / agent UI component",
      "Prompt engineering & evaluation",
      "Rate limiting & caching",
      "Documentation & handoff",
    ],
    timeline: "4-10 weeks",
    priceFrom: "$2,500",
    priceTo: "$12,000+",
    priceNote: "Standalone or add-on to any project",
  },
  {
    id: "ml",
    category: "core",
    shortTitle: "ML & Analytics",
    title: "ML & Predictive Analytics",
    description:
      "Forecasting models, predictive scoring and interactive ML dashboards deployed on your data.",
    longDescription:
      "Revenue forecasting, predictive scoring and operational analytics  -  models trained and validated on your data, served via API and visualised in dashboards your team can use daily.",
    icon: LineChart,
    points: ["Forecasting models", "Predictive scoring", "ML dashboards", "API inference"],
    deliverables: [
      "Data audit & feature engineering",
      "Model training & validation report",
      "Interactive dashboard UI",
      "API inference endpoint",
      "Accuracy / performance reporting",
      "Optional retraining pipeline",
    ],
    timeline: "6-12 weeks",
    priceFrom: "$4,000",
    priceTo: "$15,000+",
    priceNote: "Healthcare, finance & ops analytics",
  },
  {
    id: "data",
    category: "core",
    shortTitle: "Data Engineering",
    title: "Data Science & Engineering",
    description:
      "ETL pipelines, NLP, warehousing and analytics  -  from messy data ingestion to actionable insight.",
    longDescription:
      "End-to-end data pipelines: load, clean, transform and visualise complex datasets. Includes PostgreSQL warehousing, scheduled jobs, NLP/sentiment analysis, EDA reports and export/API access.",
    icon: Database,
    points: ["ETL & pipelines", "NLP & sentiment", "PostgreSQL warehousing", "Reports & charts"],
    deliverables: [
      "Pipeline architecture document",
      "Automated ETL scripts",
      "Database schema design",
      "EDA reports + visualisations",
      "Scheduled data jobs",
      "Export / API access layer",
    ],
    timeline: "4-8 weeks",
    priceFrom: "$3,000",
    priceTo: "$10,000+",
    priceNote: "Ingestion through insight",
  },
  {
    id: "devops",
    category: "addon",
    shortTitle: "Cloud & DevOps",
    title: "Cloud & DevOps",
    description:
      "Docker, CI/CD, GCP deployment, monitoring and security hardening for production releases.",
    longDescription:
      "Infrastructure setup for teams that need reliable shipping: containerised services, automated deployments, environment configuration, uptime monitoring and security hardening  -  standalone or bundled with a build.",
    icon: Cloud,
    points: ["Docker & compose", "Google Cloud Run", "CI/CD pipelines", "Monitoring & alerts"],
    deliverables: [
      "Infrastructure-as-code setup",
      "Docker containerisation",
      "CI/CD pipeline configuration",
      "Environment & secrets management",
      "Uptime monitoring & alerts",
      "Security hardening checklist",
    ],
    timeline: "1-3 weeks",
    priceFrom: "$800",
    priceTo: "$4,000",
    priceNote: "Add-on or standalone setup",
  },
  {
    id: "security",
    category: "addon",
    shortTitle: "Security",
    title: "Security & Compliance",
    description:
      "2FA, RBAC, audit logging, session hardening and HIPAA-aware patterns for regulated clients.",
    longDescription:
      "Production-grade security for healthcare, finance and enterprise: encrypted sessions, audit trails, permission matrices, pen-test checklists and compliance-ready data handling patterns.",
    icon: Shield,
    points: ["2FA & SSO ready", "Audit logging", "RBAC permissions", "HIPAA-aware patterns"],
    deliverables: [
      "Security architecture review",
      "Auth & session hardening",
      "Audit log implementation",
      "RBAC permission matrix",
      "Pen-test readiness checklist",
      "Compliance documentation",
    ],
    timeline: "2-4 weeks",
    priceFrom: "$1,500",
    priceTo: "$5,000",
    priceNote: "Add-on or standalone audit",
  },
  {
    id: "mobile",
    category: "addon",
    shortTitle: "Mobile & PWA",
    title: "Mobile-Responsive & PWA",
    description:
      "Cross-device responsive QA and optional PWA setup for installable, app-like web experiences.",
    longDescription:
      "Mobile-first is default on every Veyra build. This add-on adds deep cross-device QA, touch optimisation, optional PWA manifest for home-screen install, and performance audits across breakpoints.",
    icon: Smartphone,
    points: ["Cross-device QA", "Touch optimisation", "PWA manifest", "Performance audit"],
    deliverables: [
      "Responsive testing all breakpoints",
      "Touch & gesture optimisation",
      "Optional PWA manifest + service worker",
      "Cross-browser device matrix QA",
      "Performance audit report",
    ],
    timeline: "+1-2 weeks",
    priceFrom: "$500",
    priceTo: "$1,500",
    priceNote: "Add-on to any web project",
  },
  {
    id: "analytics",
    category: "addon",
    shortTitle: "Analytics & BI",
    title: "Analytics & BI Dashboards",
    description:
      "Custom telemetry, Google Tag Manager, custom dashboard setup, user behavior tracking, and funnel analysis.",
    longDescription:
      "Detailed analytics setup for data-driven decisions: custom telemetry, Google Tag Manager, custom dashboard setup, user behavior tracking, and conversion funnel analysis.",
    icon: BarChart3,
    points: ["Custom telemetry", "GTM & pixel tracking", "User behavior tracking", "Funnel analysis"],
    deliverables: [
      "Telemetry implementation plan",
      "GTM container & pixel setup",
      "Interactive dashboard",
      "Conversion tracking verification",
    ],
    timeline: "+1-2 weeks",
    priceFrom: "$1,200",
    priceTo: "$3,000",
    priceNote: "Custom tags & dashboards",
  },
  {
    id: "integrations",
    category: "addon",
    shortTitle: "API Integrations",
    title: "Third-Party API Integrations",
    description:
      "CRM syncing, payment processors, custom webhooks, inventory sync, accounting, and system migrations.",
    longDescription:
      "Connect your web platform to the software you use daily: CRM syncing (Salesforce/Hubspot), inventory management, accounting tools, and custom webhooks.",
    icon: Link2,
    points: ["CRM syncing & webhooks", "Inventory management", "Accounting software", "Custom middleware"],
    deliverables: [
      "Integration architecture diagram",
      "OAuth 2.0 configuration",
      "Custom webhook handlers",
      "API testing & verification logs",
    ],
    timeline: "+2-3 weeks",
    priceFrom: "$1,000",
    priceTo: "$4,500",
    priceNote: "Custom scoped by API",
  },
  {
    id: "performance",
    category: "addon",
    shortTitle: "Speed Optimization",
    title: "Performance & Core Web Vitals",
    description:
      "Database query tuning, bundle splitting, database caching, CDN setup, and asset pipeline audits.",
    longDescription:
      "Bring your site to sub-second load times. Includes Core Web Vitals optimization, asset pipeline tuning, database index optimizations, Redis caching, and edge CDN deployments.",
    icon: Gauge,
    points: ["Core Web Vitals audit", "Redis caching & CDN", "Database indexing", "Asset optimization"],
    deliverables: [
      "Before/after speed reports",
      "Edge CDN configuration",
      "Database query optimization script",
      "Webpack/Turbopack bundle analysis",
    ],
    timeline: "+1-2 weeks",
    priceFrom: "$600",
    priceTo: "$1,800",
    priceNote: "Sub-second load times",
  },
];

export const coreServices = services.filter((s) => s.category === "core");
export const addonServices = services.filter((s) => s.category === "addon");

export const footerServiceLinks = coreServices.map((s) => ({
  label: s.shortTitle,
  href: `/services#services-${s.id}`,
}));

export const contactProjectTypes = [
  ...coreServices.map((s) => s.title),
  ...addonServices.map((s) => `${s.shortTitle} (add-on)`),
  "Not sure yet  -  let's talk",
];

export type Outcome = {
  value: string;
  suffix?: string;
  label: string;
  detail: string;
  project: string;
  category: string;
};

export const outcomes: Outcome[] = [
  {
    value: "90",
    suffix: "%+",
    label: "Predictive model accuracy",
    detail: "ML forecasting kernels achieving R² > 0.90 on healthcare billing data",
    project: "RevOps AI · Collective RCM",
    category: "Predictive ML",
  },
  {
    value: "40",
    suffix: "%+",
    label: "Manual effort reduction",
    detail: "Automated audit workflows and real-time analytics dashboards",
    project: "TrainIQ · Collective RCM",
    category: "Enterprise SaaS",
  },
  {
    value: "15",
    suffix: "+",
    label: "Successful projects delivered",
    detail: "Live SaaS, AI tools, e-commerce and premium brand websites",
    project: "Veyra Labs portfolio",
    category: "Full-stack",
  },
  {
    value: "7",
    suffix: "M+",
    label: "Data points processed",
    detail: "Enterprise-scale ETL, NLP and predictive pipelines in production",
    project: "Data science engagements",
    category: "Data & ML",
  },
];

export type TechCategory = {
  name: string;
  icon: LucideIcon;
  tools: { name: string; desc: string }[];
};

export const techCategories: TechCategory[] = [
  {
    name: "Frontend & UI",
    icon: Layout,
    tools: [
      { name: "Next.js 16", desc: "App Router, SSR, SEO" },
      { name: "React 19", desc: "Component architecture" },
      { name: "TypeScript", desc: "Type-safe codebase" },
      { name: "Tailwind CSS v4", desc: "Design system" },
      { name: "HTML5 & CSS3", desc: "Core web standards & structures" },
      { name: "Shadcn UI / Radix", desc: "Modern custom UI components" },
      { name: "Zustand / Redux", desc: "Predictable state management" },
      { name: "Framer Motion", desc: "Cinematic web animations" },
    ],
  },
  {
    name: "Backend & APIs",
    icon: Server,
    tools: [
      { name: "Python", desc: "ML, APIs & data pipelines" },
      { name: "FastAPI", desc: "Async Python APIs" },
      { name: "Django / Flask", desc: "Python enterprise backends" },
      { name: "Node.js", desc: "JS runtime & tooling" },
      { name: "Express.js", desc: "Node web server framework" },
      { name: "PHP / Laravel", desc: "Robust MVC web structures" },
      { name: "GraphQL", desc: "Flexible data query schemas" },
      { name: "REST APIs & Webhooks", desc: "Documented real-time interfaces" },
      { name: "WebSockets", desc: "Bi-directional real-time communication" },
    ],
  },
  {
    name: "Data & ML",
    icon: Database,
    tools: [
      { name: "PostgreSQL", desc: "Relational warehouse" },
      { name: "MySQL", desc: "Relational DB storage" },
      { name: "MongoDB", desc: "NoSQL document store" },
      { name: "Vector Databases", desc: "Semantic search (FAISS, Pinecone)" },
      { name: "Redis", desc: "In-memory caching & queues" },
      { name: "PyTorch", desc: "Deep learning & computer vision" },
      { name: "TensorFlow", desc: "Machine learning platform" },
      { name: "Pandas / NumPy", desc: "Data engineering & analysis" },
      { name: "Prisma / Mongoose", desc: "Database ORM / ODM layers" },
    ],
  },
  {
    name: "AI & LLM",
    icon: BrainCircuit,
    tools: [
      { name: "LangChain", desc: "Agent orchestration & workflows" },
      { name: "LlamaIndex", desc: "Data frameworks for LLMs" },
      { name: "RAG pipelines", desc: "Grounded semantic retrieval" },
      { name: "Ollama / Gemma 4", desc: "Local LLM inference" },
      { name: "OpenAI GPT-4o", desc: "Cloud LLM reasoning APIs" },
      { name: "Claude 3.5 Sonnet", desc: "Advanced cognitive reasoning" },
      { name: "Hugging Face", desc: "Transformer models & NLP" },
      { name: "Playwright", desc: "Autonomous browser agents" },
    ],
  },
  {
    name: "Cloud & DevOps",
    icon: Cloud,
    tools: [
      { name: "Google Cloud", desc: "Cloud Run, GCP services" },
      { name: "AWS", desc: "Amazon Web Services" },
      { name: "Microsoft Azure", desc: "Enterprise cloud solutions" },
      { name: "Docker", desc: "Containerisation" },
      { name: "Kubernetes", desc: "Container orchestration" },
      { name: "Supabase / Firebase", desc: "Backend-as-a-Service platforms" },
      { name: "Vercel", desc: "Edge CDN deployment" },
      { name: "GitHub Actions", desc: "CI/CD workflow automation" },
    ],
  },
  {
    name: "Commerce & Integrations",
    icon: Plug,
    tools: [
      { name: "Stripe", desc: "Payments & billing" },
      { name: "Shopify / WooCommerce", desc: "E-commerce integrations" },
      { name: "MCP Protocol", desc: "Live catalog APIs" },
      { name: "Monday.com API", desc: "CRM & workflow integration" },
      { name: "Streamlit", desc: "Internal Python dashboards" },
      { name: "Zapier / Make.com", desc: "No-code workflow automation" },
      { name: "Resend", desc: "Transactional email delivery" },
    ],
  },
];

/** Flat list of every production technology (derived from techCategories) */
export const productionTechTools = techCategories.flatMap((c) =>
  c.tools.map((t) => ({ ...t, category: c.name }))
);

export const techStack: string[] = productionTechTools.map((t) => t.name);

export type ProcessStep = {
  no: string;
  title: string;
  description: string;
  duration: string;
  deliverables: string[];
  clientGets: string;
};

export const process: ProcessStep[] = [
  {
    no: "01",
    title: "Discovery & Scoping",
    description:
      "We start with a free discovery call to understand your business goals, users, constraints and success metrics. No sales pitch  -  just clarity.",
    duration: "Week 1",
    deliverables: ["Requirements document", "Technical blueprint", "Fixed-price quote", "Project timeline"],
    clientGets: "A clear roadmap and transparent estimate before any code is written.",
  },
  {
    no: "02",
    title: "Design & Architecture",
    description:
      "Wireframes, data models and system architecture come together. You review interactive prototypes and approve the direction before development begins.",
    duration: "Week 1-2",
    deliverables: ["UI wireframes", "Database schema", "API design", "Architecture diagram"],
    clientGets: "Visual proof of what you're buying  -  no surprises at launch.",
  },
  {
    no: "03",
    title: "Agile Build Sprints",
    description:
      "Modular, tested code shipped in 1-2 week sprints. You see working features after every sprint  -  frontend, backend, AI and data layers in lockstep.",
    duration: "Week 2-10",
    deliverables: ["Sprint demos", "Staging environment", "Automated tests", "Progress reports"],
    clientGets: "Working software every sprint, not a big reveal at the end.",
  },
  {
    no: "04",
    title: "Launch & Handoff",
    description:
      "Production deployment on Google Cloud or Vercel, performance tuning, documentation and a structured handoff. We stay on for 30 days post-launch.",
    duration: "Final week",
    deliverables: ["Production deployment", "Documentation", "Admin training", "30-day support"],
    clientGets: "A live, production-ready product you own  -  with support while you settle in.",
  },
];

export type PricingTier = {
  name: string;
  price: string;
  priceNote: string;
  description: string;
  features: string[];
  cta: string;
  highlight?: boolean;
};

export const pricingTiers: PricingTier[] = [
  {
    name: "Portfolio Website",
    price: "$800 - $1,500",
    priceNote: "Personal & creative brands",
    description:
      "Clean, high-performance portfolio site to showcase your creative work, skills, and capture leads.",
    features: [
      "Up to 5 sections/pages",
      "Optimized media showcase",
      "Contact/inquiry form",
      "Basic SEO & Analytics",
      "Mobile-responsive build",
      "SSL deployment",
      "1-3 week delivery",
    ],
    cta: "Get portfolio quote",
  },
  {
    name: "Premium Website",
    price: "$1,200 - $3,500",
    priceNote: "Brand & portfolio sites",
    description:
      "Custom brand or portfolio site with motion, lead capture and performance optimisation.",
    features: [
      "Custom UI/UX design",
      "Up to 8 sections/pages",
      "Framer-grade animations",
      "Contact & lead capture",
      "Google Analytics",
      "Core Web Vitals optimised",
      "Deployment + SSL",
      "2-4 week delivery",
    ],
    cta: "Get website quote",
  },
  {
    name: "E-Commerce Starter",
    price: "$1,500 - $2,000",
    priceNote: "Most popular entry point",
    description:
      "Professional online store  -  product catalog, cart, secure checkout and admin dashboard.",
    features: [
      "Up to 50 products",
      "Mobile-responsive storefront",
      "Cart & secure checkout",
      "Payment gateway (Stripe/PayPal)",
      "Admin order dashboard",
      "SEO setup + SSL deployment",
      "2 revision rounds",
      "3-6 week delivery",
    ],
    cta: "Get e-commerce quote",
    highlight: true,
  },
  {
    name: "AI & LLM Feature",
    price: "$2,500 - $12,000",
    priceNote: "Standalone or add-on",
    description:
      "Production AI  -  chatbots, RAG search, autonomous agents or local/cloud LLM integration.",
    features: [
      "AI architecture design",
      "RAG or agent pipeline",
      "Chat / copilot UI",
      "Vector database setup",
      "Prompt engineering & evals",
      "Rate limiting & caching",
      "Local or cloud LLM",
      "4-10 week delivery",
    ],
    cta: "Discuss AI scope",
  },
  {
    name: "SaaS Platform",
    price: "$8,000 - $25,000+",
    priceNote: "Enterprise-grade",
    description:
      "Full multi-tenant SaaS  -  auth, billing, dashboards, RBAC and cloud deployment.",
    features: [
      "Multi-tenant architecture",
      "Auth, 2FA & RBAC",
      "Stripe subscription billing",
      "Admin + user dashboards",
      "REST/GraphQL API",
      "PostgreSQL + caching",
      "GCP deployment + CI/CD",
      "8-16 week delivery",
    ],
    cta: "Book discovery call",
  },
  {
    name: "ML & Predictive Analytics",
    price: "$4,000 - $15,000+",
    priceNote: "Forecasting & dashboards",
    description:
      "Predictive models and interactive dashboards  -  trained on your data, deployed with API access.",
    features: [
      "Data audit & feature engineering",
      "Model training & validation",
      "Interactive ML dashboard",
      "API inference endpoint",
      "Accuracy reporting",
      "Optional retraining pipeline",
      "Healthcare & ops experience",
      "6-12 week delivery",
    ],
    cta: "Discuss ML scope",
  },
  {
    name: "Data Science & Engineering",
    price: "$3,000 - $10,000+",
    priceNote: "Pipelines & warehousing",
    description:
      "ETL pipelines, NLP, PostgreSQL warehousing and analytics from ingestion to insight.",
    features: [
      "Pipeline architecture",
      "Automated ETL scripts",
      "Database schema design",
      "EDA reports + visualisations",
      "Scheduled data jobs",
      "Export / API access",
      "NLP & sentiment (optional)",
      "4-8 week delivery",
    ],
    cta: "Discuss data scope",
  },
];

export const stats: { value: string; label: string }[] = [
  { value: "20+", label: "Products delivered" },
  { value: "6", label: "Industry domains" },
  { value: "R² > 0.90", label: "On billing datasets" },
  { value: "100%", label: "Production-focused" },
];

export type Testimonial = {
  quote: string;
  /** Job title or function  -  no fabricated personal names. */
  role: string;
  /** Industry / engagement context (anonymized). */
  context: string;
  /** Optional link to a public case study for the same engagement type. */
  projectSlug?: string;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "Veyra Labs took our vague concept and turned it into a fully operational SaaS platform in under 12 weeks. The architecture was clean, the handoff was thorough, and it's been running without issues since day one.",
    role: "Co-Founder",
    context: "B2B FinTech platform",
  },
  {
    quote:
      "We needed a premium brand site that could compete with our enterprise competitors. What Veyra delivered looked world-class and generated qualified leads within the first week of going live.",
    role: "Marketing Director",
    context: "B2B services company",
    projectSlug: "azeem-portfolio",
  },
  {
    quote:
      "Their RAG pipeline implementation was impressive  -  they had our 50,000-document knowledge base fully searchable and integrated into our internal tool within a month. The team is deeply technical and zero-fluff.",
    role: "Engineering Lead",
    context: "Enterprise AI product team",
    projectSlug: "codex",
  },
  {
    quote:
      "The e-commerce storefront they built converted at 3.8% on launch week  -  well above our previous 1.2%. Mobile-first performance was exactly what we needed to compete on Google Shopping.",
    role: "Founder",
    context: "D2C retail brand",
    projectSlug: "kapruka-flow",
  },
  {
    quote:
      "The compliance training rollout cut manual audit overhead and has stayed stable under our full production user load since go-live. Admin reporting alone saves our team hours every week.",
    role: "Learning Operations Lead",
    context: "Healthcare RCM organization (anonymized)",
    projectSlug: "trainiq",
  },
  {
    quote:
      "From discovery call to production deployment, the process was transparent and structured. We always knew what was coming next, and they never missed a sprint deadline.",
    role: "CTO",
    context: "PropTech SaaS startup",
  },
  {
    quote:
      "Veyra Labs built our customer-facing AI chatbot from scratch  -  it handles 85% of tier-1 support queries with no human handoff. Saved us two full-time support roles in the first quarter.",
    role: "Director of Operations",
    context: "Public-sector technology program (anonymized)",
  },
];

export const CONTACT_EMAIL = "veyralabs0@gmail.com";
export const CONTACT_LINKEDIN =
  "https://www.linkedin.com/in/thanuka-ellepola-a559b01aa/";
export const CONTACT_LOCATION = "Colombo, Sri Lanka · Remote-first worldwide";
