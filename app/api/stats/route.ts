import { NextResponse } from "next/server";
import { getDb, ensureSchema } from "@/lib/db";

const ADMIN_KEY = process.env.ADMIN_SECRET_KEY || "rahul-admin-2025";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get("key") !== ADMIN_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await ensureSchema();
    const sql = getDb();

    // ── Total & unique all-time ──────────────────────────────────────
    const [totals] = await sql`
      SELECT
        COUNT(*)                                      AS total,
        COUNT(DISTINCT ip_hash)                       AS unique_total
      FROM visits
    `;

    // ── Today ────────────────────────────────────────────────────────
    const [todays] = await sql`
      SELECT
        COUNT(*)                    AS today_visits,
        COUNT(DISTINCT ip_hash)     AS today_unique
      FROM visits
      WHERE visited_at >= NOW() AT TIME ZONE 'UTC' - INTERVAL '1 day'
        AND DATE(visited_at AT TIME ZONE 'UTC') = CURRENT_DATE
    `;

    // ── Last 7 days ──────────────────────────────────────────────────
    const [week] = await sql`
      SELECT COUNT(*) AS week_visits
      FROM visits
      WHERE visited_at >= NOW() AT TIME ZONE 'UTC' - INTERVAL '7 days'
    `;

    // ── Daily breakdown — last 30 days ───────────────────────────────
    const dailyRows = await sql`
      SELECT
        DATE(visited_at AT TIME ZONE 'UTC')::TEXT   AS date,
        COUNT(*)                                     AS visits,
        COUNT(DISTINCT ip_hash)                      AS unique
      FROM visits
      WHERE visited_at >= NOW() AT TIME ZONE 'UTC' - INTERVAL '30 days'
      GROUP BY 1
      ORDER BY 1 ASC
    `;

    // Fill in missing days with 0s
    const dailyMap = new Map<string, { visits: number; unique: number }>();
    for (const row of dailyRows) {
      dailyMap.set(row.date, {
        visits: Number(row.visits),
        unique: Number(row.unique),
      });
    }
    const dailyData: { date: string; visits: number; unique: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      dailyData.push({
        date: dateStr,
        ...(dailyMap.get(dateStr) ?? { visits: 0, unique: 0 }),
      });
    }

    // ── Top pages ────────────────────────────────────────────────────
    const pageRows = await sql`
      SELECT page, COUNT(*) AS count
      FROM visits
      GROUP BY page
      ORDER BY count DESC
      LIMIT 10
    `;

    // ── Referrers ────────────────────────────────────────────────────
    const refRows = await sql`
      SELECT referrer AS domain, COUNT(*) AS count
      FROM visits
      WHERE referrer IS NOT NULL AND referrer != ''
      GROUP BY referrer
      ORDER BY count DESC
      LIMIT 10
    `;

    return NextResponse.json({
      total: Number(totals.total),
      uniqueTotal: Number(totals.unique_total),
      todayVisits: Number(todays.today_visits),
      todayUnique: Number(todays.today_unique),
      weekVisits: Number(week.week_visits),
      dailyData,
      pages: pageRows.map((r) => ({ page: r.page, count: Number(r.count) })),
      referrers: refRows.map((r) => ({ domain: r.domain, count: Number(r.count) })),
      generatedAt: new Date().toISOString(),
      source: "db",
    });
  } catch (err) {
    console.error("Stats API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
