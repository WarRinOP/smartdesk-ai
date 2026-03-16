"use client";

import { useCallback, useEffect, useState } from "react";

type Filter = "all" | "high" | "low";

interface Session {
  session_id: string;
  message_count: number;
  avg_confidence: number;
  last_active: string;
  first_message: string;
}

interface ThreadMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  confidence: number | null;
  created_at: string;
}

function ConfidenceBadge({ value }: { value: number }) {
  let color = "var(--color-success)";
  let bg = "rgba(63,185,80,0.1)";
  let border = "rgba(63,185,80,0.3)";
  if (value < 0.5) { color = "var(--color-danger)"; bg = "rgba(248,81,73,0.1)"; border = "rgba(248,81,73,0.3)"; }
  else if (value < 0.7) { color = "var(--color-warning)"; bg = "rgba(210,153,34,0.1)"; border = "rgba(210,153,34,0.3)"; }

  return (
    <span style={{ padding: "2px 8px", borderRadius: "20px", fontSize: "11px", fontWeight: 600, color, background: bg, border: `1px solid ${border}` }}>
      {Math.round(value * 100)}%
    </span>
  );
}

export default function ConversationTable() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [thread, setThread] = useState<ThreadMessage[]>([]);
  const [threadLoading, setThreadLoading] = useState(false);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (filter !== "all") params.set("filter", filter);
      const res = await fetch(`/api/conversations?${params}`);
      const data = await res.json();
      setSessions(data.sessions ?? []);
      setTotal(data.total ?? 0);
      setTotalPages(data.total_pages ?? 1);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [page, filter]);

  useEffect(() => { fetchSessions(); }, [fetchSessions]);

  const toggleExpand = async (sessionId: string) => {
    if (expandedId === sessionId) { setExpandedId(null); return; }
    setExpandedId(sessionId);
    setThreadLoading(true);
    try {
      const res = await fetch(`/api/conversations?session_id=${encodeURIComponent(sessionId)}`);
      const data = await res.json();
      setThread(data.messages ?? []);
    } catch (e) { console.error(e); }
    finally { setThreadLoading(false); }
  };

  const FILTERS: { key: Filter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "high", label: "High confidence (>70%)" },
    { key: "low", label: "Low confidence (<50%)" },
  ];

  return (
    <div>
      {/* Filter bar */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => { setFilter(f.key); setPage(1); }}
            style={{
              padding: "6px 14px",
              borderRadius: "20px",
              border: "1px solid",
              borderColor: filter === f.key ? "var(--color-accent)" : "var(--color-border)",
              background: filter === f.key ? "rgba(47,129,247,0.1)" : "transparent",
              color: filter === f.key ? "var(--color-accent)" : "var(--color-text-secondary)",
              fontSize: "12px",
              cursor: "pointer",
              fontWeight: filter === f.key ? 600 : 400,
              transition: "all 0.15s",
            }}
          >
            {f.label}
          </button>
        ))}
        <span style={{ marginLeft: "auto", fontSize: "12px", color: "var(--color-text-muted)", alignSelf: "center" }}>
          {total} session{total !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      <div style={{ background: "var(--color-bg-surface)", border: "1px solid var(--color-border)", borderRadius: "12px", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ display: "grid", gridTemplateColumns: "100px 1fr 80px 90px 120px", padding: "10px 16px", borderBottom: "1px solid var(--color-border)", background: "var(--color-bg-surface2)" }}>
          {["Session", "First Message", "Messages", "Confidence", "Last Active"].map((h) => (
            <span key={h} style={{ fontSize: "11px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--color-text-muted)" }}>{h}</span>
          ))}
        </div>

        {/* Empty state */}
        {!loading && sessions.length === 0 && (
          <div style={{ padding: "48px", textAlign: "center", color: "var(--color-text-muted)", fontSize: "13px" }}>
            No conversations yet — start chatting to see data here
          </div>
        )}

        {/* Rows */}
        {sessions.map((s, i) => (
          <div key={s.session_id}>
            {/* Session row */}
            <div
              onClick={() => toggleExpand(s.session_id)}
              style={{
                display: "grid",
                gridTemplateColumns: "100px 1fr 80px 90px 120px",
                padding: "12px 16px",
                borderBottom: i < sessions.length - 1 || expandedId === s.session_id ? "1px solid var(--color-border)" : "none",
                cursor: "pointer",
                background: expandedId === s.session_id ? "rgba(47,129,247,0.04)" : "transparent",
                transition: "background 0.15s",
                alignItems: "center",
              }}
              onMouseEnter={(e) => { if (expandedId !== s.session_id) (e.currentTarget as HTMLDivElement).style.background = "var(--color-bg-surface2)"; }}
              onMouseLeave={(e) => { if (expandedId !== s.session_id) (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
            >
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--color-text-secondary)" }}>
                {s.session_id.slice(0, 8)}…
              </span>
              <span style={{ fontSize: "13px", color: "var(--color-text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: "12px" }}>
                {s.first_message || "—"}
              </span>
              <span style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>{s.message_count * 2}</span>
              <span><ConfidenceBadge value={s.avg_confidence} /></span>
              <span style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>
                {new Date(s.last_active).toLocaleDateString()}
              </span>
            </div>

            {/* Expanded thread */}
            {expandedId === s.session_id && (
              <div style={{ padding: "16px 20px", background: "var(--color-bg-primary)", borderBottom: "1px solid var(--color-border)" }}>
                {threadLoading && <div style={{ color: "var(--color-text-muted)", fontSize: "13px" }}>Loading thread…</div>}
                {!threadLoading && thread.map((msg) => (
                  <div key={msg.id} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", marginBottom: "8px" }}>
                    <div style={{
                      maxWidth: "70%",
                      padding: "8px 12px",
                      borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                      background: msg.role === "user" ? "var(--color-accent)" : "var(--color-bg-surface2)",
                      border: msg.role === "assistant" ? "1px solid var(--color-border)" : "none",
                      fontSize: "12.5px",
                      color: msg.role === "user" ? "#fff" : "var(--color-text-primary)",
                      lineHeight: 1.5,
                    }}>
                      {msg.content}
                      {msg.role === "assistant" && msg.confidence !== null && (
                        <span style={{ display: "block", marginTop: "4px" }}>
                          <ConfidenceBadge value={msg.confidence} />
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Skeleton rows */}
        {loading && Array.from({ length: 5 }).map((_, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "100px 1fr 80px 90px 120px", padding: "12px 16px", borderBottom: "1px solid var(--color-border)", gap: "12px", alignItems: "center" }}>
            {[60, 200, 40, 50, 80].map((w, j) => (
              <div key={j} style={{ height: "14px", width: w, background: "var(--color-bg-surface2)", borderRadius: "4px", animation: "pulse 1.5s ease-in-out infinite" }} />
            ))}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "16px" }}>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{ padding: "6px 14px", borderRadius: "8px", border: "1px solid var(--color-border)", background: "transparent", color: page === 1 ? "var(--color-text-muted)" : "var(--color-text-secondary)", cursor: page === 1 ? "not-allowed" : "pointer", fontSize: "13px" }}
          >
            ← Prev
          </button>
          <span style={{ padding: "6px 12px", fontSize: "13px", color: "var(--color-text-secondary)" }}>
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{ padding: "6px 14px", borderRadius: "8px", border: "1px solid var(--color-border)", background: "transparent", color: page === totalPages ? "var(--color-text-muted)" : "var(--color-text-secondary)", cursor: page === totalPages ? "not-allowed" : "pointer", fontSize: "13px" }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
