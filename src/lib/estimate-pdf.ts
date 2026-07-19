import { jsPDF } from "jspdf";
import { getAppIconDataUrl, getWordmarkDataUrl } from "./brand-assets";
import { CONTACT_EMAIL } from "./content";
import { ESTIMATE_DISCLAIMER, formatUsd, type ProjectEstimate } from "./estimate";

const TAGLINE = "Software & AI Engineering Studio";
const SITE = "veyralabs.com";
const VALIDITY_DAYS = 30;

/** Production palette — light letterhead, one brand accent */
const ink = [17, 24, 39] as const;
const body = [55, 65, 81] as const;
const muted = [107, 114, 128] as const;
const faint = [156, 163, 175] as const;
const rule = [229, 231, 235] as const;
const wash = [249, 250, 251] as const;
const violet = [109, 76, 232] as const;
const white = [255, 255, 255] as const;

function rangeLabel(min: number, max: number): string {
  if (min === 0 && max === 0) return "Included";
  if (min === max) return formatUsd(min);
  return `${formatUsd(min)} – ${formatUsd(max)}`;
}

function addDays(iso: string, days: number): string {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function formatIssued(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
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
    keywords: "quote, project estimate, Veyra Labs",
    creator: "Veyra Labs Quote Builder",
  });

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const M = 20;
  const W = pageW - M * 2;
  const FOOTER_TOP = pageH - 18;
  const CONTENT_BOTTOM = FOOTER_TOP - 6;

  let wordmark: string | null = null;
  let icon: string | null = null;
  if (!skipImages) {
    try {
      [wordmark, icon] = await Promise.all([getWordmarkDataUrl(), getAppIconDataUrl()]);
    } catch {
      /* text fallback */
    }
  }

  const issued = formatIssued(estimate.createdAt);
  const validUntil = addDays(estimate.createdAt, VALIDITY_DAYS);
  let y = M;

  const setInk = () => doc.setTextColor(...ink);
  const setBody = () => doc.setTextColor(...body);
  const setMuted = () => doc.setTextColor(...muted);
  const setFaint = () => doc.setTextColor(...faint);
  const setViolet = () => doc.setTextColor(...violet);

  function hairline(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: readonly [number, number, number] = rule
  ) {
    doc.setDrawColor(color[0], color[1], color[2]);
    doc.setLineWidth(0.2);
    doc.line(x1, y1, x2, y2);
  }

  function sectionLabel(text: string, x: number, at: number) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    setFaint();
    doc.text(text.toUpperCase(), x, at);
  }

  function ensureSpace(needed: number) {
    if (y + needed <= CONTENT_BOTTOM) return;
    doc.addPage();
    y = M;
  }

  // ── Letterhead ──────────────────────────────────────────
  // Thin brand accent at very top
  doc.setFillColor(...violet);
  doc.rect(0, 0, pageW, 1.4, "F");

  if (wordmark && !skipImages) {
    doc.addImage(wordmark, "PNG", M, y - 1, 42, 10);
  } else {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    setInk();
    doc.text("Veyra Labs", M, y + 5);
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  setInk();
  doc.text("Quote", pageW - M, y + 4, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  setMuted();
  doc.text(TAGLINE, M, y + 12);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  setBody();
  doc.text(estimate.id, pageW - M, y + 11, { align: "right" });

  y += 18;
  hairline(M, y, pageW - M, y, [209, 213, 219]);
  y += 10;

  // ── Meta: Prepared for | Quote details ──────────────────
  const colW = (W - 12) / 2;
  const leftX = M;
  const rightX = M + colW + 12;
  const metaTop = y;

  sectionLabel("Prepared for", leftX, y);
  sectionLabel("Quote details", rightX, y);
  y += 5.5;

  let leftY = y;
  let rightY = y;

  const hasClient = Boolean(
    estimate.clientName?.trim() || estimate.clientEmail?.trim() || estimate.clientCompany?.trim()
  );

  if (hasClient) {
    if (estimate.clientName?.trim()) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11.5);
      setInk();
      const nameLines = doc.splitTextToSize(estimate.clientName.trim(), colW);
      doc.text(nameLines, leftX, leftY);
      leftY += nameLines.length * 5 + 1;
    }
    if (estimate.clientCompany?.trim()) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      setBody();
      const co = doc.splitTextToSize(estimate.clientCompany.trim(), colW);
      doc.text(co, leftX, leftY);
      leftY += co.length * 4.4 + 1;
    }
    if (estimate.clientEmail?.trim()) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      setMuted();
      doc.text(estimate.clientEmail.trim(), leftX, leftY);
      leftY += 4.5;
    }
  } else {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    setMuted();
    doc.text("—", leftX, leftY);
    leftY += 5;
  }

  const details: [string, string][] = [
    ["Issued", issued],
    ["Valid until", validUntil],
    ["Timeline", estimate.timeline],
    ["Currency", "USD"],
  ];

  for (const [label, value] of details) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    setFaint();
    doc.text(label, rightX, rightY);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    setInk();
    const lines = doc.splitTextToSize(value, colW - 28);
    doc.text(lines, rightX + 26, rightY);
    rightY += Math.max(5.2, lines.length * 4) + 1.8;
  }

  y = Math.max(leftY, rightY, metaTop + 28) + 6;
  hairline(M, y, pageW - M, y);
  y += 9;

  // ── Project ─────────────────────────────────────────────
  sectionLabel("Project", M, y);
  y += 5.5;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  setInk();
  const titleLines = doc.splitTextToSize(estimate.projectLabel, W);
  doc.text(titleLines, M, y);
  y += titleLines.length * 5.6 + 2;

  if (estimate.timelineNote?.trim()) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    setMuted();
    const noteLines = doc.splitTextToSize(estimate.timelineNote.trim(), W);
    doc.text(noteLines, M, y);
    y += noteLines.length * 4.2 + 8;
  } else {
    y += 6;
  }

  // ── Scope & pricing table ───────────────────────────────
  ensureSpace(30);
  sectionLabel("Scope & pricing", M, y);
  y += 4;

  const priceW = 44;
  const descW = W - priceW - 10;
  const rowPad = 3.2;

  // Header bar
  doc.setFillColor(...wash);
  doc.rect(M, y, W, 8, "F");
  hairline(M, y, pageW - M, y, [229, 231, 235]);
  hairline(M, y + 8, pageW - M, y + 8, [229, 231, 235]);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  setFaint();
  doc.text("#", M + 3, y + 5.3);
  doc.text("Description", M + 12, y + 5.3);
  doc.text("Amount", pageW - M - 3, y + 5.3, { align: "right" });
  y += 8;

  estimate.lineItems.forEach((item, index) => {
    const labelLines = doc.splitTextToSize(item.label, descW);
    const rowH = Math.max(9, labelLines.length * 4.1 + rowPad * 2);
    ensureSpace(rowH + 1);

    if (index % 2 === 1) {
      doc.setFillColor(252, 252, 253);
      doc.rect(M, y, W, rowH, "F");
    }

    const textY = y + rowPad + 3.6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    setFaint();
    doc.text(String(index + 1).padStart(2, "0"), M + 3, textY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    setInk();
    doc.text(labelLines, M + 12, textY);

    const amount = rangeLabel(item.min, item.max);
    const isIncluded = item.min === 0 && item.max === 0;
    doc.setFont("helvetica", isIncluded ? "normal" : "bold");
    doc.setFontSize(9.5);
    if (isIncluded) setMuted();
    else setInk();
    doc.text(amount, pageW - M - 3, textY, { align: "right" });

    y += rowH;
    hairline(M, y, pageW - M, y);
  });

  y += 8;

  // ── Total block ─────────────────────────────────────────
  ensureSpace(28);
  const totalBoxH = 22;
  doc.setFillColor(...ink);
  doc.rect(M, y, W, totalBoxH, "F");
  // Accent strip
  doc.setFillColor(...violet);
  doc.rect(M, y, 2.5, totalBoxH, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(196, 181, 253);
  doc.text("QUOTE RANGE", M + 8, y + 8);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(...white);
  doc.text(rangeLabel(estimate.totalMin, estimate.totalMax), pageW - M - 6, y + 10, {
    align: "right",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(156, 163, 175);
  doc.text(
    "Includes sprint demos and 30-day post-launch support",
    M + 8,
    y + 16.5
  );
  y += totalBoxH + 8;

  // ── Client notes ────────────────────────────────────────
  if (estimate.notes?.trim()) {
    ensureSpace(20);
    sectionLabel("Client notes", M, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    setBody();
    const notes = doc.splitTextToSize(estimate.notes.trim(), W);
    ensureSpace(notes.length * 4.2 + 6);
    doc.text(notes, M, y);
    y += notes.length * 4.2 + 8;
  }

  // ── Terms ───────────────────────────────────────────────
  const disc = doc.splitTextToSize(ESTIMATE_DISCLAIMER, W - 4);
  const termsH = 8 + disc.length * 3.4;
  ensureSpace(termsH + 14);

  sectionLabel("Terms", M, y);
  y += 4.5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  setMuted();
  doc.text(disc, M, y);
  y += disc.length * 3.4 + 8;

  // Next step
  hairline(M, y, pageW - M, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  setBody();
  doc.text("For a fixed-scope proposal, reply to this quote or email us — no obligation.", M, y);
  y += 5;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  setViolet();
  doc.text(CONTACT_EMAIL, M, y);
  doc.setFont("helvetica", "normal");
  setMuted();
  doc.text(SITE, pageW - M, y, { align: "right" });

  // ── Footers ─────────────────────────────────────────────
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    const fy = pageH - 14;
    hairline(M, fy, pageW - M, fy);

    if (icon && !skipImages) {
      doc.addImage(icon, "PNG", M, fy + 2.2, 4.5, 4.5);
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    setFaint();
    const leftPad = icon && !skipImages ? 7 : 0;
    doc.text(
      `Veyra Labs  ·  Confidential  ·  Valid ${VALIDITY_DAYS} days from issue`,
      M + leftPad,
      fy + 5.2
    );
    doc.text(`${i} / ${pages}`, pageW - M, fy + 5.2, { align: "right" });
  }

  return doc;
}

export async function downloadEstimatePdf(estimate: ProjectEstimate): Promise<void> {
  const doc = await buildEstimatePdfDoc(estimate, false);
  doc.save(`veyra-labs-quote-${estimate.id}.pdf`);
}

/** Print the designed PDF (not the webpage) via a hidden iframe. */
export async function printEstimatePdf(estimate: ProjectEstimate): Promise<void> {
  const doc = await buildEstimatePdfDoc(estimate, false);
  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);

  const iframe = document.createElement("iframe");
  iframe.setAttribute("title", "Print quote");
  Object.assign(iframe.style, {
    position: "fixed",
    right: "0",
    bottom: "0",
    width: "0",
    height: "0",
    border: "0",
    opacity: "0",
    pointerEvents: "none",
  });
  iframe.src = url;
  document.body.appendChild(iframe);

  const cleanup = () => {
    try {
      document.body.removeChild(iframe);
    } catch {
      /* already removed */
    }
    URL.revokeObjectURL(url);
  };

  const triggerPrint = () => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch {
      // Fallback: open PDF in a new tab
      window.open(url, "_blank");
    }
    window.setTimeout(cleanup, 1500);
  };

  iframe.onload = () => window.setTimeout(triggerPrint, 250);
  // Safety if onload never fires for blob PDFs
  window.setTimeout(triggerPrint, 800);
}
