import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

const memoryStore: Record<string, number | string> = {};

async function safeKvGet<T>(key: string, fallback: T): Promise<T> {
  try {
    const v = await kv.get<T>(key);
    return v ?? fallback;
  } catch {
    return (memoryStore[key] as T) ?? fallback;
  }
}

async function safeHGetAll(hash: string): Promise<Record<string, number>> {
  try {
    const result = await kv.hgetall<Record<string, number>>(hash);
    return result ?? {};
  } catch {
    return {};
  }
}

async function safeKvKeys(pattern: string): Promise<string[]> {
  try {
    return await kv.keys(pattern);
  } catch {
    return [];
  }
}

export async function GET(request: Request) {
  // Protect with a secret key
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("key");
  const adminKey = process.env.ADMIN_SECRET_KEY || "rahul-admin-2025";

  if (secret !== adminKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const total = await safeKvGet<number>("visits:total", 0);
    const uniqueTotal = await safeKvGet<number>("visits:unique_total", 0);

    // Get last 30 days of data
    const dailyData: Array<{ date: string; visits: number; unique: number }> = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);

      const visits = await safeKvGet<number>(`visits:day:${dateStr}`, 0);
      const unique = await safeKvGet<number>(`visits:unique_day:${dateStr}`, 0);
      dailyData.push({ date: dateStr, visits, unique });
    }

    // Get page-level breakdown
    const pageKeys = await safeKvKeys("visits:page:*");
    const pages: Array<{ page: string; count: number }> = [];
    for (const key of pageKeys.slice(0, 20)) {
      const count = await safeKvGet<number>(key, 0);
      pages.push({ page: key.replace("visits:page:", "/"), count });
    }
    pages.sort((a, b) => b.count - a.count);

    // Referrers
    const refKeys = await safeKvKeys("visits:ref:*");
    const referrers: Array<{ domain: string; count: number }> = [];
    for (const key of refKeys.slice(0, 10)) {
      const count = await safeKvGet<number>(key, 0);
      referrers.push({ domain: key.replace("visits:ref:", ""), count });
    }
    referrers.sort((a, b) => b.count - a.count);

    // Today's stats
    const todayStr = today.toISOString().slice(0, 10);
    const todayVisits = await safeKvGet<number>(`visits:day:${todayStr}`, 0);
    const todayUnique = await safeKvGet<number>(`visits:unique_day:${todayStr}`, 0);

    // This week
    const weekVisits = dailyData.slice(-7).reduce((sum, d) => sum + d.visits, 0);

    let source: "db" | "memory" = "db";
    if (total === 0 && uniqueTotal === 0) {
      // Check if KV is actually configured
      try {
        await kv.get("visits:total");
      } catch {
        source = "memory";
      }
    }

    return NextResponse.json({
      total,
      uniqueTotal,
      todayVisits,
      todayUnique,
      weekVisits,
      dailyData,
      pages,
      referrers,
      generatedAt: new Date().toISOString(),
      source,
    });
  } catch (err) {
    console.error("Stats API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
