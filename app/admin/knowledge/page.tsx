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
