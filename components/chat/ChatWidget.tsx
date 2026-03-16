"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import TypingIndicator from "./TypingIndicator";
import MessageBubble, { Message } from "./MessageBubble";

// ─── SVG Icons ────────────────────────────────────────────
const ChatIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

// ─── Helpers ─────────────────────────────────────────────
function genId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return genId();
  const stored = localStorage.getItem("sd_session_id");
  if (stored) return stored;
  const id = genId();
  localStorage.setItem("sd_session_id", id);
  return id;
}

// ─── Types ────────────────────────────────────────────────
interface BotConfig {
  bot_name: string;
  welcome_message: string;
  persona: string;
}

// ─── Component ────────────────────────────────────────────
export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<BotConfig | null>(null);
  const [sessionId] = useState(getOrCreateSessionId);
  const [hasOpened, setHasOpened] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch bot config once
  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.json())
      .then((data: BotConfig) => setConfig(data))
      .catch(() =>
        setConfig({
          bot_name: "SmartDesk Assistant",
          welcome_message: "Hi! How can I help you today?",
          persona: "friendly",
        })
      );
  }, []);

  // Show welcome message on first open
  useEffect(() => {
    if (isOpen && !hasOpened && config) {
      setHasOpened(true);
      setMessages([
        {
          id: genId(),
          role: "assistant",
          content: config.welcome_message,
          confidence: 1,
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, hasOpened, config]);

  // Auto-scroll to latest message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: genId(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, session_id: sessionId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      const assistantMsg: Message = {
        id: genId(),
        role: "assistant",
        content: data.response,
        confidence: data.confidence,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg: Message = {
        id: genId(),
        role: "assistant",
        content:
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.",
        confidence: 0,
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, sessionId]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div
          className="chat-window animate-slide-up"
          style={{
            background: "var(--color-bg-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "20px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 1000,
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 16px",
              borderBottom: "1px solid var(--color-border)",
              background: "var(--color-bg-surface2)",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {/* Avatar */}
              <div
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--color-accent), #7c3aed)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "15px",
                  flexShrink: 0,
                }}
              >
                🤖
              </div>
              <div>
                <div
                  style={{
                    fontSize: "13.5px",
                    fontWeight: 600,
                    color: "var(--color-text-primary)",
                    lineHeight: 1.2,
                  }}
                >
                  {config?.bot_name ?? "SmartDesk Assistant"}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    marginTop: "2px",
                  }}
                >
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "var(--color-success)",
                      display: "inline-block",
                      boxShadow: "0 0 6px var(--color-success)",
                    }}
                  />
                  <span style={{ fontSize: "11px", color: "var(--color-text-secondary)" }}>
                    Online
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "none",
                border: "none",
                color: "var(--color-text-secondary)",
                cursor: "pointer",
                padding: "6px",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "color 0.15s, background 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "var(--color-text-primary)";
                (e.currentTarget as HTMLButtonElement).style.background = "var(--color-border)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "var(--color-text-secondary)";
                (e.currentTarget as HTMLButtonElement).style.background = "none";
              }}
              aria-label="Close chat"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px 14px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {messages.length === 0 && !isLoading && (
              <div
                style={{
                  textAlign: "center",
                  color: "var(--color-text-muted)",
                  fontSize: "13px",
                  marginTop: "40px",
                }}
              >
                Start a conversation...
              </div>
            )}

            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}

            {isLoading && (
              <div className="animate-fade-in">
                <TypingIndicator />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Row */}
          <div
            style={{
              padding: "12px 12px 14px",
              borderTop: "1px solid var(--color-border)",
              display: "flex",
              gap: "8px",
              alignItems: "center",
              background: "var(--color-bg-surface)",
              flexShrink: 0,
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything…"
              disabled={isLoading}
              style={{
                flex: 1,
                background: "var(--color-bg-surface2)",
                border: "1px solid var(--color-border)",
                borderRadius: "12px",
                padding: "9px 14px",
                color: "var(--color-text-primary)",
                fontSize: "13.5px",
                outline: "none",
                transition: "border-color 0.15s",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "var(--color-accent)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "var(--color-border)";
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "12px",
                border: "none",
                background:
                  input.trim() && !isLoading
                    ? "var(--color-accent)"
                    : "var(--color-bg-surface2)",
                color:
                  input.trim() && !isLoading
                    ? "#fff"
                    : "var(--color-text-muted)",
                cursor: input.trim() && !isLoading ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.15s, color 0.15s, transform 0.1s",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                if (input.trim() && !isLoading) {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "var(--color-accent-hover)";
                  (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.05)";
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  input.trim() && !isLoading
                    ? "var(--color-accent)"
                    : "var(--color-bg-surface2)";
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
              }}
            >
              <SendIcon />
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        id="chat-widget-toggle"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: isOpen
            ? "var(--color-bg-surface2)"
            : "var(--color-accent)",
          border: isOpen ? "1px solid var(--color-border)" : "none",
          color: "#ffffff",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: isOpen
            ? "0 4px 20px rgba(0,0,0,0.3)"
            : "0 4px 24px rgba(47, 129, 247, 0.5)",
          transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
          zIndex: 1001,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
        }}
      >
        {isOpen ? <CloseIcon /> : <ChatIcon />}
      </button>
    </>
  );
}
