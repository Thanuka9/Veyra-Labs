export const ESTIMATE_DISCLAIMER =
  "This is an automated ballpark estimate only  -  not a binding quote or contract. The final amount may differ based on your specific requirements, integrations, scope changes, and complexity identified when you contact Veyra Labs.";

export type ProjectTypeId =
  | "portfolio"
  | "ecommerce"
  | "website"
  | "saas"
  | "ai"
  | "ml"
  | "data"
  | "devops"
  | "security"
  | "mobile"
  | "analytics"
  | "integrations"
  | "performance"
  | "custom";

export type ProjectType = {
  id: ProjectTypeId;
  label: string;
  icon: string;
  description: string;
  baseMin: number;
  baseMax: number;
  timeline: string;
  /** Mirrors the pricing page: core packages vs add-on services */
  category: "core" | "addon";
};

export type ScopeOption = {
  id: string;
  label: string;
  min: number;
  max: number;
  appliesTo: ProjectTypeId[];
  /** When set, only one option in the group can be selected (e.g. catalog size). */
  exclusiveGroup?: string;
};

export type TimelineOption = {
  id: "standard" | "rush";
  label: string;
  multiplier: number;
  note: string;
};

export type EstimateLineItem = {
  label: string;
  min: number;
  max: number;
};

export type ProjectEstimate = {
  id: string;
  createdAt: string;
  projectTypeIds: ProjectTypeId[];
  projectLabel: string;
  lineItems: EstimateLineItem[];
  totalMin: number;
  totalMax: number;
  timeline: string;
  timelineNote: string;
  selectedScope: string[];
  clientName?: string;
  clientEmail?: string;
  clientCompany?: string;
  notes?: string;
};

export const PROJECT_TYPES: ProjectType[] = [
  {
    id: "portfolio",
    label: "Portfolio Website",
    icon: "palette",
    description: "Personal & creative brand site with lead capture",
    baseMin: 500,
    baseMax: 1000,
    timeline: "1-3 weeks",
    category: "core",
  },
  {
    id: "ecommerce",
    label: "E-Commerce Store",
    icon: "cart",
    description: "Catalog, cart, checkout & admin dashboard",
    baseMin: 1000,
    baseMax: 2000,
    timeline: "3-6 weeks",
    category: "core",
  },
  {
    id: "website",
    label: "Premium Website",
    icon: "globe",
    description: "Custom brand site with motion & lead capture",
    baseMin: 1200,
    baseMax: 3500,
    timeline: "2-4 weeks",
    category: "core",
  },
  {
    id: "ai",
    label: "AI & LLM Feature",
    icon: "brain",
    description: "Chatbot, RAG, agents or copilot integration",
    baseMin: 2500,
    baseMax: 12000,
    timeline: "4-10 weeks",
    category: "core",
  },
  {
    id: "saas",
    label: "SaaS Platform",
    icon: "layers",
    description: "Multi-tenant app with auth, billing & admin",
    baseMin: 8000,
    baseMax: 25000,
    timeline: "8-16 weeks",
    category: "core",
  },
  {
    id: "ml",
    label: "ML & Predictive Analytics",
    icon: "chart",
    description: "Forecasting models & interactive ML dashboards",
    baseMin: 4000,
    baseMax: 15000,
    timeline: "6-12 weeks",
    category: "core",
  },
  {
    id: "data",
    label: "Data Science & Engineering",
    icon: "database",
    description: "ETL pipelines, warehousing & analytics",
    baseMin: 3000,
    baseMax: 10000,
    timeline: "4-8 weeks",
    category: "core",
  },
  {
    id: "custom",
    label: "Custom / Mixed Scope",
    icon: "sparkles",
    description: "Multiple deliverables  -  scoped when you contact us",
    baseMin: 2000,
    baseMax: 20000,
    timeline: "Varies",
    category: "core",
  },
  {
    id: "devops",
    label: "Cloud & DevOps",
    icon: "cloud",
    description: "Docker, CI/CD & GCP deployment",
    baseMin: 800,
    baseMax: 4000,
    timeline: "1-3 weeks",
    category: "addon",
  },
  {
    id: "security",
    label: "Security & Compliance",
    icon: "shield",
    description: "2FA, RBAC, audit logs & hardening",
    baseMin: 1500,
    baseMax: 5000,
    timeline: "2-4 weeks",
    category: "addon",
  },
  {
    id: "mobile",
    label: "Mobile-Responsive & PWA",
    icon: "smartphone",
    description: "Cross-device QA & installable PWA setup",
    baseMin: 500,
    baseMax: 1500,
    timeline: "1-2 weeks",
    category: "addon",
  },
  {
    id: "analytics",
    label: "Analytics & BI Dashboards",
    icon: "bar",
    description: "GTM, telemetry, dashboards & funnel analysis",
    baseMin: 1200,
    baseMax: 3000,
    timeline: "1-2 weeks",
    category: "addon",
  },
  {
    id: "integrations",
    label: "Third-Party API Integrations",
    icon: "link",
    description: "CRM sync, payments, webhooks & migrations",
    baseMin: 1000,
    baseMax: 4500,
    timeline: "2-3 weeks",
    category: "addon",
  },
  {
    id: "performance",
    label: "Speed Optimization",
    icon: "gauge",
    description: "Core Web Vitals, caching, CDN & DB tuning",
    baseMin: 600,
    baseMax: 1800,
    timeline: "1-2 weeks",
    category: "addon",
  },
];

