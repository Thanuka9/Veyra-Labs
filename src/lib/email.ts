import emailjs from "@emailjs/browser";
import { CONTACT_EMAIL } from "./content";
import { formatRange, type ProjectEstimate } from "./estimate";

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
 * Estimate templates use structured fields + {{{line_items_html}}} (triple braces for HTML rows).
 * Inquiry templates still use {{message}} / {{message_heading}}.
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

function escapeHtml(value = ""): string {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatLineItemPrice(min: number, max: number): string {
  if (min === 0 && max === 0) return "Included";
  if (min === max) return formatRange(min, min);
  return formatRange(min, max);
}

function buildLineItemsHtml(estimate: ProjectEstimate): string {
  return estimate.lineItems
    .map(
      (item) => `
      <tr>
        <td style="padding:12px 0; border-bottom:1px solid #e2e8f0; color:#334155; font-size:14px; line-height:22px;">
          ${escapeHtml(item.label)}
        </td>
        <td align="right" style="padding:12px 0 12px 18px; border-bottom:1px solid #e2e8f0; color:#0f172a; font-size:14px; line-height:22px; font-weight:600; white-space:nowrap;">
          ${escapeHtml(formatLineItemPrice(item.min, item.max))}
        </td>
      </tr>
    `
    )
    .join("");
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

/**
 * Estimate flow — structured fields + HTML line-item rows (no giant message blob).
 * PDF remains download-only on the result screen.
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

  const estimateId = estimate.id;
  const formattedDate = new Date(estimate.createdAt).toLocaleDateString("en-US", {
    dateStyle: "medium",
  });
  const companyName = estimate.clientCompany?.trim() || "Not provided";
  const selectedServices = estimate.projectLabel || "Not provided";
  const selectedTimeline = estimate.timeline || "Not provided";
  const selectedTimelineOption = estimate.timelineNote || "";
  const selectedScope =
    estimate.selectedScope.length > 0
      ? estimate.selectedScope.join(", ")
      : "No additional scope selected";
  const formattedEstimateTotal =
    formatRange(estimate.totalMin, estimate.totalMax) || "To be confirmed";
  const clientNotes =
    estimate.notes?.trim() || "No additional notes were provided.";
  const lineItemsHtml = buildLineItemsHtml(estimate);

  const customerEstimateParams: EmailJsParams = {
    is_estimate: true,
    is_inquiry: false,

    subject: `Your Veyra Labs Estimate — ${estimateId}`,

    name: customerName,
    to_email: customerEmail,
    reply_to: CONTACT_EMAIL,

    estimate_id: estimateId,
    estimate_date: formattedDate,

    company: companyName,
    service: selectedServices,
    timeline: selectedTimeline,
    timeline_option: selectedTimelineOption,
    scope: selectedScope,
    estimate_total: formattedEstimateTotal,

    line_items_html: lineItemsHtml,

    client_notes: clientNotes,
  };

  const internalEstimateParams: EmailJsParams = {
    is_estimate: true,
    is_inquiry: false,

    subject: `New Estimate Request — ${customerName} | ${estimateId}`,

    name: customerName,
    customer_email: customerEmail,
    reply_to: customerEmail,

    estimate_id: estimateId,
    estimate_date: formattedDate,

    company: companyName,
    service: selectedServices,
    timeline: selectedTimeline,
    timeline_option: selectedTimelineOption,
    scope: selectedScope,
    estimate_total: formattedEstimateTotal,

    line_items_html: lineItemsHtml,

    client_notes: clientNotes,
  };

  await sendVeyraEmails(customerEstimateParams, internalEstimateParams);
}
