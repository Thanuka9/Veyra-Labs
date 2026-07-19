import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let sql: NeonQueryFunction<false, false> | null = null;

/**
 * Normalize DATABASE_URL from env.
 * Common Vercel mistake: pasting `DATABASE_URL=postgresql://...` into the Value
 * field (including the key name), or wrapping quotes.
 */
export function normalizeDatabaseUrl(raw: string): string {
  let url = raw.trim().replace(/^["']|["']$/g, "");
  if (/^DATABASE_URL\s*=/i.test(url)) {
    url = url.replace(/^DATABASE_URL\s*=\s*/i, "").trim().replace(/^["']|["']$/g, "");
  }
  return url;
}

export function isEstimateDbConfigured(): boolean {
  const raw = process.env.DATABASE_URL?.trim();
  if (!raw) return false;
  const url = normalizeDatabaseUrl(raw);
  return url.startsWith("postgres://") || url.startsWith("postgresql://");
}

export function getEstimateDb(): NeonQueryFunction<false, false> {
  const raw = process.env.DATABASE_URL?.trim();
  if (!raw) {
    throw new Error(
      "DATABASE_URL is not set. Add a Neon (or Postgres) connection string to track estimate IDs."
    );
  }

  const url = normalizeDatabaseUrl(raw);
  if (!url.startsWith("postgres://") && !url.startsWith("postgresql://")) {
    throw new Error(
      "DATABASE_URL is invalid. In Vercel, set the Value to only the postgres URL (no DATABASE_URL= prefix), using your real Neon password."
    );
  }

  if (url.includes("YOUR_PASSWORD") || url.includes("PASSWORD@")) {
    throw new Error(
      "DATABASE_URL still has a placeholder password. Paste your real Neon connection string from the Neon dashboard."
    );
  }

  if (!sql) {
    sql = neon(url);
  }
  return sql;
}