export const CORE_PROJECT_TYPES = PROJECT_TYPES.filter((p) => p.category === "core");
export const ADDON_PROJECT_TYPES = PROJECT_TYPES.filter((p) => p.category === "addon");

/**
 * Global rate card (USD) — keep internal scopes aligned with Pricing page packages.
 *
 * Core bases match /pricing tiers.
 * Standalone add-on bases match addon cards ($800–$4k DevOps, $1.5k–$5k Security, etc.).
 * Bundled scopes (when attached to another core) use the same bands so quotes stay fair.
 * $0 / $0 = included in that service’s base package (shown on the quote, no extra charge).
 */
export const SCOPE_OPTIONS: ScopeOption[] = [
  // ── Portfolio Website ($500–$1,000 base) ─────────────────────────────────
  { id: "portfolio-5", label: "Up to 5 sections/pages", min: 0, max: 0, appliesTo: ["portfolio"], exclusiveGroup: "portfolio-pages" },
  { id: "portfolio-media", label: "Optimized media showcase / gallery", min: 0, max: 0, appliesTo: ["portfolio"] },
  { id: "portfolio-contact", label: "Contact / inquiry form", min: 0, max: 0, appliesTo: ["portfolio"] },
  { id: "portfolio-seo", label: "Basic SEO & analytics", min: 0, max: 0, appliesTo: ["portfolio"] },
  { id: "portfolio-mobile", label: "Mobile-responsive build + SSL deploy", min: 0, max: 0, appliesTo: ["portfolio"] },
  { id: "portfolio-extra", label: "6–8 sections/pages", min: 200, max: 450, appliesTo: ["portfolio"], exclusiveGroup: "portfolio-pages" },
  { id: "portfolio-blog", label: "Blog / articles section", min: 250, max: 550, appliesTo: ["portfolio"] },
  { id: "portfolio-cms", label: "Lightweight CMS for content edits", min: 350, max: 700, appliesTo: ["portfolio"] },
  { id: "portfolio-booking", label: "Booking / calendar embed", min: 200, max: 450, appliesTo: ["portfolio"] },

  // ── E-Commerce Starter ($1,000–$2,000 base) ──────────────────────────────
  { id: "ecom-catalog-50", label: "Up to 50 products", min: 0, max: 0, appliesTo: ["ecommerce"], exclusiveGroup: "ecom-catalog" },
  { id: "ecom-cart", label: "Cart & secure checkout", min: 0, max: 0, appliesTo: ["ecommerce"] },
  { id: "ecom-pay-one", label: "One payment gateway (Stripe or PayPal)", min: 0, max: 0, appliesTo: ["ecommerce"] },
  { id: "ecom-admin", label: "Admin order dashboard", min: 0, max: 0, appliesTo: ["ecommerce"] },
  { id: "ecom-seo", label: "SEO setup + SSL deployment", min: 0, max: 0, appliesTo: ["ecommerce"] },
  { id: "ecom-catalog-200", label: "51–200 products", min: 400, max: 850, appliesTo: ["ecommerce"], exclusiveGroup: "ecom-catalog" },
  { id: "ecom-catalog-unlimited", label: "200+ products / variants", min: 900, max: 1_800, appliesTo: ["ecommerce"], exclusiveGroup: "ecom-catalog" },
  { id: "ecom-pay-multi", label: "Multiple payment gateways", min: 300, max: 650, appliesTo: ["ecommerce"] },
  { id: "ecom-discounts", label: "Coupons, discounts & promo codes", min: 250, max: 550, appliesTo: ["ecommerce"] },
  { id: "ecom-inventory", label: "Advanced inventory & variants", min: 350, max: 750, appliesTo: ["ecommerce"] },
  { id: "ecom-ai", label: "AI product discovery / concierge", min: 2_500, max: 6_000, appliesTo: ["ecommerce"] },

  // ── Premium Website ($1,200–$3,500 base) ─────────────────────────────────
  { id: "web-pages-8", label: "Up to 8 pages / sections", min: 0, max: 0, appliesTo: ["website"], exclusiveGroup: "web-pages" },
  { id: "web-design", label: "Custom UI/UX design", min: 0, max: 0, appliesTo: ["website"] },
  { id: "web-lead", label: "Contact & lead capture", min: 0, max: 0, appliesTo: ["website"] },
  { id: "web-analytics", label: "Google Analytics setup", min: 0, max: 0, appliesTo: ["website"] },
  { id: "web-deploy", label: "Deployment + SSL + CWV baseline", min: 0, max: 0, appliesTo: ["website"] },
  { id: "web-pages-12", label: "9–12 pages / sections", min: 900, max: 1_600, appliesTo: ["website"], exclusiveGroup: "web-pages" },
  { id: "web-motion", label: "Premium motion & animations", min: 500, max: 1_200, appliesTo: ["website"] },
  { id: "web-cms", label: "CMS / content management", min: 600, max: 1_400, appliesTo: ["website"] },
  { id: "web-blog", label: "Blog / resources section", min: 400, max: 850, appliesTo: ["website"] },
  { id: "web-i18n", label: "Multi-language (2 locales)", min: 800, max: 1_600, appliesTo: ["website"] },

  // ── AI & LLM ($2,500–$12,000 base) ───────────────────────────────────────
  { id: "ai-architecture", label: "AI architecture & prompt design", min: 0, max: 0, appliesTo: ["ai"] },
  { id: "ai-ui", label: "Chat / copilot UI shell", min: 0, max: 0, appliesTo: ["ai"] },
  { id: "ai-rate-limit", label: "Rate limiting & basic caching", min: 0, max: 0, appliesTo: ["ai"] },
  { id: "ai-docs", label: "Documentation & handoff", min: 0, max: 0, appliesTo: ["ai"] },
  { id: "ai-rag", label: "RAG / document search pipeline", min: 1_500, max: 4_000, appliesTo: ["ai"] },
  { id: "ai-chatbot", label: "Production chatbot (custom trained flow)", min: 2_000, max: 5_500, appliesTo: ["ai"] },
  { id: "ai-agents", label: "Autonomous agents / workflows", min: 3_500, max: 9_000, appliesTo: ["ai"] },
  { id: "ai-local", label: "Local LLM deployment (Ollama / private)", min: 2_000, max: 6_000, appliesTo: ["ai"] },
  { id: "ai-evals", label: "Eval harness & quality monitoring", min: 800, max: 2_000, appliesTo: ["ai"] },

  // ── SaaS Platform ($8,000–$25,000 base) ──────────────────────────────────
  { id: "saas-tenant", label: "Multi-tenant architecture", min: 0, max: 0, appliesTo: ["saas"] },
  { id: "saas-auth", label: "Auth, 2FA & user profiles", min: 0, max: 0, appliesTo: ["saas"] },
  { id: "saas-admin", label: "Admin + user dashboards", min: 0, max: 0, appliesTo: ["saas"] },
  { id: "saas-api", label: "REST/GraphQL API + PostgreSQL", min: 0, max: 0, appliesTo: ["saas"] },
  { id: "saas-deploy", label: "Cloud deploy + CI/CD baseline", min: 0, max: 0, appliesTo: ["saas"] },
  { id: "saas-billing", label: "Stripe subscription billing", min: 2_000, max: 4_500, appliesTo: ["saas"] },
  { id: "saas-rbac", label: "Advanced RBAC & org roles", min: 1_500, max: 3_500, appliesTo: ["saas"] },
  { id: "saas-sso", label: "SSO / SAML enterprise login", min: 1_500, max: 4_000, appliesTo: ["saas"] },
  { id: "saas-audit", label: "Audit logs & activity trail", min: 800, max: 2_000, appliesTo: ["saas"] },
  { id: "saas-whitelabel", label: "White-label / custom branding", min: 2_000, max: 5_000, appliesTo: ["saas"] },

  // ── ML & Predictive Analytics ($4,000–$15,000 base) ──────────────────────
  { id: "ml-audit", label: "Data audit & feature engineering", min: 0, max: 0, appliesTo: ["ml"] },
  { id: "ml-train", label: "Model training & validation report", min: 0, max: 0, appliesTo: ["ml"] },
  { id: "ml-api", label: "API inference endpoint", min: 0, max: 0, appliesTo: ["ml"] },
  { id: "ml-forecast", label: "Predictive / forecasting models", min: 2_000, max: 6_000, appliesTo: ["ml"] },
  { id: "ml-dashboard", label: "Interactive ML dashboard", min: 1_500, max: 4_000, appliesTo: ["ml"] },
  { id: "ml-retrain", label: "Optional retraining pipeline", min: 1_200, max: 3_500, appliesTo: ["ml"] },
  { id: "ml-etl", label: "ETL feed into the model", min: 1_500, max: 4_000, appliesTo: ["ml"] },

  // ── Data Science & Engineering ($3,000–$10,000 base) ─────────────────────
  { id: "data-arch", label: "Pipeline architecture", min: 0, max: 0, appliesTo: ["data"] },
  { id: "data-schema", label: "Database schema design", min: 0, max: 0, appliesTo: ["data"] },
  { id: "data-eda", label: "EDA reports + visualisations", min: 0, max: 0, appliesTo: ["data"] },
  { id: "data-etl", label: "Automated ETL scripts", min: 2_000, max: 5_500, appliesTo: ["data"] },
  { id: "data-nlp", label: "NLP / sentiment analysis", min: 1_500, max: 4_500, appliesTo: ["data"] },
  { id: "data-warehouse", label: "PostgreSQL warehousing", min: 1_000, max: 3_500, appliesTo: ["data"] },
  { id: "data-jobs", label: "Scheduled data jobs", min: 600, max: 1_800, appliesTo: ["data"] },
  { id: "data-export", label: "Export / API access layer", min: 500, max: 1_500, appliesTo: ["data"] },

  // ── Custom / Mixed ───────────────────────────────────────────────────────
  { id: "custom-discovery", label: "Discovery workshop & tech blueprint", min: 0, max: 0, appliesTo: ["custom"] },
  { id: "custom-mvp", label: "MVP slice (narrow first release)", min: 2_000, max: 8_000, appliesTo: ["custom"] },
  { id: "custom-integrations", label: "Cross-system integration layer", min: 1_000, max: 4_500, appliesTo: ["custom"] },

  // ── Cloud & DevOps add-on ($800–$4,000 standalone) ───────────────────────
  { id: "devops-docker", label: "Docker containerisation", min: 0, max: 0, appliesTo: ["devops"] },
  { id: "devops-cicd", label: "CI/CD pipeline configuration", min: 0, max: 0, appliesTo: ["devops"] },
  { id: "devops-env", label: "Environments & secrets management", min: 0, max: 0, appliesTo: ["devops"] },
  { id: "devops-iac", label: "Infrastructure-as-code setup", min: 400, max: 1_200, appliesTo: ["devops"] },
  { id: "devops-monitor", label: "Uptime monitoring & alerts", min: 400, max: 1_200, appliesTo: ["devops"] },
  { id: "devops-harden", label: "Security hardening checklist", min: 300, max: 900, appliesTo: ["devops"] },

  // ── Security add-on ($1,500–$5,000 standalone) ───────────────────────────
  { id: "sec-review", label: "Security architecture review", min: 0, max: 0, appliesTo: ["security"] },
  { id: "sec-auth", label: "Auth & session hardening", min: 0, max: 0, appliesTo: ["security"] },
  { id: "sec-audit-log", label: "Audit log implementation", min: 400, max: 1_200, appliesTo: ["security"] },
  { id: "sec-rbac", label: "RBAC permission matrix", min: 500, max: 1_500, appliesTo: ["security"] },
  { id: "sec-pentest", label: "Pen-test readiness checklist", min: 400, max: 1_200, appliesTo: ["security"] },
  { id: "sec-hipaa", label: "HIPAA-aware patterns", min: 2_000, max: 6_000, appliesTo: ["security", "saas", "ml", "data"] },

  // ── Mobile & PWA add-on ($500–$1,500 standalone) ─────────────────────────
  { id: "mobile-qa", label: "Responsive testing all breakpoints", min: 0, max: 0, appliesTo: ["mobile"] },
  { id: "mobile-touch", label: "Touch & gesture optimisation", min: 0, max: 0, appliesTo: ["mobile"] },
  { id: "mobile-pwa", label: "PWA manifest + service worker", min: 250, max: 700, appliesTo: ["mobile"] },
  { id: "mobile-matrix", label: "Cross-browser device matrix QA", min: 200, max: 500, appliesTo: ["mobile"] },

  // ── Analytics & BI add-on ($1,200–$3,000 standalone) ─────────────────────
  { id: "analytics-plan", label: "Telemetry implementation plan", min: 0, max: 0, appliesTo: ["analytics"] },
  { id: "analytics-gtm", label: "GTM & pixel tracking setup", min: 0, max: 0, appliesTo: ["analytics"] },
  { id: "analytics-verify", label: "Conversion tracking verification", min: 0, max: 0, appliesTo: ["analytics"] },
  { id: "analytics-dashboard", label: "Custom BI / analytics dashboard", min: 600, max: 1_500, appliesTo: ["analytics"] },
  { id: "analytics-funnel", label: "Funnel & user behavior analysis", min: 400, max: 1_000, appliesTo: ["analytics"] },

  // ── Integrations add-on ($1,000–$4,500 standalone) ───────────────────────
  { id: "int-arch", label: "Integration architecture diagram", min: 0, max: 0, appliesTo: ["integrations"] },
  { id: "int-oauth", label: "OAuth 2.0 configuration", min: 0, max: 0, appliesTo: ["integrations"] },
  { id: "int-crm", label: "CRM sync (Salesforce / HubSpot)", min: 600, max: 2_000, appliesTo: ["integrations"] },
  { id: "int-webhooks", label: "Custom webhooks & middleware", min: 400, max: 1_200, appliesTo: ["integrations"] },
  { id: "int-migration", label: "Data / system migration", min: 800, max: 2_500, appliesTo: ["integrations"] },
  { id: "int-accounting", label: "Accounting / inventory sync", min: 700, max: 2_200, appliesTo: ["integrations"] },

  // ── Speed / Performance add-on ($600–$1,800 standalone) ──────────────────
  { id: "perf-report", label: "Before/after speed reports", min: 0, max: 0, appliesTo: ["performance"] },
  { id: "perf-cwv", label: "Core Web Vitals audit & fixes", min: 0, max: 0, appliesTo: ["performance"] },
  { id: "perf-cdn", label: "Edge CDN configuration", min: 300, max: 800, appliesTo: ["performance"] },
  { id: "perf-cache", label: "Redis caching layer", min: 350, max: 900, appliesTo: ["performance"] },
  { id: "perf-db", label: "Database query & index tuning", min: 400, max: 1_000, appliesTo: ["performance"] },
];

