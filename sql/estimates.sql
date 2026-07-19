-- Run once in your Neon SQL editor (or any Postgres) before going live.
-- Free Neon DB: https://neon.tech → create project → copy DATABASE_URL

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
);

CREATE INDEX IF NOT EXISTS estimates_created_at_idx ON estimates (created_at DESC);
CREATE INDEX IF NOT EXISTS estimates_client_email_idx ON estimates (client_email);
CREATE INDEX IF NOT EXISTS estimates_source_idx ON estimates (source);
