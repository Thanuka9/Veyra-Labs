import emailjs from "@emailjs/browser";
import { CONTACT_EMAIL } from "./content";
import { ESTIMATE_DISCLAIMER, formatRange, type ProjectEstimate } from "./estimate";
import { getEstimatePdfDataUrl } from "./estimate-pdf";

/**
 * EmailJS — public key only. Never put the Private Key in NEXT_PUBLIC_* / frontend / GitHub.
 *
 * Templates:
 *   Customer confirmation → template_69hvz1j (NEXT_PUBLIC_EMAILJS_CONFIRMATION_TEMPLATE_ID)
 *     To Email:  {{to_email}}
 *     From Name: Veyra Labs  (or fixed)
 *     Reply-To:  {{reply_to}}   → must be studio inbox (CONTACT_EMAIL)
 *     Subject:   {{subject}}
 *     Attachment: Variable → param estimate_pdf · Filename {{estimate_filename}} · type PDF
 *
 *   Internal lead → template_neuqpqj (NEXT_PUBLIC_EMAILJS_INTERNAL_TEMPLATE_ID)
 *     To Email:  veyralabs0@gmail.com  (fixed) OR {{to_email}}
 *     From Name: {{from_name}}
 *     Reply-To:  {{reply_to}}   → customer email
 *     Subject:   {{subject}}
 *     Body link: mailto:{{reply_to}} shows {{reply_to}} (customer address)
 *     Attachment: same estimate_pdf setup
 *
 * Contact/inquiry emails NEVER send estimate_pdf (empty attachment vars break Variable Attachments).
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

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "";
const INTERNAL_TEMPLATE_ID =
  process.env.NEXT_PUBLIC_EMAILJS_INTERNAL_TEMPLATE_ID ??
  process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ??
  "";
const CUSTOMER_TEMPLATE_ID =
  process.env.NEXT_PUBLIC_EMAILJS_CONFIRMATION_TEMPLATE_ID ?? "";
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "";

/** EmailJS free tier: 1 request/second */
const SEND_GAP_MS = 1100;

let emailJsReady = false;

