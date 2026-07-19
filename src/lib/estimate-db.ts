import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let sql: NeonQueryFunction<false, false> | null = null;

export function isEstimateDbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}

export function getEstimateDb(): NeonQueryFunction<false, false> {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Add a Neon (or Postgres) connection string to track estimate IDs."
    );
  }
  if (!sql) {
    sql = neon(url);
  }
  return sql;
}
