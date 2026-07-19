import emailjs from "@emailjs/browser";
import { CONTACT_EMAIL } from "./content";
import { ESTIMATE_DISCLAIMER, formatRange, type ProjectEstimate } from "./estimate";

/**
 * EmailJS — public key only. Never put the Private Key in NEXT_PUBLIC_* / frontend / GitHub.
 *
 * No Attachments tab on either template — leave empty. PDF download stays on-site only.
 *
 * Customer template — template_69hvz1j
 *   Subject: {{subject}} · To: {{to_email}} · From Name: Veyra Labs · Reply To: {{reply_to}}
 *
 * Internal template — template_neuqpqj
 *   Subject: {{subject}} · To: veyralabs0@gmail.com · From Name: Veyra Website · Reply To: {{reply_to}}
 *
 * Use {{#is_estimate}} / {{#is_inquiry}} blocks in HTML for conditional notices.
 */

export type ContactEmailPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
  html_message?: string;
  company?: string;
  project_type?: string;
  source?: string;
};

/** Template params for EmailJS — `subject` must be exactly this key (maps to {{subject}}). */
type EmailJsParams = {
  subject: string;
  [key: string]: string | boolean | number;
};

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "";
const INTERNAL_TEMPLATE_ID =
  process.env.NEXT_PUBLIC_EMAILJS_INTERNAL_TEMPLATE_ID ??
  process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ??
  "";
const CUSTOMER_TEMPLATE_ID =
  process.env.NEXT_PUBLIC_EMAILJS_CONFIRMATION_TEMPLATE_ID ?? "";
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "";

/** EmailJS free tier: ~1 request/second */
const SEND_GAP_MS = 1100;

let emailJsReady = false;

function ensureEmailJsInit(): void {
  if (emailJsReady || !PUBLIC_KEY) return;
  emailjs.init({ publicKey: PUBLIC_KEY });
  emailJsReady = true;
}

function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

function assertSubject(params: EmailJsParams, label: string): void {
  const subject = typeof params.subject === "string" ? params.subject.trim() : "";
  if (!subject) {
    throw new Error(`${label} email subject is missing.`);
  }
  // Guard against accidental legacy field names
  if ("customer_subject" in params || "internal_subject" in params) {
    throw new Error(
      `${label} payload must use subject — not customer_subject / internal_subject.`
    );
  }
}

export function isEmailConfigured(): boolean {
  return Boolean(SERVICE_ID && INTERNAL_TEMPLATE_ID && PUBLIC_KEY);
}

export function hasCustomerTemplate(): boolean {
  return Boolean(CUSTOMER_TEMPLATE_ID);
}

/**
 * Customer template first, then internal — sequential to respect rate limit.
 * Both payloads must include `subject` (EmailJS Subject field = {{subject}}).
 */
async function sendVeyraEmails(
  customerParams: EmailJsParams,
  internalParams: EmailJsParams
): Promise<{ customerResult: unknown; internalResult: unknown }> {
  assertSubject(customerParams, "Customer");
  assertSubject(internalParams, "Internal");

  ensureEmailJsInit();

  if (!CUSTOMER_TEMPLATE_ID) {
    console.log("Internal EmailJS payload:", internalParams);
    const internalResult = await emailjs.send(
      SERVICE_ID,
      INTERNAL_TEMPLATE_ID,
      internalParams,
      { publicKey: PUBLIC_KEY }
    );
    if (internalResult.status !== 200) {
      throw new Error(
        `EmailJS failed with status ${internalResult.status}: ${internalResult.text}`
      );
    }
    return { customerResult: null, internalResult };
  }

  console.log("Customer EmailJS payload:", customerParams);
  console.log("Customer email params subject:", customerParams.subject);

  const customerResult = await emailjs.send(
    SERVICE_ID,
    CUSTOMER_TEMPLATE_ID,
    customerParams,
    { publicKey: PUBLIC_KEY }
  );
  if (customerResult.status !== 200) {
    throw new Error(
      `EmailJS failed with status ${customerResult.status}: ${customerResult.text}`
    );
  }

  await wait(SEND_GAP_MS);

  console.log("Internal EmailJS payload:", internalParams);
  console.log("Internal email params subject:", internalParams.subject);

  const internalResult = await emailjs.send(
    SERVICE_ID,
    INTERNAL_TEMPLATE_ID,
    internalParams,
    { publicKey: PUBLIC_KEY }
  );
  if (internalResult.status !== 200) {
    throw new Error(
      `EmailJS failed with status ${internalResult.status}: ${internalResult.text}`
    );
  }

  return { customerResult, internalResult };
}

