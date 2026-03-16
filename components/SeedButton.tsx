"use client";

import { useState } from "react";

export default function SeedButton() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  const handleSeed = async () => {
    if (status === "loading") return;
    setStatus("loading");
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Seed failed");
      setStatus("done");
      setTimeout(() => setStatus("idle"), 3000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const labels: Record<string, string> = {
    idle: "Load Demo Data",
    loading: "Loading…",
    done: "✓ Demo loaded!",
    error: "✗ Failed — retry",
  };

  return (
    <button
      id="seed-demo-btn"
      onClick={handleSeed}
      disabled={status === "loading"}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "7px 14px",
        borderRadius: "8px",
        border: "1px solid var(--color-border)",
        background:
          status === "done"
            ? "rgba(63, 185, 80, 0.1)"
            : status === "error"
            ? "rgba(248, 81, 73, 0.1)"
            : "transparent",
        borderColor:
          status === "done"
            ? "rgba(63, 185, 80, 0.4)"
            : status === "error"
            ? "rgba(248, 81, 73, 0.4)"
            : "var(--color-border)",
        color:
          status === "done"
            ? "var(--color-success)"
            : status === "error"
            ? "var(--color-danger)"
            : "var(--color-text-secondary)",
        fontSize: "13px",
        cursor: status === "loading" ? "not-allowed" : "pointer",
        transition: "all 0.2s",
        whiteSpace: "nowrap",
      }}
    >
      {status === "loading" ? (
        <span
          style={{
            width: "12px",
            height: "12px",
            border: "2px solid var(--color-border)",
            borderTopColor: "var(--color-accent)",
            borderRadius: "50%",
            display: "inline-block",
            animation: "spin 0.7s linear infinite",
          }}
        />
      ) : (
        <span>🌱</span>
      )}
      {labels[status]}
    </button>
  );
}
