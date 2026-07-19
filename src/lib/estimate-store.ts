import {
  buildEstimate,
  generateEstimateId,
  type ProjectEstimate,
  type ProjectTypeId,
} from "./estimate";
import { getEstimateDb, isEstimateDbConfigured } from "./estimate-db";
import type { EstimateSource } from "./estimate-client";

export type { EstimateSource };

export type CreateEstimateInput = {
  projectTypeIds: ProjectTypeId[];
  selectedScopeIds: string[];
  timelineId: "standard" | "rush";
  clientName?: string;
  clientEmail?: string;
  clientCompany?: string;
  notes?: string;
  source: EstimateSource;
  userAgent?: string | null;
  referer?: string | null;
};

export type StoredEstimateRow = {
  id: string;
  created_at: string;
  source: string;
  client_name: string | null;
  client_email: string | null;
  client_company: string | null;
  project_label: string;
  project_type_ids: ProjectTypeId[];
  selected_scope: string[];
  timeline: string | null;
  timeline_note: string | null;
  total_min: number;
  total_max: number;
  line_items: ProjectEstimate["lineItems"];
  notes: string | null;
  email_sent: boolean;
  payload: ProjectEstimate;
};

function asJson<T>(value: unknown, fallback: T): T {
  if (value == null) return fallback;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  return value as T;
}

export async function createTrackedEstimate(
  input: CreateEstimateInput
): Promise<{ estimate: ProjectEstimate; tracked: true }> {
  if (!isEstimateDbConfigured()) {
    throw new Error("Estimate tracking database is not configured (DATABASE_URL).");
  }

  const db = getEstimateDb();
  let lastError: unknown;

  // Retry a few times if an ID collides (extremely unlikely).
  for (let attempt = 0; attempt < 5; attempt++) {
    const id = generateEstimateId();
    const createdAt = new Date().toISOString();
    const estimate = buildEstimate({
      ...input,
      id,
      createdAt,
    });

    try {
      await db`
        INSERT INTO estimates (
          id,
          created_at,
          source,
          client_name,
          client_email,
          client_company,
          project_label,
          project_type_ids,
          selected_scope,
          timeline,
          timeline_note,
          total_min,
          total_max,
          line_items,
          notes,
          email_sent,
          payload,
          user_agent,
          referer
        ) VALUES (
          ${estimate.id},
          ${estimate.createdAt},
          ${input.source},
          ${estimate.clientName ?? null},
          ${estimate.clientEmail ?? null},
          ${estimate.clientCompany ?? null},
          ${estimate.projectLabel},
          ${JSON.stringify(estimate.projectTypeIds)},
          ${JSON.stringify(estimate.selectedScope)},
          ${estimate.timeline},
          ${estimate.timelineNote},
          ${estimate.totalMin},
          ${estimate.totalMax},
          ${JSON.stringify(estimate.lineItems)},
          ${estimate.notes ?? null},
          ${false},
          ${JSON.stringify(estimate)},
          ${input.userAgent ?? null},
          ${input.referer ?? null}
        )
      `;

      return { estimate, tracked: true };
    } catch (err) {
      lastError = err;
      const message = err instanceof Error ? err.message : String(err);
      // Unique violation → try another ID
      if (/duplicate key|unique constraint|23505/i.test(message)) {
        continue;
      }
      throw err;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Could not allocate a unique estimate ID.");
}

export async function markEstimateEmailSent(id: string, sent: boolean): Promise<void> {
  if (!isEstimateDbConfigured()) return;
  const db = getEstimateDb();
  await db`
    UPDATE estimates
    SET email_sent = ${sent}
    WHERE id = ${id}
  `;
}

export async function getEstimateById(id: string): Promise<StoredEstimateRow | null> {
  if (!isEstimateDbConfigured()) {
    throw new Error("Estimate tracking database is not configured (DATABASE_URL).");
  }

  const db = getEstimateDb();
  const rows = await db`
    SELECT
      id,
      created_at,
      source,
      client_name,
      client_email,
      client_company,
      project_label,
      project_type_ids,
      selected_scope,
      timeline,
      timeline_note,
      total_min,
      total_max,
      line_items,
      notes,
      email_sent,
      payload
    FROM estimates
    WHERE id = ${id}
    LIMIT 1
  `;

  const row = rows[0];
  if (!row) return null;

  return {
    id: String(row.id),
    created_at: String(row.created_at),
    source: String(row.source),
    client_name: (row.client_name as string | null) ?? null,
    client_email: (row.client_email as string | null) ?? null,
    client_company: (row.client_company as string | null) ?? null,
    project_label: String(row.project_label),
    project_type_ids: asJson<ProjectTypeId[]>(row.project_type_ids, []),
    selected_scope: asJson<string[]>(row.selected_scope, []),
    timeline: (row.timeline as string | null) ?? null,
    timeline_note: (row.timeline_note as string | null) ?? null,
    total_min: Number(row.total_min),
    total_max: Number(row.total_max),
    line_items: asJson(row.line_items, []),
    notes: (row.notes as string | null) ?? null,
    email_sent: Boolean(row.email_sent),
    payload: asJson<ProjectEstimate>(row.payload, row.payload as ProjectEstimate),
  };
}
