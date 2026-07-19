import type { ProjectEstimate, ProjectTypeId } from "./estimate";

export type EstimateSource = "quote_page" | "chat" | "api";

export type CreateEstimateClientInput = {
  projectTypeIds: ProjectTypeId[];
  selectedScopeIds: string[];
  timelineId: "standard" | "rush";
  clientName: string;
  clientEmail: string;
  clientCompany?: string;
  notes?: string;
  source: EstimateSource;
};

/**
 * Create a server-tracked estimate. The returned ID is the source of truth
 * (stored in Postgres) and must be used for emails / PDF.
 */
export async function createTrackedEstimateClient(
  input: CreateEstimateClientInput
): Promise<ProjectEstimate> {
  const res = await fetch("/api/estimates", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = (await res.json().catch(() => ({}))) as {
    estimate?: ProjectEstimate;
    error?: string;
  };

  if (!res.ok || !data.estimate?.id) {
    throw new Error(data.error || "Could not save your estimate. Please try again.");
  }

  return data.estimate;
}

export async function markEstimateEmailSentClient(
  id: string,
  emailSent: boolean
): Promise<void> {
  try {
    await fetch(`/api/estimates/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emailSent }),
    });
  } catch {
    // Non-blocking — estimate row already exists
  }
}
