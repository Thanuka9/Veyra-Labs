import { jsPDF } from "jspdf";
import { getAppIconDataUrl, getLockupDarkDataUrl, getWordmarkDataUrl } from "./brand-assets";
import { CONTACT_EMAIL } from "./content";
import { ESTIMATE_DISCLAIMER, formatUsd, type ProjectEstimate } from "./estimate";

const TAGLINE = "Software & AI Engineering Studio";
const SITE = "veyralabs.com";
const VALIDITY_DAYS = 30;

const ink = [15, 23, 42] as const;
const body = [51, 65, 85] as const;
const muted = [100, 116, 139] as const;
const faint = [148, 163, 184] as const;
const line = [226, 232, 240] as const;
const wash = [248, 250, 252] as const;
const violet = [124, 92, 255] as const;
const indigo = [91, 109, 255] as const;
const cyan = [34, 211, 238] as const;
const white = [255, 255, 255] as const;
const night = [8, 10, 20] as const;

function rangeLabel(min: number, max: number): string {
  if (min === 0 && max === 0) return "Included";
  if (min === max) return formatUsd(min);
  return `${formatUsd(min)} – ${formatUsd(max)}`;
}

function addDays(iso: string, days: number): string {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function formatIssued(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Fake a left→right gradient with thin vertical strips */
function fillHGradient(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  from: readonly [number, number, number],
  mid: readonly [number, number, number],
  to: readonly [number, number, number]
) {
  const steps = Math.max(24, Math.floor(w));
  const stepW = w / steps;
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    let r: number, g: number, b: number;
    if (t < 0.5) {
      const u = t * 2;
      r = from[0] + (mid[0] - from[0]) * u;
      g = from[1] + (mid[1] - from[1]) * u;
      b = from[2] + (mid[2] - from[2]) * u;
    } else {
      const u = (t - 0.5) * 2;
      r = mid[0] + (to[0] - mid[0]) * u;
      g = mid[1] + (to[1] - mid[1]) * u;
      b = mid[2] + (to[2] - mid[2]) * u;
    }
    doc.setFillColor(Math.round(r), Math.round(g), Math.round(b));
    doc.rect(x + i * stepW, y, stepW + 0.15, h, "F");
  }
}

export async function buildEstimatePdfDoc(
  estimate: ProjectEstimate,
  skipImages = false
): Promise<jsPDF> {
  const doc = new jsPDF({ unit: "mm", format: "a4", compress: true });
  doc.setProperties({
    title: `Veyra Labs Quote — ${estimate.id}`,
    subject: estimate.projectLabel,
    author: "Veyra Labs",
    keywords: "quote, Veyra Labs",
    creator: "Veyra Labs Quote Builder",
  });

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const M = 16;
  const W = pageW - M * 2;
  const FOOTER_Y = pageH - 14;
  const CONTENT_BOTTOM = FOOTER_Y - 8;

  let lockupDark: string | null = null;
  let wordmark: string | null = null;
  let icon: string | null = null;
  if (!skipImages) {
    try {
      [lockupDark, wordmark, icon] = await Promise.all([
        getLockupDarkDataUrl(),
        getWordmarkDataUrl(),
        getAppIconDataUrl(),
      ]);
    } catch {
      /* text fallback */
    }
  }

  const issued = formatIssued(estimate.createdAt);
  const validUntil = addDays(estimate.createdAt, VALIDITY_DAYS);
  let y = 0;

  const setInk = () => doc.setTextColor(...ink);
  const setBody = () => doc.setTextColor(...body);
  const setMuted = () => doc.setTextColor(...muted);
  const setFaint = () => doc.setTextColor(...faint);

  function hairline(x1: number, y1: number, x2: number, y2: number, c = line) {
    doc.setDrawColor(...c);
    doc.setLineWidth(0.25);
    doc.line(x1, y1, x2, y2);
  }

  function ensureSpace(needed: number) {
    if (y + needed <= CONTENT_BOTTOM) return;
    doc.addPage();
    // Continuation header accent
    fillHGradient(doc, 0, 0, pageW, 1.2, violet, indigo, cyan);
    y = M + 4;
  }

  function pill(label: string, x: number, at: number, maxW = 48): number {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    const tw = doc.getTextWidth(label) + 6;
    const w = Math.min(tw, maxW);
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(x, at - 3.6, w, 6.2, 3.1, 3.1, "F");
    doc.setTextColor(...muted);
    doc.text(label, x + 3, at);
    return w + 2.5;
  }

  // ════════════════════════════════════════════════════════
  // HERO HEADER — dark cinematic band
  // ════════════════════════════════════════════════════════
  const headerH = 42;
  doc.setFillColor(...night);
  doc.rect(0, 0, pageW, headerH, "F");

  // Soft ambient blobs (cheap depth)
  doc.setFillColor(40, 28, 90);
  doc.circle(pageW - 18, 8, 28, "F");
  doc.setFillColor(20, 50, 80);
  doc.circle(12, 36, 22, "F");

  // Top gradient accent
  fillHGradient(doc, 0, 0, pageW, 1.6, violet, indigo, cyan);

  if (lockupDark && !skipImages) {
    doc.addImage(lockupDark, "PNG", M, 10, 48, 11);
  } else if (wordmark && !skipImages) {
    doc.addImage(wordmark, "PNG", M, 10, 42, 10);
  } else {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(...white);
    doc.text("Veyra Labs", M, 17);
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(TAGLINE, M, 28);

  // Right: document type badge
  doc.setFillColor(124, 92, 255);
  doc.roundedRect(pageW - M - 34, 11, 34, 7, 3.5, 3.5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...white);
  doc.text("PROJECT QUOTE", pageW - M - 17, 15.6, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225);
  doc.text(estimate.id, pageW - M, 24, { align: "right" });
  doc.setTextColor(148, 163, 184);
  doc.text(issued, pageW - M, 29.5, { align: "right" });

  // Bottom gradient rail under header
  fillHGradient(doc, 0, headerH, pageW, 1.4, violet, indigo, cyan);

  y = headerH + 10;

  // ════════════════════════════════════════════════════════
  // HERO SUMMARY CARD — price front and center
  // ════════════════════════════════════════════════════════
  const titleLines = doc.splitTextToSize(estimate.projectLabel, W - 16);
  const heroH = 28 + titleLines.length * 5.2;

  doc.setFillColor(...wash);
  doc.roundedRect(M, y, W, heroH, 3.5, 3.5, "F");
  doc.setDrawColor(...line);
  doc.setLineWidth(0.3);
  doc.roundedRect(M, y, W, heroH, 3.5, 3.5, "S");
  // Left accent
  fillHGradient(doc, M, y + 2, 2.2, heroH - 4, violet, indigo, cyan);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...violet);
  doc.text("ESTIMATED INVESTMENT", M + 8, y + 7);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  setInk();
  doc.text(rangeLabel(estimate.totalMin, estimate.totalMax), M + 8, y + 16);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  setInk();
  doc.text(titleLines, M + 8, y + 22.5);

  // Right meta chips inside hero
  const chipX = pageW - M - 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  setMuted();
  doc.text(`Timeline  ·  ${estimate.timeline}`, chipX, y + 10, { align: "right" });
  doc.text(`Valid until  ·  ${validUntil}`, chipX, y + 15.5, { align: "right" });
  doc.text("Currency  ·  USD", chipX, y + 21, { align: "right" });

  y += heroH + 6;

  // Timeline note as soft pills row
  if (estimate.timelineNote?.trim()) {
    let px = M;
    px += pill(estimate.timelineNote.trim().slice(0, 42), px, y + 1, 70);
    px += pill(`${VALIDITY_DAYS}-day validity`, px, y + 1, 40);
    pill("Sprint demos included", px, y + 1, 48);
    y += 10;
  }

  // ════════════════════════════════════════════════════════
  // PREPARED FOR  |  DETAILS  (two soft cards)
  // ════════════════════════════════════════════════════════
  const colGap = 4;
  const colW = (W - colGap) / 2;
  const cardH = 28;
  ensureSpace(cardH + 8);

  // Left card
  doc.setFillColor(...white);
  doc.setDrawColor(...line);
  doc.setLineWidth(0.3);
  doc.roundedRect(M, y, colW, cardH, 2.5, 2.5, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  setFaint();
  doc.text("PREPARED FOR", M + 4, y + 5.5);

  let ly = y + 11;
  const hasClient = Boolean(
    estimate.clientName?.trim() || estimate.clientEmail?.trim() || estimate.clientCompany?.trim()
  );
  if (hasClient) {
    if (estimate.clientName?.trim()) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      setInk();
      const n = doc.splitTextToSize(estimate.clientName.trim(), colW - 8);
      doc.text(n.slice(0, 1), M + 4, ly);
      ly += 5;
    }
    if (estimate.clientCompany?.trim()) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      setBody();
      doc.text(doc.splitTextToSize(estimate.clientCompany.trim(), colW - 8)[0], M + 4, ly);
      ly += 4.2;
    }
    if (estimate.clientEmail?.trim()) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      setMuted();
      doc.text(estimate.clientEmail.trim(), M + 4, ly);
    }
  } else {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    setMuted();
    doc.text("—", M + 4, ly);
  }

  // Right card
  const rx = M + colW + colGap;
  doc.setFillColor(...white);
  doc.roundedRect(rx, y, colW, cardH, 2.5, 2.5, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  setFaint();
  doc.text("QUOTE DETAILS", rx + 4, y + 5.5);

  const detailRows: [string, string][] = [
    ["Reference", estimate.id],
    ["Issued", issued],
    ["Timeline", estimate.timeline],
  ];
  let ry = y + 11;
  for (const [k, v] of detailRows) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    setFaint();
    doc.text(k, rx + 4, ry);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    setInk();
    doc.text(v, rx + colW - 4, ry, { align: "right" });
    ry += 5;
  }

  y += cardH + 8;

  // ════════════════════════════════════════════════════════
  // SCOPE TABLE
  // ════════════════════════════════════════════════════════
  ensureSpace(24);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  setInk();
  doc.text("Scope & pricing", M, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  setFaint();
  doc.text(`${estimate.lineItems.length} line items`, pageW - M, y, { align: "right" });
  y += 4;

  const descW = W - 52;
  // Table header with gradient
  fillHGradient(doc, M, y, W, 8, [30, 27, 55], [25, 35, 70], [20, 45, 70]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(203, 213, 225);
  doc.text("#", M + 4, y + 5.3);
  doc.text("Description", M + 14, y + 5.3);
  doc.text("Amount (USD)", pageW - M - 4, y + 5.3, { align: "right" });
  y += 8;

  estimate.lineItems.forEach((item, index) => {
    const labelLines = doc.splitTextToSize(item.label, descW);
    const rowH = Math.max(9.5, labelLines.length * 4 + 5);
    ensureSpace(rowH + 1);

    if (index % 2 === 0) {
      doc.setFillColor(250, 251, 253);
      doc.rect(M, y, W, rowH, "F");
    }

    const textY = y + 5.5;

    // Number badge
    doc.setFillColor(237, 233, 254);
    doc.circle(M + 5.5, textY - 1.2, 2.6, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(...violet);
    doc.text(String(index + 1), M + 5.5, textY, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    setInk();
    doc.text(labelLines, M + 12, textY);

    const amount = rangeLabel(item.min, item.max);
    const included = item.min === 0 && item.max === 0;
    doc.setFont("helvetica", included ? "normal" : "bold");
    doc.setFontSize(9);
    if (included) {
      doc.setTextColor(...cyan);
      // small included chip feel
      setMuted();
    } else setInk();
    if (included) {
      doc.setFillColor(236, 254, 255);
      const aw = doc.getTextWidth("Included") + 5;
      doc.roundedRect(pageW - M - 4 - aw, textY - 3.4, aw, 5.5, 2.5, 2.5, "F");
      doc.setTextColor(8, 145, 178);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.text("Included", pageW - M - 4 - aw / 2, textY, { align: "center" });
    } else {
      doc.text(amount, pageW - M - 4, textY, { align: "right" });
    }

    y += rowH;
  });

  y += 6;

  // ════════════════════════════════════════════════════════
  // TOTAL + INCLUSIONS
  // ════════════════════════════════════════════════════════
  ensureSpace(36);
  const totalH = 20;
  doc.setFillColor(...night);
  doc.roundedRect(M, y, W, totalH, 3, 3, "F");
  fillHGradient(doc, M, y, W, 1.2, violet, indigo, cyan);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(196, 181, 253);
  doc.text("QUOTE RANGE", M + 6, y + 8);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...white);
  doc.text(rangeLabel(estimate.totalMin, estimate.totalMax), pageW - M - 6, y + 12, {
    align: "right",
  });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text("Ballpark investment · USD", M + 6, y + 14.5);
  y += totalH + 5;

  // What’s included strip
  ensureSpace(16);
  doc.setFillColor(245, 243, 255);
  doc.roundedRect(M, y, W, 12, 2.5, 2.5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(...violet);
  doc.text("ALWAYS INCLUDED", M + 4, y + 4.5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  setBody();
  doc.text(
    "Sprint demos   ·   Source code handoff   ·   30-day post-launch support   ·   Staging access",
    M + 4,
    y + 9
  );
  y += 16;

  // ════════════════════════════════════════════════════════
  // NOTES
  // ════════════════════════════════════════════════════════
  if (estimate.notes?.trim()) {
    ensureSpace(18);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    setFaint();
    doc.text("CLIENT NOTES", M, y);
    y += 4;
    doc.setFillColor(...wash);
    doc.roundedRect(M, y, W, 2, 1, 1, "F"); // spacer start
    const notes = doc.splitTextToSize(estimate.notes.trim(), W - 8);
    const notesH = notes.length * 4 + 6;
    ensureSpace(notesH + 2);
    doc.setFillColor(...wash);
    doc.roundedRect(M, y, W, notesH, 2.5, 2.5, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    setBody();
    doc.text(notes, M + 4, y + 5);
    y += notesH + 6;
  }

  // ════════════════════════════════════════════════════════
  // TERMS + NEXT STEP
  // ════════════════════════════════════════════════════════
  const disc = doc.splitTextToSize(ESTIMATE_DISCLAIMER, W - 8);
  ensureSpace(disc.length * 3.3 + 28);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  setFaint();
  doc.text("TERMS", M, y);
  y += 4;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  setMuted();
  doc.text(disc, M, y);
  y += disc.length * 3.3 + 6;

  // CTA card
  ensureSpace(18);
  doc.setFillColor(...night);
  doc.roundedRect(M, y, W, 16, 3, 3, "F");
  fillHGradient(doc, M, y + 16 - 1.2, W, 1.2, violet, indigo, cyan);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...white);
  doc.text("Ready for a fixed-scope proposal?", M + 5, y + 6.5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text("Reply to this quote — no obligation.", M + 5, y + 11.5);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...cyan);
  doc.text(CONTACT_EMAIL, pageW - M - 5, y + 6.5, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(SITE, pageW - M - 5, y + 11.5, { align: "right" });

  // ════════════════════════════════════════════════════════
  // FOOTERS (one icon only — never logo spam)
  // ════════════════════════════════════════════════════════
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    const fy = pageH - 12;
    hairline(M, fy, pageW - M, fy, [226, 232, 240]);

    if (icon && !skipImages && i === pages) {
      // Tiny mark only on last page footer
      doc.addImage(icon, "PNG", M, fy + 2, 4, 4);
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    setFaint();
    const pad = icon && !skipImages && i === pages ? 6.5 : 0;
    doc.text(
      `Veyra Labs  ·  Confidential project quote  ·  Valid ${VALIDITY_DAYS} days`,
      M + pad,
      fy + 4.8
    );
    doc.text(`${i} / ${pages}`, pageW - M, fy + 4.8, { align: "right" });
  }

  return doc;
}

export async function downloadEstimatePdf(estimate: ProjectEstimate): Promise<void> {
  const doc = await buildEstimatePdfDoc(estimate, false);
  doc.save(`veyra-labs-quote-${estimate.id}.pdf`);
}

/**
 * Print the designed quote PDF only — never the webpage.
 * Opens the PDF in a new tab with auto-print. If the popup is blocked, downloads the PDF instead.
 */
export async function printEstimatePdf(estimate: ProjectEstimate): Promise<void> {
  const doc = await buildEstimatePdfDoc(estimate, false);
  doc.autoPrint();

  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);

  const win = window.open(url, "_blank");
  if (!win) {
    URL.revokeObjectURL(url);
    doc.save(`veyra-labs-quote-${estimate.id}.pdf`);
    return;
  }

  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
