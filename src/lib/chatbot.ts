import { CONTACT_EMAIL, coreServices, pricingTiers, process, services } from "./content";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  estimateId?: string;
};

export type QuickReply = {
  id: string;
  label: string;
  message: string;
  icon?: "services" | "pricing" | "cart" | "process" | "brain" | "portfolio" | "contact" | "estimate" | "about";
};

export const CHAT_QUICK_REPLIES: QuickReply[] = [
  { id: "estimate", label: "Get estimate", message: "I want a project estimate", icon: "estimate" },
  { id: "about", label: "About Veyra", message: "What is Veyra Labs?", icon: "about" },
  { id: "services", label: "Services", message: "What services does Veyra Labs offer?", icon: "services" },
  { id: "pricing", label: "Pricing", message: "What are your prices?", icon: "pricing" },
  { id: "ecommerce", label: "E-commerce", message: "Tell me about e-commerce pricing", icon: "cart" },
  { id: "process", label: "Process", message: "What is your process?", icon: "process" },
  { id: "ai", label: "AI & chatbots", message: "Can you build AI features and chatbots?", icon: "brain" },
  { id: "portfolio", label: "Case studies", message: "Show me your work", icon: "portfolio" },
  { id: "contact", label: "Contact Us", message: "I want to contact Veyra Labs", icon: "contact" },
];

const WELCOME = `Hi! 👋 I'm **Veyra**, your Veyra Labs assistant.

Ask me anything about **who we are**, **what we build**, **pricing**, or **how we work**.

I can help with:

• **About Veyra**  -  our story, team & why clients choose us
• **Services**  -  SaaS, e-commerce, AI, websites & more
• **Pricing**  -  starting ranges in USD
• **Project estimates**  -  multi-service quote + PDF download
• **Case studies**  -  live projects you can visit
• **Contact**  -  reach us at **${CONTACT_EMAIL}**

Tap **Get estimate** below for a ballpark quote in under a minute.`;

/** Normalise common misspellings of “Veyra” */
function normalizeChatInput(text: string): string {
  return text.replace(/\b(verra|veira|vyra|veyraa)\b/gi, "veyra");
}

function formatAboutVeyra(): string {
  return `**Veyra Labs** is a boutique **software & AI engineering studio**  -  remote-first, serving clients worldwide.

We design, build and deploy intelligent products:

• **SaaS platforms**  -  multi-tenant, auth, billing & admin ($8k-$25k+)
• **E-commerce**  -  catalog, cart, checkout & admin ($1k-$2k)
• **Portfolio websites**  -  personal & creative brands ($500-$1k)
• **Premium websites**  -  brand sites with motion & lead capture ($1.2k-$3.5k)
• **AI & LLM**  -  chatbots, RAG, agents & copilots ($2.5k-$12k+)
• **ML & analytics**  -  forecasting models & dashboards ($4k-$15k+)
• **Data engineering**  -  ETL, warehousing & NLP ($3k-$10k+)

**Add-ons:** Cloud/DevOps, security & compliance, mobile/PWA, analytics & BI dashboards, API integrations and speed optimization  -  standalone or bundled with any project.

**Our belief:** great software companies don't just write code  -  they **engineer outcomes**. We combine product thinking, full-stack engineering and applied AI so you launch faster and operate smarter.

**In production:** TrainIQ (enterprise LMS), RevOps AI (90%+ forecast accuracy), and live demos on this site.

Ask about **pricing**, **our process**, or say **"contact us"** to reach the team at **${CONTACT_EMAIL}**.`;
}

function formatVeyraStory(): string {
  return `**The Veyra Labs story**

We started with a simple idea: businesses deserve more than a generic dev shop or a pretty landing page  -  they need a **partner who ships real software** with **measurable outcomes**.

Veyra Labs is a **boutique, in-house team** covering design, frontend, backend, AI, data and cloud. No outsourcing hand-offs, no agency overhead  -  one team from architecture to deployment.

**Milestones we've shipped:**
• **TrainIQ**  -  enterprise LMS for Collective RCM with 4 AI modules → **40% less** manual audit overhead
• **RevOps AI**  -  predictive forecasting at **90%+ accuracy** (R² > 0.90)
• **15+ projects**  -  SaaS, AI tools, e-commerce & premium brand sites live in production

We're **remote-first**, async-friendly, and treat every engagement like a product partnership.

Want to know **how we work**? Ask about our **process** or tap **Get estimate** for a tailored quote.`;
}

