import { neon } from "@neondatabase/serverless";

const DATABASE_URL =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  "";

export function getDb() {
  if (!DATABASE_URL) {
    throw new Error("No DATABASE_URL configured");
  }
  return neon(DATABASE_URL);
}

/** Run once on first request to ensure tables exist */
export async function ensureSchema() {
  const sql = getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS visits (
      id          BIGSERIAL PRIMARY KEY,
      page        TEXT        NOT NULL DEFAULT '/',
      referrer    TEXT,
      ip_hash     TEXT,
      visited_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  // Index for fast date-range queries
  await sql`
    CREATE INDEX IF NOT EXISTS visits_visited_at_idx ON visits (visited_at DESC)
  `;
}
