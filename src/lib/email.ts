import emailjs from "@emailjs/browser";
import { ESTIMATE_DISCLAIMER, formatRange, type ProjectEstimate } from "./estimate";
import { getEstimatePdfBase64 } from "./estimate-pdf";

export type ContactEmailPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
  html_message?: string;
  estimate_pdf?: string;
};

const SERVICE_ID =
  process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "service_3q31q6h";
const TEMPLATE_ID =
  process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "template_oxg4tlo";
const PUBLIC_KEY =
  process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "mqtA7O0dh4Q6-V-Ur";

let emailJsReady = false;

function ensureEmailJsInit(): void {
  if (emailJsReady || !PUBLIC_KEY) return;
  emailjs.init({ publicKey: PUBLIC_KEY });
  emailJsReady = true;
}

export function isEmailConfigured(): boolean {
  return Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);
}

export async function sendContactEmail(payload: ContactEmailPayload): Promise<void> {
  if (!isEmailConfigured()) {
    throw new Error("Email service is not configured.");
  }

  ensureEmailJsInit();

  const result = await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
    name: payload.name,
    email: payload.email,
    subject: payload.subject,
    title: payload.subject,
    message: payload.message,
    html_message: payload.html_message,
    estimate_pdf: payload.estimate_pdf,
  });

  if (result.status !== 200) {
    throw new Error(`Email failed with status ${result.status}`);
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
    subject: `Veyra Labs  -  ${params.projectType} inquiry from ${params.name}`,
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
                        <a href="https://veyralabs.com/#contact" style="display: inline-block; background: linear-gradient(to right, ${accentColor}, ${cyanColor}); color: ${textWhite}; padding: 12px 28px; font-size: 13px; font-weight: bold; text-decoration: none; border-radius: 8px; box-shadow: 0 4px 12px rgba(124,92,255,0.3); text-align: center;">
                          Book a Free Discovery Call
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

  const lines = [
    "=== VEYRA LABS  -  CHAT ESTIMATE REQUEST ===",
    "",
    `Estimate ID: ${estimate.id}`,
    `Date: ${new Date(estimate.createdAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}`,
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
    `ESTIMATED TOTAL: ${formatRange(estimate.totalMin, estimate.totalMax)}`,
    "",
    estimate.selectedScope.length
      ? `Scope add-ons: ${estimate.selectedScope.join(", ")}`
      : "Scope add-ons: (none selected)",
    estimate.notes?.trim() ? `\nClient notes:\n${estimate.notes.trim()}` : null,
    "",
    "---",
    ESTIMATE_DISCLAIMER,
    "",
    "Source: Veyra chatbot estimate wizard",
  ].filter(Boolean);

  return {
    name: clientName,
    email: clientEmail,
    subject: `[Estimate ${estimate.id}] ${estimate.projectLabel}  -  ${formatRange(estimate.totalMin, estimate.totalMax)}`,
    message: lines.join("\n"),
    html_message: buildEstimateHtml(estimate),
    estimate_pdf: pdfBase64,
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
