/* Local probe: insert one estimate using DATABASE_URL from .env.local */
const fs = require("fs");
const path = require("path");
const { neon } = require("@neondatabase/serverless");

const envPath = path.join(__dirname, "..", ".env.local");
const env = fs.readFileSync(envPath, "utf8");
const match = env.match(/^DATABASE_URL=(.+)$/m);
if (!match) {
  console.error("NO_DATABASE_URL");
  process.exit(1);
}
const url = match[1].trim().replace(/^["']|["']$/g, "");
const sql = neon(url);

async function main() {
  const id = `VL-PROBE-${Date.now().toString(36).toUpperCase()}`;
  await sql.query(
    `INSERT INTO estimates (
      id, created_at, source, client_name, client_email, client_company,
      project_label, project_type_ids, selected_scope, timeline, timeline_note,
      total_min, total_max, line_items, notes, email_sent, payload, user_agent, referer
    ) VALUES (
      $1, $2::timestamptz, $3, $4, $5, $6,
      $7, $8::jsonb, $9::jsonb, $10, $11,
      $12, $13, $14::jsonb, $15, $16, $17::jsonb, $18, $19
    )`,
    [
      id,
      new Date().toISOString(),
      "api",
      "Probe",
      "probe@example.com",
      null,
      "Portfolio Website",
      JSON.stringify(["portfolio"]),
      JSON.stringify([]),
      "1-3 weeks",
      "Recommended pace with sprint demos",
      500,
      1000,
      JSON.stringify([{ label: "Portfolio Website  -  base package", min: 500, max: 1000 }]),
      null,
      false,
      JSON.stringify({ id, projectTypeIds: ["portfolio"] }),
      "probe-script",
      null,
    ]
  );
  const rows = await sql`SELECT id FROM estimates WHERE id = ${id}`;
  console.log("OK", rows[0]?.id);
  await sql`DELETE FROM estimates WHERE id = ${id}`;
  console.log("CLEANED");
}

main().catch((e) => {
  console.error("FAIL", e.message);
  process.exit(1);
});
