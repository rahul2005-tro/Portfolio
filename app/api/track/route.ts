import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

// Simple in-memory fallback when KV is not configured (local dev)
const memoryStore: Record<string, number> = {};

async function kvIncr(key: string): Promise<number> {
  try {
    const result = await kv.incr(key);
    return result;
  } catch {
    // Fallback: use in-memory store (resets on restart)
    memoryStore[key] = (memoryStore[key] || 0) + 1;
    return memoryStore[key];
  }
}

async function kvGet(key: string): Promise<number> {
  try {
    const result = await kv.get<number>(key);
    return result ?? 0;
  } catch {
    return memoryStore[key] ?? 0;
  }
}

async function kvHSet(hash: string, field: string, value: number): Promise<void> {
  try {
    await kv.hset(hash, { [field]: value });
  } catch {
    const hashKey = `${hash}:${field}`;
    memoryStore[hashKey] = value;
  }
}

async function kvHGet(hash: string, field: string): Promise<number> {
  try {
    const result = await kv.hget<number>(hash, field);
    return result ?? 0;
  } catch {
    return memoryStore[`${hash}:${field}`] ?? 0;
  }
}

export async function POST(request: Request) {
  try {
    // Get referrer / page
    const body = await request.json().catch(() => ({}));
    const page = typeof body.page === "string" ? body.page.slice(0, 200) : "/";
    const referrer = typeof body.referrer === "string" ? body.referrer.slice(0, 500) : "";

    // Increment total visit counter
    const totalVisits = await kvIncr("visits:total");

    // Increment today's count  
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const todayCount = await kvGet(`visits:day:${today}`);
    await kvHSet("visits:daily", today, todayCount + 1);
    await kvIncr(`visits:day:${today}`);

    // Track which pages are visited
    const safePageKey = page.replace(/[^a-zA-Z0-9/_-]/g, "_").slice(0, 100);
    await kvIncr(`visits:page:${safePageKey}`);

    // Track unique daily IPs (privacy-safe — just count unique days)
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    // Hash the IP with today's date for privacy (never store raw IP)
    const crypto = await import("crypto");
    const ipHash = crypto.createHash("sha256").update(`${ip}:${today}`).digest("hex").slice(0, 16);
    const uniqueKey = `visits:unique:${today}:${ipHash}`;

    let isNew = false;
    try {
      // SET NX: only set if not exists → unique visitor
      const wasSet = await kv.set(uniqueKey, 1, { nx: true, ex: 86400 * 2 });
      isNew = wasSet !== null;
    } catch {
      // Fallback for local dev
      if (!memoryStore[uniqueKey]) {
        memoryStore[uniqueKey] = 1;
        isNew = true;
      }
    }

    if (isNew) {
      await kvIncr(`visits:unique_day:${today}`);
      await kvIncr("visits:unique_total");
    }

    // Store referrer if present
    if (referrer && !referrer.includes(request.headers.get("host") || "")) {
      try {
        const domain = new URL(referrer).hostname;
        await kvIncr(`visits:ref:${domain.slice(0, 50)}`);
      } catch {
        // invalid referrer URL, skip
      }
    }

    return NextResponse.json({ ok: true, total: totalVisits });
  } catch (err) {
    console.error("Track API error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