function ensureEmailJsInit(): void {
  if (emailJsReady || !PUBLIC_KEY) return;
  emailjs.init({ publicKey: PUBLIC_KEY });
  emailJsReady = true;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function nowStamp(): string {
  return new Date().toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function isEmailConfigured(): boolean {
  return Boolean(SERVICE_ID && INTERNAL_TEMPLATE_ID && PUBLIC_KEY);
}

export function hasCustomerTemplate(): boolean {
  return Boolean(CUSTOMER_TEMPLATE_ID);
}

async function sendWithTemplate(
  templateId: string,
  params: Record<string, string>
): Promise<void> {
  const result = await emailjs.send(SERVICE_ID, templateId, params, {
    publicKey: PUBLIC_KEY,
  });
  if (result.status !== 200) {
    throw new Error(`EmailJS failed with status ${result.status}: ${result.text}`);
  }
}

/**
 * Contact / lead inquiry — NO estimate_pdf (avoids broken Variable Attachment on empty param).
 * Sends internal first, then customer confirmation when configured.
 */
export async function sendContactEmail(payload: ContactEmailPayload): Promise<void> {
  if (!isEmailConfigured()) {
    throw new Error(
      "Email service is not configured. Set NEXT_PUBLIC_EMAILJS_SERVICE_ID, NEXT_PUBLIC_EMAILJS_INTERNAL_TEMPLATE_ID, and NEXT_PUBLIC_EMAILJS_PUBLIC_KEY."
    );
  }

  const customerName = payload.name.trim() || "Website visitor";
  const customerEmail = payload.email.trim();
  if (!customerEmail) throw new Error("Customer email is required.");

  ensureEmailJsInit();

  const company = payload.company?.trim() || "Not provided";
  const service = payload.project_type?.trim() || "General inquiry";
  const shared = {
    name: customerName,
    from_name: customerName,
    company,
    service,
    project_type: service,
    request_type: "Inquiry",
    message: payload.message,
    html_message: payload.html_message ?? payload.message,
    source: payload.source?.trim() || "veyralabs.com",
    time: nowStamp(),
  };

  // Internal → Veyra (reply goes to customer)
  const internalParams: Record<string, string> = {
    ...shared,
    to_email: CONTACT_EMAIL,
    reply_to: customerEmail,
    customer_email: customerEmail,
    email: customerEmail,
    subject: payload.subject || `New inquiry — ${customerName} | Veyra Labs`,
    title: payload.subject || `New inquiry — ${customerName} | Veyra Labs`,
  };

  await sendWithTemplate(INTERNAL_TEMPLATE_ID, internalParams);

  if (!CUSTOMER_TEMPLATE_ID) return;

  await sleep(SEND_GAP_MS);

  // Customer confirmation → visitor (reply goes to Veyra — never the visitor themselves)
  const firstName = customerName.split(/\s+/)[0] || "there";
  const customerParams: Record<string, string> = {
    ...shared,
    to_email: customerEmail,
    reply_to: CONTACT_EMAIL,
    email: customerEmail,
    from_name: "Veyra Labs",
    subject: "We received your message — Veyra Labs",
    title: "We received your message — Veyra Labs",
    message: [
      `Hi ${firstName},`,
      "",
      "Thanks for contacting Veyra Labs — we've received your message.",
      "",
      "Our team will review your inquiry and respond within 24 hours with next steps.",
      "",
      `Need to add detail? Reply to this email or write to ${CONTACT_EMAIL}.`,
      "",
      "— Veyra Labs",
      "https://veyralabs.com",
    ].join("\n"),
  };

  try {
    await sendWithTemplate(CUSTOMER_TEMPLATE_ID, customerParams);
  } catch (err) {
    console.error("Customer confirmation email failed:", err);
  }
}

export function buildVeyraInquiryEmail(params: {
  name: string;
  email: string;
  company?: string;
  projectType: string;
  message: string;
  source?: string;
}): ContactEmailPayload {
  const lines = [
    params.company ? `Company: ${params.company}` : null,
    `Project type: ${params.projectType}`,
    params.source ? `Source: ${params.source}` : null,
    "",
    params.message,
  ].filter(Boolean);

  return {
    name: params.name,
    email: params.email,
    company: params.company,
    project_type: params.projectType,
    source: params.source,
    subject: `Veyra Labs — ${params.projectType} inquiry from ${params.name}`,
    message: lines.join("\n"),
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

function buildCustomerEstimateMessage(estimate: ProjectEstimate): string {
  const firstName = (estimate.clientName?.trim() || "there").split(/\s+/)[0];
  const companyLine = estimate.clientCompany?.trim()
    ? ` (${estimate.clientCompany.trim()})`
    : "";
  const range = formatRange(estimate.totalMin, estimate.totalMax);

  return [
    `Hi ${firstName},`,
    "",
    `Thanks for requesting a project estimate from Veyra Labs${companyLine}.`,
    "",
    `Estimate ID: ${estimate.id}`,
    `Services: ${estimate.projectLabel}`,
    `Ballpark range: ${range}`,
    `Timeline: ${estimate.timeline}`,
    "",
    "Your estimate PDF is attached to this email. This is an indicative range only — not a binding quote. Our team has received a copy and will follow up within 24 hours.",
    "",
    `If you have anything to add, reply to this email or write to ${CONTACT_EMAIL}.`,
    "",
    "— Veyra Labs",
    "https://veyralabs.com",
  ].join("\n");
}

/**
 * Estimate flow — generates a real Base64 PDF data URL and sends TWO separate
 * EmailJS payloads (customer + internal) with different recipients / reply-to / subjects.
 * Never reuse contact-form params for estimates.
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

  const estimatePdf = await getEstimatePdfDataUrl(estimate);
  if (!estimatePdf.startsWith("data:application/pdf;base64,")) {
    throw new Error("The estimate PDF is not in the correct Base64 format.");
  }

  ensureEmailJsInit();

  const company = estimate.clientCompany?.trim() || "Not provided";
  const service = estimate.projectLabel;
  const estimateId = estimate.id;
  const estimateSummary = buildEstimateSummary(estimate);
  const filename = `veyra-labs-estimate-${estimateId}.pdf`;
  const range = formatRange(estimate.totalMin, estimate.totalMax);

  // Customer template (template_69hvz1j) — To: customer, Reply-To: Veyra
  const customerParams: Record<string, string> = {
    to_email: customerEmail,
    name: customerName,
    from_name: "Veyra Labs",
    reply_to: CONTACT_EMAIL,
    email: customerEmail,
    subject: `Your Veyra Labs Estimate — ${estimateId}`,
    title: `Your Veyra Labs Estimate — ${estimateId}`,
    request_type: "Estimate",
    company,
    service,
    project_type: service,
    message: buildCustomerEstimateMessage(estimate),
    estimate_id: estimateId,
    estimate_range: range,
    estimate_pdf: estimatePdf,
    estimate_filename: filename,
    time: nowStamp(),
  };

  // Internal template (template_neuqpqj) — To: Veyra (fixed in dashboard), Reply-To: customer
  const internalParams: Record<string, string> = {
    to_email: CONTACT_EMAIL,
    name: customerName,
    from_name: customerName,
    reply_to: customerEmail,
    customer_email: customerEmail,
    email: customerEmail,
    subject: `New Estimate Request — ${customerName} | ${estimateId}`,
    title: `New Estimate Request — ${customerName} | ${estimateId}`,
    request_type: "Estimate",
    company,
    service,
    project_type: service,
    message: estimateSummary,
    estimate_id: estimateId,
    estimate_range: range,
    estimate_pdf: estimatePdf,
    estimate_filename: filename,
    time: nowStamp(),
  };

  // Sequential sends respect EmailJS 1 req/sec free-tier limit
  let customerOk = !CUSTOMER_TEMPLATE_ID;
  let internalOk = false;

  if (CUSTOMER_TEMPLATE_ID) {
    try {
      await sendWithTemplate(CUSTOMER_TEMPLATE_ID, customerParams);
      customerOk = true;
    } catch (err) {
      console.error("Customer estimate email failed:", err);
    }
    await sleep(SEND_GAP_MS);
  }

  try {
    await sendWithTemplate(INTERNAL_TEMPLATE_ID, internalParams);
    internalOk = true;
  } catch (err) {
    console.error("Internal estimate email failed:", err);
  }

  if (!customerOk && !internalOk) {
    throw new Error(
      "Estimate emails failed. Check the EmailJS request history and that estimate_pdf is configured as a Variable Attachment on both templates."
    );
  }

  if (!customerOk || !internalOk) {
    console.error(
      "One estimate email failed; the other may have been delivered. Check EmailJS history.",
      { customerOk, internalOk }
    );
  }
}
