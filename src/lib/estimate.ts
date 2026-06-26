export const ESTIMATE_DISCLAIMER =
  "This is an automated ballpark estimate only — not a binding quote or contract. The final amount may differ based on your specific requirements, integrations, scope changes, and complexity identified during a free discovery call with Veyra Labs.";

export type ProjectTypeId =
  | "ecommerce"
  | "website"
  | "saas"
  | "ai"
  | "ml"
  | "data"
  | "devops"
  | "security"
  | "mobile"
  | "custom";

export type ProjectType = {
  id: ProjectTypeId;
  label: string;
  icon: string;
  description: string;
  baseMin: number;
  baseMax: number;
  timeline: string;
};

export type ScopeOption = {
  id: string;
  label: string;
  min: number;
  max: number;
  appliesTo: ProjectTypeId[];
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
  notes?: string;
};

export const PROJECT_TYPES: ProjectType[] = [
  {
    id: "ecommerce",
    label: "E-Commerce Store",
    icon: "cart",
    description: "Catalog, cart, checkout & admin dashboard",
    baseMin: 1500,
    baseMax: 2000,
    timeline: "3–6 weeks",
  },
  {
    id: "website",
    label: "Premium Website",
    icon: "globe",
    description: "Brand, portfolio or marketing site with lead capture",
    baseMin: 1200,
    baseMax: 3500,
    timeline: "2–4 weeks",
  },
  {
    id: "saas",
    label: "SaaS Platform",
    icon: "layers",
    description: "Multi-tenant app with auth, billing & admin",
    baseMin: 8000,
    baseMax: 25000,
    timeline: "8–16 weeks",
  },
  {
    id: "ai",
    label: "AI & LLM Feature",
    icon: "brain",
    description: "Chatbot, RAG, agents or copilot integration",
    baseMin: 2500,
    baseMax: 12000,
    timeline: "4–10 weeks",
  },
  {
    id: "ml",
    label: "ML & Predictive Analytics",
    icon: "chart",
    description: "Forecasting models & interactive ML dashboards",
    baseMin: 4000,
    baseMax: 15000,
    timeline: "6–12 weeks",
  },
  {
    id: "data",
    label: "Data Science & Engineering",
    icon: "database",
    description: "ETL pipelines, warehousing & analytics",
    baseMin: 3000,
    baseMax: 10000,
    timeline: "4–8 weeks",
  },
  {
    id: "devops",
    label: "Cloud & DevOps",
    icon: "cloud",
    description: "Docker, CI/CD & GCP deployment",
    baseMin: 800,
    baseMax: 4000,
    timeline: "1–3 weeks",
  },
  {
    id: "security",
    label: "Security & Compliance",
    icon: "shield",
    description: "2FA, RBAC, audit logs & hardening",
    baseMin: 1500,
    baseMax: 5000,
    timeline: "2–4 weeks",
  },
  {
    id: "mobile",
    label: "Mobile / PWA",
    icon: "smartphone",
    description: "Mobile-first UI & PWA wrapper",
    baseMin: 500,
    baseMax: 1500,
    timeline: "1–2 weeks",
  },
  {
    id: "custom",
    label: "Custom / Mixed Scope",
    icon: "sparkles",
    description: "Multiple deliverables — scoped on discovery call",
    baseMin: 2000,
    baseMax: 20000,
    timeline: "Varies",
  },
];

