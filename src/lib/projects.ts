export type ProjectCategory =
  | "SaaS Platform"
  | "AI & LLM"
  | "Data Science"
  | "E-Commerce"
  | "Website";

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: ProjectCategory;
  tags: string[];
  labels?: string[];
  image?: string;
  /** CSS object-position for screenshot framing in cards */
  imagePosition?: string;
  /** cover = crop to frame (full websites); contain = fit entire UI screenshot */
  imageFit?: "contain" | "cover";
  cover?: string;
  href?: string;
  linkLabel?: string;
  featured?: boolean;
  /** Large bento tile on the homepage */
  spotlight?: boolean;
  metrics?: { label: string; value: string }[];
  gallery?: { src: string; caption: string }[];
};

export const projects: Project[] = [
  {
    slug: "thanuka-careers",
    name: "Thanuka Ellepola Careers",
    tagline: "Premium AI architect & enterprise solutions website",
    description:
      "A conversion-engineered personal brand platform — animated hero, case studies, AI lab demos, client testimonials and strategic inquiry flows. Built to win enterprise clients.",
    category: "Website",
    tags: ["Next.js", "Framer Motion", "SEO", "i18n"],
    labels: ["Personal Brand", "Live Production"],
    image: "/projects/thanuka-careers-hero-wide.png",
    imageFit: "cover",
    imagePosition: "left top",
    href: "https://thanukaellepola.careers/en",
    linkLabel: "Visit live site → thanukaellepola.careers",
    featured: true,
    spotlight: true,
    metrics: [
      { label: "Live sections", value: "9+" },
      { label: "Deployed", value: "Live" },
    ],
    gallery: [
      { src: "/projects/thanuka-careers-card.png", caption: "Hero — enterprise intelligence positioning" },
      { src: "/projects/thanuka-careers-labs.png", caption: "AI Labs — Neural Playgrounds with RAG Orchestrator" },
      { src: "/projects/thanuka-careers-projects.png", caption: "Case studies grid with project cards" },
      { src: "/projects/thanuka-careers-skills-card.png", caption: "Skills & expertise showcase" },
      { src: "/projects/thanuka-careers-hero.png", caption: "Full overview with navigation" },
    ],
  },
  {
    slug: "trainiq",
    name: "TrainIQ",
    tagline: "Enterprise workforce training & AI performance platform",
    description:
      "Multi-tenant LMS with level-based exams, knowledge bases, LearnIQ local LLM assistant, ProctorIQ integrity, RBAC, 2FA and enterprise audit logging — deployed for Collective RCM.",
    category: "SaaS Platform",
    tags: ["Flask", "PostgreSQL", "MongoDB", "Local LLM", "RBAC"],
    labels: ["Client Project", "Live Production"],
    image: "/projects/trainiq-hero.png",
    href: "/case-studies/trainiq",
    linkLabel: "Read case study →",
    featured: true,
    spotlight: true,
    metrics: [
      { label: "Audit overhead reduced", value: "40%" },
      { label: "AI modules shipped", value: "4" },
    ],
  },
  {
    slug: "codex",
    name: "CodeX",
    tagline: "Architecture intelligence for any codebase",
    description:
      "Turns any GitHub repository into instant visual documentation and system architecture — for teams onboarding into unfamiliar codebases.",
    category: "AI & LLM",
    tags: ["Next.js", "LLM", "Cloud Run"],
    labels: ["Internal SaaS", "Demo App"],
    image: "/projects/codex-home.png",
    href: "/case-studies/codex",
    linkLabel: "Read case study →",
    featured: true,
    spotlight: true,
  },
  {
    slug: "kapruka-flow",
    name: "Kapruka Flow",
    tagline: "AI-first intent-driven shopping",
    description:
      "Challenge / demo project using Kapruka MCP. Built for the Kapruka Agent Challenge 2026. Describe what you need in natural language — the AI composes optimised carts over a live commerce MCP with real checkout.",
    category: "E-Commerce",
    tags: ["Next.js", "FastAPI", "AI Agents", "MCP"],
    labels: ["Challenge Build", "Demo App"],
    image: "/projects/kapruka-home.png",
    href: "/case-studies/kapruka-flow",
    linkLabel: "Read case study →",
    featured: true,
    spotlight: true,
  },
  {
    slug: "techforge-ai",
    name: "TechForge AI",
    tagline: "Multi-agent career intelligence suite",
    description:
      "AI recruiter agents that audit resumes, build portfolios, run mock interviews and surface live market salary intelligence.",
    category: "AI & LLM",
    tags: ["Multi-agent", "LLM", "Cloud Run"],
    labels: ["Internal Product", "Demo App"],
    image: "/projects/careerforge-home.png",
    href: "/case-studies/techforge-ai",
    linkLabel: "Read case study →",
    featured: true,
  },
  {
    slug: "revops-ai",
    name: "RevOps AI",
    tagline: "Predictive revenue cycle management",
    description:
      "B2B SaaS prototype that automates healthcare RCM auditing and forecasts payment timelines with ML. Built with FastAPI, React, and HIPAA-aware logging. (Anonymized healthcare dataset).",
    category: "SaaS Platform",
    tags: ["FastAPI", "React", "Scikit-learn", "GCP"],
    labels: ["Internal SaaS", "Prototype"],
    image: "/projects/revops-landing.png",
    href: "/case-studies/revops-ai",
    linkLabel: "Read case study →",
    featured: true,
    metrics: [
      { label: "Forecast accuracy", value: "94%" },
      { label: "Rejection rate", value: "~0" },
    ],
  },
  {
    slug: "reviewradar-ai",
    name: "ReviewRadar AI",
    tagline: "Review intelligence at scale",
    description:
      "End-to-end pipeline — ingest, clean, feature-engineer and analyse millions of reviews with NLP sentiment, TF-IDF and geo-clustering.",
    category: "Data Science",
    tags: ["Python", "PostgreSQL", "NLP", "Pandas"],
    labels: ["Internal Product", "Prototype"],
    image: "/projects/reviewradar-sentiment.png",
    href: "/case-studies/reviewradar-ai",
    linkLabel: "Read case study →",
  },
  {
    slug: "job-hunter-ai",
    name: "Job Hunter AI",
    tagline: "Autonomous career-application agent",
    description:
      "Hybrid-RAG engine that discovers roles, ranks them with an LLM, and autonomously submits applications via Playwright — grounded by FAISS.",
    category: "AI & LLM",
    tags: ["RAG", "FAISS", "Playwright", "GPT-4o"],
    labels: ["Internal SaaS", "Prototype"],
    cover: "from-violet-600/30 via-indigo-600/20 to-cyan-500/20",
    href: "/case-studies/job-hunter-ai",
    linkLabel: "Read case study →",
  },
  {
    slug: "nimasha-portfolio",
    name: "Academic Research Portfolio",
    tagline: "Publication-grade computational chemistry site",
    description:
      "Custom molecular canvas animation, filterable academic timelines, abstract viewer and print-optimised CV — Next.js 16 + Tailwind v4.",
    category: "Website",
    tags: ["Next.js 16", "Canvas", "Framer Motion"],
    labels: ["Client Project", "Live Production"],
    image: "/projects/nimasha-portfolio-hero.png",
    href: "/case-studies/nimasha-portfolio",
    linkLabel: "Read case study →",
  },
  {
    slug: "azeem-portfolio",
    name: "Creative Portfolio",
    tagline: "Conversion-focused video editor site",
    description:
      "Cinematic showreels, animated project archive, review collection and lead-capture contact flow that turns viewers into clients.",
    category: "Website",
    tags: ["React", "Lead capture", "Responsive"],
    labels: ["Client Project", "Live Production"],
    image: "/projects/azeem-portfolio-hero.png",
    href: "/case-studies/azeem-portfolio",
    linkLabel: "Read case study →",
  },
  {
    slug: "monday-auditor",
    name: "Monday Data Auditor",
    tagline: "Workspace data-hygiene at scale",
    description:
      "Scans Monday.com boards via GraphQL with deep pagination, pinpoints missing data and exports filterable audit reports.",
    category: "Data Science",
    tags: ["Streamlit", "Pandas", "GraphQL"],
    labels: ["Internal Product", "Demo App"],
    image: "/projects/monday-auditor.png",
    href: "/case-studies/monday-auditor",
    linkLabel: "Read case study →",
  },
];

export const spotlightProjects = projects.filter((p) => p.spotlight);
export const featuredProjects = projects.filter((p) => p.featured);
