"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";

interface DayData {
  date: string;
  visits: number;
  unique: number;
}

interface StatsData {
  total: number;
  uniqueTotal: number;
  todayVisits: number;
  todayUnique: number;
  weekVisits: number;
  dailyData: DayData[];
  pages: { page: string; count: number }[];
  referrers: { domain: string; count: number }[];
  generatedAt: string;
  source: "db" | "memory";
}

function StatCard({
  label,
  value,
  subtitle,
  color,
  icon,
}: {
  label: string;
  value: number | string;
  subtitle?: string;
  color: string;
  icon: string;
}) {
  return (
    <div
      className="stat-card"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${color}33`,
        borderRadius: "16px",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: `linear-gradient(90deg, ${color}, transparent)`,
        }}
      />
      <div style={{ fontSize: "28px", marginBottom: "8px" }}>{icon}</div>
      <div
        style={{
          fontSize: "36px",
          fontWeight: 800,
          color,
          fontFamily: "JetBrains Mono, monospace",
          lineHeight: 1,
        }}
      >
        {typeof value === "number" ? value.toLocaleString() : value}
      </div>
      <div
        style={{
          fontSize: "13px",
          color: "#94a3b8",
          marginTop: "6px",
          fontWeight: 500,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
      {subtitle && (
        <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
          {subtitle}
        </div>
      )}
    </div>
  );
}

function MiniChart({ data }: { data: DayData[] }) {
  const maxVal = Math.max(...data.map((d) => d.visits), 1);
  const last7 = data.slice(-7);

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "6px", height: "80px" }}>
      {last7.map((d) => {
        const h = Math.max((d.visits / maxVal) * 80, 4);
        const isToday = d.date === new Date().toISOString().slice(0, 10);
        return (
          <div key={d.date} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
            <div
              title={`${d.date}: ${d.visits} visits`}
              style={{
                width: "100%",
                height: `${h}px`,
                background: isToday
                  ? "linear-gradient(180deg, #00ff41, #00d4ff)"
                  : "linear-gradient(180deg, #00d4ff88, #00d4ff22)",
                borderRadius: "4px 4px 2px 2px",
                transition: "height 0.5s ease",
                cursor: "help",
              }}
            />
            <span style={{ fontSize: "9px", color: "#475569", writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
              {d.date.slice(5)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function BarRow({ label, count, max, color }: { label: string; count: number; max: number; color: string }) {
  const pct = max > 0 ? (count / max) * 100 : 0;
  return (
    <div style={{ marginBottom: "10px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
        <span style={{ fontSize: "13px", color: "#cbd5e1", fontFamily: "JetBrains Mono, monospace" }}>
          {label}
        </span>
        <span style={{ fontSize: "13px", color, fontWeight: 700, fontFamily: "JetBrains Mono, monospace" }}>
          {count}
        </span>
      </div>
      <div style={{ height: "4px", background: "#1e293b", borderRadius: "2px", overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}, ${color}88)`,
            borderRadius: "2px",
            transition: "width 0.8s ease",
          }}
        />
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const searchParams = useSearchParams();
  const key = searchParams.get("key");

  const [stats, setStats] = useState<StatsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const fetchStats = useCallback(async () => {
    if (!key) {
      setError("No secret key provided. Access via /admin?key=YOUR_KEY");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`/api/stats?key=${encodeURIComponent(key)}`);
      if (res.status === 401) {
        setError("❌ Invalid secret key. Access denied.");
        setLoading(false);
        return;
      }
      if (!res.ok) throw new Error("Server error");
      const data: StatsData = await res.json();
      setStats(data);
      setLastRefresh(new Date());
      setError(null);
    } catch {
      setError("Failed to load stats. Check if the API is deployed correctly.");
    } finally {
      setLoading(false);
    }
  }, [key]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  const pageStyle: React.CSSProperties = {
    minHeight: "100vh",
    background: "#050508",
    color: "#e2e8f0",
    fontFamily: "Inter, sans-serif",
    padding: "0",
  };

  if (loading) {
    return (
      <div style={{ ...pageStyle, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              border: "3px solid #00ff4133",
              borderTop: "3px solid #00ff41",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <p style={{ color: "#64748b", fontFamily: "JetBrains Mono, monospace", fontSize: "14px" }}>
            Loading analytics...
          </p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ ...pageStyle, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            background: "rgba(255,40,40,0.08)",
            border: "1px solid #ff2828aa",
            borderRadius: "16px",
            padding: "40px",
            textAlign: "center",
            maxWidth: "500px",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔒</div>
          <p style={{ color: "#ff6b6b", fontFamily: "JetBrains Mono, monospace", fontSize: "14px" }}>{error}</p>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const maxPageCount = Math.max(...stats.pages.map((p) => p.count), 1);
  const maxRefCount = Math.max(...stats.referrers.map((r) => r.count), 1);

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gap: "16px",
  };

  return (
    <div style={pageStyle}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        .stat-card:hover { transform: translateY(-2px); transition: transform 0.2s ease; }
        * { box-sizing: border-box; }
      `}</style>

      {/* Header */}
      <div
        style={{
          background: "rgba(0,255,65,0.04)",
          borderBottom: "1px solid #00ff4122",
          padding: "20px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "10px",
              height: "10px",
              background: "#00ff41",
              borderRadius: "50%",
              animation: "pulse 2s infinite",
              boxShadow: "0 0 8px #00ff41",
            }}
          />
          <h1 style={{ margin: 0, fontSize: "20px", fontWeight: 700, fontFamily: "JetBrains Mono, monospace" }}>
            <span style={{ color: "#00ff41" }}>rahul</span>
            <span style={{ color: "#64748b" }}>@</span>
            <span style={{ color: "#00d4ff" }}>analytics</span>
          </h1>
          <span
            style={{
              background: "#00ff4115",
              border: "1px solid #00ff4133",
              borderRadius: "999px",
              padding: "2px 10px",
              fontSize: "11px",
              color: "#00ff41",
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            PRIVATE
          </span>
          {stats.source === "memory" && (
            <span
              style={{
                background: "#ff950015",
                border: "1px solid #ff950033",
                borderRadius: "999px",
                padding: "2px 10px",
                fontSize: "11px",
                color: "#ff9500",
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              ⚡ IN-MEMORY (resets on redeploy)
            </span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {lastRefresh && (
            <span style={{ fontSize: "12px", color: "#475569", fontFamily: "JetBrains Mono, monospace" }}>
              Updated {lastRefresh.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={fetchStats}
            style={{
              background: "rgba(0,212,255,0.1)",
              border: "1px solid #00d4ff44",
              borderRadius: "8px",
              color: "#00d4ff",
              padding: "6px 14px",
              fontSize: "12px",
              cursor: "pointer",
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            ↻ Refresh
          </button>
          {/* Vercel Analytics deep-link */}
          <a
            href="https://vercel.com/rahul2005-tro/rahul-portfolio/analytics"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "#00ff4120",
              border: "1px solid #00ff4144",
              borderRadius: "8px",
              color: "#00ff41",
              padding: "6px 14px",
              fontSize: "12px",
              cursor: "pointer",
              fontFamily: "JetBrains Mono, monospace",
              textDecoration: "none",
            }}
          >
            ↗ Vercel Dashboard
          </a>
        </div>
      </div>

      <div style={{ padding: "32px", maxWidth: "1200px", margin: "0 auto" }}>

        {/* Notice banner if using memory */}
        {stats.source === "memory" && (
          <div style={{
            background: "rgba(255,149,0,0.08)",
            border: "1px solid #ff950033",
            borderRadius: "12px",
            padding: "16px 20px",
            marginBottom: "24px",
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "13px",
            color: "#ff9500",
          }}>
            ⚡ <strong>Running without a database</strong> — visit counts reset on each redeploy.
            For persistent tracking, connect a <strong>Neon</strong> database in your Vercel project Storage tab,
            then add <code style={{ background: "#ff950020", padding: "1px 6px", borderRadius: "4px" }}>DATABASE_URL</code> to your environment variables.
            <br /><br />
            Alternatively, use the <strong>↗ Vercel Dashboard</strong> button above — Vercel Analytics is already tracking all your visitors for free.
          </div>
        )}

        {/* Top stat cards */}
        <div
          style={{
            ...gridStyle,
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            marginBottom: "32px",
          }}
        >
          <StatCard label="Total Visits" value={stats.total} subtitle="All time" color="#00ff41" icon="👁️" />
          <StatCard label="Unique Visitors" value={stats.uniqueTotal} subtitle="All time" color="#00d4ff" icon="👤" />
          <StatCard label="Today" value={stats.todayVisits} subtitle={`${stats.todayUnique} unique today`} color="#ff9500" icon="📅" />
          <StatCard label="This Week" value={stats.weekVisits} subtitle="Last 7 days" color="#9f00ff" icon="📊" />
        </div>

        {/* Charts row */}
        <div style={{ ...gridStyle, gridTemplateColumns: "1fr 1fr", marginBottom: "32px" }}>
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #1e293b", borderRadius: "16px", padding: "24px" }}>
            <h2 style={{ margin: "0 0 20px", fontSize: "14px", color: "#94a3b8", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              📈 Last 7 Days
            </h2>
            <MiniChart data={stats.dailyData} />
          </div>

          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #1e293b", borderRadius: "16px", padding: "24px" }}>
            <h2 style={{ margin: "0 0 20px", fontSize: "14px", color: "#94a3b8", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              📅 30-Day Overview
            </h2>
            <div style={{ display: "flex", alignItems: "flex-end", gap: "3px", height: "80px" }}>
              {stats.dailyData.map((d) => {
                const maxVal = Math.max(...stats.dailyData.map((x) => x.visits), 1);
                const h = Math.max((d.visits / maxVal) * 80, 2);
                const isToday = d.date === new Date().toISOString().slice(0, 10);
                return (
                  <div key={d.date} title={`${d.date}: ${d.visits}`} style={{ flex: 1, height: `${h}px`, background: isToday ? "#00ff41" : "#00d4ff44", borderRadius: "2px 2px 0 0", cursor: "help" }} />
                );
              })}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
              <span style={{ fontSize: "11px", color: "#475569", fontFamily: "JetBrains Mono, monospace" }}>{stats.dailyData[0]?.date}</span>
              <span style={{ fontSize: "11px", color: "#475569", fontFamily: "JetBrains Mono, monospace" }}>{stats.dailyData[stats.dailyData.length - 1]?.date}</span>
            </div>
          </div>
        </div>

        {/* Pages + Referrers */}
        <div style={{ ...gridStyle, gridTemplateColumns: "1fr 1fr", marginBottom: "32px" }}>
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #1e293b", borderRadius: "16px", padding: "24px" }}>
            <h2 style={{ margin: "0 0 20px", fontSize: "14px", color: "#94a3b8", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>📄 Top Pages</h2>
            {stats.pages.length === 0
              ? <p style={{ color: "#475569", fontSize: "13px", fontFamily: "JetBrains Mono, monospace" }}>No page data yet</p>
              : stats.pages.slice(0, 8).map((p) => <BarRow key={p.page} label={p.page} count={p.count} max={maxPageCount} color="#00ff41" />)
            }
          </div>
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #1e293b", borderRadius: "16px", padding: "24px" }}>
            <h2 style={{ margin: "0 0 20px", fontSize: "14px", color: "#94a3b8", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>🔗 Traffic Sources</h2>
            {stats.referrers.length === 0
              ? <p style={{ color: "#475569", fontSize: "13px", fontFamily: "JetBrains Mono, monospace" }}>No referrer data yet</p>
              : stats.referrers.slice(0, 8).map((r) => <BarRow key={r.domain} label={r.domain} count={r.count} max={maxRefCount} color="#00d4ff" />)
            }
          </div>
        </div>

        {/* Daily breakdown table */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #1e293b", borderRadius: "16px", padding: "24px", overflowX: "auto" }}>
          <h2 style={{ margin: "0 0 20px", fontSize: "14px", color: "#94a3b8", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            🗓️ Daily Breakdown (Last 30 Days)
          </h2>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1e293b" }}>
                {["Date", "Visits", "Unique Visitors"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 12px", color: "#64748b", fontWeight: 600, letterSpacing: "0.05em", fontFamily: "JetBrains Mono, monospace", fontSize: "11px", textTransform: "uppercase" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...stats.dailyData].reverse().filter(d => d.visits > 0 || d.unique > 0).slice(0, 14).map((d) => {
                const isToday = d.date === new Date().toISOString().slice(0, 10);
                return (
                  <tr key={d.date} style={{ borderBottom: "1px solid #0f172a", background: isToday ? "rgba(0,255,65,0.04)" : "transparent" }}>
                    <td style={{ padding: "10px 12px", fontFamily: "JetBrains Mono, monospace" }}>
                      {isToday ? <span>{d.date} <span style={{ fontSize: "10px", color: "#00ff41", background: "#00ff4115", padding: "1px 6px", borderRadius: "4px" }}>TODAY</span></span> : d.date}
                    </td>
                    <td style={{ padding: "10px 12px", color: "#00ff41", fontWeight: 700, fontFamily: "JetBrains Mono, monospace" }}>{d.visits}</td>
                    <td style={{ padding: "10px 12px", color: "#00d4ff", fontWeight: 700, fontFamily: "JetBrains Mono, monospace" }}>{d.unique}</td>
                  </tr>
                );
              })}
              {stats.dailyData.every(d => d.visits === 0) && (
                <tr>
                  <td colSpan={3} style={{ padding: "20px 12px", color: "#475569", fontFamily: "JetBrains Mono, monospace", textAlign: "center" }}>
                    No visits tracked yet — data appears here as visitors arrive
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={{ textAlign: "center", marginTop: "32px", color: "#334155", fontSize: "12px", fontFamily: "JetBrains Mono, monospace" }}>
          🔐 This dashboard is private — accessible only with your secret key
          <br />
          Auto-refreshes every 60 seconds • Last updated: {stats.generatedAt}
        </div>
      </div>
    </div>
  );
}