/** Contact / lead inquiry — attachment-free. */
export async function sendContactEmail(payload: ContactEmailPayload): Promise<void> {
  if (!isEmailConfigured()) {
    throw new Error(
      "Email service is not configured. Set NEXT_PUBLIC_EMAILJS_SERVICE_ID, NEXT_PUBLIC_EMAILJS_INTERNAL_TEMPLATE_ID, and NEXT_PUBLIC_EMAILJS_PUBLIC_KEY."
    );
  }

  const customerName = payload.name.trim() || "Website visitor";
  const customerEmail = payload.email.trim();
  if (!customerEmail) throw new Error("Customer email is required.");

  const company = payload.company?.trim() || "";
  const service = payload.project_type?.trim() || "";
  const message = payload.message?.trim() || "";

  const customerInquiryParams: EmailJsParams = {
    is_inquiry: true,
    is_estimate: false,

    name: customerName,
    to_email: customerEmail,
    reply_to: CONTACT_EMAIL,

    subject: "We Received Your Veyra Labs Inquiry",

    company,
    service,

    message_heading: "YOUR MESSAGE",
    message,
  };

  const internalInquiryParams: EmailJsParams = {
    is_inquiry: true,
    is_estimate: false,

    name: customerName,
    customer_email: customerEmail,
    reply_to: customerEmail,

    subject: `New Inquiry — ${customerName} | Veyra Labs`,

    company,
    service,

    message_heading: "PROJECT DETAILS",
    message,
  };

  await sendVeyraEmails(customerInquiryParams, internalInquiryParams);
}

export function buildVeyraInquiryEmail(params: {
  name: string;
  email: string;
  company?: string;
  projectType: string;
  message: string;
  source?: string;
}): ContactEmailPayload {
  return {
    name: params.name,
    email: params.email,
    company: params.company,
    project_type: params.projectType,
    source: params.source,
    subject: `New Inquiry — ${params.name} | Veyra Labs`,
    message: params.message,
  };
}

function buildEstimateSummary(estimate: ProjectEstimate): string {
  const clientName = estimate.clientName?.trim() || "Website visitor";
  const clientEmail = estimate.clientEmail?.trim() || "—";
  const clientCompany = estimate.clientCompany?.trim();
  const range = formatRange(estimate.totalMin, estimate.totalMax);

  return [
    "=== VEYRA LABS — PROJECT ESTIMATE ===",
    "",
    `Estimate ID: ${estimate.id}`,
    `Date: ${new Date(estimate.createdAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}`,
    "",
    "CLIENT",
    `  Name: ${clientName}`,
    `  Email: ${clientEmail}`,
    clientCompany ? `  Company: ${clientCompany}` : null,
    "",
    `Services: ${estimate.projectLabel}`,
    `Timeline: ${estimate.timeline} (${estimate.timelineNote})`,
    "",
    "LINE ITEMS:",
    ...estimate.lineItems.map((item) => {
      const price =
        item.min === 0 && item.max === 0
          ? "Included"
          : item.min === item.max
            ? formatRange(item.min, item.min)
            : formatRange(item.min, item.max);
      return `  • ${item.label}: ${price}`;
    }),
    "",
    `ESTIMATED TOTAL: ${range}`,
    "",
    estimate.selectedScope.length
      ? `Scope add-ons: ${estimate.selectedScope.join(", ")}`
      : "Scope add-ons: (none selected)",
    estimate.notes?.trim() ? `\nClient notes:\n${estimate.notes.trim()}` : null,
    "",
    "---",
    ESTIMATE_DISCLAIMER,
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * Estimate flow — summary in email body only. PDF is downloadable on the result screen.
 */
export async function sendEstimateEmail(estimate: ProjectEstimate): Promise<void> {
  if (!isEmailConfigured()) {
    throw new Error(
      "Email service is not configured. Set NEXT_PUBLIC_EMAILJS_SERVICE_ID, NEXT_PUBLIC_EMAILJS_INTERNAL_TEMPLATE_ID, and NEXT_PUBLIC_EMAILJS_PUBLIC_KEY."
    );
  }

  const customerName = estimate.clientName?.trim();
  const customerEmail = estimate.clientEmail?.trim();
  if (!customerName || !customerEmail) {
    throw new Error("Customer name and email are required.");
  }

  const companyName = estimate.clientCompany?.trim() || "";
  const selectedServices = estimate.projectLabel || "";
  const selectedScope = estimate.selectedScope.join(", ") || "";
  const selectedTimeline = estimate.timeline || "";
  const estimateId = estimate.id;
  const formattedEstimateTotal = formatRange(estimate.totalMin, estimate.totalMax);
  const estimateSummary = buildEstimateSummary(estimate);

  const customerEstimateParams: EmailJsParams = {
    is_inquiry: false,
    is_estimate: true,

    name: customerName,
    to_email: customerEmail,
    reply_to: CONTACT_EMAIL,

    subject: `Your Veyra Labs Estimate — ${estimateId}`,

    company: companyName,
    service: selectedServices,
    scope: selectedScope,
    timeline: selectedTimeline,
    estimate_total: formattedEstimateTotal,
    estimate_id: estimateId,

    message_heading: "ESTIMATE DETAILS",
    message: estimateSummary,
  };

  const internalEstimateParams: EmailJsParams = {
    is_inquiry: false,
    is_estimate: true,

    name: customerName,
    customer_email: customerEmail,
    reply_to: customerEmail,

    subject: `New Estimate Request — ${customerName} | ${estimateId}`,

    company: companyName,
    service: selectedServices,
    scope: selectedScope,
    timeline: selectedTimeline,
    estimate_total: formattedEstimateTotal,
    estimate_id: estimateId,

    message_heading: "ESTIMATE DETAILS",
    message: estimateSummary,
  };

  await sendVeyraEmails(customerEstimateParams, internalEstimateParams);
}
