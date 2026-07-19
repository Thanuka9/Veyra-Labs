import { NextResponse } from "next/server";
import { getEstimateById, markEstimateEmailSent } from "@/lib/estimate-store";
import { isEstimateDbConfigured } from "@/lib/estimate-db";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  if (!isEstimateDbConfigured()) {
    return NextResponse.json({ error: "Estimate tracking is not configured." }, { status: 503 });
  }

  const { id } = await params;
  if (!id || !/^VL-\d{8}-[A-Z0-9]+$/i.test(id)) {
    return NextResponse.json({ error: "Invalid estimate ID." }, { status: 400 });
  }

  try {
    const row = await getEstimateById(id);
    if (!row) {
      return NextResponse.json({ error: "Estimate not found." }, { status: 404 });
    }

    // Public-safe summary (no notes / full payload dump)
    return NextResponse.json({
      id: row.id,
      createdAt: row.created_at,
      projectLabel: row.project_label,
      timeline: row.timeline,
      totalMin: row.total_min,
      totalMax: row.total_max,
      emailSent: row.email_sent,
      source: row.source,
    });
  } catch (err) {
    console.error("Failed to load estimate:", err);
    return NextResponse.json({ error: "Could not load estimate." }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: Params) {
  if (!isEstimateDbConfigured()) {
    return NextResponse.json({ error: "Estimate tracking is not configured." }, { status: 503 });
  }

  const { id } = await params;
  if (!id || !/^VL-\d{8}-[A-Z0-9]+$/i.test(id)) {
    return NextResponse.json({ error: "Invalid estimate ID." }, { status: 400 });
  }

  let body: { emailSent?: unknown };
  try {
    body = (await request.json()) as { emailSent?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (typeof body.emailSent !== "boolean") {
    return NextResponse.json({ error: "emailSent boolean is required." }, { status: 400 });
  }

  try {
    const existing = await getEstimateById(id);
    if (!existing) {
      return NextResponse.json({ error: "Estimate not found." }, { status: 404 });
    }
    await markEstimateEmailSent(id, body.emailSent);
    return NextResponse.json({ ok: true, id, emailSent: body.emailSent });
  } catch (err) {
    console.error("Failed to update estimate:", err);
    return NextResponse.json({ error: "Could not update estimate." }, { status: 500 });
  }
}
