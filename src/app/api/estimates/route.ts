import { NextResponse } from "next/server";
import {
  ADDON_PROJECT_TYPES,
  CORE_PROJECT_TYPES,
  type ProjectTypeId,
} from "@/lib/estimate";
import { createTrackedEstimate } from "@/lib/estimate-store";
import type { EstimateSource } from "@/lib/estimate-client";
import { isEstimateDbConfigured } from "@/lib/estimate-db";
import {
  checkRateLimit,
  clientIpFromRequest,
  rateLimitResponse,
} from "@/lib/rate-limit";

export const runtime = "nodejs";

const VALID_TYPES = new Set<string>([
  ...CORE_PROJECT_TYPES.map((p) => p.id),
  ...ADDON_PROJECT_TYPES.map((p) => p.id),
]);

const VALID_SOURCES = new Set<EstimateSource>(["quote_page", "chat", "api"]);

type Body = {
  projectTypeIds?: unknown;
  selectedScopeIds?: unknown;
  timelineId?: unknown;
  clientName?: unknown;
  clientEmail?: unknown;
  clientCompany?: unknown;
  notes?: unknown;
  source?: unknown;
};

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function POST(request: Request) {
  const ip = clientIpFromRequest(request);
  const limited = checkRateLimit(`estimates:post:${ip}`, { limit: 6, windowMs: 60_000 });
  if (!limited.ok) {
    return rateLimitResponse(limited.retryAfterSec);
  }

  if (!isEstimateDbConfigured()) {
    return NextResponse.json(
      {
        error:
          "Estimate tracking is not configured. Set DATABASE_URL (Neon/Postgres) and run sql/estimates.sql.",
      },
      { status: 503 }
    );
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return badRequest("Invalid JSON body.");
  }

  const projectTypeIds = Array.isArray(body.projectTypeIds)
    ? body.projectTypeIds.filter((id): id is ProjectTypeId => typeof id === "string" && VALID_TYPES.has(id))
    : [];

  if (projectTypeIds.length === 0) {
    return badRequest("Select at least one valid service.");
  }

  const selectedScopeIds = Array.isArray(body.selectedScopeIds)
    ? body.selectedScopeIds.filter((id): id is string => typeof id === "string")
    : [];

  const timelineId = body.timelineId === "rush" ? "rush" : "standard";
  const source =
    typeof body.source === "string" && VALID_SOURCES.has(body.source as EstimateSource)
      ? (body.source as EstimateSource)
      : "api";

  const clientName = typeof body.clientName === "string" ? body.clientName.trim() : "";
  const clientEmail = typeof body.clientEmail === "string" ? body.clientEmail.trim() : "";
  if (!clientName || !clientEmail) {
    return badRequest("Name and email are required to create a tracked estimate.");
  }

  try {
    const { estimate, tracked } = await createTrackedEstimate({
      projectTypeIds,
      selectedScopeIds,
      timelineId,
      clientName,
      clientEmail,
      clientCompany:
        typeof body.clientCompany === "string" ? body.clientCompany.trim() || undefined : undefined,
      notes: typeof body.notes === "string" ? body.notes.trim() || undefined : undefined,
      source,
      userAgent: request.headers.get("user-agent"),
      referer: request.headers.get("referer"),
    });

    return NextResponse.json({ estimate, tracked }, { status: 201 });
  } catch (err) {
    console.error("Failed to create tracked estimate:", err);
    const detail = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      {
        error: `Could not save estimate. ${detail.includes("DATABASE_URL") || detail.includes("does not exist") || detail.includes("relation") ? detail : "Please try again or contact us directly."}`,
        detail,
      },
      { status: 500 }
    );
  }
}
