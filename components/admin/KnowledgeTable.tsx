"use client";

import { useCallback, useEffect, useState } from "react";

interface KnowledgeFile {
  source_file: string;
  chunk_count: number;
  created_at: string;
}

interface ChunkPreview {
  id: string;
  content: string;
  chunk_index: number;
}

export default function KnowledgeTable({ onRefresh }: { onRefresh?: number }) {
  const [files, setFiles] = useState<KnowledgeFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [previewChunks, setPreviewChunks] = useState<ChunkPreview[]>([]);
  const [previewLoading, setPreviewLoading] = useState(false);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/chunks");
      const data = await res.json();
      setFiles(data.files ?? []);
    } catch { /* non-fatal */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchFiles(); }, [fetchFiles, onRefresh]);

  const handlePreview = async (sourceFile: string) => {
    if (previewFile === sourceFile) { setPreviewFile(null); return; }
    setPreviewFile(sourceFile);
    setPreviewLoading(true);
    try {
      const res = await fetch("/api/chunks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source_file: sourceFile }),
      });
      const data = await res.json();
      setPreviewChunks(data.chunks ?? []);
    } catch { /* non-fatal */ }
    finally { setPreviewLoading(false); }
  };

  return (
    <div style={{ background: "var(--color-bg-surface)", border: "1px solid var(--color-border)", borderRadius: "12px", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 90px 140px 160px", padding: "10px 16px", borderBottom: "1px solid var(--color-border)", background: "var(--color-bg-surface2)" }}>
        {["Filename", "Chunks", "Uploaded", "Actions"].map((h) => (
          <span key={h} style={{ fontSize: "11px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--color-text-muted)" }}>{h}</span>
        ))}
      </div>

      {/* Empty state */}
      {!loading && files.length === 0 && (
        <div style={{ padding: "48px", textAlign: "center", color: "var(--color-text-muted)", fontSize: "13px" }}>
          No documents uploaded yet
        </div>
      )}

      {/* Rows */}
      {files.map((file, i) => (
        <div key={file.source_file}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 90px 140px 160px",
              padding: "12px 16px",
              borderBottom: (i < files.length - 1 || previewFile === file.source_file) ? "1px solid var(--color-border)" : "none",
              alignItems: "center",
            }}
          >
            {/* Filename */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "16px" }}>{file.source_file.endsWith(".pdf") ? "📋" : "📄"}</span>
              <span style={{
                fontSize: "13px",
                color: "var(--color-text-primary)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "200px",
              }}>
                {file.source_file}
              </span>
            </div>

            {/* Chunk count */}
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "12px",
              fontWeight: 600,
              color: "var(--color-accent)",
              background: "rgba(47,129,247,0.08)",
              border: "1px solid rgba(47,129,247,0.2)",
              borderRadius: "20px",
              padding: "2px 8px",
              width: "fit-content",
            }}>
              {file.chunk_count} chunks
            </span>

            {/* Date */}
            <span style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
              {new Date(file.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
            </span>

            {/* Actions */}
            <div style={{ display: "flex", gap: "6px" }}>
              <button
                onClick={() => handlePreview(file.source_file)}
                style={{
                  padding: "4px 10px",
                  borderRadius: "6px",
                  border: "1px solid var(--color-border)",
                  background: previewFile === file.source_file ? "var(--color-bg-surface2)" : "transparent",
                  color: "var(--color-text-secondary)",
                  fontSize: "11px",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {previewFile === file.source_file ? "Hide" : "Preview"}
              </button>
            </div>
          </div>

          {/* Preview panel */}
          {previewFile === file.source_file && (
            <div style={{ padding: "16px 20px", background: "var(--color-bg-primary)", borderBottom: i < files.length - 1 ? "1px solid var(--color-border)" : "none" }}>
              {previewLoading ? (
                <div style={{ color: "var(--color-text-muted)", fontSize: "13px" }}>Loading preview…</div>
              ) : (
                <>
                  <div style={{ fontSize: "11px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--color-text-muted)", marginBottom: "10px" }}>
                    First 3 chunks
                  </div>
                  {previewChunks.map((chunk, ci) => (
                    <div key={chunk.id} style={{
                      marginBottom: "8px",
                      padding: "10px 14px",
                      background: "var(--color-bg-surface)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "8px",
                      fontSize: "12px",
                      color: "var(--color-text-secondary)",
                      lineHeight: 1.6,
                    }}>
                      <span style={{ fontSize: "10px", color: "var(--color-text-muted)", display: "block", marginBottom: "4px" }}>Chunk {ci + 1}</span>
                      {chunk.content}
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Skeleton */}
      {loading && Array.from({ length: 3 }).map((_, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 90px 140px 160px", padding: "12px 16px", borderBottom: "1px solid var(--color-border)", gap: "12px", alignItems: "center" }}>
          {[180, 60, 80, 100].map((w, j) => (
            <div key={j} style={{ height: "14px", width: w, background: "var(--color-bg-surface2)", borderRadius: "4px", animation: "pulse 1.5s ease-in-out infinite" }} />
          ))}
        </div>
      ))}
    </div>
  );
}