function formatWhyVeyra(): string {
  return `**Why clients choose Veyra Labs**

🚀 **Ship fast, ship right**  -  working demos every sprint, not endless prototypes.

🛡️ **Enterprise-grade from day one**  -  auth, RBAC, audit logs, testing & observability built in.

👥 **One team, full stack**  -  frontend, backend, AI, data & cloud under one roof.

**Proven outcomes:**
• **R² > 0.90** accuracy on billing datasets
• **40%** reduction in manual audit overhead
• **15+** production projects delivered

Every build includes **30-day post-launch support**. Reach us anytime at **${CONTACT_EMAIL}**.

What next  -  **pricing**, **case studies**, or **contact us**?`;
}

function formatFaq(): string {
  return `**Common questions**

**What is Veyra Labs?**
A boutique software & AI studio  -  we build SaaS, e-commerce, websites & AI features.

**Do you work with startups?**
Yes  -  from MVPs to enterprise. Portfolio sites from **$500**, e-commerce from **$1,000**, SaaS from **$8,000**.

**Where are you based?**
Remote-first, worldwide. We're headquartered in **Colombo, Sri Lanka**  -  async-friendly with email, video calls & sprint demos.

**How do I get a quote?**
Tap **Get estimate** for an instant ballpark + PDF, or **contact us** at **${CONTACT_EMAIL}** for a fixed scope quote.

**What's included?**
Every project: clean handoff docs, deployment, and **30-day post-launch support**.

**Who am I talking to?**
I'm **Veyra**, the site assistant. For a human conversation, say **"contact us"** or email **${CONTACT_EMAIL}**.

Ask anything else  -  **services**, **pricing**, **process**, or **case studies**.`;
}

function formatPricing(): string {
  return pricingTiers
    .map(
      (t) =>
        `**${t.name}**  -  ${t.price}\n${t.description}\n\nIncludes: ${t.features.slice(0, 4).join(" · ")}`
    )
    .join("\n\n");
}

function formatServices(): string {
  return coreServices
    .map(
      (s) =>
        `• **${s.title}**  -  ${s.priceFrom}${s.priceTo ? ` - ${s.priceTo}` : ""} · ${s.timeline}\n  _${s.description}_`
    )
    .join("\n\n");
}

function formatAddons(): string {
  return services
    .filter((s) => s.category === "addon")
    .map((s) => `• **${s.title}**  -  ${s.priceFrom} - ${s.priceTo} · ${s.timeline}`)
    .join("\n");
}

function formatProcess(): string {
  return process
    .map((p) => `**${p.no}. ${p.title}** (${p.duration})\n${p.clientGets}`)
    .join("\n\n");
}

type Intent = {
  patterns: RegExp[];
  reply: string | (() => string);
};

