import { NextResponse } from "next/server";
import { getDb, ensureSchema } from "@/lib/db";
import { createHash } from "crypto";

// Simple in-memory rate limit: one hit per IP per minute
const recentHits = new Map<string, number>();

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const page: string = typeof body.page === "string" ? body.page.slice(0, 200) : "/";
    const referrer: string = typeof body.referrer === "string" ? body.referrer.slice(0, 500) : "";

    // Get client IP
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Rate limit: ignore duplicate hits from same IP within 10 seconds
    const now = Date.now();
    const lastHit = recentHits.get(ip) || 0;
    if (now - lastHit < 10_000) {
      return NextResponse.json({ ok: true, skipped: true });
    }
    recentHits.set(ip, now);
    // Clean up old entries
    if (recentHits.size > 500) {
      const cutoff = now - 60_000;
      for (const [k, v] of recentHits.entries()) {
        if (v < cutoff) recentHits.delete(k);
      }
    }

    // Privacy-safe: hash IP with today's date — never store raw IP
    const today = new Date().toISOString().slice(0, 10);
    const ipHash = createHash("sha256")
      .update(`${ip}:${today}`)
      .digest("hex")
      .slice(0, 16);

    // Clean up referrer — skip self-referrals
    const host = request.headers.get("host") || "";
    const cleanRef =
      referrer && !referrer.includes(host)
        ? (() => {
            try {
              return new URL(referrer).hostname;
            } catch {
              return null;
            }
          })()
        : null;

    // Ensure table exists (no-op after first call)
    await ensureSchema();
    const sql = getDb();

    // Insert the visit row
    await sql`
      INSERT INTO visits (page, referrer, ip_hash)
      VALUES (${page}, ${cleanRef}, ${ipHash})
    `;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Track API error:", err);
    // Don't expose errors to client — silently succeed
    return NextResponse.json({ ok: true });
  }
}
