import { jsPDF } from "jspdf";
import { getAppIconDataUrl, getLockupDarkDataUrl } from "./brand-assets";
import { CONTACT_EMAIL } from "./content";
import { ESTIMATE_DISCLAIMER, formatRange, formatUsd, type ProjectEstimate } from "./estimate";

const TAGLINE = "Software & AI Engineering Studio";

export async function buildEstimatePdfDoc(estimate: ProjectEstimate, skipImages = false): Promise<jsPDF> {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 16;
  const contentW = pageW - margin * 2;
  let y = margin;

  // One brand mark only — lockup already includes the V + wordmark (no separate icon)
  let lockupData: string | null = null;
  let iconData: string | null = null;
  if (!skipImages) {
    try {
      [lockupData, iconData] = await Promise.all([getLockupDarkDataUrl(), getAppIconDataUrl()]);
    } catch {
      // Text-only header if assets fail
    }
  }

  // Compact dark header
  const headerH = 34;
  doc.setFillColor(10, 12, 22);
  doc.rect(0, 0, pageW, headerH, "F");

  // Accent line under header
  doc.setFillColor(124, 92, 255);
  doc.rect(0, headerH, pageW, 0.6, "F");

  if (lockupData && !skipImages) {
    // Single lockup — ~48mm wide, vertically centered in header
    doc.addImage(lockupData, "PNG", margin, 8, 48, 11);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(140, 150, 170);
    doc.text(TAGLINE, margin, 26);
  } else {
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Veyra Labs", margin, 14);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(160, 170, 190);
    doc.text(TAGLINE, margin, 21);
  }

  doc.setTextColor(167, 139, 250);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("PROJECT ESTIMATE", pageW - margin, 11, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 210, 230);
  doc.setFontSize(8);
  doc.text(estimate.id, pageW - margin, 17, { align: "right" });
  doc.setTextColor(150, 160, 180);
  doc.text(
    new Date(estimate.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    pageW - margin,
    23,
    { align: "right" }
  );

  y = headerH + 10;

  // Prepared for
  if (estimate.clientName || estimate.clientEmail || estimate.clientCompany) {
    doc.setTextColor(100, 105, 120);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("PREPARED FOR", margin, y);
    y += 5;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(30, 35, 50);
    if (estimate.clientName) {
      doc.text(estimate.clientName, margin, y);
      y += 5;
    }
    if (estimate.clientCompany?.trim()) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(70, 75, 95);
      doc.text(estimate.clientCompany.trim(), margin, y);
      y += 5;
    }
    if (estimate.clientEmail) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(70, 75, 95);
      doc.text(estimate.clientEmail, margin, y);
      y += 5;
    }
    y += 4;
  }

  // Project summary card
  doc.setTextColor(30, 35, 50);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  const labelLines = doc.splitTextToSize(estimate.projectLabel, contentW - 12);
  const labelBlockH = Math.max(labelLines.length * 5, 5);
  const summaryH = 18 + labelBlockH;

  doc.setFillColor(246, 247, 252);
  doc.roundedRect(margin, y, contentW, summaryH, 2.5, 2.5, "F");
  doc.setDrawColor(124, 92, 255);
  doc.setLineWidth(0.4);
  doc.line(margin, y + 1, margin, y + summaryH - 1);
  doc.setLineWidth(0.2);

  doc.text(labelLines, margin + 6, y + 8);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(90, 95, 115);
  doc.text(`Timeline: ${estimate.timeline}`, margin + 6, y + 8 + labelBlockH + 3);
  doc.setTextColor(120, 125, 145);
  doc.text(estimate.timelineNote, margin + 6, y + 8 + labelBlockH + 8);
  y += summaryH + 8;

  // Table header
  doc.setFillColor(248, 249, 253);
  doc.rect(margin, y, contentW, 7, "F");
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(90, 95, 115);
  doc.text("ITEM", margin + 3, y + 4.8);
  doc.text("ESTIMATE (USD)", pageW - margin - 3, y + 4.8, { align: "right" });
  y += 7;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(40, 45, 60);

  for (const item of estimate.lineItems) {
    if (y > 248) {
      doc.addPage();
      y = margin;
    }
    const rowH = 8;
    doc.setDrawColor(232, 235, 245);
    doc.line(margin, y + rowH, margin + contentW, y + rowH);
    const label = doc.splitTextToSize(item.label, contentW - 45);
    doc.text(label, margin + 3, y + 5.5);
    const price =
      item.min === 0 && item.max === 0
        ? "Included"
        : item.min === item.max
          ? formatUsd(item.min)
          : formatRange(item.min, item.max);
    doc.setFont("helvetica", "bold");
    doc.text(price, pageW - margin - 3, y + 5.5, { align: "right" });
    doc.setFont("helvetica", "normal");
    y += Math.max(rowH, label.length * 4 + 2);
  }

  y += 5;

  // Total bar
  if (y > 250) {
    doc.addPage();
    y = margin;
  }
  doc.setFillColor(124, 92, 255);
  doc.roundedRect(margin, y, contentW, 14, 2.5, 2.5, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("Estimated total range", margin + 5, y + 8.5);
  doc.setFontSize(12);
  doc.text(formatRange(estimate.totalMin, estimate.totalMax), pageW - margin - 5, y + 9, {
    align: "right",
  });
  y += 20;

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 105, 120);
  doc.text("Includes sprint demos and 30-day post-launch support.", margin, y);
  y += 7;

  // Disclaimer
  const disclaimerLines = doc.splitTextToSize(ESTIMATE_DISCLAIMER, contentW - 8);
  const discH = 10 + disclaimerLines.length * 3.4;
  if (y + discH > 268) {
    doc.addPage();
    y = margin;
  }
  doc.setFillColor(255, 250, 235);
  doc.setDrawColor(230, 190, 100);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, contentW, discH, 2, 2, "FD");
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(150, 100, 20);
  doc.text("IMPORTANT  —  BALLPARK ONLY", margin + 4, y + 5.5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(90, 70, 35);
  doc.text(disclaimerLines, margin + 4, y + 10.5);
  y += discH + 6;

  if (estimate.notes?.trim()) {
    if (y > 255) {
      doc.addPage();
      y = margin;
    }
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(60, 65, 80);
    doc.text("Project notes", margin, y);
    y += 4.5;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 85, 100);
    const noteLines = doc.splitTextToSize(estimate.notes, contentW);
    doc.text(noteLines, margin, y);
  }

  // Footer — single small icon + contact line (no second wordmark)
  const footerY = 278;
  doc.setDrawColor(225, 228, 238);
  doc.setLineWidth(0.2);
  doc.line(margin, footerY, pageW - margin, footerY);

  const footerTextX = margin + (iconData && !skipImages ? 9 : 0);
  if (iconData && !skipImages) {
    doc.addImage(iconData, "PNG", margin, footerY + 2.5, 6, 6);
  }

  doc.setFontSize(7.5);
  doc.setTextColor(110, 115, 130);
  doc.text("For a fixed-scope quote, contact us — no obligation.", footerTextX, footerY + 5);
  doc.setTextColor(124, 92, 255);
  doc.setFont("helvetica", "bold");
  doc.text(CONTACT_EMAIL, footerTextX, footerY + 9.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(130, 135, 150);
  doc.text("veyralabs.com", pageW - margin, footerY + 9.5, { align: "right" });

  return doc;
}

