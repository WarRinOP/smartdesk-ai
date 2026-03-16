"use client";

import { useCallback, useRef, useState } from "react";

interface AdminFileUploadProps {
  onUploadSuccess?: () => void;
}

export default function AdminFileUpload({ onUploadSuccess }: AdminFileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(
    (file: File) => {
      if (!file.name.endsWith(".pdf") && !file.name.endsWith(".txt")) {
        setStatus("error");
        setMessage("Only PDF and .txt files are supported.");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setStatus("error");
        setMessage("File exceeds 10MB limit.");
        return;
      }

      setStatus("uploading");
      setProgress(0);
      setMessage("");

      const formData = new FormData();
      formData.append("file", file);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/upload");

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setProgress(Math.round((e.loaded / e.total) * 100));
        }
      };

      xhr.onload = () => {
        try {
          const res = JSON.parse(xhr.responseText);
          if (xhr.status === 200) {
            setStatus("success");
            setMessage(`✓ ${res.chunk_count} chunks created from "${res.source_file}"`);
            setProgress(100);
            onUploadSuccess?.();
          } else {
            setStatus("error");
            setMessage(res.error ?? "Upload failed");
          }
        } catch {
          setStatus("error");
          setMessage("Upload failed — unexpected response");
        }
      };

      xhr.onerror = () => {
        setStatus("error");
        setMessage("Network error — please try again");
      };

      xhr.send(formData);
    },
    [onUploadSuccess]
  );

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = "";
  };

  const reset = () => {
    setStatus("idle");
    setProgress(0);
    setMessage("");
  };

  return (
    <div style={{ marginBottom: "24px" }}>
      {/* Drop zone */}
      <div
        onClick={() => status === "idle" && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); if (status === "idle") setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${isDragging ? "var(--color-accent)" : status === "error" ? "var(--color-danger)" : status === "success" ? "var(--color-success)" : "var(--color-border)"}`,
          borderRadius: "12px",
          padding: "36px 24px",
          textAlign: "center",
          cursor: status === "idle" ? "pointer" : "default",
          background: isDragging
            ? "rgba(47,129,247,0.05)"
            : status === "error"
            ? "rgba(248,81,73,0.04)"
            : status === "success"
            ? "rgba(63,185,80,0.04)"
            : "var(--color-bg-surface2)",
          transition: "all 0.15s",
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.txt"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        {status === "idle" && (
          <>
            <div style={{ fontSize: "32px", marginBottom: "10px" }}>📂</div>
            <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--color-text-primary)", marginBottom: "4px" }}>
              Drop a file here, or click to browse
            </div>
            <div style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
              Supports PDF and .txt — max 10MB
            </div>
          </>
        )}

        {status === "uploading" && (
          <>
            <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--color-text-primary)", marginBottom: "16px" }}>
              Uploading… {progress}%
            </div>
            <div style={{ width: "100%", maxWidth: "360px", margin: "0 auto", height: "6px", background: "var(--color-border)", borderRadius: "3px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progress}%`, background: "var(--color-accent)", borderRadius: "3px", transition: "width 0.2s" }} />
            </div>
            <div style={{ marginTop: "8px", fontSize: "12px", color: "var(--color-text-muted)" }}>
              Embedding chunks with Jina AI…
            </div>
          </>
        )}

        {status === "success" && (
          <>
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>✅</div>
            <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--color-success)" }}>{message}</div>
            <button
              onClick={(e) => { e.stopPropagation(); reset(); }}
              style={{ marginTop: "12px", padding: "6px 16px", borderRadius: "8px", border: "1px solid var(--color-border)", background: "transparent", color: "var(--color-text-secondary)", fontSize: "12px", cursor: "pointer" }}
            >
              Upload another
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>❌</div>
            <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--color-danger)", marginBottom: "8px" }}>{message}</div>
            <button
              onClick={(e) => { e.stopPropagation(); reset(); }}
              style={{ padding: "6px 16px", borderRadius: "8px", border: "1px solid rgba(248,81,73,0.3)", background: "rgba(248,81,73,0.08)", color: "var(--color-danger)", fontSize: "12px", cursor: "pointer" }}
            >
              Try again
            </button>
          </>
        )}
      </div>
    </div>
  );
}
