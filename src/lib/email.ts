import emailjs from "@emailjs/browser";
import { CONTACT_EMAIL } from "./content";
import { ESTIMATE_DISCLAIMER, formatRange, type ProjectEstimate } from "./estimate";
import { getEstimatePdfBase64 } from "./estimate-pdf";

/**
 * Payload mapped to EmailJS template variables used by both:
 *   - NEXT_PUBLIC_EMAILJS_INTERNAL_TEMPLATE_ID   (template_neuqpqj)
 *   - NEXT_PUBLIC_EMAILJS_CONFIRMATION_TEMPLATE_ID (template_69hvz1j)
 *
 * Template dashboard setup (required for correct delivery):
 *
 * Internal (to Veyra):
 *   To Email:    {{to_email}}     OR hardcode veyralabs0@gmail.com
 *   Reply-To:    {{reply_to}}     (= visitor email)
 *   Subject:     {{subject}}
 *   Body:        use {{name}}, {{email}}, {{message}}, {{{html_message}}}
 *   Attachment:  Variable Attachment, parameter name = estimate_pdf (optional)
 *
 * Confirmation (to visitor):
 *   To Email:    {{to_email}}     (= visitor email)
 *   Reply-To:    {{reply_to}}     (= CONTACT_EMAIL)
 *   Subject:     {{subject}}
 *   Body:        use {{name}}, {{message}}, {{{html_message}}}
 *   Attachment:  same estimate_pdf variable if you want the PDF on confirmations
 *
 * Public key only — never put the EmailJS Private Key in NEXT_PUBLIC_* / frontend / GitHub.
 */
export type ContactEmailPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
  html_message?: string;
  /** Data-URI or base64 PDF for EmailJS Variable Attachment (param name: estimate_pdf) */
  estimate_pdf?: string;
  /** Suggested filename for the EmailJS attachment Filename field: {{estimate_filename}} */
  estimate_filename?: string;
  company?: string;
  project_type?: string;
  source?: string;
  estimate_id?: string;
};

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "";
const INTERNAL_TEMPLATE_ID =
  process.env.NEXT_PUBLIC_EMAILJS_INTERNAL_TEMPLATE_ID ??
  process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ??
  "";
const CONFIRMATION_TEMPLATE_ID =
  process.env.NEXT_PUBLIC_EMAILJS_CONFIRMATION_TEMPLATE_ID ?? "";
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "";

/** EmailJS free tier rate limit is 1 request/second */
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

/**
 * Flat param object matching both EmailJS templates.
 * Extra keys are harmless if a template doesn't use them.
 */
function buildTemplateParams(
  payload: ContactEmailPayload,
  role: "internal" | "confirmation"
): Record<string, string> {
  const visitorEmail = payload.email.trim();
  const visitorName = payload.name.trim() || "Website visitor";

  const toEmail = role === "internal" ? CONTACT_EMAIL : visitorEmail;
  const replyTo = role === "internal" ? visitorEmail : CONTACT_EMAIL;
  const fromName = role === "internal" ? visitorName : "Veyra Labs";

  const params: Record<string, string> = {
    // Core identity
    name: visitorName,
    email: visitorEmail,
    from_name: fromName,
    to_name: role === "internal" ? "Veyra Labs" : visitorName,
    to_email: toEmail,
    reply_to: replyTo,

    // Subject — EmailJS Subject field must be {{subject}}
    subject: payload.subject,
    title: payload.subject,

    // Body
    message: payload.message,
    html_message: payload.html_message ?? payload.message,

    // Metadata
    company: payload.company?.trim() || "—",
    project_type: payload.project_type?.trim() || "General inquiry",
    source: payload.source?.trim() || "veyralabs.com",
    estimate_id: payload.estimate_id?.trim() || "—",
    time: nowStamp(),
  };

  // Variable Attachment — dashboard: Attachments → Variable → param `estimate_pdf`
  // Filename field: {{estimate_filename}} · Content type: PDF
  if (payload.estimate_pdf) {
    params.estimate_pdf = payload.estimate_pdf;
    params.estimate_filename =
      payload.estimate_filename?.trim() ||
      `veyra-labs-estimate${payload.estimate_id ? `-${payload.estimate_id}` : ""}.pdf`;
  }

  return params;
}

export function isEmailConfigured(): boolean {
  return Boolean(SERVICE_ID && INTERNAL_TEMPLATE_ID && PUBLIC_KEY);
}

export function hasConfirmationTemplate(): boolean {
  return Boolean(CONFIRMATION_TEMPLATE_ID);
}

