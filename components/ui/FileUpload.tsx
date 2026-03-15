"use client";

import * as React from "react";

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  maxSizeMB?: number;
  uploading?: boolean;
  progress?: number; // 0–100
  className?: string;
}

export function FileUpload({
  onFilesSelected,
  accept = ".pdf,.txt",
  maxSizeMB = 10,
  uploading = false,
  progress,
  className = "",
}: FileUploadProps) {
  const [dragOver, setDragOver] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const validate = (files: File[]): File[] => {
    setError(null);
    const valid: File[] = [];
    for (const f of files) {
      if (f.size > maxSizeMB * 1024 * 1024) {
        setError(`${f.name} exceeds ${maxSizeMB}MB limit.`);
        continue;
      }
      valid.push(f);
    }
    return valid;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = validate(Array.from(e.dataTransfer.files));
    if (files.length) onFilesSelected(files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = validate(Array.from(e.target.files ?? []));
    if (files.length) onFilesSelected(files);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={className}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => !uploading && inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && !uploading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`
          relative flex flex-col items-center justify-center gap-3
          rounded-lg border-2 border-dashed p-10 cursor-pointer
          transition-all duration-200
          ${dragOver
            ? "border-[#2f81f7] bg-[#2f81f7]/5"
            : "border-[#30363d] hover:border-[#484f58] bg-[#161b22]"
          }
          ${uploading ? "pointer-events-none opacity-60" : ""}
        `}
      >
        {/* Icon */}
        <div className="w-12 h-12 rounded-full bg-[#21262d] flex items-center justify-center">
          <svg className="w-6 h-6 text-[#8b949e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
        </div>

        <div className="text-center">
          <p className="text-sm font-medium text-[#e6edf3]">
            Drop files here or <span className="text-[#2f81f7]">browse</span>
          </p>
          <p className="text-xs text-[#8b949e] mt-1">
            PDF or TXT · Max {maxSizeMB}MB
          </p>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple
          onChange={handleChange}
          className="sr-only"
          id="file-upload-input"
        />
      </div>

      {/* Progress bar */}
      {uploading && progress !== undefined && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-[#8b949e] mb-1">
            <span>Uploading…</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 bg-[#21262d] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#2f81f7] rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="mt-2 text-xs text-[#f85149]">{error}</p>
      )}
    </div>
  );
}
