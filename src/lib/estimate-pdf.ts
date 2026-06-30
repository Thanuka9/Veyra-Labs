import { jsPDF } from "jspdf";
import { getAppIconDataUrl, getWordmarkDataUrl } from "./brand-assets";
import { CONTACT_EMAIL } from "./content";
import { ESTIMATE_DISCLAIMER, formatRange, formatUsd, type ProjectEstimate } from "./estimate";

const TAGLINE = "Software & AI Engineering Studio";

export async function buildEstimatePdfDoc(estimate: ProjectEstimate, skipImages = false): Promise<jsPDF> {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 18;
  const contentW = pageW - margin * 2;
  let y = margin;

  // Load brand assets
  let wordmarkData: string | null = null;
  let iconData: string | null = null;
  if (!skipImages) {
    try {
      [wordmarkData, iconData] = await Promise.all([getWordmarkDataUrl(), getAppIconDataUrl()]);
    } catch {
      // Fall back to text-only header if assets fail to load
    }
  }

  // Header bar
  doc.setFillColor(10, 12, 22);
  doc.rect(0, 0, pageW, 44, "F");

  if (iconData && !skipImages) {
    doc.addImage(iconData, "PNG", margin, 9, 12, 12);
  }

  if (wordmarkData && !skipImages) {
    doc.addImage(wordmarkData, "PNG", margin + (iconData ? 14 : 0), 11, 52, 11);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(140, 150, 170);
    doc.text(TAGLINE, margin + (iconData ? 14 : 0), 28);
  } else {
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Veyra Labs", margin, 18);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(180, 190, 210);
    doc.text(TAGLINE, margin, 26);
  }

  doc.setTextColor(124, 92, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("PROJECT ESTIMATE", pageW - margin, 14, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 210, 230);
  doc.text(estimate.id, pageW - margin, 20, { align: "right" });
  doc.text(
    new Date(estimate.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    pageW - margin,
    26,
    { align: "right" }
  );

  y = 54;

  if (estimate.clientName || estimate.clientEmail) {
    doc.setTextColor(40, 45, 60);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Prepared for", margin, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 65, 80);
    if (estimate.clientName) {
      doc.text(estimate.clientName, margin, y);
      y += 5;
    }
    if (estimate.clientEmail) {
      doc.text(estimate.clientEmail, margin, y);
      y += 5;
    }
    y += 4;
  }

  doc.setTextColor(40, 45, 60);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  const labelLines = doc.splitTextToSize(estimate.projectLabel, contentW - 10);
  const labelBlockH = labelLines.length * 5;
  const summaryH = 22 + labelBlockH;

  doc.setFillColor(245, 246, 250);
  doc.roundedRect(margin, y, contentW, summaryH, 3, 3, "F");
  doc.text(labelLines, margin + 5, y + 10);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(90, 95, 110);
  doc.text(`Estimated timeline: ${estimate.timeline}`, margin + 5, y + 10 + labelBlockH + 4);
  doc.text(estimate.timelineNote, margin + 5, y + 10 + labelBlockH + 10);
  y += summaryH + 8;

  doc.setDrawColor(220, 225, 235);
  doc.setFillColor(250, 251, 253);
  doc.rect(margin, y, contentW, 8, "F");
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(80, 85, 100);
  doc.text("Item", margin + 3, y + 5.5);
  doc.text("Estimate (USD)", pageW - margin - 3, y + 5.5, { align: "right" });
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(50, 55, 70);

  for (const item of estimate.lineItems) {
    if (y > 250) {
      doc.addPage();
      y = margin;
    }
    const rowH = 9;
    doc.setDrawColor(235, 238, 245);
    doc.line(margin, y + rowH, margin + contentW, y + rowH);
    doc.text(item.label, margin + 3, y + 6);
    const price =
      item.min === 0 && item.max === 0
        ? "Included"
        : item.min === item.max
          ? formatUsd(item.min)
          : formatRange(item.min, item.max);
    doc.text(price, pageW - margin - 3, y + 6, { align: "right" });
    y += rowH;
  }

  y += 4;
  doc.setFillColor(124, 92, 255);
  doc.roundedRect(margin, y, contentW, 16, 3, 3, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Estimated total range", margin + 5, y + 7);
  doc.setFontSize(13);
  doc.text(formatRange(estimate.totalMin, estimate.totalMax), pageW - margin - 5, y + 10, {
    align: "right",
  });
  y += 24;

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(90, 95, 110);
  doc.text("All estimates include sprint demos and 30-day post-launch support.", margin, y);
  y += 8;

  doc.setFillColor(255, 248, 230);
  doc.setDrawColor(230, 180, 80);
  doc.roundedRect(margin, y, contentW, 32, 2, 2, "FD");
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(140, 90, 20);
  doc.text("IMPORTANT DISCLAIMER", margin + 4, y + 7);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(80, 60, 30);
  const disclaimerLines = doc.splitTextToSize(ESTIMATE_DISCLAIMER, contentW - 8);
  doc.text(disclaimerLines, margin + 4, y + 13);
  y += 38;

  if (estimate.notes?.trim()) {
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(60, 65, 80);
    doc.text("Project notes", margin, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 85, 100);
    const noteLines = doc.splitTextToSize(estimate.notes, contentW);
    doc.text(noteLines, margin, y);
  }

  const footerY = 280;
  doc.setDrawColor(220, 225, 235);
  doc.line(margin, footerY, pageW - margin, footerY);

  if (iconData && !skipImages) {
    doc.addImage(iconData, "PNG", margin, footerY + 3, 8, 8);
  }

  doc.setFontSize(8);
  doc.setTextColor(100, 105, 120);
  doc.text("For a fixed-scope quote, book a free discovery call  -  no obligation.", margin + (iconData && !skipImages ? 10 : 0), footerY + 6);
  doc.setTextColor(124, 92, 255);
  doc.text(CONTACT_EMAIL, margin + (iconData && !skipImages ? 10 : 0), footerY + 11);
  doc.setTextColor(120, 125, 140);
  doc.text("veyralabs.com", pageW - margin, footerY + 11, { align: "right" });

  return doc;
}

export async function downloadEstimatePdf(estimate: ProjectEstimate): Promise<void> {
  const doc = await buildEstimatePdfDoc(estimate, false);
  doc.save(`veyra-labs-estimate-${estimate.id}.pdf`);
}

export async function getEstimatePdfBase64(estimate: ProjectEstimate): Promise<string> {
  // Try generating with images first
  let doc = await buildEstimatePdfDoc(estimate, false);
  let base64 = doc.output("datauristring");

  // EmailJS free plan size limit is 50KB (approx 65,000 chars in data URI)
  if (base64.length > 65000) {
    console.warn(`PDF base64 size (${base64.length} chars) exceeds EmailJS free limit. Generating compact version...`);
    doc = await buildEstimatePdfDoc(estimate, true);
    base64 = doc.output("datauristring");
  }

  return base64;
}
