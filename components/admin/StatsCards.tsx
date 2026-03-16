"use client";

import { useEffect, useState } from "react";

interface Stats {
  total_conversations: number;
  avg_confidence: number;
  low_confidence_pct: number;
  chunk_count: number;
}

function confidenceColor(val: number): string {
  if (val >= 0.7) return "var(--color-success)";
  if (val >= 0.4) return "var(--color-warning)";
  return "var(--color-danger)";
}

function pctColor(pct: number): string {
  if (pct <= 20) return "var(--color-success)";
  if (pct <= 50) return "var(--color-warning)";
  return "var(--color-danger)";
}

interface CardProps {
  label: string;
  value: string | number;
  color?: string;
  loading: boolean;
  icon: string;
}

function StatCard({ label, value, color, loading, icon }: CardProps) {
  return (
    <div
      style={{
        background: "var(--color-bg-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "12px",
        padding: "20px 22px",
        flex: 1,
        minWidth: "160px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
        <span style={{ fontSize: "11px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-text-muted)" }}>
          {label}
        </span>
        <span style={{ fontSize: "18px" }}>{icon}</span>
      </div>
      {loading ? (
        <div
          style={{
            height: "32px",
            width: "60%",
            background: "var(--color-bg-surface2)",
            borderRadius: "6px",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
      ) : (
        <div
          style={{
            fontSize: "26px",
            fontWeight: 600,
            color: color ?? "var(--color-text-primary)",
            lineHeight: 1,
          }}
        >
          {value}
        </div>
      )}
    </div>
  );
}

export default function StatsCards() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch(() => { /* non-fatal */ })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>
      <div className="stats-grid">
        <StatCard
          label="Total Conversations"
          value={stats?.total_conversations ?? 0}
          icon="💬"
          loading={loading}
        />
        <StatCard
          label="Avg Confidence"
          value={stats ? `${Math.round(stats.avg_confidence * 100)}%` : "—"}
          color={stats ? confidenceColor(stats.avg_confidence) : undefined}
          icon="🎯"
          loading={loading}
        />
        <StatCard
          label="Low Confidence"
          value={stats ? `${stats.low_confidence_pct}%` : "—"}
          color={stats ? pctColor(stats.low_confidence_pct) : undefined}
          icon="⚠️"
          loading={loading}
        />
        <StatCard
          label="Knowledge Chunks"
          value={stats?.chunk_count ?? 0}
          icon="📄"
          loading={loading}
        />
      </div>
    </>
  );
}