export const SCOPE_OPTIONS: ScopeOption[] = [
  { id: "catalog-50", label: "Up to 50 products", min: 0, max: 0, appliesTo: ["ecommerce"] },
  { id: "catalog-200", label: "51–200 products", min: 400, max: 800, appliesTo: ["ecommerce"] },
  { id: "catalog-unlimited", label: "200+ products / variants", min: 900, max: 1800, appliesTo: ["ecommerce"] },
  { id: "payments-multi", label: "Multiple payment gateways", min: 300, max: 600, appliesTo: ["ecommerce"] },
  { id: "ai-commerce", label: "AI product discovery / concierge", min: 2500, max: 6000, appliesTo: ["ecommerce"] },
  { id: "pages-5", label: "Up to 5 pages / sections", min: 0, max: 0, appliesTo: ["website"] },
  { id: "pages-8", label: "6–8 pages / sections", min: 400, max: 800, appliesTo: ["website"] },
  { id: "pages-12", label: "9–12 pages / sections", min: 900, max: 1500, appliesTo: ["website"] },
  { id: "motion-premium", label: "Premium motion & animations", min: 500, max: 1200, appliesTo: ["website"] },
  { id: "cms", label: "CMS / content management", min: 600, max: 1400, appliesTo: ["website"] },
  { id: "auth-basic", label: "User auth & profiles", min: 1500, max: 3500, appliesTo: ["saas"] },
  { id: "billing", label: "Stripe subscription billing", min: 2000, max: 4500, appliesTo: ["saas"] },
  { id: "rbac", label: "RBAC & multi-tenant", min: 2500, max: 6000, appliesTo: ["saas"] },
  { id: "admin", label: "Admin dashboard & analytics", min: 2000, max: 5000, appliesTo: ["saas"] },
  { id: "rag", label: "RAG / document search", min: 1500, max: 4000, appliesTo: ["ai"] },
  { id: "chatbot", label: "Custom chatbot (like this one)", min: 2000, max: 5500, appliesTo: ["ai"] },
  { id: "agents", label: "Autonomous agents / workflows", min: 3500, max: 9000, appliesTo: ["ai"] },
  { id: "local-llm", label: "Local LLM deployment", min: 2000, max: 6000, appliesTo: ["ai"] },
  { id: "forecast", label: "Predictive / forecasting models", min: 2000, max: 6000, appliesTo: ["ml"] },
  { id: "dashboard", label: "Interactive ML dashboard", min: 1500, max: 4000, appliesTo: ["ml"] },
  { id: "etl", label: "ETL / data pipeline", min: 2000, max: 5500, appliesTo: ["data", "ml"] },
  { id: "nlp", label: "NLP / sentiment analysis", min: 1500, max: 4500, appliesTo: ["data"] },
  { id: "warehouse", label: "PostgreSQL warehousing", min: 1000, max: 3500, appliesTo: ["data"] },
  { id: "pwa", label: "PWA / mobile app wrapper", min: 500, max: 1500, appliesTo: ["ecommerce", "website", "saas", "mobile"] },
  { id: "devops-setup", label: "Full cloud & CI/CD setup", min: 800, max: 4000, appliesTo: ["devops", "saas", "custom", "ml"] },
  { id: "monitoring", label: "Monitoring, logs & alerts", min: 600, max: 2000, appliesTo: ["devops", "saas"] },
  { id: "security-audit", label: "Security audit & hardening", min: 1500, max: 5000, appliesTo: ["security", "saas", "custom"] },
  { id: "compliance-hipaa", label: "HIPAA-aware patterns", min: 2000, max: 6000, appliesTo: ["security", "saas"] },
  { id: "responsive-qa", label: "Cross-device responsive QA", min: 400, max: 900, appliesTo: ["mobile", "website", "ecommerce"] },
];

export const TIMELINE_OPTIONS: TimelineOption[] = [
  { id: "standard", label: "Standard timeline", multiplier: 1, note: "Recommended pace with sprint demos" },
  { id: "rush", label: "Rush delivery (+15%)", multiplier: 1.15, note: "Accelerated sprints — subject to availability" },
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
  return `${formatUsd(min)} – ${formatUsd(max)}`;
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
  const order = ["1–2 weeks", "1–3 weeks", "2–4 weeks", "3–4 weeks", "3–6 weeks", "4–10 weeks", "6–12 weeks", "8–16 weeks", "Varies"];
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
  notes?: string;
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
      label: `${project.label} — base package`,
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
    id: generateEstimateId(),
    createdAt: new Date().toISOString(),
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