async function sendWithTemplate(
  templateId: string,
  params: Record<string, string>
): Promise<void> {
  const result = await emailjs.send(SERVICE_ID, templateId, params);
  if (result.status !== 200) {
    throw new Error(`EmailJS failed with status ${result.status}: ${result.text}`);
  }
}

function buildConfirmationCopy(payload: ContactEmailPayload): ContactEmailPayload {
  const firstName = payload.name.trim().split(/\s+/)[0] || "there";
  const isEstimate = Boolean(payload.estimate_pdf) || /estimate/i.test(payload.subject);
  const companyLine = payload.company?.trim() ? ` (${payload.company.trim()})` : "";

  const message = isEstimate
    ? [
        `Hi ${firstName},`,
        "",
        `Thanks for requesting a project estimate from Veyra Labs${companyLine}.`,
        "",
        "We've attached your ballpark estimate PDF to this email. This is an indicative range only — not a binding quote. Our team has also received a copy and will follow up within 24 hours to refine scope, timeline, and a fixed price.",
        "",
        `Subject reference: ${payload.subject}`,
        payload.estimate_id ? `Estimate ID: ${payload.estimate_id}` : null,
        "",
        `If you have anything to add, reply to this email or write to ${CONTACT_EMAIL}.`,
        "",
        "— Veyra Labs",
        "https://veyralabs.com",
      ]
        .filter(Boolean)
        .join("\n")
    : [
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
      ].join("\n");

  return {
    ...payload,
    // Keep a clear subject that still references the estimate for inbox search
    subject: isEstimate
      ? payload.estimate_id
        ? `Your Veyra Labs estimate ${payload.estimate_id}`
        : `Your Veyra Labs estimate request`
      : `We received your message — Veyra Labs`,
    message,
    html_message: undefined,
    // Keep estimate_pdf + estimate_filename so confirmation also gets the PDF
  };
}

/**
 * 1) Internal notification → Veyra Labs (template_neuqpqj)
 * 2) Confirmation → visitor (template_69hvz1j), after rate-limit gap
 */
