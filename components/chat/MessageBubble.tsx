"use client";

import { useState } from "react";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  confidence?: number;
  timestamp: Date;
  isError?: boolean;
}

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const [showTime, setShowTime] = useState(false);
  const isUser = message.role === "user";
  const isLowConfidence =
    !isUser && message.confidence !== undefined && message.confidence < 0.5;

  const timeStr = message.timestamp.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className="animate-fade-in-up"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: isUser ? "flex-end" : "flex-start",
        gap: "4px",
        marginBottom: "2px",
      }}
    >
      {/* Bubble */}
      <div
        onMouseEnter={() => setShowTime(true)}
        onMouseLeave={() => setShowTime(false)}
        style={{
          maxWidth: "82%",
          padding: "9px 13px",
          borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          background: isUser
            ? "var(--color-accent)"
            : message.isError
            ? "rgba(248, 81, 73, 0.15)"
            : "var(--color-bg-surface2)",
          color: isUser ? "#ffffff" : "var(--color-text-primary)",
          fontSize: "13.5px",
          lineHeight: "1.55",
          wordBreak: "break-word",
          border: message.isError
            ? "1px solid rgba(248, 81, 73, 0.3)"
            : isUser
            ? "none"
            : "1px solid var(--color-border)",
          cursor: "default",
          transition: "opacity 0.15s",
        }}
      >
        {message.content}
      </div>

      {/* Low-confidence badge */}
      {isLowConfidence && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            padding: "2px 8px",
            background: "rgba(210, 153, 34, 0.12)",
            border: "1px solid rgba(210, 153, 34, 0.3)",
            borderRadius: "20px",
            fontSize: "11px",
            color: "var(--color-warning)",
            marginLeft: "2px",
          }}
        >
          <span>⚠</span>
          <span>I&apos;m not sure about this</span>
        </div>
      )}

      {/* Timestamp on hover */}
      <div
        style={{
          fontSize: "10.5px",
          color: "var(--color-text-muted)",
          opacity: showTime ? 1 : 0,
          transition: "opacity 0.2s ease",
          paddingLeft: isUser ? 0 : "3px",
          paddingRight: isUser ? "3px" : 0,
        }}
      >
        {timeStr}
      </div>
    </div>
  );
}