const INTENTS: Intent[] = [
  {
    patterns: [/^(hi|hello|hey|yo|good morning|good afternoon|good evening|sup)\b/i, /^help$/i],
    reply: WELCOME,
  },
  {
    patterns: [
      /^who are you\??$/i,
      /^what are you\??$/i,
      /are you (a )?(real )?(bot|ai|assistant|chatbot)/i,
      /who am i talking to/i,
      /talking to (a )?(human|person|bot|ai)/i,
    ],
    reply: () =>
      `I'm **Veyra**  -  the AI assistant for **Veyra Labs**, built to answer questions about our studio, services, pricing and projects.

**Veyra Labs** is a boutique software & AI engineering team (remote-first, worldwide). To speak with a human, say **"contact us"** or email **${CONTACT_EMAIL}**.`,
  },
  {
    patterns: [
      /what (is|'s) (veyra|veyra labs)(\s+labs?)?(\s+about)?\??/i,
      /who (is|are) (veyra|veyra labs)(\s+labs?)?\??/i,
      /tell me about (veyra|veyra labs)(\s+labs?)?/i,
      /^about (veyra|veyra labs)(\s+labs?)?\??$/i,
      /explain (veyra|veyra labs)(\s+labs?)?/i,
      /what do(es)? (veyra|veyra labs)(\s+labs?)? do/i,
      /what (is|'s) (veyra|veyra labs)(\s+labs?)? (company|studio|agency)/i,
      /describe (veyra|veyra labs)(\s+labs?)?/i,
    ],
    reply: () => formatAboutVeyra(),
  },
  {
    patterns: [
      /(veyra|your|the) (story|history|background|mission|origin)/i,
      /tell me (your|the) story/i,
      /how did (veyra|you|veyra labs) (start|begin|get started)/i,
      /when (was|did) (veyra|veyra labs) (start|founded|begin)/i,
      /why (did you )?(start|create|found|launch) veyra/i,
      /who (founded|started|created) (veyra|veyra labs)/i,
    ],
    reply: () => formatVeyraStory(),
  },
  {
    patterns: [
      /why (veyra|choose you|hire you|work with you|pick you|use veyra)/i,
      /why (should i|would i) (choose|hire|work with|pick) (you|veyra)/i,
      /what makes (you|veyra|veyra labs) (different|special|unique|better)/i,
      /what('s| is) (so )?special about (veyra|you|veyra labs)/i,
      /why veyra labs/i,
    ],
    reply: () => formatWhyVeyra(),
  },
  {
    patterns: [
      /\bfaq\b/i,
      /frequently asked/i,
      /common questions?/i,
      /questions? people ask/i,
    ],
    reply: () => formatFaq(),
  },
  {
    patterns: [
      /do you work with (startups?|small business|enterprises?|smbs?)/i,
      /minimum (project|budget|engagement)/i,
      /how (do|can) i (get started|start a project|hire you)/i,
      /payment terms|do you sign ndas?|sign an nda/i,
    ],
    reply: () =>
      `**Getting started with Veyra Labs**

• **Startups & SMBs**  -  yes! Portfolio from **$500**, e-commerce from **$1,000**, websites from **$1,200**, AI features from **$2,500**
• **Enterprise**  -  we've shipped multi-tenant SaaS & LMS platforms (e.g. TrainIQ)
• **Minimum engagement**  -  typically from **$500** depending on scope
• **NDAs**  -  happy to sign before sharing sensitive details
• **Payment**  -  milestone-based (deposit + sprint payments); exact terms when you contact us

**Next step:** [Contact Us](/contact) or email **${CONTACT_EMAIL}**  -  or tap **Get estimate** for a ballpark quote.`,
  },
  // --- Specific add-on services (checked before broader tier/pricing intents) ---
  {
    patterns: [/devops|ci\/cd|docker|cloud deploy|infrastructure/i],
    reply: () => {
      const svc = services.find((s) => s.id === "devops")!;
      return `**${svc.title}  -  ${svc.priceFrom} - ${svc.priceTo}**\n\n${svc.description}\n\n**Includes:** ${svc.deliverables.slice(0, 4).join(" · ")}.\n\n**Timeline:** ${svc.timeline} · Available standalone or bundled with any build.`;
    },
  },
  {
    patterns: [/security|compliance|hipaa|audit log|2fa/i],
    reply: () => {
      const svc = services.find((s) => s.id === "security")!;
      return `**${svc.title}  -  ${svc.priceFrom} - ${svc.priceTo}**\n\n${svc.description}\n\n**Includes:** ${svc.deliverables.slice(0, 4).join(" · ")}.\n\n**Timeline:** ${svc.timeline}.`;
    },
  },
  {
    patterns: [/analytics dashboard|bi dashboard|business intelligence|google tag manager|\bgtm\b|pixel tracking|funnel|user behavior|telemetry|analytics setup|analytics & bi|analytics and bi/i],
    reply: () => {
      const svc = services.find((s) => s.id === "analytics")!;
      return `**${svc.title}  -  ${svc.priceFrom} - ${svc.priceTo}**\n\n${svc.description}\n\n**Includes:** ${svc.deliverables.join(" · ")}.\n\n**Timeline:** ${svc.timeline} · Available standalone or bundled with any build.\n\nYou can [click here to view all services](/services).`;
    },
  },
  {
    patterns: [/api integration|third.?party|crm sync|salesforce|hubspot|webhook|zapier|connect (my|our|the) (crm|tools|systems)|system migration|integrate (with|my|our)/i],
    reply: () => {
      const svc = services.find((s) => s.id === "integrations")!;
      return `**${svc.title}  -  ${svc.priceFrom} - ${svc.priceTo}**\n\n${svc.description}\n\n**Includes:** ${svc.deliverables.join(" · ")}.\n\n**Timeline:** ${svc.timeline} · Scoped per API.\n\nYou can [click here to view all services](/services).`;
    },
  },
  {
    patterns: [/speed optimi|performance optimi|core web vitals|page speed|site (is )?slow|slow (site|website|load)|load(ing)? time|lighthouse|caching|cdn/i],
    reply: () => {
      const svc = services.find((s) => s.id === "performance")!;
      return `**${svc.title}  -  ${svc.priceFrom} - ${svc.priceTo}**\n\n${svc.description}\n\n**Includes:** ${svc.deliverables.join(" · ")}.\n\n**Timeline:** ${svc.timeline} · Before/after speed reports included.\n\nYou can [click here to view all services](/services).`;
    },
  },
  {
    patterns: [/\bpwa\b|progressive web app|mobile.?(responsive|first|friendly|app)|installable|home.?screen|cross.?device/i],
    reply: () => {
      const svc = services.find((s) => s.id === "mobile")!;
      return `**${svc.title}  -  ${svc.priceFrom} - ${svc.priceTo}**\n\n${svc.description}\n\nMobile-first is **default on every Veyra build**  -  this add-on adds deep cross-device QA and an installable PWA setup.\n\n**Includes:** ${svc.deliverables.slice(0, 4).join(" · ")}.\n\n**Timeline:** ${svc.timeline}.`;
    },
  },
  // --- Core package tiers ---
  {
    patterns: [/e-?commerce|online store|shop|storefront|shopify|woocommerce|sell online/i],
    reply: () => {
      const tier = pricingTiers.find((t) => t.name.includes("E-Commerce"))!;
      return `**E-Commerce Starter  -  ${tier.price}**\n\n${tier.description}\n\n**What's included:**\n${tier.features.map((f) => `• ${f}`).join("\n")}\n\nStarter stores ship in **3-6 weeks**. Need AI product discovery or a larger catalog? Contact us at **${CONTACT_EMAIL}** and we'll scope it.\n\nYou can also [click here to view our e-commerce details](/pricing).`;
    },
  },
  {
    patterns: [/website|portfolio|landing page|marketing site|brand site|personal brand/i],
    reply: () => {
      const portTier = pricingTiers.find((t) => t.name.includes("Portfolio Website"))!;
      const premTier = pricingTiers.find((t) => t.name.includes("Premium Website"))!;
      return `**Portfolio Website  -  ${portTier.price}**\n\n${portTier.description}\n\n**Premium Website  -  ${premTier.price}**\n\n${premTier.description}\n\nSee our live example: [thanukaellepola.com](https://thanukaellepola.com/en)  -  built by Veyra Labs.\n\nYou can [click here to view pricing details](/pricing) or [click here to view our work portfolio](/work).`;
    },
  },
  {
    patterns: [/saas|multi-tenant|platform|subscription|b2b|enterprise app/i],
    reply: () => {
      const tier = pricingTiers.find((t) => t.name.includes("SaaS"))!;
      return `**SaaS Platform  -  ${tier.price}**\n\n${tier.description}\n\nWe ship auth, RBAC, billing, admin dashboards and GCP deployment. Flagship example: **TrainIQ**  -  enterprise LMS with 4 AI modules (40% audit overhead reduction).\n\n**Timeline:** 8-16 weeks · **Contact us for a free scope review.**\n\nYou can [click here to view all case studies](/work).`;
    },
  },
  {
    patterns: [
      /\b(ml|machine learning|predictive analytics|forecasting model|forecast model|analytics model|r²|regression model)\b/i,
    ],
    reply: () => {
      const tier = pricingTiers.find((t) => t.name.includes("ML"))!;
      const svc = coreServices.find((s) => s.id === "ml")!;
      return `**${tier.name}  -  ${tier.price}**\n\n${tier.description}\n\n**Deliverables:** ${svc.deliverables.slice(0, 4).join(" · ")}.\n\n**Timeline:** ${svc.timeline} · Flagship outcome: **90%+** forecast accuracy (RevOps AI).\n\nYou can [click here to view all services](/services).`;
    },
  },
  {
    patterns: [
      /\b(data pipeline|data engineer|etl|warehousing|data science|nlp|sentiment)\b/i,
    ],
    reply: () => {
      const tier = pricingTiers.find((t) => t.name.includes("Data Science"))!;
      const svc = coreServices.find((s) => s.id === "data")!;
      return `**${tier.name}  -  ${tier.price}**\n\n${tier.description}\n\n**Deliverables:** ${svc.deliverables.slice(0, 4).join(" · ")}.\n\n**Timeline:** ${svc.timeline}.\n\nYou can [click here to view all services](/services).`;
    },
  },
  {
    patterns: [
      /\b(ai|llm|chatbot|rag|agent|gpt|copilot|local llm)\b/i,
    ],
    reply: () => {
      const tier = pricingTiers.find((t) => t.name.includes("AI"))!;
      return `**${tier.name}  -  ${tier.price}**\n\n${tier.description}\n\n**Includes:**\n${tier.features.map((f) => `• ${f}`).join("\n")}\n\nWe build production chatbots (like me!), RAG search and autonomous agents.\n\nYou can [click here to view our case studies](/work).`;
    },
  },
  // --- Generic pricing (after specific tiers so targeted questions win) ---
  {
    patterns: [
      /price|pricing|cost|how much|budget|quote|rate|fee|afford|expensive|cheap|\$\d/i,
    ],
    reply: () =>
      `Here are our **standard starting ranges** (USD, fixed quote after you contact us):\n\n${formatPricing()}\n\n**Add-ons** (standalone or bundled):\n${formatAddons()}\n\nYou can [click here to view our full pricing details](/pricing).\n\nEvery project includes sprint demos and **30-day post-launch support**.\n\nWant a tailored range? [Get a quote](/quote) for an instant ballpark with a tracked estimate ID, or tap **Get estimate** in chat.`,
  },
  {
    patterns: [/service|what do you (do|build|offer)|capabilit|special/i],
    reply: () =>
      `Veyra Labs is a **software & AI engineering studio**. Our **core services**:\n\n${formatServices()}\n\n**Add-ons** (standalone or bundled):\n${formatAddons()}\n\nEvery core project includes sprint demos and **30-day post-launch support**.\n\nYou can [click here to view all services and capabilities](/services).`,
  },
  {
    patterns: [/your process|how (do you|does veyra) work|delivery process|methodology|project steps|what happens after/i],
    reply: () =>
      `Our **4-phase process**:\n\n${formatProcess()}\n\nYou always see working software every sprint  -  never a big reveal at the end.\n\nYou can [click here to read more about our delivery process](/process).`,
  },
  {
    patterns: [/project timeline|how long (does|will)|delivery time|turnaround|weeks to (build|deliver|ship)/i],
    reply: () =>
      `Typical timelines by project type:\n\n• **Portfolio Website:** 1-3 weeks\n• **Premium Website:** 2-4 weeks\n• **E-Commerce:** 3-6 weeks\n• **AI & LLM:** 4-10 weeks\n• **SaaS Platform:** 8-16 weeks\n• **ML & Analytics:** 6-12 weeks\n• **Data Engineering:** 4-8 weeks\n\n**Add-ons** (DevOps, security, PWA, analytics, integrations, speed optimization) typically add **1-3 weeks** each.\n\nExact timeline depends on scope  -  tap **Get estimate** for a tailored range.`,
  },
  {
    patterns: [/tech stack|technology stack|what tech|next\.?js|react|python|gcp|vercel|langchain/i],
    reply:
      "Our production stack includes **Next.js 16**, **React 19**, **TypeScript**, **FastAPI/Flask**, **PostgreSQL**, **MongoDB**, **LangChain**, **FAISS**, **Docker**, **Google Cloud Run**, and **Vercel**. Every tool has shipped in a live client project.",
  },
  {
    patterns: [
      /case stud|portfolio|your work|projects you|show me (your|the) (work|projects|portfolio)|live demo|flagship|examples of (your )?work|what have you built|client work/i,
    ],
    reply:
      "**Live projects you can visit today:**\n\n• [thanukaellepola.com](https://thanukaellepola.com/en)  -  Premium brand website\n• [CodeX](https://codex-705252260340.us-west1.run.app/)  -  Architecture AI\n• [TechForge AI](https://careerforge-ai-3-0-1030331335046.us-west1.run.app/)  -  Career platform\n\n**Enterprise:** TrainIQ (LMS + 4 AI modules), Kapruka Flow (AI commerce), RevOps AI (90%+ forecast accuracy).\n\nScroll to **Case Studies** on this page for screenshots.",
  },
  {
    patterns: [
      /contact|email|call|book a|book discovery|meet|discover|reach out|talk to (the )?team|human|speak to|get started|hire (you|veyra)|work with you|contact us/i,
    ],
    reply: () =>
      `Let's connect! 🚀\n\n**Contact Us**  -  no pitch, just clarity on scope, timeline and a fixed quote.\n\n📧 **${CONTACT_EMAIL}**\n\nOr use the **Contact** section on this page. I can also collect your details here  -  just say **"send my info"** or tap **Contact Us** below.`,
  },
  {
    patterns: [/support|maintenance|after launch|post-?launch|warranty/i],
    reply:
      "Every Veyra Labs project includes **30-day post-launch support**  -  bug fixes, deployment help and handoff training. Ongoing maintenance retainers are available from **$500/mo** depending on scope.",
  },
  {
    patterns: [/where are you|where is veyra|your location|based in|office|remote.?first|serve clients|worldwide|sri lanka|timezone/i],
    reply:
      "We're **remote-first** and serve clients worldwide. Communication via email, Slack and video calls  -  async-friendly with sprint demos every 1-2 weeks.\n\n📧 **${CONTACT_EMAIL}**",
  },
  {
    patterns: [/trainiq|collective rcm|lms|training/i],
    reply:
      "**TrainIQ** is our flagship enterprise LMS for Collective RCM  -  multi-tenant, RBAC, 2FA, level-based exams, and **4 AI modules** (LearnIQ, AnalyticsIQ, ProctorIQ, CreatorIQ). Result: **40% reduction** in manual audit overhead.",
  },
  {
    patterns: [/thank|thanks|cheers|awesome|great|perfect|cool/i],
    reply:
      "You're welcome! If you have more questions, just ask  -  or contact us at **${CONTACT_EMAIL}** whenever you're ready. 🙌",
  },
  {
    patterns: [/bye|goodbye|see you|later/i],
    reply: "Goodbye! Best of luck with your project  -  we're here when you need us. 👋",
  },
];

const OFF_TOPIC_REPLY = `I'm **Veyra**, the Veyra Labs assistant  -  I help with **who we are**, **our story**, **services**, **pricing**, **estimates**, **case studies**, and **contact**.

For anything else, email **${CONTACT_EMAIL}**.

Try asking:
• "What is Veyra Labs?"
• "Tell me your story"
• "How much for an e-commerce store?"`;

const FALLBACK =
  "I can help with **about Veyra Labs**, **our story**, **services**, **pricing**, **estimates**, **case studies**, or **contact**. Try: \"What is Veyra?\" or \"What are your prices?\"";

/** Keywords that indicate the user is asking about Veyra Labs / our work */
const ON_TOPIC_SIGNALS =
  /\b(veyra|verra|veira|vyra|about|story|mission|founder|team|faq|estimate|quote|pricing|price|cost|budget|website|e-?commerce|storefront|online store|shop|saas|platform|software|develop|build|hire|agency|studio|project|discovery|contact|service|deliver|trainiq|codex|kapruka|techforge|case stud|portfolio|chatbot|llm|ai feature|machine learning|data science|next\.?js|react|flask|python|gcp|docker|devops|timeline|process|sprint|support|maintenance|launch|pdf|package|tier|landing page|brand site|multi-tenant|rbac|stripe|deploy|how much|how long|book a call|contact us|get started|revops|collective rcm|why choose|who are you|what are you|startup|nda|remote|analytics|integration|webhook|crm|salesforce|hubspot|pwa|mobile|responsive|speed|performance|web vitals|caching|cdn|seo|security|compliance|hipaa)\b/i;

/** Clearly unrelated topics  -  declined even if phrasing is vague */
const OFF_TOPIC_PATTERNS: RegExp[] = [
  /\b(weather|forecast|temperature|rain|snow|humidity|climate)\b/i,
  /\b(football|soccer|cricket|basketball|nba|nfl|world cup|premier league)\b/i,
  /\b(politics|election|president|congress|parliament|democrat|republican)\b/i,
  /\b(recipe|cook|ingredient|bake|calories|restaurant recommendation)\b/i,
  /\b(homework|solve this|math problem|equation|algebra|calculus|geometry)\b/i,
  /\b(capital of|country flag|geography trivia|history of the world)\b/i,
  /\b(tell me a joke|write me a (poem|story|essay|song)|riddle)\b/i,
  /\b(medical|diagnos|symptom|doctor|prescri|disease|treatment)\b/i,
  /\b(stock price|bitcoin price|crypto price|ethereum price|invest in)\b/i,
  /\b(movie|netflix|spotify|song lyrics|celebrity gossip)\b/i,
  /\b(fix my (pc|computer|laptop|phone|wifi)|virus on my)\b/i,
  /\b(who won|score of|match result|game last night)\b/i,
  /\b(translate .{3,} (to|into) (spanish|french|german|chinese|japanese|korean|hindi|tamil|sinhala))\b/i,
  /\b(what is the meaning of life|philosophy of|religion debate)\b/i,
  /\b(dating advice|relationship advice|break up with)\b/i,
  /\b(cheat on|exam answers|plagiarism)\b/i,
];

function hasOnTopicSignal(text: string): boolean {
  return ON_TOPIC_SIGNALS.test(normalizeChatInput(text));
}

function isClearlyOffTopic(text: string): boolean {
  return OFF_TOPIC_PATTERNS.some((p) => p.test(text));
}

function isOffTopic(text: string): boolean {
  const t = normalizeChatInput(text.trim());
  if (!t) return false;
  if (hasOnTopicSignal(t)) return false;
  if (isClearlyOffTopic(t)) return true;
  // Short pleasantries handled by intents  -  don't block
  if (/^(hi|hello|hey|yo|thanks|thank you|bye|goodbye|help)\b/i.test(t)) return false;
  // No on-topic signal and looks like a general knowledge / open question
  if (/^(what|who|where|when|why|how|can you|could you|tell me|explain|define|is it true)\b/i.test(t)) {
    return true;
  }
  // Long messages with no Veyra-related signal are likely off-topic
  if (t.split(/\s+/).length >= 6 && !hasOnTopicSignal(t)) return true;
  return false;
}

export function shouldOpenEstimate(input: string): boolean {
  return /estimate|quote builder|build.?a.?quote|project estimate|get.?estimate|pdf|download.?estimate|calculator/i.test(
    input.trim()
  );
}

export function getEstimateIntroMessage(): string {
  return "Your estimate form is **open below** 👇  -  select services, add scope, enter your email, and we'll send you a PDF quote.";
}

export function getWelcomeMessage(): ChatMessage {
  return {
    id: "welcome",
    role: "assistant",
    content: WELCOME,
    timestamp: new Date(),
  };
}

export function getBotResponse(input: string): string {
  const text = normalizeChatInput(input.trim());
  if (!text) return FALLBACK;

  for (const intent of INTENTS) {
    if (intent.patterns.some((p) => p.test(text))) {
      return typeof intent.reply === "function" ? intent.reply() : intent.reply;
    }
  }

  if (isOffTopic(text)) {
    return OFF_TOPIC_REPLY;
  }

  return FALLBACK;
}

export function createMessage(role: "user" | "assistant", content: string): ChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    role,
    content,
    timestamp: new Date(),
  };
}

export function buildLeadMailto(name: string, email: string, message: string): string {
  const subject = encodeURIComponent(`Veyra Chat  -  Inquiry from ${name}`);
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\nSource: Website chatbot\n\n${message}`
  );
  return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
}