export async function sendContactEmail(payload: ContactEmailPayload): Promise<void> {
  if (!isEmailConfigured()) {
    throw new Error(
      "Email service is not configured. Set NEXT_PUBLIC_EMAILJS_SERVICE_ID, NEXT_PUBLIC_EMAILJS_INTERNAL_TEMPLATE_ID, and NEXT_PUBLIC_EMAILJS_PUBLIC_KEY."
    );
  }

  ensureEmailJsInit();

  await sendWithTemplate(
    INTERNAL_TEMPLATE_ID,
    buildTemplateParams(payload, "internal")
  );

  if (!CONFIRMATION_TEMPLATE_ID) return;

  await sleep(SEND_GAP_MS);

  const confirmation = buildConfirmationCopy(payload);
  try {
    await sendWithTemplate(
      CONFIRMATION_TEMPLATE_ID,
      buildTemplateParams(confirmation, "confirmation")
    );
  } catch (err) {
    // Internal mail already delivered — don't fail the UX if confirmation fails
    console.error("Confirmation email (template_69hvz1j) failed:", err);
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

function buildEstimateHtml(estimate: ProjectEstimate): string {
  const brandLogo = "https://veyralabs.com/brand/wordmark-main.png";
  const accentColor = "#7C5CFF";
  const cyanColor = "#22D3EE";
  const bgDark = "#0A0C16";
  const textWhite = "#FFFFFF";
  const textMuted = "#8C96AA";

  const itemsHtml = estimate.lineItems
    .map((item) => {
      const price =
        item.min === 0 && item.max === 0
          ? "Included"
          : item.min === item.max
            ? `$${item.min.toLocaleString()}`
            : `$${item.min.toLocaleString()} - $${item.max.toLocaleString()}`;

      return `
      <tr style="border-bottom: 1px solid #2A2B3D;">
        <td style="padding: 12px; font-size: 13px; color: ${textWhite};">${item.label}</td>
        <td style="padding: 12px; font-size: 13px; text-align: right; font-weight: bold; color: ${cyanColor};">${price}</td>
      </tr>
    `;
    })
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Veyra Labs Project Estimate</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #05060B; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; -webkit-font-smoothing: antialiased;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #05060B; padding: 30px 15px;">
        <tr>
          <td align="center">
            <table width="100%" max-width="600" style="max-width: 600px; width: 100%; background-color: ${bgDark}; border: 1px solid #1E2038; border-radius: 16px; overflow: hidden; border-collapse: separate; box-shadow: 0 10px 30px rgba(0,0,0,0.4);">
              
              <!-- Header -->
              <tr>
                <td style="background-color: #0F1122; padding: 24px; border-bottom: 1px solid #1E2038;">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td>
                        <img src="${brandLogo}" alt="Veyra Labs" height="24" style="display: block; height: 24px; max-height: 24px; border: 0;" />
                        <span style="font-size: 10px; color: ${textMuted}; display: block; margin-top: 4px; letter-spacing: 0.5px;">Software & AI Engineering Studio</span>
                      </td>
                      <td align="right" style="vertical-align: middle;">
                        <span style="font-size: 11px; font-weight: bold; color: ${accentColor}; letter-spacing: 1px; display: block;">ESTIMATE RECEIPT</span>
                        <span style="font-family: monospace; font-size: 11px; color: ${textMuted}; display: block; margin-top: 2px;">${estimate.id}</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Content Body -->
              <tr>
                <td style="padding: 30px 24px;">
                  
                  <!-- Title -->
                  <h2 style="margin: 0 0 8px 0; font-size: 18px; font-weight: bold; color: ${textWhite};">Hi ${estimate.clientName || "there"},</h2>
                  <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.5; color: ${textMuted};">
                    Thank you for requesting a ballpark estimate from Veyra Labs. Below is the configuration summary we compiled based on your selected services.
                  </p>

                  <!-- Estimate Summary Card -->
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #121428; border: 1px solid #7C5CFF50; border-radius: 12px; margin-bottom: 24px;">
                    <tr>
                      <td style="padding: 20px;">
                        <span style="font-size: 10px; font-weight: bold; text-transform: uppercase; color: ${cyanColor}; letter-spacing: 1px;">Estimated Total Range</span>
                        <h1 style="margin: 6px 0 2px 0; font-size: 28px; font-weight: 800; color: ${textWhite}; letter-spacing: -0.5px;">
                          ${formatRange(estimate.totalMin, estimate.totalMax)}
                        </h1>
                        <p style="margin: 4px 0 0 0; font-size: 13px; font-weight: 600; color: ${textWhite};">${estimate.projectLabel}</p>
                        <p style="margin: 2px 0 0 0; font-size: 12px; color: ${textMuted};">
                          Timeline: ${estimate.timeline} (${estimate.timelineNote})
                        </p>
                      </td>
                    </tr>
                  </table>

                  <!-- Line Items Table -->
                  <h3 style="margin: 0 0 10px 0; font-size: 13px; font-weight: bold; text-transform: uppercase; color: ${textMuted}; letter-spacing: 0.5px;">Configuration Details</h3>
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border: 1px solid #1E2038; border-radius: 8px; overflow: hidden; border-collapse: separate; margin-bottom: 24px; background-color: #0E0F1B;">
                    <thead>
                      <tr style="background-color: #121324;">
                        <th align="left" style="padding: 10px 12px; font-size: 11px; font-weight: bold; color: ${textMuted}; text-transform: uppercase;">Service Item</th>
                        <th align="right" style="padding: 10px 12px; font-size: 11px; font-weight: bold; color: ${textMuted}; text-transform: uppercase;">Range (USD)</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${itemsHtml}
                    </tbody>
                  </table>

                  <!-- Client Details -->
                  <h3 style="margin: 0 0 10px 0; font-size: 13px; font-weight: bold; text-transform: uppercase; color: ${textMuted}; letter-spacing: 0.5px;">Client Information</h3>
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border: 1px solid #1E2038; border-radius: 8px; overflow: hidden; border-collapse: separate; margin-bottom: 24px; padding: 14px; background-color: #0E0F1B; font-size: 13px; line-height: 1.6; color: ${textWhite}; border-spacing: 0;">
                    <tr>
                      <td width="30%" style="color: ${textMuted}; font-weight: 500; padding: 4px 0;">Client Name:</td>
                      <td style="font-weight: bold; padding: 4px 0;">${estimate.clientName || "N/A"}</td>
                    </tr>
                    ${
                      estimate.clientCompany?.trim()
                        ? `
                    <tr>
                      <td style="color: ${textMuted}; font-weight: 500; padding: 4px 0;">Company:</td>
                      <td style="font-weight: bold; padding: 4px 0;">${estimate.clientCompany.trim()}</td>
                    </tr>
                    `
                        : ""
                    }
                    <tr>
                      <td style="color: ${textMuted}; font-weight: 500; padding: 4px 0;">Email:</td>
                      <td style="padding: 4px 0;"><a href="mailto:${estimate.clientEmail}" style="color: ${cyanColor}; text-decoration: none;">${estimate.clientEmail || "N/A"}</a></td>
                    </tr>
                    ${
                      estimate.notes?.trim()
                        ? `
                    <tr>
                      <td style="color: ${textMuted}; font-weight: 500; vertical-align: top; padding: 8px 0 4px 0;">Notes:</td>
                      <td style="color: #E2E8F0; padding: 8px 0 4px 0;">${estimate.notes.trim()}</td>
                    </tr>
                    `
                        : ""
                    }
                  </table>

                  <!-- Disclaimer Banner -->
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: rgba(217, 119, 6, 0.1); border: 1px solid rgba(217, 119, 6, 0.3); border-radius: 8px; margin-bottom: 24px;">
                    <tr>
                      <td style="padding: 12px; font-size: 11px; line-height: 1.5; color: #F59E0B; text-align: left;">
                        <strong>IMPORTANT:</strong> ${ESTIMATE_DISCLAIMER}
                      </td>
                    </tr>
                  </table>

                  <!-- Call to Action -->
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 10px;">
                    <tr>
                      <td align="center">
                        <a href="https://veyralabs.com/contact" style="display: inline-block; background: linear-gradient(to right, ${accentColor}, ${cyanColor}); color: ${textWhite}; padding: 12px 28px; font-size: 13px; font-weight: bold; text-decoration: none; border-radius: 8px; box-shadow: 0 4px 12px rgba(124,92,255,0.3); text-align: center;">
                          Contact Us
                        </a>
                      </td>
                    </tr>
                  </table>

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #0F1122; padding: 20px 24px; border-top: 1px solid #1E2038; font-size: 11px; text-align: center; color: ${textMuted};">
                  <p style="margin: 0 0 6px 0;">This email was automatically generated and contains your PDF estimate receipt as an attachment.</p>
                  <p style="margin: 0;">&copy; ${new Date().getFullYear()} Veyra Labs. All rights reserved. · <a href="https://veyralabs.com" style="color: ${accentColor}; text-decoration: none;">veyralabs.com</a></p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export function buildEstimateEmail(estimate: ProjectEstimate, pdfBase64?: string): ContactEmailPayload {
  const clientName = estimate.clientName?.trim() || "Website visitor";
  const clientEmail = estimate.clientEmail?.trim() || "no-reply@veyralabs.com";
  const clientCompany = estimate.clientCompany?.trim();
  const range = formatRange(estimate.totalMin, estimate.totalMax);
  const filename = `veyra-labs-estimate-${estimate.id}.pdf`;
  const subject = `[Estimate ${estimate.id}] ${estimate.projectLabel} — ${range}`;

  const lines = [
    "=== VEYRA LABS — PROJECT ESTIMATE ===",
    "",
    `Subject: ${subject}`,
    `Estimate ID: ${estimate.id}`,
    `Date: ${new Date(estimate.createdAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}`,
    "",
    "CLIENT",
    `  Name: ${clientName}`,
    `  Email: ${clientEmail}`,
    clientCompany ? `  Company: ${clientCompany}` : null,
    "",
    `Services selected: ${estimate.projectLabel}`,
    `Delivery timeline: ${estimate.timeline}`,
    `Timeline option: ${estimate.timelineNote}`,
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
    pdfBase64
      ? `PDF attachment: ${filename}`
      : "PDF attachment: (failed to generate — ask client to download from the site)",
    "",
    "---",
    ESTIMATE_DISCLAIMER,
    "",
    "Source: Veyra chatbot estimate wizard",
  ].filter(Boolean);

  return {
    name: clientName,
    email: clientEmail,
    company: clientCompany,
    project_type: estimate.projectLabel,
    source: "Veyra chatbot estimate wizard — veyralabs.com",
    estimate_id: estimate.id,
    subject,
    message: lines.join("\n"),
    html_message: buildEstimateHtml(estimate),
    estimate_pdf: pdfBase64,
    estimate_filename: filename,
  };
}

export async function sendEstimateEmail(estimate: ProjectEstimate): Promise<void> {
  let pdfBase64: string | undefined;
  try {
    pdfBase64 = await getEstimatePdfBase64(estimate);
  } catch (err) {
    console.error("Failed to generate PDF attachment for email:", err);
  }

  await sendContactEmail(buildEstimateEmail(estimate, pdfBase64));
}
