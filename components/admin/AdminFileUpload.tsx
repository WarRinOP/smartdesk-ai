"use client";

interface AdminFileUploadProps {
  onUploadSuccess?: () => void;
}

export default function AdminFileUpload({ onUploadSuccess: _onUploadSuccess }: AdminFileUploadProps) {
  return (
    <div style={{ marginBottom: "24px" }}>
      {/* Drop zone — disabled in demo mode */}
      <div
        style={{
          border: "2px dashed var(--color-border)",
          borderRadius: "12px",
          padding: "36px 24px",
          textAlign: "center",
          cursor: "not-allowed",
          background: "var(--color-bg-surface2)",
          opacity: 0.7,
          transition: "all 0.15s",
        }}
      >
        <div style={{ fontSize: "32px", marginBottom: "10px", opacity: 0.5 }}>🔒</div>
        <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: "4px" }}>
          Upload disabled in demo mode
        </div>
        <div style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
          Sample NovaTech documents are pre-loaded · In production, drag &amp; drop PDF or TXT files here
        </div>
      </div>
    </div>
  );
}
