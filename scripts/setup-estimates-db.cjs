/* One-shot: create estimates table from .env.local DATABASE_URL */
const fs = require("fs");
const { neon } = require("@neondatabase/serverless");

const env = fs.readFileSync(".env.local", "utf8");
const match = env.match(/^DATABASE_URL=(.+)$/m);
if (!match) {
  console.error("NO_DATABASE_URL");
  process.exit(1);
}

const url = match[1].trim().replace(/^["']|["']$/g, "");
const sql = neon(url);

async function main() {
  await sql`
    CREATE TABLE IF NOT EXISTS estimates (
      id TEXT PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      source TEXT NOT NULL,
      client_name TEXT,
      client_email TEXT,
      client_company TEXT,
      project_label TEXT NOT NULL,
      project_type_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
      selected_scope JSONB NOT NULL DEFAULT '[]'::jsonb,
      timeline TEXT,
      timeline_note TEXT,
      total_min INTEGER NOT NULL,
      total_max INTEGER NOT NULL,
      line_items JSONB NOT NULL DEFAULT '[]'::jsonb,
      notes TEXT,
      email_sent BOOLEAN NOT NULL DEFAULT FALSE,
      payload JSONB NOT NULL,
      user_agent TEXT,
      referer TEXT
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS estimates_created_at_idx ON estimates (created_at DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS estimates_client_email_idx ON estimates (client_email)`;
  await sql`CREATE INDEX IF NOT EXISTS estimates_source_idx ON estimates (source)`;

  const rows = await sql`SELECT to_regclass('public.estimates') AS table_name`;
  console.log("OK", rows[0]?.table_name);
}

main().catch((err) => {
  console.error("FAIL", err.message);
  process.exit(1);
});
