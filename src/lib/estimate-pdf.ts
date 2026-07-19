import { jsPDF } from "jspdf";
import { getAppIconDataUrl, getLockupDarkDataUrl } from "./brand-assets";
import { CONTACT_EMAIL } from "./content";
import { ESTIMATE_DISCLAIMER, formatRange, formatUsd, type ProjectEstimate } from "./estimate";

const TAGLINE = "Software & AI Engineering Studio";
const SITE = "veyralabs.com";

const C = {
  ink: [22, 26, 38] as const,
  muted: [100, 108, 128] as const,
  soft: [140, 148, 168] as const,
  line: [228, 232, 242] as const,
  wash: [248, 249, 253] as const,
  violet: [124, 92, 255] as const,
  header: [10, 12, 22] as const,
  white: [255, 255, 255] as const,
};

function priceLabel(min: number, max: number): string {
  if (min === 0 && max === 0) return "Included";
  if (min === max) return formatUsd(min);
  return formatRange(min, max);
}

export async function buildEstimatePdfDoc(estimate: ProjectEstimate, skipImages = false): Promise<jsPDF> {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentW = pageW - margin * 2;
  const colGap = 10;
  const colW = (contentW - colGap) / 2;
  let y = 0;

  let lockupData: string | null = null;
  let iconData: string | null = null;
  if (!skipImages) {
    try {
      [lockupData, iconData] = await Promise.all([getLockupDarkDataUrl(), getAppIconDataUrl()]);
    } catch {
      // Text-only header if assets fail
    }
  }

  const dateStr = new Date(estimate.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  function ensureSpace(needed: number) {
    if (y + needed <= pageH - 28) return;
    doc.addPage();
    drawPageChrome();
    y = margin + 8;
  }

  function drawPageChrome() {
    // Top accent bar on every page
    doc.setFillColor(...C.violet);
    doc.rect(0, 0, pageW, 1.2, "F");
  }

  // ── Header ──────────────────────────────────────────────
  const headerH = 36;
  doc.setFillColor(...C.header);
  doc.rect(0, 0, pageW, headerH, "F");
  doc.setFillColor(...C.violet);
  doc.rect(0, headerH, pageW, 1.1, "F");

  if (lockupData && !skipImages) {
    doc.addImage(lockupData, "PNG", margin, 9, 52, 12);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...C.soft);
    doc.text(TAGLINE, margin, 28);
  } else {
    doc.setTextColor(...C.white);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(17);
    doc.text("Veyra Labs", margin, 15);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...C.soft);
    doc.text(TAGLINE, margin, 22);
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(196, 181, 253);
  doc.text("PROJECT QUOTE", pageW - margin, 12, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...C.white);
  doc.text(estimate.id, pageW - margin, 19, { align: "right" });
  doc.setFontSize(8);
  doc.setTextColor(...C.soft);
  doc.text(dateStr, pageW - margin, 25.5, { align: "right" });

  y = headerH + 14;

  // ── Two-column meta ─────────────────────────────────────
  const hasClient = Boolean(estimate.clientName || estimate.clientEmail || estimate.clientCompany);
  const leftX = margin;
  const rightX = margin + colW + colGap;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(...C.muted);
  if (hasClient) doc.text("PREPARED FOR", leftX, y);
  doc.text("QUOTE DETAILS", rightX, y);
  y += 6;

  const metaStartY = y;
  let leftY = y;
  let rightY = y;

  if (hasClient) {
    if (estimate.clientName) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(...C.ink);
      doc.text(estimate.clientName, leftX, leftY);
      leftY += 5.5;
    }
    if (estimate.clientCompany?.trim()) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(...C.muted);
      doc.text(estimate.clientCompany.trim(), leftX, leftY);
      leftY += 5;
    }
    if (estimate.clientEmail) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...C.muted);
      doc.text(estimate.clientEmail, leftX, leftY);
      leftY += 5;
    }
  }

  const detailRows: [string, string][] = [
    ["Reference", estimate.id],
    ["Date", dateStr],
    ["Timeline", estimate.timeline],
  ];
  for (const [k, v] of detailRows) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...C.soft);
    doc.text(k, rightX, rightY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...C.ink);
    const lines = doc.splitTextToSize(v, colW - 2);
    doc.text(lines, rightX, rightY + 4.2);
    rightY += 4.2 + lines.length * 4 + 2.5;
  }

  y = Math.max(leftY, rightY, metaStartY) + 6;

  // Divider
  doc.setDrawColor(...C.line);
  doc.setLineWidth(0.35);
  doc.line(margin, y, pageW - margin, y);
  y += 9;

  // ── Project title ───────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(...C.muted);
  doc.text("PROJECT", margin, y);
  y += 6;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...C.ink);
  const titleLines = doc.splitTextToSize(estimate.projectLabel, contentW);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 5.5 + 2;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...C.muted);
  doc.text(estimate.timelineNote, margin, y);
  y += 10;

  // ── Line items table ────────────────────────────────────
  ensureSpace(28);

  const priceColW = 42;
  const itemColW = contentW - priceColW;

  // Table header
  doc.setFillColor(...C.wash);
  doc.roundedRect(margin, y, contentW, 8, 1.5, 1.5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(...C.muted);
  doc.text("DESCRIPTION", margin + 4, y + 5.3);
  doc.text("AMOUNT (USD)", pageW - margin - 4, y + 5.3, { align: "right" });
  y += 10;

  for (const item of estimate.lineItems) {
    const labelLines = doc.splitTextToSize(item.label, itemColW - 6);
    const rowH = Math.max(9, labelLines.length * 4.2 + 4);
    ensureSpace(rowH + 2);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...C.ink);
    doc.text(labelLines, margin + 4, y + 4.5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(...C.ink);
    doc.text(priceLabel(item.min, item.max), pageW - margin - 4, y + 4.5, { align: "right" });

    y += rowH;
    doc.setDrawColor(...C.line);
    doc.setLineWidth(0.25);
    doc.line(margin, y, pageW - margin, y);
    y += 1.5;
  }

  y += 6;

  // ── Total ───────────────────────────────────────────────
  ensureSpace(26);
  doc.setFillColor(...C.header);
  doc.roundedRect(margin, y, contentW, 18, 2.5, 2.5, "F");
  doc.setFillColor(...C.violet);
  doc.rect(margin, y, 2.2, 18, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(196, 181, 253);
  doc.text("QUOTE TOTAL (USD)", margin + 8, y + 7);
  doc.setFontSize(14);
  doc.setTextColor(...C.white);
  doc.text(formatRange(estimate.totalMin, estimate.totalMax), pageW - margin - 6, y + 11.5, {
    align: "right",
  });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...C.soft);
  doc.text("Includes sprint demos and 30-day post-launch support", margin + 8, y + 13.5);
  y += 24;

  // ── Notes ───────────────────────────────────────────────
  if (estimate.notes?.trim()) {
    ensureSpace(22);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...C.muted);
    doc.text("PROJECT NOTES", margin, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...C.ink);
    const noteLines = doc.splitTextToSize(estimate.notes.trim(), contentW);
    ensureSpace(noteLines.length * 4.2 + 6);
    doc.text(noteLines, margin, y);
    y += noteLines.length * 4.2 + 8;
  }

  // ── Disclaimer ──────────────────────────────────────────
  const discBody = doc.splitTextToSize(ESTIMATE_DISCLAIMER, contentW - 10);
  const discH = 9 + discBody.length * 3.5;
  ensureSpace(discH + 4);
  doc.setFillColor(252, 250, 245);
  doc.setDrawColor(230, 210, 160);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, contentW, discH, 2, 2, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(140, 105, 30);
  doc.text("BALLPARK ONLY — NOT A BINDING CONTRACT", margin + 4, y + 5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(110, 90, 45);
  doc.text(discBody, margin + 4, y + 9.5);
  y += discH + 8;

  // ── CTA strip ───────────────────────────────────────────
  ensureSpace(16);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...C.muted);
  doc.text("Ready for a fixed-scope quote? Contact us — no obligation.", margin, y);
  y += 5;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...C.violet);
  doc.text(CONTACT_EMAIL, margin, y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...C.muted);
  doc.text(SITE, pageW - margin, y, { align: "right" });

  // ── Footer on all pages ─────────────────────────────────
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const footerY = pageH - 12;
    doc.setDrawColor(...C.line);
    doc.setLineWidth(0.25);
    doc.line(margin, footerY, pageW - margin, footerY);

    if (iconData && !skipImages) {
      doc.addImage(iconData, "PNG", margin, footerY + 2, 5, 5);
    }
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...C.soft);
    doc.text("Veyra Labs  ·  Confidential project quote", margin + (iconData && !skipImages ? 7 : 0), footerY + 5.5);
    doc.text(`Page ${i} of ${pageCount}`, pageW - margin, footerY + 5.5, { align: "right" });
  }

  return doc;
}

export async function downloadEstimatePdf(estimate: ProjectEstimate): Promise<void> {
  const doc = await buildEstimatePdfDoc(estimate, false);
  doc.save(`veyra-labs-quote-${estimate.id}.pdf`);
}

/** Opens the designed PDF in a new tab and triggers the browser print dialog. */
export async function printEstimatePdf(estimate: ProjectEstimate): Promise<void> {
  const doc = await buildEstimatePdfDoc(estimate, false);
  const blobUrl = doc.output("bloburl");
  const win = window.open(blobUrl, "_blank");
  if (!win) {
    // Popup blocked — fall back to download
    doc.save(`veyra-labs-quote-${estimate.id}.pdf`);
    return;
  }
  // Give the PDF viewer a moment to load, then print
  win.addEventListener("load", () => {
    try {
      win.focus();
      win.print();
    } catch {
      // Viewer may not fire load the same way; try anyway
      win.print();
    }
  });
  // Some browsers don't fire load on blob PDFs — retry shortly
  setTimeout(() => {
    try {
      win.focus();
      win.print();
    } catch {
      /* ignore */
    }
  }, 600);
}