export const TIMELINE_OPTIONS: TimelineOption[] = [
  { id: "standard", label: "Standard timeline", multiplier: 1, note: "Recommended pace with sprint demos" },
  { id: "rush", label: "Rush delivery (+15%)", multiplier: 1.15, note: "Accelerated sprints  -  subject to availability" },
];

export function getScopeForType(typeId: ProjectTypeId): ScopeOption[] {
  return SCOPE_OPTIONS.filter((o) => o.appliesTo.includes(typeId));
}

export function getScopeForTypes(typeIds: ProjectTypeId[]): ScopeOption[] {
  const seen = new Set<string>();
  const result: ScopeOption[] = [];
  for (const typeId of typeIds) {
    for (const opt of getScopeForType(typeId)) {
      if (!seen.has(opt.id)) {
        seen.add(opt.id);
        result.push(opt);
      }
    }
  }
  return result;
}

/** Included-in-base options (no extra cost) — pre-checked for a focused service quote. */
export function getIncludedScopeIds(typeIds: ProjectTypeId[]): string[] {
  const options = getScopeForTypes(typeIds).filter((o) => o.min === 0 && o.max === 0);
  const seenGroups = new Set<string>();
  const result: string[] = [];
  for (const opt of options) {
    if (opt.exclusiveGroup) {
      if (seenGroups.has(opt.exclusiveGroup)) continue;
      seenGroups.add(opt.exclusiveGroup);
    }
    result.push(opt.id);
  }
  return result;
}