export async function downloadEstimatePdf(estimate: ProjectEstimate): Promise<void> {
  const doc = await buildEstimatePdfDoc(estimate, false);
  doc.save(`veyra-labs-estimate-${estimate.id}.pdf`);
}

/** Convert a Blob to a Base64 data URL via FileReader (EmailJS-compatible). */
export function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("Could not convert PDF to Base64."));
        return;
      }
      resolve(reader.result);
    };
    reader.onerror = () => {
      reject(new Error("Failed to read the generated PDF."));
    };
    reader.readAsDataURL(blob);
  });
}

/**
 * Normalize to the exact format EmailJS expects:
 * data:application/pdf;base64,JVBERi0x...
 * (jsPDF sometimes inserts `;filename=generated.pdf` which we strip)
 */
export function normalizePdfDataUrl(dataUrl: string): string {
  const match = dataUrl.match(/^data:application\/pdf[^,]*,([\s\S]+)$/i);
  if (!match) {
    throw new Error("The estimate PDF is not in the correct Base64 format.");
  }
  return `data:application/pdf;base64,${match[1]}`;
}

/**
 * Build an EmailJS-ready PDF data URL from a project estimate.
 * Falls back to a compact (no-images) PDF if the payload would exceed ~50KB.
 */
export async function getEstimatePdfDataUrl(estimate: ProjectEstimate): Promise<string> {
  let doc = await buildEstimatePdfDoc(estimate, false);
  let blob = doc.output("blob");

  if (!(blob instanceof Blob) || blob.size === 0) {
    throw new Error("The estimate PDF was not generated correctly.");
  }

  let dataUrl = normalizePdfDataUrl(await blobToDataURL(blob));

  // EmailJS free plan variable payload limit ~50KB
  if (dataUrl.length > 65000) {
    console.warn(
      `PDF data URL (${dataUrl.length} chars) exceeds EmailJS free limit. Generating compact version...`
    );
    doc = await buildEstimatePdfDoc(estimate, true);
    blob = doc.output("blob");
    if (!(blob instanceof Blob) || blob.size === 0) {
      throw new Error("The compact estimate PDF was not generated correctly.");
    }
    dataUrl = normalizePdfDataUrl(await blobToDataURL(blob));
  }

  if (!dataUrl.startsWith("data:application/pdf;base64,")) {
    throw new Error("The estimate PDF is not in the correct Base64 format.");
  }

  return dataUrl;
}

/** @deprecated Prefer getEstimatePdfDataUrl — kept for any legacy callers */
export async function getEstimatePdfBase64(estimate: ProjectEstimate): Promise<string> {
  return getEstimatePdfDataUrl(estimate);
}
