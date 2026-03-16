"use client";

import { useState } from "react";
import AdminFileUpload from "@/components/admin/AdminFileUpload";
import KnowledgeTable from "@/components/admin/KnowledgeTable";
import ErrorBoundary from "@/components/admin/ErrorBoundary";

export default function KnowledgePage() {
  const [refreshTick, setRefreshTick] = useState(0);

  return (
    <>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 700, color: "var(--color-text-primary)", marginBottom: "4px" }}>
          Knowledge Base
        </h1>
        <p style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
          Upload documents to train your bot. Supports PDF and .txt up to 10MB.
        </p>
      </div>

      <div style={{
        padding: "14px 16px",
        borderRadius: "10px",
        background: "rgba(47, 129, 247, 0.08)",
        border: "1px solid rgba(47, 129, 247, 0.2)",
        fontSize: "13px",
        color: "var(--color-text-secondary)",
        marginBottom: "20px",
        lineHeight: 1.6,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
          <span>📌</span>
          <span style={{ fontWeight: 600, color: "var(--color-accent)" }}>Demo Mode</span>
        </div>
        <p style={{ margin: "0 0 4px", paddingLeft: "26px" }}>
          This system is currently trained on <strong style={{ color: "var(--color-text-primary)" }}>NovaTech</strong> sample data
          — including their FAQ, returns policy, and product documentation.
        </p>
        <p style={{ margin: 0, paddingLeft: "26px", fontSize: "12px", color: "var(--color-text-muted)" }}>
          Want a custom deployment trained on your own data? Reach out to{" "}
          <strong style={{ color: "var(--color-text-secondary)" }}>Abrar Tajwar Khan</strong> to build one for your business.
        </p>
      </div>

      <ErrorBoundary label="File upload area failed to load.">
        <AdminFileUpload onUploadSuccess={() => setRefreshTick((t) => t + 1)} />
      </ErrorBoundary>

      <div style={{ marginBottom: "14px" }}>
        <h2 style={{ fontSize: "15px", fontWeight: 600, color: "var(--color-text-primary)", marginBottom: "4px" }}>
          Uploaded Documents
        </h2>
        <p style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
          Click Preview to inspect chunks · Delete to remove from the knowledge base
        </p>
      </div>

      <ErrorBoundary label="Knowledge table failed to load.">
        <div className="table-scroll">
          <KnowledgeTable onRefresh={refreshTick} />
        </div>
      </ErrorBoundary>
    </>
  );
}