export function getScopeGroupedByType(typeIds: ProjectTypeId[]): { typeId: ProjectTypeId; label: string; options: ScopeOption[] }[] {
  return typeIds
    .map((typeId) => {
      const project = PROJECT_TYPES.find((p) => p.id === typeId);
      return {
        typeId,
        label: project?.label ?? typeId,
        options: getScopeForType(typeId),
      };
    })
    .filter((g) => g.options.length > 0);
}

export function formatUsd(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatRange(min: number, max: number): string {
  if (min === max) return formatUsd(min);
  return `${formatUsd(min)} - ${formatUsd(max)}`;
}

export function generateEstimateId(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `VL-${y}${m}${day}-${rand}`;
}

function longestTimeline(projects: ProjectType[]): string {
  if (projects.length === 0) return "Varies";
  if (projects.length === 1) return projects[0].timeline;
  const order = ["1-2 weeks", "1-3 weeks", "2-3 weeks", "2-4 weeks", "3-4 weeks", "3-6 weeks", "4-10 weeks", "6-12 weeks", "8-16 weeks", "Varies"];
  let best = projects[0].timeline;
  for (const p of projects) {
    if (order.indexOf(p.timeline) > order.indexOf(best)) best = p.timeline;
  }
  return projects.length > 1 ? `${best} (combined scope)` : best;
}

export function buildEstimate(input: {
  projectTypeIds: ProjectTypeId[];
  selectedScopeIds: string[];
  timelineId: "standard" | "rush";
  clientName?: string;
  clientEmail?: string;
  clientCompany?: string;
  notes?: string;
  /** Server-assigned ID when tracked via /api/estimates */
  id?: string;
  createdAt?: string;
}): ProjectEstimate {
  const projects = input.projectTypeIds
    .map((id) => PROJECT_TYPES.find((p) => p.id === id))
    .filter(Boolean) as ProjectType[];

  if (projects.length === 0) {
    throw new Error("At least one service must be selected.");
  }

  const timeline = TIMELINE_OPTIONS.find((t) => t.id === input.timelineId)!;
  const lineItems: EstimateLineItem[] = [];

  for (const project of projects) {
    lineItems.push({
      label: `${project.label}  -  base package`,
      min: project.baseMin,
      max: project.baseMax,
    });
  }

  for (const scopeId of input.selectedScopeIds) {
    const opt = SCOPE_OPTIONS.find((o) => o.id === scopeId);
    if (!opt) continue;
    if (!opt.appliesTo.some((t) => input.projectTypeIds.includes(t))) continue;
    lineItems.push({ label: opt.label, min: opt.min, max: opt.max });
  }

  const rawMin = lineItems.reduce((s, i) => s + i.min, 0);
  const rawMax = lineItems.reduce((s, i) => s + i.max, 0);
  const totalMin = Math.round(rawMin * timeline.multiplier);
  const totalMax = Math.round(rawMax * timeline.multiplier);

  const scopeLabels = input.selectedScopeIds
    .map((id) => SCOPE_OPTIONS.find((o) => o.id === id)?.label)
    .filter(Boolean) as string[];

  const projectLabel =
    projects.length === 1 ? projects[0].label : projects.map((p) => p.label).join(" + ");

  return {
    id: input.id ?? generateEstimateId(),
    createdAt: input.createdAt ?? new Date().toISOString(),
    projectTypeIds: input.projectTypeIds,
    projectLabel,
    lineItems,
    totalMin,
    totalMax,
    timeline: longestTimeline(projects),
    timelineNote: timeline.note,
    selectedScope: scopeLabels,
    clientName: input.clientName,
    clientEmail: input.clientEmail,
    clientCompany: input.clientCompany,
    notes: input.notes,
  };
}

/** Preview totals while user is still in the wizard. */
export function previewEstimateTotals(input: {
  projectTypeIds: ProjectTypeId[];
  selectedScopeIds: string[];
  timelineId: "standard" | "rush";
}): { min: number; max: number } | null {
  if (input.projectTypeIds.length === 0) return null;
  try {
    const est = buildEstimate({ ...input });
    return { min: est.totalMin, max: est.totalMax };
  } catch {
    return null;
  }
}
