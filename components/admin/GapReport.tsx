"use client";

import { useCallback, useEffect, useState } from "react";

interface Gap {
  cluster_label: string;
  count: number;
  example_messages: string[];
}

interface GapsResponse {
  gaps: Gap[];
  total_low_confidence: number;
  message?: string;
}

function downloadCSV(gaps: Gap[]) {
  const rows = [
    ["Cluster", "Times Asked", "Example 1", "Example 2", "Example 3"],
    ...gaps.map((g) => [
      g.cluster_label,
      String(g.count),
      g.example_messages[0] ?? "",
      g.example_messages[1] ?? "",
      g.example_messages[2] ?? "",
    ]),
  ];
  const csv = rows
    .map((r) => r.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `knowledge-gaps-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function GapReport() {
  const [data, setData] = useState<GapsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const fetchGaps = useCallback(async () => {
    setLoading(true);
    try {
      const sid = typeof window !== "undefined" ? localStorage.getItem("sd_session_id") : null;
      const params = sid ? `?session_id=${encodeURIComponent(sid)}` : "";
      const res = await fetch(`/api/gaps${params}`);
      const json = await res.json();
      setData(json);
    } catch { /* non-fatal */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchGaps(); }, [fetchGaps]);

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{ height: "64px", background: "var(--color-bg-surface)", border: "1px solid var(--color-border)", borderRadius: "10px", animation: "pulse 1.5s ease-in-out infinite" }} />
        ))}
      </div>
    );
  }

  if (!data || data.gaps.length === 0) {
    return (
      <div style={{ padding: "60px 24px", textAlign: "center", background: "var(--color-bg-surface)", border: "1px solid var(--color-border)", borderRadius: "12px" }}>
        <div style={{ fontSize: "40px", marginBottom: "12px" }}>🎉</div>
        <div style={{ color: "var(--color-text-primary)", fontWeight: 600, marginBottom: "6px" }}>No knowledge gaps found</div>
        <div style={{ color: "var(--color-text-muted)", fontSize: "13px" }}>
          {data?.message ?? "Your bot is answering everything confidently."}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
          <span style={{ color: "var(--color-danger)", fontWeight: 600 }}>
            {data.total_low_confidence}
          </span>{" "}
          session{data.total_low_confidence !== 1 ? "s" : ""} with low-confidence answers
        </div>
        <button
          onClick={() => downloadCSV(data.gaps)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "7px 14px",
            borderRadius: "8px",
            border: "1px solid var(--color-border)",
            background: "transparent",
            color: "var(--color-text-secondary)",
            fontSize: "12px",
            cursor: "pointer",
            transition: "border-color 0.15s",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
          Export CSV
        </button>
      </div>

      {/* Gap list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {data.gaps.map((gap, i) => (
          <div
            key={i}
            style={{
              background: "var(--color-bg-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <div
              onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
              style={{
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                gap: "12px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                {/* Rank badge */}
                <span style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: i === 0 ? "rgba(248,81,73,0.15)" : i === 1 ? "rgba(210,153,34,0.15)" : "var(--color-bg-surface2)",
                  border: `1px solid ${i === 0 ? "rgba(248,81,73,0.3)" : i === 1 ? "rgba(210,153,34,0.3)" : "var(--color-border)"}`,
                  color: i === 0 ? "var(--color-danger)" : i === 1 ? "var(--color-warning)" : "var(--color-text-muted)",
                  fontSize: "11px",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}>
                  {i + 1}
                </span>
                <div>
                  <div style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--color-text-primary)" }}>
                    {gap.cluster_label}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--color-text-muted)", marginTop: "2px" }}>
                    Asked {gap.count} time{gap.count !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ transform: expandedIdx === i ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0, color: "var(--color-text-muted)" }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>

            {/* Expanded examples */}
            {expandedIdx === i && (
              <div style={{ padding: "0 16px 14px", borderTop: "1px solid var(--color-border)", paddingTop: "12px" }}>
                <div style={{ fontSize: "11px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--color-text-muted)", marginBottom: "8px" }}>
                  Example questions
                </div>
                {gap.example_messages.map((msg, mi) => (
                  <div key={mi} style={{
                    padding: "7px 11px",
                    marginBottom: "6px",
                    background: "var(--color-bg-surface2)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                    fontSize: "12.5px",
                    color: "var(--color-text-secondary)",
                    fontStyle: "italic",
                  }}>
                    &ldquo;{msg}&rdquo;
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
